export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
  category: string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Code verbessern und finden',
    prompt: 'Bitte überprüfe den folgenden Code auf Fehler, Verbesserungsmöglichkeiten und Best Practices. Geben mir konkrete Vorschläge zur Optimierung.',
    icon: '🔍',
    category: 'code',
  },
  {
    id: 'explain-simple',
    name: 'ELI5',
    description: 'Wie für 5-Jährige erklärt',
    prompt: 'Erkläre mir das wie für einen 5-Jährigen. Verwende einfache Sprache und anschauliche Beispiele.',
    icon: '🧒',
    category: 'general',
  },
  {
    id: 'summarize',
    name: 'Zusammenfassen',
    description: 'Kurzusammenfassung',
    prompt: 'Fasse die wichtigsten Punkte aus dem obigen Text zusammen. Sei prägnant und strukturiert.',
    icon: '📝',
    category: 'general',
  },
  {
    id: 'translate-de',
    name: 'Ins Deutsche',
    description: 'Übersetzung',
    prompt: 'Übersetze den folgenden Text ins Deutsche. Behalte dabei die Bedeutung und den Tonfall bei.',
    icon: '🇩🇪',
    category: 'language',
  },
  {
    id: 'translate-en',
    name: 'Ins Englische',
    description: 'Translation',
    prompt: 'Translate the following text into English. Maintain the meaning and tone of voice.',
    icon: '🇬🇧',
    category: 'language',
  },
  {
    id: 'continue',
    name: 'Fortsetzen',
    description: 'Mehr dazu',
    prompt: 'Bitte setze fort, wo du aufgehört hast. Gehe dabei genauer ins Detail.',
    icon: '➡️',
    category: 'general',
  },
  {
    id: 'improve-writing',
    name: 'Text verbessern',
    description: 'Korrektur & Stil',
    prompt: 'Verbessere den folgenden Text: Korrigiere Grammatik- und Rechtschreibfehler, verbessere den Stil und mache ihn klarer verständlich.',
    icon: '✏️',
    category: 'writing',
  },
  {
    id: 'find-bugs',
    name: 'Bugs finden',
    description: 'Fehleranalyse',
    prompt: 'Durchsuche den folgenden Code nach potentiellen Bugs, Edge Cases und logischen Fehlern. Liste alle gefundenen Probleme auf.',
    icon: '🐛',
    category: 'code',
  },
  {
    id: 'refactor',
    name: 'Refactoring',
    description: 'Code umstrukturieren',
    prompt: 'Refactore den folgenden Code, um ihn lesbarer, modularer und effizienter zu machen. Erkläre deine Änderungen.',
    icon: '🔧',
    category: 'code',
  },
  {
    id: 'brainstorm',
    name: 'Brainstorming',
    description: 'Ideen sammeln',
    prompt: 'Gib mir 10 kreative Ideen zum folgenden Thema. Sei innovativ und denke außerhalb der Box.',
    icon: '💡',
    category: 'creative',
  },
  {
    id: 'pros-cons',
    name: 'Pro & Contra',
    description: 'Vor- und Nachteile',
    prompt: 'Liste die Vor- und Nachteile des folgenden Themas auf. Sei ausgewogen und objektiv.',
    icon: '⚖️',
    category: 'analysis',
  },
  {
    id: 'step-by-step',
    name: 'Schritt für Schritt',
    description: 'Anleitung',
    prompt: 'Erkläre Schritt für Schritt, wie man das folgende macht. Gehe systematisch vor und gib klare Anweisungen.',
    icon: '📋',
    category: 'general',
  },
];

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'Alle', icon: '📚' },
  { id: 'code', name: 'Code', icon: '💻' },
  { id: 'language', name: 'Sprache', icon: '🌐' },
  { id: 'writing', name: 'Schreiben', icon: '✍️' },
  { id: 'general', name: 'Allgemein', icon: '💬' },
  { id: 'creative', name: 'Kreativ', icon: '🎨' },
  { id: 'analysis', name: 'Analyse', icon: '📊' },
];
