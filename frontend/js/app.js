document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const chatWindow = document.getElementById('chatWindow');
    const sendBtn = document.getElementById('sendBtn');
    
    // Auto-focus input
    userInput.focus();

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const messageText = userInput.value.trim();
        if (!messageText) return;

        // 1. Add User Message
        addMessage(messageText, 'user');
        userInput.value = '';
        sendBtn.disabled = true;

        // 2. Add Typing Indicator
        const typingId = addTypingIndicator();

        try {
            // 3. Call Backend API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: messageText })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Network response was not ok');
            }

            const data = await response.json();
            
            // 4. Remove Typing Indicator
            removeMessage(typingId);

            // 5. Add System Message
            if (data && data.response) {
                // If response is an array of messages, pick the last one or handle it based on Gradio format.
                // Assuming data.response is the text.
                let reply = data.response;
                if (Array.isArray(reply)) {
                    // Chatbots in Gradio usually return history [user, bot][]
                    const lastPair = reply[reply.length - 1];
                    reply = lastPair[1] || "Error: empty response";
                }
                addMessage(reply, 'system');
            } else {
                addMessage("I'm sorry, I couldn't process that response.", 'system');
            }

        } catch (error) {
            console.error('Error:', error);
            removeMessage(typingId);
            addMessage(`Error: ${error.message || "Oops! I encounter an error communicating with the server."}`, 'system');
        } finally {
            sendBtn.disabled = false;
            userInput.focus();
        }
    });

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = `avatar ${sender}-avatar`;
        avatarDiv.textContent = sender === 'user' ? 'U' : 'AI';

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.textContent = text; // simple textContent prevents XSS

        if (sender === 'system') {
            msgDiv.appendChild(avatarDiv);
            msgDiv.appendChild(bubbleDiv);
        } else {
            msgDiv.appendChild(bubbleDiv);
            msgDiv.appendChild(avatarDiv);
        }

        chatWindow.appendChild(msgDiv);
        scrollToBottom();
    }

    function addTypingIndicator() {
        const typingId = 'typing-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.className = `message system-message`;
        msgDiv.id = typingId;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = `avatar system-avatar`;
        avatarDiv.textContent = 'AI';

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dotDiv = document.createElement('div');
            dotDiv.className = 'typing-dot';
            bubbleDiv.appendChild(dotDiv);
        }

        msgDiv.appendChild(avatarDiv);
        msgDiv.appendChild(bubbleDiv);
        
        chatWindow.appendChild(msgDiv);
        scrollToBottom();
        
        return typingId;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) {
            el.remove();
        }
    }

    function scrollToBottom() {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});
