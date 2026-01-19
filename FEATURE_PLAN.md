# LotionGPT - Feature Enhancement Plan
## "Ultrathink" - Was einen guten Chatbot ausmacht

---

## 1. CHAT INPUT ENHANCEMENTS

### 1.1 Model Selector (Inline)
```
┌─────────────────────────────────────────────────────────────────┐
│ [▼ GLM-4.7] [⚡ Thinking: ON] [📎]     [      Nachricht      ] │
└─────────────────────────────────────────────────────────────────┘
```

**Models:**
- `GLM-4.6` - Standard, schnell
- `GLM-4.7` - Bestes Modell für komplexes Denken
- `Gemini-2.5-Pro` - Multimodal, sehr smart
- `Gemini-2.5-Flash` - Schnell für日常 Anfragen
- `GPT-4.1` - OpenAI Option
- `Claude-4.5-Sonnet` - Anthropic Option

**Implementation:**
- Dropdown in ChatInput
- Pro-Chat Modell-Auswahl (Per-Chat Model)
- Globale Default-Settings
- Visual indicator für aktuelles Modell

### 1.2 Thinking Toggle (Inline)
```
[⚡ Thinking: ON] → [⚡ Thinking: OFF]

ON:  Modell verwendet erweitertes Reasoning
OFF: Schnellere Antworten, weniger Token
```

**Features:**
- Toggle-Switch im ChatInput
- Pro-Chat konfigurierbar
- Visuelles Feedback (Glow-Animation wenn aktiv)
- Token-Anzeige ("~2500 thinking tokens")

### 1.3 File Upload System
```
┌─────────────────────────────────────────────────────────────────┐
│ [📎 Attach]                                                     │
│ ┌─────────────────────────────────────────────────────────┐    │
│ │ 📄 document.pdf  (2.4 MB)                     [✕]        │    │
│ │ 🖼️ image.png        (450 KB)                    [✕]        │    │
│ │ 📊 data.csv        (12 KB)                      [✕]        │    │
│ └─────────────────────────────────────────────────────────┘    │
│ [Type your message...]                                          │
└─────────────────────────────────────────────────────────────────┘
```

**Supported File Types:**
| Type | Extensions | Max Size |
|------|------------|----------|
| Bilder | PNG, JPG, WEBP, GIF | 10 MB |
| Dokumente | PDF, DOCX, TXT, MD | 25 MB |
| Code | All source files | 5 MB |
| Daten | CSV, JSON, XML | 10 MB |
| Audio | MP3, WAV, M4A | 25 MB |

**Features:**
- Drag & Drop Zone
- Multiple file upload
- File preview thumbnails
- Progress indicators
- Cancel upload option
- OCR für Bilder/PDFs (Text extrahieren)
- Code Syntax Highlighting für Uploads

---

## 2. MESSAGE ACTIONS

### 2.1 Edit Message (User & Assistant)
```
┌─────────────────────────────────────────────────────────────────┐
│ User  [✎ Edit] [🗑️ Delete] [📋 Copy]                           │
│ ───────────────────────────────────────────────────────────────│
│ Was ist der Hauptstad...                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Assistant  [📋 Copy] [🔄 Regenerate] [✎ Edit]                   │
│ ───────────────────────────────────────────────────────────────│
│ Die Hauptstadt von Deutschland ist Berlin. Sie ist...          │
└─────────────────────────────────────────────────────────────────┘
```

**Edit Flow:**
1. User klickt [✎ Edit] auf eigene Message
2. Message wird in-place editierbar
3. [Save] → Regeneriert AI-Response ab diesem Punkt
4. [Cancel] → Keine Änderung

### 2.2 Copy Response (One-Click)
```
┌─────────────────────────────────────────────────────────────────┐
│ [📋 Copy all] [Copy code block] [📋]                            │
│ ───────────────────────────────────────────────────────────────│
│ Hier ist der Code...                                          │
│ ```python                                                      │
│ def hello():                                                   │
│     print("Hello")                                             │
│ ```                                                            │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- [📋 Copy all] - Kopiert komplette Antwort
- [Copy code] - Kopiert nur Code-Blocks
- Auto-copy feedback (Toast: "Kopiert!")
- Keyboard shortcut: `Cmd/Ctrl + Shift + C`

### 2.3 Regenerate Options
```
[🔄 Regenerate] → [🔄 Retry] [🔄 New Response] [🔄 With Thinking]
```

### 2.4 Branching (Conversations forken)
```
[🔀 Branch] → Erstellt neuen Chat ab dieser Message
```

---

## 3. SIDEBAR FEATURES

### 3.1 Projekte (Projects)
```
┌─────────────────────────────────────────────────────────────────┐
│ PROJEKTE                                                        │
│ ───────────────────────────────────────────────────────────────│
│ 📁 Webentwicklung          (5 Chats)        [⋮]                │
│ 📁 Lern-Material           (12 Chats)       [⋮]                │
│ 📁 Recherche: AI           (3 Chats)        [⋮]                │
│                                                                 │
│ [+ Neues Projekt]                                               │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Chats in Projekte organisieren
- Color-coded Projekte
- Drag & Drop Chat in Projekt
- Projektbeschreibung & Notizen
- Share Projekt (Link teilen)

### 3.2 Artefakte (Artifacts)
```
┌─────────────────────────────────────────────────────────────────┐
│ ARTEFAKTE                                                       │
│ ───────────────────────────────────────────────────────────────│
│ 🎨 index.html          [Open] [Download] [Delete]              │
│ 📊 chart.py            [Open] [Download] [Delete]              │
│ 📄 README.md           [Open] [Download] [Delete]              │
│                                                                 │
│ [+ Neues Artefakt]                                              │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- AI-generierte Dateien speichern
- Inline Preview für Code/Bilder
- Direct Download
- Version History
- Fork/Clone Artefakt

### 3.3 Code (Code Snippets Library)
```
┌─────────────────────────────────────────────────────────────────┐
│ CODE                                                            │
│ ───────────────────────────────────────────────────────────────│
│ 🐍 Python: API Fetch    [Copy] [Edit]                          │
│ ⚛️ React: useFetch      [Copy] [Edit]                          │
│ 🟨 SQL: Join Query      [Copy] [Edit]                          │
│                                                                 │
│ [+ Snippet hinzufügen]                                          │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Saved code snippets
- Syntax highlighting
- Tags & Kategorien
- Search snippets
- Import/Export snippets

---

## 4. CONVERSATION FEATURES

### 4.1 Search in Chat
```
[🔍 Search in chat...] → Highlightet gefundene Messages
```

### 4.2 Jump to Bottom
```
[↓ New message] Button wenn nach oben gescrollt
```

### 4.3 Message Star/Favorite
```
[⭐ Star] → Wichtige Messages markieren
→ Sidebar: "Starred Messages" Filter
```

### 4.4 Export Chat
```
[⋮] → Export as:
  - Markdown (.md)
  - PDF
  - JSON
  - Plain Text
```

### 4.5 Share Chat
```
[Share] → Generiert öffentliche/privaten Link
- Option: Include memories
- Option: Include artifacts
```

---

## 5. AI CAPABILITIES

### 5.1 Multimodal Input
- Text + Bilder + Dateien gleichzeitig
- Sprachnachrichten (Voice-to-Text)
- Video-Upload (Frame extraction)

### 5.2 Streaming Response
- Typing indicator
- Token-by-token streaming
- Stop generation button

### 5.3 Function Calling
- Web Search
- Calculator
- Weather
- Date/Time
- (User-definierbare Functions)

### 5.4 Context Window
- Sliding context
- Summary mode für lange Chats
- Smart context retention

---

## 6. UX IMPROVEMENTS

### 6.1 Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | New Chat |
| `Cmd/Ctrl + /` | Search Chats |
| `Cmd/Ctrl + Enter` | Send Message |
| `Cmd/Ctrl + Shift + C` | Copy Last Response |
| `Cmd/Ctrl + E` | Edit Last Message |
| `Cmd/Ctrl + ↑` | Previous Prompt |
| `Cmd/Ctrl + ↓` | Next Prompt |
| `Escape` | Close Sidebar/Modal |

### 6.2 Prompt Templates
```
[Template:] →
  - Code Review
  - Explain Like I'm 5
  - Translate to German
  - Summarize
  - Continue Writing
```

### 6.3 Suggested Follow-ups
```
[AI Antwort]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Weitere Fragen:]
• Wie würde das in Python aussehen?
• Kannst du das genauer erklären?
• Was sind die Alternativen?
```

---

## 7. DATABASE SCHEMA UPDATES

### 7.1 Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7.2 Artifacts Table
```sql
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  chat_id UUID REFERENCES chats ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  file_type TEXT NOT NULL,
  language TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 7.3 Snippets Table
```sql
CREATE TABLE snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 7.4 Chat-Project Relation
```sql
ALTER TABLE chats ADD COLUMN project_id UUID REFERENCES projects(id);
CREATE INDEX idx_chats_project ON chats(project_id);
```

---

## 8. COMPONENTS TO CREATE

```
src/components/
├── chat/
│   ├── ModelSelector.tsx         # Model dropdown
│   ├── ThinkingToggle.tsx        # Thinking switch
│   ├── FileUpload.tsx            # File attachment
│   ├── FilePreview.tsx           # Uploaded files list
│   ├── MessageActions.tsx        # Edit/Delete/Copy/Regenerate
│   └── CodeBlock.tsx             # Enhanced code display
├── sidebar/
│   ├── ProjectsPanel.tsx         # Projects list
│   ├── ArtifactsPanel.tsx        # Artifacts list
│   └── CodeSnippetsPanel.tsx     # Snippets library
├── features/
│   ├── ChatBranch.tsx            # Branch conversation
│   ├── ExportModal.tsx           # Export options
│   ├── ShareModal.tsx            # Share options
│   └── PromptTemplates.tsx       # Template selector
└── modals/
    ├── EditMessageModal.tsx      # Edit message
    └── NewProjectModal.tsx       # Create project
```

---

## 9. IMPLEMENTATION PRIORITY

| Priority | Feature | Complexity |
|----------|---------|------------|
| 🔴 Critical | Copy Response Button | Low |
| 🔴 Critical | Edit Message | Medium |
| 🔴 Critical | Model Selector Inline | Medium |
| 🔴 Critical | Thinking Toggle Inline | Low |
| 🟡 High | File Upload | High |
| 🟡 High | Projects | Medium |
| 🟡 High | Code Snippets | Medium |
| 🟢 Medium | Artifacts | High |
| 🟢 Medium | Chat Branching | Medium |
| 🟢 Medium | Export/Share | Medium |
| 🔵 Low | Voice Input | High |
| 🔵 Low | Keyboard Shortcuts | Low |

---

## 10. API ENDPOINTS NEEDED

```
POST   /api/chat/with-files    # Chat mit file upload
POST   /api/chat/regenerate    # Regenerate last response
PUT    /api/chat/:id/message/:msgId  # Edit message
POST   /api/artifacts          # Create artifact
GET    /api/artifacts          # List artifacts
DELETE /api/artifacts/:id      # Delete artifact
POST   /api/projects           # Create project
PUT    /api/projects/:id       # Update project
DELETE /api/projects/:id       # Delete project
POST   /api/snippets           # Create snippet
GET    /api/snippets           # List snippets
POST   /api/chat/export        # Export chat
POST   /api/chat/share         # Generate share link
```

---

## 11. DESIGN CONSIDERATIONS

- **Consistent Design Tokens** für alle neuen Features
- **Responsive** - Mobile-friendly für alle Panels
- **Dark Mode** - Alle Features dark-mode compatible
- **Accessibility** - Keyboard navigation, ARIA labels
- **Performance** - Lazy loading für Sidebar-Panels
- **Animations** - Smooth transitions für State changes

---

**Summary: Dieser Plan macht LotionGPT zu einem vollständigen AI-Chat-Workspace.**
