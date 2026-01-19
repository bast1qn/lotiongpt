import { Message } from '@/types/chat';

// Generate contextual follow-up suggestions based on message content
export function generateSuggestions(message: Message, allMessages: Message[]): string[] {
  if (message.role !== 'assistant') return [];

  const content = message.content.toLowerCase();
  const suggestions: string[] = [];

  // Code-related suggestions
  if (content.includes('```') || content.includes('code') || content.includes('funktion')) {
    if (content.includes('python')) {
      suggestions.push('Erklärung hinzufügen', 'In JavaScript umwandeln', 'Testfall schreiben');
    } else if (content.includes('javascript') || content.includes('react')) {
      suggestions.push('Erklärung hinzufügen', 'In Python umwandeln', 'Kommentare hinzufügen');
    } else {
      suggestions.push('Erklärung hinzufügen', 'Kommentare hinzufügen', 'Optimieren');
    }
  }

  // Explanation-related
  if (content.includes('ist') || content.includes('bedeutet') || content.includes('erklärt')) {
    suggestions.push('Genauer erklären', 'Beispiel geben', 'Alternativen zeigen');
  }

  // List-related
  if (content.includes('1.') || content.includes('- ') || content.includes('sind:')) {
    suggestions.push('Mehr Details', 'Erweitern', 'Sortieren');
  }

  // How-to related
  if (content.includes('schritt') || content.includes('1.') || content.includes('zuerst')) {
    suggestions.push('Zusammenfassung', 'Nächster Schritt', 'Troubleshooting');
  }

  // Default suggestions if none matched
  if (suggestions.length === 0) {
    const defaultSuggestions = [
      'Genauer erklären',
      'Beispiel geben',
      'Alternativen zeigen',
      'Zusammenfassen',
    ];
    // Return 2-3 random suggestions
    return defaultSuggestions.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  return suggestions.sort(() => Math.random() - 0.5).slice(0, 3);
}

// Predefined suggestions for empty chat
export const DEFAULT_SUGGESTIONS = [
  'Erkläre mir wie Quantum Computing funktioniert',
  'Schreibe eine Python-Funktion zum Sortieren einer Liste',
  'Hilf mir bei einem React Hook Problem',
  'Erstelle ein Diagramm mit Mermaid syntax',
];
