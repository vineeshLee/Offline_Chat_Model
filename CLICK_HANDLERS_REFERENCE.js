// ============================================================
// CLICK HANDLERS - COMPLETE REFERENCE GUIDE
// ============================================================

/**
 * 1. SEND BUTTON (#send-button)
 * ---
 * Functionality: Sends user message to AI server
 * Action: 
 *   - Gets message from input field
 *   - Validates message is not empty
 *   - Hides welcome screen on first message
 *   - Creates new chat if needed
 *   - Adds user message to chat
 *   - Shows typing indicator
 *   - Sends to /chat endpoint
 *   - Receives bot response
 *   - Saves chat to localStorage
 * Keyboard Shortcut: Enter key
 * Visual Feedback: Hover scale (1.05), Active scale (0.95)
 */
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

/**
 * 2. NEW CHAT BUTTON (#new-chat-btn)
 * ---
 * Functionality: Creates new conversation
 * Action:
 *   - Generates unique chatId using timestamp
 *   - Clears current messages
 *   - Hides welcome screen
 *   - Shows empty chat area
 *   - Updates localStorage
 *   - Refreshes history list
 *   - Closes sidebar
 * Location: Sidebar footer
 * Visual Feedback: Hover translateY(-2px), Active scale(1)
 */
newChatBtn.addEventListener('click', startNewChat);

/**
 * 3. MENU BUTTON (#menu-btn)
 * ---
 * Functionality: Toggles sidebar visibility on mobile/desktop
 * Action:
 *   - Toggles 'active' class on sidebar
 *   - Sidebar slides in/out with transform
 * Location: Chat header (top right)
 * Visibility: Shown by default
 * Visual Feedback: Hover background change, Active darker
 */
menuBtn.addEventListener('click', toggleSidebar);

/**
 * 4. SIDEBAR TOGGLE (#toggle-sidebar)
 * ---
 * Functionality: Mobile sidebar close button
 * Action:
 *   - Same as menu button
 *   - Also bound to same toggleSidebar function
 * Location: Sidebar header (right side)
 * Visibility: Hidden by default, shown on <768px
 * Display: Block on mobile
 */
toggleSidebarBtn.addEventListener('click', toggleSidebar);

/**
 * 5. SUGGESTION BUTTONS (.suggestion-btn × 4)
 * ---
 * Functionality: Fills message input with preset prompts
 * Action:
 *   - Gets data-prompt attribute value
 *   - Sets messageInput.value = prompt
 *   - Focuses input field
 *   - Ready for user to send or edit
 * Prompts:
 *   a) "Explain quantum computing to me like I'm 5"
 *   b) "What are the best practices for Python programming?"
 *   c) "Tell me a funny joke"
 *   d) "Summarize the history of artificial intelligence"
 * Location: Welcome screen center
 * Visual Feedback: Hover translateX(4px), Active background
 */
suggestionBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const prompt = this.getAttribute('data-prompt');
    messageInput.value = prompt;
    messageInput.focus();
  });
});

/**
 * 6. HISTORY ITEMS (.history-item - dynamic)
 * ---
 * Functionality: Loads previous conversation from history
 * Action:
 *   - Gets chatId from clicked element
 *   - Retrieves chat data from localStorage
 *   - Clears current messages
 *   - Displays all messages from chat
 *   - Updates active history item styling
 *   - Closes sidebar on mobile
 * Location: Sidebar chat list (dynamically populated)
 * Title: Auto-generated from first user message (30 chars max)
 * Visual Feedback: Hover background lightens, Active highlighted
 */
historyItem.addEventListener('click', () => loadChat(chatId));

// ============================================================
// SUPPORTING FUNCTIONS
// ============================================================

/**
 * toggleSidebar()
 * Toggles 'active' class on sidebar element
 * Effect: Transforms sidebar from translateX(-100%) to translateX(0)
 */
function toggleSidebar() {
  sidebar.classList.toggle('active');
}

/**
 * closeSidebar()
 * Removes 'active' class from sidebar
 * Called after: Chat selection, New chat creation
 */
function closeSidebar() {
  sidebar.classList.remove('active');
}

/**
 * startNewChat()
 * Creates new chat object with:
 *   - Unique ID: 'chat_' + Date.now()
 *   - Title: 'New Chat' (updated on first message)
 *   - Messages: Empty array
 *   - CreatedAt: Current date/time string
 * Stores in: localStorage['chats']
 */
function startNewChat() {
  // Implementation in script.js
}

/**
 * loadChat(chatId)
 * Retrieves chat from localStorage
 * Renders all messages to DOM
 * Updates sidebar active state
 * Updates currentChat reference
 */
function loadChat(chatId) {
  // Implementation in script.js
}

/**
 * sendMessage()
 * Main chat function:
 *   1. Get message from input
 *   2. Validate (not empty)
 *   3. Show chat area (hide welcome)
 *   4. Create new chat if needed
 *   5. Add user message
 *   6. Clear input
 *   7. Show typing indicator
 *   8. POST to /chat endpoint
 *   9. Receive response
 *   10. Add bot message
 *   11. Save to localStorage
 */
function sendMessage() {
  // Implementation in script.js
}

/**
 * addMessage(text, sender)
 * Creates message element
 * Appends to chatMessages DOM
 * Adds to currentChat.messages array
 * Auto-scrolls to bottom
 * Sender: 'user' or 'bot'
 */
function addMessage(text, sender) {
  // Implementation in script.js
}

/**
 * loadChatHistory()
 * Reads all chats from localStorage
 * Dynamically creates history items
 * Adds click listeners to each item
 * Marks active chat with highlighted style
 */
function loadChatHistory() {
  // Implementation in script.js
}

/**
 * saveCurrentChat()
 * Saves current chat to localStorage
 * Auto-generates title from first message
 * Updates localStorage['chats']
 */
function saveCurrentChat() {
  // Implementation in script.js
}

// ============================================================
// EVENT FLOW DIAGRAM
// ============================================================

/*
USER INTERACTION → EVENT LISTENER → HANDLER FUNCTION → STATE UPDATE → DOM UPDATE → STORAGE

SEND MESSAGE FLOW:
Send Button Click ──→ sendMessage() ──→ Add message ──→ Fetch /chat ──→ Add response ──→ Save to Storage

NEW CHAT FLOW:
New Chat Click ──→ startNewChat() ──→ Create chat object ──→ Clear DOM ──→ Save to Storage ──→ Refresh History

HISTORY CLICK FLOW:
History Item Click ──→ loadChat(id) ──→ Get from Storage ──→ Render messages ──→ Update sidebar ──→ Close menu

SUGGESTION FLOW:
Suggestion Click ──→ Fill input ──→ Focus field ──→ (User can edit or press Enter) ──→ Send

MENU CLICK FLOW:
Menu Button Click ──→ toggleSidebar() ──→ Toggle class ──→ CSS transform ──→ Sidebar slides
*/

// ============================================================
// STYLING & VISUAL FEEDBACK
// ============================================================

/*
BUTTON STATES:

1. DEFAULT:
   - background: #333333 to #555555 gradient
   - border: 1px solid #666666
   - color: #ffffff

2. HOVER:
   - background: #444444 to #666666 gradient
   - border: 1px solid #888888
   - transform: translateY(-2px) or scale(1.05)
   - box-shadow: enhanced

3. ACTIVE/PRESSED:
   - background: #555555 to #777777 gradient
   - transform: scale(0.95) or translateY(0)
   - box-shadow: reduced

HISTORY ITEM STATES:

1. DEFAULT:
   - background: #2a2a2a
   - color: #cccccc
   - border: 1px solid transparent

2. HOVER:
   - background: #333333
   - color: #ffffff
   - border: 1px solid #555555

3. ACTIVE:
   - background: #333333 to #444444 gradient
   - color: #ffffff
   - border: 1px solid #666666

INPUT FIELD STATES:

1. DEFAULT:
   - background: #2a2a2a
   - border: 2px solid #333333
   - color: #ffffff

2. FOCUS:
   - background: #333333
   - border: 2px solid #666666
   - box-shadow: 0 0 8px rgba(102, 102, 102, 0.3)
*/

// ============================================================
// DEBUGGING TIPS
// ============================================================

/*
Check Click Functionality:
  1. Open DevTools (F12)
  2. Go to Console tab
  3. Add: console.log("Button clicked") in each handler
  4. Click buttons and watch for messages

Check Storage:
  1. DevTools → Application tab
  2. Local Storage → Click domain
  3. Look for 'chats' key with JSON data

Check Element Targeting:
  1. DevTools → Elements tab
  2. Find button by ID/class
  3. Check ID matches JavaScript getElementById()

Test All Interactions:
  1. Send button (click & Enter key)
  2. New Chat button
  3. All 4 suggestion buttons
  4. History items (if any chats exist)
  5. Menu button (mobile view: <768px)
  6. Sidebar toggle
*/
