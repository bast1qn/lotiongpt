import { NextRequest, NextResponse } from 'next/server';
import { ImageAttachment } from '@/types/chat';

const ZAI_API_URL = 'https://api.z.ai/api/paas/v4/chat/completions';

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
    const body: ChatRequest = await request.json();
    const { messages, model = 'glm-4.6', visionModel = 'glm-4.6v-flashx', temperature = 0.7, maxTokens = 4096 } = body;

    // API Key from header or default
    const apiKey = request.headers.get('x-api-key') || '5fcd17049e3b4b98bd3634993e32e923.TUudeRsviXYEU6D5';

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
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(ZAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.error?.message || responseData.message || responseData.error || 'API Error' },
        { status: response.status }
      );
    }

    const content = responseData.choices?.[0]?.message?.content || '';

    return NextResponse.json({ content, model: responseData.model });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
