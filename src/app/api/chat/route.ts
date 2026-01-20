import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ImageAttachment } from '@/types/chat';

const ZAI_API_URL = 'https://api.z.ai/api/coding/paas/v4/chat/completions';

// Zod schema for validating image attachments
const ImageAttachmentSchema = z.object({
  type: z.literal('image'),
  data: z.string().max(1000000), // Base64 limit ~1MB
  mimeType: z.enum(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
});

// Zod schema for validating chat messages
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().max(50000),
  images: z.array(ImageAttachmentSchema).max(10).optional()
});

// Zod schema for validating the entire request
const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).max(100).min(1),
  model: z.string().max(50).optional(),
  visionModel: z.string().max(50).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(128000).optional(),
  thinking: z.boolean().optional()
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: ImageAttachment[];
}

interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  visionModel?: string;
  temperature?: number;
  maxTokens?: number;
  thinking?: boolean;
}

// Simple in-memory rate limiter (for production, use Redis or similar)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs = 10000; // 10 seconds
  private readonly maxRequests = 20; // Max 20 requests per window

  check(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let requests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    requests = requests.filter(time => time > windowStart);

    if (requests.length >= this.maxRequests) {
      return false;
    }

    requests.push(now);
    this.requests.set(identifier, requests);

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup();
    }

    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > windowStart);
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

const rateLimiter = new RateLimiter();

// Sanitize error messages to prevent information leakage
function sanitizeError(error: any): string {
  const genericMessage = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';

  if (typeof error === 'string') {
    // Only return safe error messages
    const safePatterns = [
      /rate limit/i,
      /quota/i,
      /credits/i,
      /unauthorized/i,
      /invalid/i
    ];

    if (safePatterns.some(pattern => pattern.test(error))) {
      return error.substring(0, 200); // Limit length
    }
  }

  return genericMessage;
}

// Format message content for the API
function formatMessageContent(message: ChatMessage): string | Array<{ type: string; text?: string; image_url?: { url: string } }> {
  // If no images, return simple string content
  if (!message.images || message.images.length === 0) {
    return message.content;
  }

  // With images, use multimodal content format
  const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];

  // Add images first
  for (const img of message.images) {
    content.push({
      type: 'image_url',
      image_url: {
        url: `data:${img.mimeType};base64,${img.data}`,
      },
    });
  }

  // Add text content if present
  if (message.content) {
    content.push({
      type: 'text',
      text: message.content,
    });
  }

  return content;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP address
    const ip = request.headers.get('x-forwarded-for') ||
              request.headers.get('x-real-ip') ||
              'anonymous';

    if (!rateLimiter.check(ip)) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte warten Sie einen Moment vor dem nächsten Versuch.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    let body: ChatRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Ungültiges JSON-Format' },
        { status: 400 }
      );
    }

    // Validate with Zod schema
    const validationResult = ChatRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }));

      return NextResponse.json(
        { error: 'Ungültige Anfrage', details: errors },
        { status: 400 }
      );
    }

    const validated = validationResult.data;
    const { messages, model = 'glm-4-flash', visionModel = 'glm-4v-flash', temperature = 0.7, maxTokens = 4096 } = validated;

    // API Key from environment variable only (removed header option for security)
    const apiKey = process.env.ZAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API-Konfigurationsfehler' },
        { status: 500 }
      );
    }

    // Check if any message has images - if so, use vision model
    const hasImages = messages.some((m) => m.images && m.images.length > 0);

    // Use configured vision model for image tasks
    const effectiveModel = hasImages ? visionModel : model;

    // Format messages for the API
    const formattedMessages = messages.map((m) => ({
      role: m.role,
      content: formatMessageContent(m),
    }));

    const requestBody = {
      model: effectiveModel,
      messages: formattedMessages,
      max_tokens: maxTokens,
      temperature,
      stream: false,
    };

    console.log('=== Z.ai API Request ===');
    console.log('URL:', ZAI_API_URL);
    console.log('Model:', effectiveModel);
    console.log('Has Images:', hasImages);

    // Add timeout to fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    let response: Response;
    try {
      response = await fetch(ZAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
    } catch (fetchError) {
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Zeitüberschreitung. Bitte versuchen Sie es erneut.' },
          { status: 504 }
        );
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }

    const responseData = await response.json();
    console.log('Response Status:', response.status);

    if (!response.ok) {
      return NextResponse.json(
        { error: sanitizeError(responseData.error?.message || responseData.message || responseData.error) },
        { status: response.status }
      );
    }

    const content = responseData.choices?.[0]?.message?.content || '';

    return NextResponse.json({ content, model: responseData.model });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Ein interner Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
