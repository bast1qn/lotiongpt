#!/usr/bin/env fish

# ==========================================
# LOTIONGPT AUTONOMOUS AGENT v1.0
# ==========================================
# Läuft autonom 4-5 Stunden und verbessert
# das LotionGPT Projekt kontinuierlich.
# ==========================================

# Load Fish config (for zclaude function)
if test -f ~/.config/fish/config.fish
    source ~/.config/fish/config.fish
end

# ==========================================
# KONFIGURATION (4-5 Stunden Laufzeit)
# ==========================================
set MAX_LOOPS 60              # 60 Loops × ~4-5 Minuten = ~4-5 Stunden
set PAUSE_SECONDS 30          # Kurze Pause zwischen Phasen (für API Rate Limits)
set LOG_FILE "lotiongpt_agent.log"
set ERROR_LOG_FILE "lotiongpt_errors.log"
set METRICS_FILE "lotiongpt_metrics.jsonl"
set CHECKPOINT_INTERVAL 10    # Alle 10 Loops: Extended Validation
set MAX_FAILED_REPAIRS 8      # Emergency Stop nach 8 fehlgeschlagenen Repairs
set MILESTONE_INTERVAL 10     # Git Tag alle 10 Loops
set ENABLE_HTML_REPORT true

# LotionGPT Projekt-spezifische Farben
set LOTION_PRIMARY "#FF6B35"
set LOTION_SECONDARY "#FF8C42"

# Statistik-Variablen (global)
set -g TOTAL_PHASES 0
set -g SUCCESSFUL_PHASES 0
set -g FAILED_REPAIRS 0
set -g SKIPPED_PHASES 0
set -g TOTAL_FILES_CHANGED 0
set -g TOTAL_LINES_ADDED 0
set -g TOTAL_LINES_REMOVED 0

# Phase-spezifische Erfolge
set -g PHASE_1_SUCCESS 0  # Code Quality
set -g PHASE_2_SUCCESS 0  # UI/UX
set -g PHASE_3_SUCCESS 0  # Features
set -g PHASE_4_SUCCESS 0  # Database/API
set -g PHASE_5_SUCCESS 0  # Cleanup

# ==========================================
# LOTIONGPT-SPEZIFISCHE PROMPTS
# ==========================================

function get_adaptive_prompt_1
    set -l loop_num $argv[1]
    set -l base_context "Handle als Senior Next.js/React Developer für LotionGPT.

PROJEKT: LotionGPT - Moderner Chat-Client
STACK: Next.js 16, React 19, TypeScript, Supabase, Z.ai API, Tailwind CSS 4
KONTEXT: Phase 1 von 5 | Loop $loop_num/$MAX_LOOPS"

    if test $loop_num -le 20
        echo "$base_context

FOCUS: CODE QUALITY & TYPE SAFETY (Early Phase)

PRIORITÄTEN:
1. TypeScript Fundamentals:
   - Eliminiere 'any' Types (ersetze mit proper types)
   - Fehlende Interfaces für Supabase Responses
   - Props Interfaces komplett definieren
   - Type Guards für Runtime Checks

2. React Best Practices:
   - useEffect Dependencies korrigieren
   - Memory Leaks verhindern (cleanup functions)
   - Props Drilling mit Context lösen
   - Correct Keys in Listen

3. Critical Bugs:
   - undefined/null Zugriffe (Optional Chaining)
   - Array operations ohne Guards
   - Error Handling fehlt?
   - Form Validation erweitern

4. Next.js Spezifika:
   - Server Components vs Client Components
   - Async Components correct?
   - Proxy/Middleware Optimierung

STYLE: Aggressiv, viele Fixes, Production-Ready Code!"

    else if test $loop_num -le 40
        echo "$base_context

FOCUS: ADVANCED PATTERNS & ROBUSTNESS (Mid Phase)

PRIORITÄTEN:
1. React Advanced:
   - Custom Hooks Optimierung
   - Context Performance (Split Providers?)
   - Suspense Boundaries
   - Error Boundaries Granularität

2. TypeScript Advanced:
   - Generic Types für Components
   - Discriminated Unions für State
   - Utility Types (Pick, Omit, Partial)
   - Type Coverage 100%

3. Code Robustness:
   - Edge Cases überall behandeln
   - Fallback States
   - Loading States konsistent
   - Error States user-friendly

4. Performance:
   - Re-Render Patterns analysieren
   - Virtual Scrolling für Message Lists?
   - Web Workers?

STYLE: Tiefgehend, analytisch, keine Quick-Fixes!"

    else
        echo "$base_context

FOCUS: PERFECTION & POLISH (Late Phase)

PRIORITÄTEN:
1. React Micro-Optimizations:
   - Alle Components geprüft auf Re-Renders?
   - Alle Callbacks mit useCallback?
   - Alle teuren Berechnungen mit useMemo?
   - Alle lazy-loadable Components lazy?

2. TypeScript Perfection:
   - Implizite Types eliminiert
   - Alle Functions mit Return-Type
   - Type Perfection

3. Edge Cases & Polish:
   - Alle User Flows getestet
   - Alle Error States perfekt
   - Alle Transitions smooth

4. Next.js Excellence:
   - Bundle Size minimal?
   - First Paint optimiert?
   - TTI gut?
   - Core Web Vitals grün?

STYLE: Perfektionistisch, Production-Ready!"
    end
end

function get_adaptive_prompt_2
    set -l loop_num $argv[1]
    set -l phase_1_changes $argv[2]

    set -l base_context "Handle als Lead UI/UX Designer (Referenz: Vercel, Linear, Raycast).

PROJEKT: LotionGPT Chat Interface
KONTEXT: Phase 2 von 5 | Loop $loop_num/$MAX_LOOPS

DESIGN SYSTEM:
- Primary: #FF6B35 (Orange) mit Glow
- Dark Theme: Glassmorphism, Blur, Gradient
- Typography: Geist Sans/Mono
- Spacing: 4, 8, 12, 16, 20, 24, 32px
- Animation: Spring-based (300-400ms)

ÄNDERUNGEN IN PHASE 1:
$phase_1_changes"

    if test $loop_num -le 20
        echo "$base_context

FOCUS: FOUNDATION (Visual Basics)

AUFGABEN:
1. Spacing & Hierarchy:
   - Tailwind spacing konsistent
   - Font-Sizes: Hero → H1 → Body
   - Line-Height: tight/snug → relaxed
   - Padding: Mobile → Desktop

2. Interactive States:
   - Hover: scale-105 ODER brightness
   - Focus: ring mit orange glow
   - Active: scale-95
   - Disabled: opacity-50

3. Responsive:
   - Mobile Breakpoints prüfen
   - Touch Targets min-h-11
   - Horizontal Scroll bugs?
   - Sidebar auf Mobile?

4. Color Consistency:
   - Orange (#FF6B35) konsistent?
   - Glow Effects subtil?
   - Text Contrast WCAG AA?

CONSTRAINTS: Orange Theme, Glassmorphism, Spring Animations!"

    else if test $loop_num -le 40
        echo "$base_context

FOCUS: REFINEMENT (UX Polish)

AUFGABEN:
1. Micro-Interactions:
   - Hover Transitions smooth
   - Loading States (Skeletons!)
   - Success/Error Feedback
   - Message Animations

2. Accessibility:
   - WCAG AA Contrast überall?
   - Focus Indicators sichtbar
   - Alt-Texts für Images
   - ARIA-Labels für Icons
   - Keyboard Navigation

3. Responsive Excellence:
   - Alle Breakpoints testen
   - Tablet Ansicht optimieren
   - Ultra-wide Desktop

4. Visual Consistency:
   - Buttons konsistent
   - Inputs konsistent
   - Cards konsistent
   - Shadows konsistent

CONSTRAINTS: Design-System strikt!"

    else
        echo "$base_context

FOCUS: PERFECTION (Design Excellence)

AUFGABEN:
1. Visual Perfection:
   - Pixel perfect alignment
   - Spacing harmonisch
   - Font-Weights konsistent
   - Icons aligned

2. Advanced Interactions:
   - Gestures (swipe, drag)
   - Scroll-Animations subtil
   - Subtle Parallax
   - 3D Transforms minimal

3. Performance vs Beauty:
   - GPU-accelerated animations
   - Images optimized
   - Fonts optimized
   - Critical CSS inline

4. Final Polish:
   - Glassmorphism perfekt
   - Loading States polished
   - Empty States designed
   - Error States friendly

CONSTRAINTS: Production-ready, pixel-perfect!"
    end
end

function get_adaptive_prompt_3
    set -l loop_num $argv[1]

    set -l base "Handle als Feature Developer für LotionGPT.

KONTEXT: Phase 3 von 5 | Loop $loop_num/$MAX_LOOPS
MISSION: Neue Features & Funktionalität erweitern"

    if test $loop_num -le 20
        echo "$base

FOCUS: CORE FEATURES (Essential Enhancements)

IDEEN:
1. Chat Features:
   - Message Reactions (Emoji)
   - Message Editing
   - Message Forwarding
   - Quick Reply Templates
   - Voice Input (Web Speech API)

2. Organization:
   - Tags für Chats
   - Folders für Chats
   - Advanced Search (filter by date, content)
   - Pinned Important Chats

3. UX Enhancements:
   - Chat Preview in Sidebar
   - Unread Indicators
   - Typing Indicator für Partner
   - Online Status

4. Export/Import:
   - Export as Markdown
   - Export as PDF
   - Import Chats
   - Backup/Restore

IMPLEMENTIERE: 1-2 Features pro Loop, tested und documented!"

    else if test $loop_num -le 40
        echo "$base

FOCUS: ADVANCED FEATURES (Power User)

IDEEN:
1. Collaboration:
   - Share Chats (Links)
   - Collaborative Editing
   - Comments on Messages
   - Chat Branching Merging

2. AI Features:
   - Multiple Model Selection
   - Model Comparison
   - Custom System Prompts
   - Prompt Templates Management
   - Streaming Responses

3. Media:
   - Image Generation Integration
   - File Upload Improvements
   - Video/Audio Support
   - Document Preview

4. Automation:
   - Scheduled Messages
   - Auto-Responses
   - Webhooks Integration
   - Zapier/Make Integration

IMPLEMENTIERE: 1 Feature pro Loop, Production-Ready!"

    else
        echo "$base

FOCUS: EXCELLENCE (Feature Polish)

IDEEN:
1. Integrations:
   - Calendar Integration
   - Task Management (Notion, Todoist)
   - Note Taking (Obsidian, Logseq)
   - CRM Integration

2. Advanced AI:
   - Context Memory Management
   - Fine-tuned Model Selection
   - Cost Tracking
   - Usage Analytics

3. Developer Features:
   - API Mode (headless)
   - Webhook Events
   - SDK Export
   - Plugin System

4. Enterprise:
   - SSO Integration
   - Team Management
   - Audit Logs
   - Rate Limiting

IMPLEMENTIERE: Features mit Enterprise Quality!"
    end
end

function get_adaptive_prompt_4
    set -l loop_num $argv[1]

    set -l base "Handle als Database & API Engineer für LotionGPT.

KONTEXT: Phase 4 von 5 | Loop $loop_num/$MAX_LOOPS
STACK: Supabase (PostgreSQL, RLS, Auth), Z.ai API"

    if test $loop_num -le 20
        echo "$base

FOCUS: DATABASE FUNDAMENTALS

AUFGABEN:
1. Supabase Schema:
   - RLS Policies korrekt?
   - Indexes für Performance?
   - Foreign Keys proper?
   - Tables optimized?

2. API Integration:
   - Z.ai API Error Handling?
   - Rate Limiting?
   - Retry Logic?
   - Response Caching?

3. Data Flow:
   - Realtime Subscriptions?
   - Optimistic Updates?
   - Conflict Resolution?
   - Offline Support?

4. Auth & Security:
   - Session Management?
   - Token Refresh?
   - Protected Routes?
   - API Key Security?"

    else if test $loop_num -le 40
        echo "$base

FOCUS: ADVANCED DATA PATTERNS

AUFGABEN:
1. Database Optimization:
   - Query Optimization
   - N+1 Queries eliminieren
   - Connection Pooling?
   - Replication?

2. Advanced Supabase:
   - Edge Functions?
   - Database Functions?
   - Triggers?
   - Views?

3. API Excellence:
   - Response Compression
   - Pagination
   - Filtering/Sorting
   - GraphQL Consideration?

4. Realtime:
   - Realtime Performance
   - Reconnection Logic
   - Conflict Resolution
   - Sync Strategies?"

    else
        echo "$base

FOCUS: DATA EXCELLENCE

AUFGABEN:
1. Database Perfection:
   - Zero Slow Queries
   - Perfect Indexes
   - Optimal Schema
   - Backup Strategy

2. API Perfection:
   - Zero Errors
   - Perfect Rate Limiting
   - Optimal Caching
   - Graceful Degradation

3. Monitoring:
   - Error Tracking (Sentry?)
   - Performance Monitoring
   - Usage Analytics
   - Cost Tracking

4. Scalability:
   - Horizontal Scaling?
   - Caching Strategy
   - CDN for Static
   - Edge Deployment?

TARGET: Production-Grade Data Layer!"
    end
end

function get_adaptive_prompt_5
    set -l loop_num $argv[1]

    set -l base "Handle als Senior Software Architect für LotionGPT.

KONTEXT: Phase 5 von 5 | Loop $loop_num/$MAX_LOOPS - CLEANUP"

    if test $loop_num -le 20
        echo "$base

FOCUS: BASIC CLEANUP

TASKS:
1. Dead Code:
   - Unused Imports
   - Commented Blocks
   - Unreachable Code
   - Unused Variables

2. DRY Basics:
   - Duplicate Patterns
   - Copy-Paste Code
   - Repeated Logic → Utils

3. Import Organization:
   - React → External → Internal → Types
   - Alphabetisch
   - Relative Paths konsistent

4. Light Documentation:
   - Complex Functions JSDoc
   - Magic Numbers → Constants

CONSTRAINTS: NO Breaking Changes!"

    else if test $loop_num -le 40
        echo "$base

FOCUS: STRUCTURAL IMPROVEMENTS

TASKS:
1. Component Structure:
   - Components >300 Zeilen splitten
   - Sub-Components extrahieren
   - Props Interface optimization

2. Code Organization:
   - Helper → lib/utils.ts
   - Constants → separate Files
   - Types → types/ Directory
   - Hooks → lib/hooks/

3. Readability:
   - Magic Numbers eliminieren
   - Boolean Flags → Enums
   - Long Functions aufbrechen

4. Consistency:
   - Naming Conventions
   - Event Handler naming
   - Boolean Prefixes
   - File naming

CONSTRAINTS: Keine Funktionsänderungen!"

    else
        echo "$base

FOCUS: ARCHITECTURAL EXCELLENCE

TASKS:
1. Design Patterns:
   - Singleton wo sinnvoll
   - Factory Pattern
   - Observer Pattern
   - Strategy Pattern

2. Organization:
   - Barrel Exports (index.ts)
   - Module Boundaries klar
   - Dependency Direction
   - No Circular Deps

3. Code Excellence:
   - SOLID Principles
   - Single Responsibility
   - Open/Closed
   - Dependency Inversion

4. Documentation:
   - README Features
   - ADRs
   - API Docs
   - Component Docs?

TARGET: Enterprise-Grade Code!"
    end
end

# ==========================================
# HELPER FUNCTIONS
# ==========================================

function log_msg
    set timestamp (date "+%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] $argv" | tee -a $LOG_FILE
end

function log_error
    set timestamp (date "+%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] ❌ ERROR: $argv" | tee -a $LOG_FILE | tee -a $ERROR_LOG_FILE
end

function log_success
    set timestamp (date "+%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] ✅ $argv" | tee -a $LOG_FILE
end

function log_metric
    set -l metric_name $argv[1]
    set -l metric_value $argv[2]
    set timestamp (date "+s")
    echo "{\"timestamp\": $timestamp, \"metric\": \"$metric_name\", \"value\": \"$metric_value\"}" >> $METRICS_FILE
end

function update_phase_stats
    set -l phase_num $argv[1]
    switch $phase_num
        case 1
            set -g PHASE_1_SUCCESS (math $PHASE_1_SUCCESS + 1)
        case 2
            set -g PHASE_2_SUCCESS (math $PHASE_2_SUCCESS + 1)
        case 3
            set -g PHASE_3_SUCCESS (math $PHASE_3_SUCCESS + 1)
        case 4
            set -g PHASE_4_SUCCESS (math $PHASE_4_SUCCESS + 1)
        case 5
            set -g PHASE_5_SUCCESS (math $PHASE_5_SUCCESS + 1)
    end
end

function track_git_stats
    set -l last_commit_files (git diff HEAD~1 HEAD --numstat 2>/dev/null | wc -l)
    set -l last_commit_added (git diff HEAD~1 HEAD --numstat 2>/dev/null | awk '{added+=$1} END {print added}')
    set -l last_commit_removed (git diff HEAD~1 HEAD --numstat 2>/dev/null | awk '{removed+=$2} END {print removed}')

    if test -n "$last_commit_added"
        set TOTAL_FILES_CHANGED (math $TOTAL_FILES_CHANGED + $last_commit_files)
        set TOTAL_LINES_ADDED (math $TOTAL_LINES_ADDED + $last_commit_added)
        set TOTAL_LINES_REMOVED (math $TOTAL_LINES_REMOVED + $last_commit_removed)
    end
end

function check_and_repair
    log_msg "🛠️  Build Check..."
    npm run build > /dev/null 2>&1

    if test $status -eq 0
        log_success "Build SUCCESS"
        set SUCCESSFUL_PHASES (math $SUCCESSFUL_PHASES + 1)
        track_git_stats
        return 0
    else
        log_error "BUILD FAILED! Starting Emergency Repair..."
        set ERROR_LOG (npm run build 2>&1 | tail -n 50)

        set REPAIR_PROMPT "🚨 CRITICAL BUILD FAILURE - Emergency QA Engineer Mode.

ERROR LOG (Last 50 lines):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
$ERROR_LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REPAIR PROTOCOL:
1. IDENTIFY Error Type:
   [TS] TypeScript error → Line + File + Expected vs. Got
   [IMPORT] Module error → Check import path + file exists
   [SYNTAX] Syntax error → Missing bracket/semicolon/quote
   [RUNTIME] Runtime error → Undefined access, null reference

2. FIX Strategy:
   - TypeScript: Add type assertion OR fix type definition
   - Import: Correct path OR add missing file
   - Syntax: Add missing character
   - Runtime: Add optional chaining OR null check

3. SINGLE FOCUS:
   Fix ONLY the first error listed
   Ignore subsequent errors (they might auto-resolve)

CRITICAL RULES:
✗ NO refactoring
✗ NO optimizations
✗ NO style changes
✗ NO feature additions
✓ ONLY fix the breaking error

Execute minimal fix NOW."

        zclaude -p "$REPAIR_PROMPT" --dangerously-skip-permissions

        # Verify Fix
        log_msg "🔍 Verifying repair..."
        npm run build > /dev/null 2>&1
        if test $status -eq 0
            log_success "Repair SUCCESSFUL!"
            git add .
            git commit -m "🚑 Emergency: Auto-Repair Build" --allow-empty
            set SUCCESSFUL_PHASES (math $SUCCESSFUL_PHASES + 1)
            log_metric "repair_success" "1"
            return 0
        else
            log_error "Repair FAILED. Executing ROLLBACK..."
            git stash push -m "Failed-Repair-$(date +%Y%m%d_%H%M%S)" 2>/dev/null
            git reset --hard HEAD

            set FAILED_REPAIRS (math $FAILED_REPAIRS + 1)
            log_error "Failed Repairs: $FAILED_REPAIRS/$MAX_FAILED_REPAIRS"
            log_metric "repair_failed" "1"

            if test $FAILED_REPAIRS -ge $MAX_FAILED_REPAIRS
                log_error "🛑 EMERGENCY STOP: Too many failed repairs ($FAILED_REPAIRS)"
                generate_html_report "emergency_stop"
                exit 1
            end

            return 1
        end
    end
end

function create_milestone
    set -l loop_num $argv[1]
    set -l tag_name "lotiongpt-milestone-$loop_num"
    set -l tag_message "LotionGPT: Loop $loop_num completed | $SUCCESSFUL_PHASES successful phases"

    git tag -a $tag_name -m "$tag_message" 2>/dev/null
    if test $status -eq 0
        log_success "Git Tag created: $tag_name"
        log_metric "milestone" "$loop_num"
    end
end

function log_summary
    set -l loop_num $argv[1]
    set -l progress_percent (math "round($loop_num * 100 / $MAX_LOOPS)")

    log_msg ""
    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg "📊 ROUND SUMMARY - Loop $loop_num/$MAX_LOOPS"
    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg "📍 Progress: $progress_percent% complete"

    if test $TOTAL_PHASES -gt 0
        set -l success_rate (math "round($SUCCESSFUL_PHASES * 100 / $TOTAL_PHASES)")
        log_msg "✅ Success Rate: $success_rate% ($SUCCESSFUL_PHASES/$TOTAL_PHASES phases)"
    end

    log_msg "📦 Phase Success: Code=$PHASE_1_SUCCESS | UX=$PHASE_2_SUCCESS | Features=$PHASE_3_SUCCESS | Data=$PHASE_4_SUCCESS | Clean=$PHASE_5_SUCCESS"

    set -l commits_session (git rev-list --count HEAD --since="6 hours ago")
    log_msg "💾 Commits (Session): $commits_session"
    log_msg "📝 Total Changes: +$TOTAL_LINES_ADDED -$TOTAL_LINES_REMOVED lines, $TOTAL_FILES_CHANGED files"

    if test $FAILED_REPAIRS -gt 0
        log_msg "⚠️  Failed Repairs: $FAILED_REPAIRS/$MAX_FAILED_REPAIRS"
    end

    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg ""
end

function pre_flight_check
    log_msg "🔍 PRE-FLIGHT CHECK INITIATED..."
    log_msg ""

    if not test -d .git
        log_error "Git repository not found!"
        return 1
    end
    log_success "Git repository ✓"

    if not command -q npm
        log_error "npm not found!"
        return 1
    end
    log_success "npm available ✓"

    if not type -q zclaude
        log_error "zclaude function not found!"
        return 1
    end
    log_success "zclaude function available ✓"

    if not test -f package.json
        log_error "package.json not found!"
        return 1
    end
    log_success "package.json exists ✓"

    log_msg "🏗️  Testing initial build..."
    npm run build > /dev/null 2>&1
    if test $status -ne 0
        log_error "Initial build FAILED! Fix manually before starting."
        return 1
    end
    log_success "Initial build SUCCESS ✓"

    set -l branch (git branch --show-current)
    log_success "Current branch: $branch ✓"

    if not git diff --quiet
        log_msg "⚠️  Uncommitted changes detected - committing..."
        git add .
        git commit -m "Pre-LotionGPT-Loop: Save working state" --allow-empty
        log_success "Changes committed ✓"
    end

    echo -n "" > $METRICS_FILE

    log_msg ""
    log_success "PRE-FLIGHT CHECK COMPLETE"
    log_msg ""
    return 0
end

function generate_html_report
    set -l status_type $argv[1]
    set -l report_file "lotiongpt_report.html"
    set -l end_time (date "+%Y-%m-%d %H:%M:%S")
    set -l total_commits (git rev-list --count HEAD --since="8 hours ago")
    set -l success_rate 0

    if test $TOTAL_PHASES -gt 0
        set success_rate (math "round($SUCCESSFUL_PHASES * 100 / $TOTAL_PHASES)")
    end

    echo "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>LotionGPT Agent Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fff; padding: 40px 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 60px; }
        .header h1 { font-size: 48px; margin-bottom: 10px; background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { color: #888; font-size: 18px; }
        .status { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: 600; margin-top: 20px; }
        .status.success { background: #10B981; color: white; }
        .status.emergency { background: #EF4444; color: white; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px; }
        .card { background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 24px; }
        .card h3 { font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .card .value { font-size: 36px; font-weight: 700; color: #fff; }
        .card .subvalue { font-size: 14px; color: #666; margin-top: 8px; }
        .progress-bar { width: 100%; height: 8px; background: #333; border-radius: 4px; overflow: hidden; margin-top: 12px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #FF6B35 0%, #FF8C42 100%); transition: width 0.3s ease; }
        .phase-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-top: 20px; }
        .phase { background: #2a2a2a; border-radius: 8px; padding: 16px; text-align: center; }
        .phase .name { font-size: 12px; color: #888; margin-bottom: 8px; }
        .phase .count { font-size: 24px; font-weight: 700; }
        .footer { text-align: center; margin-top: 60px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🚀 LotionGPT Agent Report</h1>
            <p>Autonomous Development Loop Results</p>
            <div class='status $status_type'>$status_type</div>
        </div>
        <div class='grid'>
            <div class='card'>
                <h3>Total Phases</h3>
                <div class='value'>$TOTAL_PHASES</div>
                <div class='subvalue'>Executed phases</div>
            </div>
            <div class='card'>
                <h3>Success Rate</h3>
                <div class='value'>$success_rate%</div>
                <div class='progress-bar'><div class='progress-fill' style='width: $success_rate%'></div></div>
                <div class='subvalue'>$SUCCESSFUL_PHASES successful</div>
            </div>
            <div class='card'>
                <h3>Total Commits</h3>
                <div class='value'>$total_commits</div>
                <div class='subvalue'>Last 8 hours</div>
            </div>
            <div class='card'>
                <h3>Code Changes</h3>
                <div class='value' style='color: #10B981'>+$TOTAL_LINES_ADDED</div>
                <div class='value' style='color: #EF4444'>-$TOTAL_LINES_REMOVED</div>
                <div class='subvalue'>$TOTAL_FILES_CHANGED files changed</div>
            </div>
        </div>
        <div class='card'>
            <h3>Phase Breakdown</h3>
            <div class='phase-grid'>
                <div class='phase'>
                    <div class='name'>💻 Code</div>
                    <div class='count'>$PHASE_1_SUCCESS</div>
                </div>
                <div class='phase'>
                    <div class='name'>🎨 UX</div>
                    <div class='count'>$PHASE_2_SUCCESS</div>
                </div>
                <div class='phase'>
                    <div class='name'>✨ Features</div>
                    <div class='count'>$PHASE_3_SUCCESS</div>
                </div>
                <div class='phase'>
                    <div class='name'>🗄️ Data</div>
                    <div class='count'>$PHASE_4_SUCCESS</div>
                </div>
                <div class='phase'>
                    <div class='name'>🧹 Clean</div>
                    <div class='count'>$PHASE_5_SUCCESS</div>
                </div>
            </div>
        </div>
        <div class='footer'>
            <p>Generated on $end_time</p>
            <p>LotionGPT Autonomous Agent © 2026</p>
        </div>
    </div>
</body>
</html>" > $report_file

    log_success "HTML Report generated: $report_file"
end

function final_report
    set -l end_time (date "+%Y-%m-%d %H:%M:%S")
    set -l total_commits (git rev-list --count HEAD --since="8 hours ago")

    log_msg ""
    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg "🎉 LOTIONGPT FINAL REPORT"
    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg "🏁 End Time: $end_time"
    log_msg "🔄 Loops Completed: $MAX_LOOPS"
    log_msg "📦 Total Phases: $TOTAL_PHASES"
    log_msg "✅ Successful Phases: $SUCCESSFUL_PHASES"

    if test $TOTAL_PHASES -gt 0
        set -l final_success_rate (math "round($SUCCESSFUL_PHASES * 100 / $TOTAL_PHASES)")
        log_msg "📊 Final Success Rate: $final_success_rate%"
    end

    log_msg ""
    log_msg "📈 Phase Breakdown:"
    log_msg "   💻 Code Quality: $PHASE_1_SUCCESS"
    log_msg "   🎨 UI/UX: $PHASE_2_SUCCESS"
    log_msg "   ✨ Features: $PHASE_3_SUCCESS"
    log_msg "   🗄️ Database/API: $PHASE_4_SUCCESS"
    log_msg "   🧹 Cleanup: $PHASE_5_SUCCESS"

    log_msg ""
    log_msg "📝 Code Statistics:"
    log_msg "   💾 Total Commits: $total_commits"
    log_msg "   📝 Lines Added: +$TOTAL_LINES_ADDED"
    log_msg "   📝 Lines Removed: -$TOTAL_LINES_REMOVED"
    log_msg "   📁 Files Changed: $TOTAL_FILES_CHANGED"

    if test $FAILED_REPAIRS -gt 0
        log_msg ""
        log_msg "⚠️  Total Failed Repairs: $FAILED_REPAIRS"
    end

    log_msg ""
    log_msg "📁 Output Files:"
    log_msg "   📄 Main Log: $LOG_FILE"
    if test $FAILED_REPAIRS -gt 0
        log_msg "   📄 Error Log: $ERROR_LOG_FILE"
    end
    log_msg "   📄 Metrics: $METRICS_FILE"
    if test "$ENABLE_HTML_REPORT" = "true"
        log_msg "   📄 HTML Report: lotiongpt_report.html"
    end

    log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_msg ""

    generate_html_report "success"
end

# ==========================================
# MAIN LOOP
# ==========================================

# Pre-Flight Check
if not pre_flight_check
    echo "❌ Pre-Flight Check failed. Aborting."
    exit 1
end

set START_TIME (date "+%Y-%m-%d %H:%M:%S")
log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_msg "🚀 LOTIONGPT AUTONOMOUS AGENT v1.0"
log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_msg "⚙️  Configuration:"
log_msg "   • Max Loops: $MAX_LOOPS (~4-5 hours)"
log_msg "   • Phases per Loop: 5 (Adaptive)"
log_msg "   • Pause: $PAUSE_SECONDS seconds"
log_msg "   • Checkpoints: Every $CHECKPOINT_INTERVAL loops"
log_msg "   • Milestones: Every $MILESTONE_INTERVAL loops"
log_msg "   • HTML Report: $ENABLE_HTML_REPORT"
log_msg "🕐 Start Time: $START_TIME"
log_msg "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_msg ""

for i in (seq 1 $MAX_LOOPS)
    log_msg ""
    log_msg "╔═══════════════════════════════════════════════╗"
    log_msg "║  🔄 LOOP $i of $MAX_LOOPS"
    log_msg "╚═══════════════════════════════════════════════╝"
    log_msg ""

    # --- PHASE 1: CODE QUALITY ---
    log_msg "💻 Phase 1/5: Code Quality & Type Safety"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    set ADAPTIVE_PROMPT_1 (get_adaptive_prompt_1 $i)
    zclaude -p "$ADAPTIVE_PROMPT_1" --dangerously-skip-permissions

    if check_and_repair
        update_phase_stats 1
        git add .
        git commit -m "Loop $i/Phase 1: Code Quality" --allow-empty
    else
        log_error "Phase 1 failed - skipping rest of loop $i"
        set SKIPPED_PHASES (math $SKIPPED_PHASES + 4)
        continue
    end

    # --- PHASE 2: UI/UX ---
    log_msg ""
    log_msg "🎨 Phase 2/5: UI/UX Design"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    set RECENT_CHANGES (git diff HEAD~1 HEAD --stat)
    set ADAPTIVE_PROMPT_2 (get_adaptive_prompt_2 $i "$RECENT_CHANGES")
    zclaude -p "$ADAPTIVE_PROMPT_2" --dangerously-skip-permissions

    if check_and_repair
        update_phase_stats 2
        git add .
        git commit -m "Loop $i/Phase 2: UI/UX" --allow-empty
    else
        log_error "Phase 2 failed - skipping rest of loop $i"
        set SKIPPED_PHASES (math $SKIPPED_PHASES + 3)
        continue
    end

    # --- PHASE 3: FEATURES ---
    log_msg ""
    log_msg "✨ Phase 3/5: Features & Functionality"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    set ADAPTIVE_PROMPT_3 (get_adaptive_prompt_3 $i)
    zclaude -p "$ADAPTIVE_PROMPT_3" --dangerously-skip-permissions

    if check_and_repair
        update_phase_stats 3
        git add .
        git commit -m "Loop $i/Phase 3: Features" --allow-empty
    else
        log_error "Phase 3 failed - skipping rest of loop $i"
        set SKIPPED_PHASES (math $SKIPPED_PHASES + 2)
        continue
    end

    # --- PHASE 4: DATABASE/API ---
    log_msg ""
    log_msg "🗄️  Phase 4/5: Database & API"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    set ADAPTIVE_PROMPT_4 (get_adaptive_prompt_4 $i)
    zclaude -p "$ADAPTIVE_PROMPT_4" --dangerously-skip-permissions

    if check_and_repair
        update_phase_stats 4
        git add .
        git commit -m "Loop $i/Phase 4: Database/API" --allow-empty
    else
        log_error "Phase 4 failed - skipping rest of loop $i"
        set SKIPPED_PHASES (math $SKIPPED_PHASES + 1)
        continue
    end

    # --- PHASE 5: CLEANUP ---
    log_msg ""
    log_msg "🧹 Phase 5/5: Architecture Cleanup"
    set TOTAL_PHASES (math $TOTAL_PHASES + 1)
    set ADAPTIVE_PROMPT_5 (get_adaptive_prompt_5 $i)
    zclaude -p "$ADAPTIVE_PROMPT_5" --dangerously-skip-permissions

    if check_and_repair
        update_phase_stats 5
        git add .
        git commit -m "Loop $i/Phase 5: Cleanup" --allow-empty
    else
        log_error "Phase 5 failed - continuing to next loop"
    end

    # --- MILESTONE TAGGING ---
    if test (math "$i % $MILESTONE_INTERVAL") -eq 0
        log_msg ""
        log_msg "🏆 MILESTONE REACHED: Loop $i"
        create_milestone $i
    end

    # --- CHECKPOINT VALIDATION ---
    if test (math "$i % $CHECKPOINT_INTERVAL") -eq 0
        log_msg ""
        log_msg "🔍 ═══ CHECKPOINT $i ═══"
        log_msg "Running Extended Validation..."
        npm run build > /dev/null 2>&1
        if test $status -eq 0
            log_success "Checkpoint Build: PASSED"
            log_metric "checkpoint_$i" "passed"
        else
            log_error "Checkpoint Build: FAILED"
            log_metric "checkpoint_$i" "failed"
        end
    end

    # --- ROUND SUMMARY ---
    log_msg ""
    log_summary $i

    # --- PAUSE ---
    log_msg ""
    log_success "Loop $i complete (5/5 phases)"
    if test $i -lt $MAX_LOOPS
        log_msg "☕ Pause for $PAUSE_SECONDS seconds..."
        log_msg ""
        sleep $PAUSE_SECONDS
    end
end

# Final Report
log_msg ""
final_report
log_success "🎉 LOTIONGPT AUTONOMOUS AGENT COMPLETED!"
