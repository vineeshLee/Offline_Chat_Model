/*
===============================================================
    REALISTIC CHAT UI - VISUAL STRUCTURE & REFERENCE
===============================================================
*/

/*
   LIVE CHAT INTERFACE LAYOUT
   ═══════════════════════════════════════════════════════════

   ┌─────────────────────────────────────────────────────────┐
   │  💬 Offline Chat Assistant                          ☰   │  ← Header
   ├─────────────────────────────────────────────────────────┤
   │                                                         │
   │  History  ┌────────────────────────────────────────┐   │
   │  ────────┤                                        │   │
   │ • Chat 1  │                                        │   │
   │ • Chat 2  │        CHAT MESSAGES AREA             │   │  ← Messages
   │ • Chat 3  │                                        │   │
   │           │   👤 ┌──────────────────────┐         │   │
   │  + New    │      │ User: Hello!          │         │   │
   │   Chat    │      └──────────────────────┘         │   │
   │           │      11:30 AM                         │   │
   │           │                                        │   │
   │           │        🤖 ┌──────────────────────┐   │   │
   │           │            │ Bot: Hi there! How  │   │   │
   │           │            │ can I help you?     │   │   │
   │           │            └──────────────────────┘   │   │
   │           │            11:31 AM                   │   │
   │           │                                        │   │
   │           └────────────────────────────────────────┘   │
   │  ┌─────────────────────────────────────────────────┐   │
   │  │ Ask me anything...                            ⬆️ │  ← Input
   │  └─────────────────────────────────────────────────┘   │
   └─────────────────────────────────────────────────────────┘


   DETAILED MESSAGE STRUCTURE
   ═══════════════════════════════════════════════════════════

   USER MESSAGE (Right-aligned):
   ───────────────────────────────
   
   Layout Grid:
   
   [Padding] [Message Body (gap: 10px)] [Padding]
              ↓
              Avatar (flex-reverse) ← Content ← Timestamp
   
   HTML Structure:
   <div class="message user">
     <div class="message-body">
       <div class="message-avatar user">👤</div>
       <div class="message-content">
         <div class="message-bubble">User message text</div>
         <div class="message-timestamp">11:30 AM</div>
       </div>
     </div>
   </div>

   Visual Rendering:
   
                                      👤 ┌──────────────┐
                                         │ User message │
                                         └──────────────┘
                                         11:30 AM


   BOT MESSAGE (Left-aligned):
   ──────────────────────────────
   
   Layout Grid:
   
   [Padding] [Message Body (gap: 10px)] [Padding]
              ↓
              Avatar ← Content ← Timestamp
   
   HTML Structure:
   <div class="message bot">
     <div class="message-body">
       <div class="message-avatar bot">🤖</div>
       <div class="message-content">
         <div class="message-bubble">Bot message text</div>
         <div class="message-timestamp">11:31 AM</div>
       </div>
     </div>
   </div>

   Visual Rendering:
   
   🤖 ┌──────────────┐
      │ Bot message  │
      └──────────────┘
      11:31 AM


   COLOR REPRESENTATION
   ═══════════════════════════════════════════════════════════

   USER MESSAGE BUBBLE:
   ┌─────────────────────────┐
   │ #333333 → #444444      │  Background gradient
   │ Border: #555555        │  1px solid
   │ Text: #ffffff          │  White
   │ Radius: 16px (4px TL) │  Pill shape with tail
   └─────────────────────────┘


   BOT MESSAGE BUBBLE:
   ┌─────────────────────────┐
   │ #1a2a1a (dark green)   │  Background
   │ Border: #333333        │  1px solid
   │ Text: #c0e0c0          │  Light green
   │ Radius: 16px (4px BL) │  Pill shape with tail
   └─────────────────────────┘


   AVATAR STYLING:
   ═══════════════════════════════════════════════════════════

   USER AVATAR:
   ┌──────────┐
   │    👤    │  32x32px, circular
   │ Bg: Blue │  #2a4a8a with #4a6aba border
   └──────────┘

   BOT AVATAR:
   ┌──────────┐
   │    🤖    │  32x32px, circular
   │  Bg: Grn │  #2a6a3a with #4a8a5a border
   └──────────┘


   TEXT FORMATTING SUPPORT
   ═══════════════════════════════════════════════════════════

   INPUT MARKDOWN          RENDERED OUTPUT         COLOR

   **bold text**    →      bold text           #ffdd77 (yellow)
   *italic text*    →      italic text         #aaddff (blue)
   `code text`      →      code text on bg     #77ff77 (green)
   Multiple lines   →      Proper line breaks  (preserved)


   ANIMATION EFFECTS
   ═══════════════════════════════════════════════════════════

   Message Appear:
   - Duration: 0.3s ease-out
   - Start: opacity 0, translateY(10px)
   - End: opacity 1, translateY(0)

   Bubble Fade:
   - Duration: 0.3s ease-out
   - Start: opacity 0, scale(0.95)
   - End: opacity 1, scale(1)

   Typing Indicator:
   - Animated dots (8px diameter)
   - Each dot scales and bobs
   - Duration: 1.4s infinite


   RESPONSIVE BEHAVIOR
   ═══════════════════════════════════════════════════════════

   DESKTOP (>768px):
   ┌─────────────────────────────┐
   │ Sidebar | Chat Area         │
   │ (280px) | (Flex: 1)         │
   └─────────────────────────────┘
   Message max-width: 80%


   TABLET (768px to 480px):
   ┌─────────────────────────────┐
   │ ☰ ← Toggle Sidebar Hidden   │
   │ Chat Area (Full width)      │
   └─────────────────────────────┘
   Message max-width: 85%


   MOBILE (<480px):
   ┌─────────────────┐
   │ ☰ Chat Area     │
   │ (Full width)    │
   └─────────────────┘
   Message max-width: 90%


   STATE TRANSITIONS
   ═══════════════════════════════════════════════════════════

   1. APP START → WELCOME SCREEN
      └─ Shows 4 suggestion buttons
      └─ Select suggestion fills input
      └─ Press Enter → First message sent

   2. SEND MESSAGE → CHAT APPEARS
      └─ Message added to chat
      └─ "Thinking..." indicator shown
      └─ Server processes (10s average)
      └─ Response appears with timestamp
      └─ Auto-saved to history

   3. NEW CHAT → FRESH CONVERSATION
      └─ Clear all messages
      └─ Reset welcome screen
      └─ Add to history sidebar
      └─ Ready for new messages

   4. LOAD HISTORY → PREVIOUS CHAT
      └─ All messages reappear
      └─ Timestamps preserved
      └─ Formatting preserved
      └─ Sidebar highlights current


   TYPING INDICATOR POSITION
   ═══════════════════════════════════════════════════════════

   When bot is processing:

   ┌────────────────────────────────────┐
   │ Previous messages...               │
   │                                    │
   │ 🤖 ⠿ ⠿ ⠿                            │
   │    Thinking...                     │
   └────────────────────────────────────┘

   Appears in message area, not header
   Uses bot avatar styling
   Animated dots


   ERROR HANDLING
   ═══════════════════════════════════════════════════════════

   ERROR MESSAGE STRUCTURE:
   
   🤖 ┌──────────────────────┐
      │ Error: [error text]   │
      └──────────────────────┘
      [timestamp]

   Same styling as regular bot message
   Clearly marked with "Error:" prefix
   Automatically saved to history


   TIMESTAMP FORMAT
   ═══════════════════════════════════════════════════════════

   FORMAT: HH:MM AM/PM
   
   Examples:
   - 08:30 AM
   - 12:15 PM
   - 03:45 PM
   - 11:59 PM

   LOCATION: Below each message bubble
   ALIGNMENT: Right for user, left for bot
   COLOR: #666666 (muted gray)
   SIZE: 11px


   MESSAGE METADATA (Internal)
   ═══════════════════════════════════════════════════════════

   Stored per message:
   {
     sender: 'user' | 'bot',
     text: 'message content',
     timestamp: '11:30 AM',
     id: 1679700330000,
     formatted: true
   }

   Preserved in localStorage for history
   Used for message reconstruction
   Enables message search/filtering


   KEYBOARD SHORTCUTS
   ═══════════════════════════════════════════════════════════

   ENTER       → Send message
   SHIFT+ENTER → (Insert line break - if supported)
   ESC         → (Close sidebar on mobile)


   BROWSER CONSOLE DETAILS
   ═══════════════════════════════════════════════════════════

   View Messages:
   JSON.parse(localStorage.getItem('chats'))

   Clear All Chats:
   localStorage.removeItem('chats')

   Current Chat:
   currentChat (global variable)

   Check Timestamps:
   currentChat.messages.map(m => ({time: m.timestamp, text: m.text}))


   PERFORMANCE METRICS
   ═══════════════════════════════════════════════════════════

   Message Rendering:       ~50ms
   Animation Duration:     0.3s
   Storage Write:          ~10ms
   Scroll Performance:     60fps
   Mobile Performance:     Good

*/

// USAGE EXAMPLE:
/*
   1. User types: "**What is AI?**"
   2. Click send or press Enter
   3. addMessage("**What is AI?**", 'user') called
   4. Message rendered with:
      - Avatar: 👤 blue
      - Text: What is AI? (with bold styling)
      - Timestamp: 11:30 AM
      - Animation: Fade in over 0.3s
   5. Stored in currentChat.messages
   6. Server receives message
   7. Typing indicator appears: 🤖 ⠿ ⠿ ⠿ Thinking...
   8. Server responds after ~10s
   9. Response rendered with:
      - Avatar: 🤖 green
      - Text: AI is... (green color, formatted if needed)
      - Timestamp: 11:31 AM
      - Animation: Fade in over 0.3s
   10. Message saved to storage
   11. History updates in sidebar
*/
