document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');
    const welcomeScreen = document.getElementById('welcome-screen');
    const navDrawer = document.getElementById('nav-drawer');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const drawerCloseBtn = document.querySelector('.drawer-close');
    const historyList = document.getElementById('history-list');
    const newChatBtn = document.getElementById('new-chat-btn');
    const menuBtn = document.getElementById('menu-btn');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    const toastNotification = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');

    // Chat state
    let currentChatId = null;
    let chats = JSON.parse(localStorage.getItem('chats')) || {};
    let currentChat = { messages: [] };

    // Initialize
    initializeChat();
    loadChatHistory();
    attachEventListeners();

    function initializeChat() {
        // Show welcome screen if no chat history
        if (Object.keys(chats).length === 0) {
            welcomeScreen.style.display = 'flex';
            chatMessages.style.display = 'none';
        } else {
            // Load the last chat
            const lastChatId = localStorage.getItem('lastChatId');
            if (lastChatId && chats[lastChatId]) {
                loadChat(lastChatId);
            } else {
                const firstChatId = Object.keys(chats)[0];
                loadChat(firstChatId);
            }
        }
    }

    function attachEventListeners() {
        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        newChatBtn.addEventListener('click', startNewChat);
        menuBtn.addEventListener('click', toggleDrawer);
        drawerCloseBtn.addEventListener('click', closeDrawer);
        drawerOverlay.addEventListener('click', closeDrawer);

        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const prompt = this.getAttribute('data-prompt');
                messageInput.value = prompt;
                messageInput.focus();
            });
        });
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        console.log('sendMessage called with:', message);
        
        if (message === '') {
            console.log('Empty message, returning');
            return;
        }

        // Hide welcome screen and show chat
        if (welcomeScreen.style.display !== 'none') {
            console.log('Hiding welcome screen and showing chat messages');
            welcomeScreen.style.display = 'none';
            chatMessages.style.display = 'flex';
            chatMessages.style.flexDirection = 'column';
        }

        // If starting a new conversation, create new chat
        if (!currentChatId) {
            console.log('Creating new chat');
            startNewChat();
        }

        // Add user message
        console.log('Adding user message');
        addMessage(message, 'user');
        messageInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Send to server
        console.log('Sending to server...');
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        })
        .then(response => {
            console.log('Server response received');
            return response.json();
        })
        .then(data => {
            console.log('Server data:', data);
            hideTypingIndicator();
            const timestamp = data.timestamp ? 
                new Date(data.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                }) : null;
            
            if (data.status === 'error' || data.response.includes('Error')) {
                addMessage(data.response, 'bot', timestamp);
            } else {
                addMessage(data.response, 'bot', timestamp);
            }
            saveCurrentChat();
        })
        .catch(error => {
            console.error('Error:', error);
            hideTypingIndicator();
            addMessage('Sorry, something went wrong. Please try again.', 'bot');
        });
    }

    function addMessage(text, sender, timestamp = null) {
        console.log('Adding message:', { text: text.substring(0, 50) + '...', sender, timestamp });
        
        if (!timestamp) {
            timestamp = new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        // Create message card wrapper
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';
        
        // Create message body with avatar and content
        const messageBody = document.createElement('div');
        messageBody.className = 'message-body';
        
        // Add avatar/indicator
        const avatar = document.createElement('div');
        avatar.className = `message-avatar ${sender}`;
        avatar.textContent = sender === 'user' ? '👤' : '🤖';
        messageBody.appendChild(avatar);
        
        // Create content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'message-content';
        
        // Add bubble
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.innerHTML = formatMessageText(text);
        contentWrapper.appendChild(bubbleDiv);
        
        // Add timestamp
        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'message-timestamp';
        timestampDiv.textContent = timestamp;
        contentWrapper.appendChild(timestampDiv);
        
        messageBody.appendChild(contentWrapper);
        messageCard.appendChild(messageBody);
        messageDiv.appendChild(messageCard);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        console.log('Message added to DOM, chatMessages display:', chatMessages.style.display);

        // Add to current chat with metadata
        currentChat.messages.push({ 
            sender, 
            text, 
            timestamp,
            id: Date.now()
        });
    }

    function formatMessageText(text) {
        // Basic markdown-like formatting
        text = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
        return text;
    }

    function showTypingIndicator() {
        typingIndicator.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    function startNewChat() {
        const chatId = 'chat_' + Date.now();
        currentChatId = chatId;
        currentChat = {
            id: chatId,
            title: 'New Chat',
            messages: [],
            createdAt: new Date().toLocaleString()
        };
        chats[chatId] = currentChat;
        localStorage.setItem('lastChatId', chatId);
        localStorage.setItem('chats', JSON.stringify(chats));

        // Clear chat display
        chatMessages.innerHTML = '';
        welcomeScreen.style.display = 'none';
        chatMessages.style.display = 'flex';
        chatMessages.style.flexDirection = 'column';

        // Add welcome message from bot
        addWelcomeMessage();

        loadChatHistory();
        closeDrawer();
    }

    function addWelcomeMessage() {
        const welcomeText = "👋 Hello! I'm your offline AI assistant. I'm here to help you with any questions or tasks you have. Feel free to ask me anything!";
        const timestamp = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';

        // Create message card wrapper
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';

        // Create message body with avatar and content
        const messageBody = document.createElement('div');
        messageBody.className = 'message-body';

        // Add avatar/indicator
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar bot';
        avatar.textContent = '🤖';
        messageBody.appendChild(avatar);

        // Create content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'message-content';

        // Add bubble
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.innerHTML = formatMessageText(welcomeText);
        contentWrapper.appendChild(bubbleDiv);

        // Add timestamp
        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'message-timestamp';
        timestampDiv.textContent = timestamp;
        contentWrapper.appendChild(timestampDiv);

        messageBody.appendChild(contentWrapper);
        messageCard.appendChild(messageBody);
        messageDiv.appendChild(messageCard);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add to current chat with metadata
        currentChat.messages.push({
            sender: 'bot',
            text: welcomeText,
            timestamp,
            id: Date.now()
        });
    }

    function loadChat(chatId) {
        if (!chats[chatId]) return;

        currentChatId = chatId;
        currentChat = chats[chatId];
        localStorage.setItem('lastChatId', chatId);

        // Clear and display messages
        chatMessages.innerHTML = '';
        welcomeScreen.style.display = 'none';
        chatMessages.style.display = 'flex';
        chatMessages.style.flexDirection = 'column';

        currentChat.messages.forEach(msg => {
            const timestamp = msg.timestamp || '';
            addMessage(msg.text, msg.sender, timestamp);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
        loadChatHistory();
        closeDrawer();
    }

    function saveCurrentChat() {
        if (currentChatId) {
            // Update chat title from first user message
            if (currentChat.messages.length > 0 && currentChat.title === 'New Chat') {
                const firstUserMsg = currentChat.messages.find(m => m.sender === 'user');
                if (firstUserMsg) {
                    currentChat.title = firstUserMsg.text.substring(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '');
                }
            }
            chats[currentChatId] = currentChat;
            localStorage.setItem('chats', JSON.stringify(chats));
        }
    }

    function loadChatHistory() {
        historyList.innerHTML = '';
        const chatIds = Object.keys(chats).reverse();

        chatIds.forEach(chatId => {
            const chat = chats[chatId];
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item' + (currentChatId === chatId ? ' active' : '');
            historyItem.setAttribute('data-chat-id', chatId); // Add data attribute for identification

            // Create history item content
            const itemContent = document.createElement('div');
            itemContent.className = 'history-item-content';
            itemContent.textContent = chat.title || 'Untitled Chat';
            itemContent.addEventListener('click', () => loadChat(chatId));

            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'history-delete-btn';
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.title = `Delete "${chat.title || 'Untitled Chat'}"`;
            deleteBtn.setAttribute('aria-label', `Delete chat: ${chat.title || 'Untitled Chat'}`);
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteChat(chatId);
            });

            historyItem.appendChild(itemContent);
            historyItem.appendChild(deleteBtn);
            historyList.appendChild(historyItem);
        });
    }

    function deleteChat(chatId) {
        if (!chats[chatId]) return;

        // Get chat title for better confirmation message
        const chatTitle = chats[chatId].title || 'Untitled Chat';

        // Create a more user-friendly confirmation dialog
        const isConfirmed = confirm(`Delete "${chatTitle}"?\n\nThis action cannot be undone.`);

        if (!isConfirmed) return;

        // Add visual feedback - disable the button temporarily
        const historyItem = document.querySelector(`[data-chat-id="${chatId}"]`) ||
                           document.querySelector('.history-item.active');
        if (historyItem) {
            historyItem.style.opacity = '0.5';
            historyItem.style.pointerEvents = 'none';
        }

        try {
            // Remove from chats object
            delete chats[chatId];
            localStorage.setItem('chats', JSON.stringify(chats));

            // If deleting current chat, handle navigation
            if (currentChatId === chatId) {
                const remainingChats = Object.keys(chats);
                if (remainingChats.length > 0) {
                    // Load the most recent remaining chat
                    const mostRecentChatId = remainingChats[remainingChats.length - 1];
                    loadChat(mostRecentChatId);
                } else {
                    // No chats left, show welcome screen and start fresh
                    currentChatId = null;
                    currentChat = { messages: [] };
                    chatMessages.innerHTML = '';
                    welcomeScreen.style.display = 'flex';
                    chatMessages.style.display = 'none';
                    localStorage.removeItem('lastChatId');
                }
            }

            // Refresh the history list
            loadChatHistory();

            // Show success feedback (could be enhanced with a toast notification)
            console.log(`Chat "${chatTitle}" deleted successfully`);
            showToast(`"${chatTitle}" deleted successfully`, 'success');

        } catch (error) {
            console.error('Error deleting chat:', error);
            // Re-enable the button if there was an error
            if (historyItem) {
                historyItem.style.opacity = '1';
                historyItem.style.pointerEvents = 'auto';
            }
            showToast('Failed to delete chat. Please try again.', 'error');
        }
    }

    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        toastNotification.className = `toast-notification ${type}`;

        // Show the toast
        toastNotification.style.display = 'block';
        setTimeout(() => {
            toastNotification.classList.add('show');
        }, 10);

        // Hide the toast after 3 seconds
        setTimeout(() => {
            toastNotification.classList.remove('show');
            setTimeout(() => {
                toastNotification.style.display = 'none';
            }, 300);
        }, 3000);
    }

    function toggleDrawer() {
        navDrawer.classList.toggle('active');
    }

    function closeDrawer() {
        navDrawer.classList.remove('active');
    }
});