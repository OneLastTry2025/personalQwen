// Qwen Clone - Pixel Perfect Logged-In Interface Implementation
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Qwen Clone v3.0 - Logged-In State Edition");

    // ==========================================
    // DOM ELEMENTS & STATE
    // ==========================================
    
    // Navigation & Layout
    const modelSelectorButton = document.getElementById('model-selector-button');
    const modelDropdown = document.getElementById('model-dropdown');
    const currentModelName = document.getElementById('current-model-name');
    const sidebarModelName = document.getElementById('sidebar-model-name');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    
    // Welcome State Elements
    const welcomeArea = document.getElementById('welcome-area');
    const mainChatInput = document.getElementById('main-chat-input');
    const mainSendButton = document.getElementById('main-send-button');
    const actionButtons = document.querySelectorAll('.action-button');
    const addButton = document.getElementById('add-button');
    const thinkingButton = document.getElementById('thinking-button');
    const searchButton = document.getElementById('search-button');
    
    // More Button Functionality
    const moreButton = document.getElementById('more-button');
    const moreDropdown = document.getElementById('more-dropdown');
    
    // Chat Elements
    const newChatButton = document.getElementById('new-chat-button');
    const chatHistoryList = document.getElementById('chat-history-list');
    
    // Chat Area Elements
    const chatArea = document.getElementById('chat-area');
    const messagesContainer = document.getElementById('messages-container');
    const chatTextarea = document.getElementById('chat-textarea');
    const chatSendButton = document.getElementById('chat-send-button');
    
    // Application State
    let currentState = 'welcome'; // 'welcome', 'chatting'
    let currentChatId = null;
    let isLoading = false;
    let webSearchEnabled = false;
    let selectedAgent = null;
    let moreDropdownVisible = false;
    
    // API Configuration
    const API_BASE = '/api';
    
    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    function showElement(element) {
        if (element) {
            element.classList.remove('hidden');
            element.classList.remove('opacity-0', 'scale-95');
            element.classList.add('opacity-100', 'scale-100');
        }
    }
    
    function hideElement(element) {
        if (element) {
            element.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                element.classList.add('hidden');
            }, 150);
        }
    }
    
    function toggleElement(element) {
        if (element) {
            if (element.classList.contains('hidden')) {
                showElement(element);
            } else {
                hideElement(element);
            }
        }
    }
    
    function setLoadingState(loading) {
        isLoading = loading;
        if (mainSendButton) mainSendButton.disabled = loading;
        if (chatSendButton) chatSendButton.disabled = loading;
        
        // Update button content with smooth transitions
        const spinner = `
            <div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
        `;
        const sendIcon = `
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
        `;
        
        if (mainSendButton) {
            mainSendButton.innerHTML = loading ? spinner : sendIcon;
        }
        if (chatSendButton) {
            chatSendButton.innerHTML = loading ? spinner : sendIcon;
        }
    }
    
    // ==========================================
    // STATE TRANSITIONS
    // ==========================================
    
    function transitionToChat() {
        currentState = 'chatting';
        
        // Hide welcome area, show chat area
        if (welcomeArea) hideElement(welcomeArea);
        showElement(chatArea);
        
        console.log("🔄 Transitioned to chat mode");
    }
    
    function resetToWelcome() {
        currentState = 'welcome';
        currentChatId = null;
        
        // Show welcome area, hide chat area
        showElement(welcomeArea);
        if (chatArea) hideElement(chatArea);
        
        // Clear chat messages
        if (messagesContainer) messagesContainer.innerHTML = '';
        
        // Reset input placeholder
        if (mainChatInput) mainChatInput.placeholder = 'How can I help you today?';
        
        console.log("🏠 Reset to welcome state");
    }
    
    // ==========================================
    // MESSAGE HANDLING
    // ==========================================
    
    function addMessage(sender, content, isImage = false) {
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex items-start space-x-3 animate-fade-in ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
        
        const userAvatar = 'https://www.gravatar.com/avatar/?d=mp&s=32';
        const aiAvatar = 'https://assets.alicdn.com/g/qwenweb/qwen-webui-fe/0.0.169/static/qwen_icon_light_84.png';
        
        const avatarUrl = sender === 'user' ? userAvatar : aiAvatar;
        
        const messageContent = isImage 
            ? `<img src="${content}" class="max-w-md rounded-lg shadow-lg" alt="Generated image" />`
            : `<div class="prose dark:prose-invert max-w-none text-sm">${formatMessageContent(content)}</div>`;
        
        const bubbleClass = sender === 'user' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700';
        
        messageDiv.innerHTML = `
            ${sender === 'user' ? '' : `<img src="${avatarUrl}" alt="${sender}" class="w-8 h-8 rounded-full flex-shrink-0 mt-1" />`}
            <div class="flex-1 ${sender === 'user' ? 'text-right' : 'text-left'} max-w-2xl">
                <div class="font-medium text-xs text-gray-500 dark:text-gray-400 mb-1">
                    ${sender === 'user' ? 'You' : 'Qwen'}
                </div>
                <div class="${bubbleClass} rounded-2xl px-4 py-3 inline-block shadow-sm">
                    ${messageContent}
                </div>
            </div>
            ${sender === 'user' ? `<img src="${avatarUrl}" alt="${sender}" class="w-8 h-8 rounded-full flex-shrink-0 mt-1" />` : ''}
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function formatMessageContent(content) {
        // Enhanced message formatting
        return content
            .replace(/\n/g, '<br>')
            .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    }
    
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'flex items-start space-x-3 animate-fade-in';
        typingDiv.innerHTML = `
            <img src="https://assets.alicdn.com/g/qwenweb/qwen-webui-fe/0.0.169/static/qwen_icon_light_84.png" alt="ai" class="w-8 h-8 rounded-full flex-shrink-0 mt-1" />
            <div class="flex-1 text-left max-w-2xl">
                <div class="font-medium text-xs text-gray-500 dark:text-gray-400 mb-1">Qwen</div>
                <div class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 inline-block shadow-sm">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                        <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                        <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // ==========================================
    // API FUNCTIONS
    // ==========================================
    
    async function sendMessage(message, agent = null) {
        if (!message.trim() || isLoading) return;
        
        setLoadingState(true);
        
        // Add user message immediately
        addMessage('user', message);
        
        // If this is the first message, transition to chat mode
        if (currentState === 'welcome') {
            transitionToChat();
        }
        
        // Add typing indicator
        addTypingIndicator();
        
        try {
            const payload = {
                prompt: message,
                chat_id: currentChatId,
                agent_name: agent,
                use_web_search: webSearchEnabled
            };
            
            const response = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            removeTypingIndicator();
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                currentChatId = data.chat_id;
                addMessage('ai', data.response);
                
                // Update chat history if this was a new chat
                if (!currentChatId) {
                    loadChatHistory();
                }
            } else {
                addMessage('error', `Error: ${data.message || 'Unknown error occurred'}`);
            }
            
        } catch (error) {
            removeTypingIndicator();
            console.error('💥 Chat API Error:', error);
            addMessage('error', `Failed to get response: ${error.message}`);
        } finally {
            setLoadingState(false);
        }
    }
    
    async function generateImage(prompt) {
        if (!prompt.trim() || isLoading) return;
        
        setLoadingState(true);
        
        // Add user message
        addMessage('user', `Generate image: ${prompt}`);
        
        // Transition to chat if needed
        if (currentState === 'welcome') {
            transitionToChat();
        }
        
        addTypingIndicator();
        
        try {
            const response = await fetch(`${API_BASE}/image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });
            
            removeTypingIndicator();
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                currentChatId = data.chat_id;
                addMessage('ai', data.image_url, true);
            } else {
                addMessage('error', `Image generation failed: ${data.message || 'Unknown error'}`);
            }
            
        } catch (error) {
            removeTypingIndicator();
            console.error('💥 Image API Error:', error);
            addMessage('error', `Failed to generate image: ${error.message}`);
        } finally {
            setLoadingState(false);
        }
    }
    
    async function loadModelInfo() {
        try {
            const response = await fetch(`${API_BASE}/model`);
            const data = await response.json();
            
            if (data.status === 'success' && data.model_name) {
                const modelName = data.model_name;
                if (currentModelName) currentModelName.textContent = modelName;
                if (sidebarModelName) sidebarModelName.textContent = modelName;
                console.log(`📡 Model loaded: ${modelName}`);
            }
        } catch (error) {
            console.error('💥 Model API Error:', error);
            if (currentModelName) currentModelName.textContent = 'Error';
            if (sidebarModelName) sidebarModelName.textContent = 'Error';
        }
    }
    
    async function loadChatHistory() {
        try {
            const response = await fetch(`${API_BASE}/history`);
            const data = await response.json();
            
            if (data.status === 'success' && data.history) {
                if (!chatHistoryList) return;
                
                chatHistoryList.innerHTML = '';
                data.history.forEach(chat => {
                    const chatItem = document.createElement('button');
                    chatItem.className = 'w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-800 transition-colors truncate';
                    chatItem.textContent = chat.title || 'Untitled Chat';
                    chatItem.dataset.chatId = chat.id;
                    
                    chatItem.addEventListener('click', () => {
                        console.log(`📂 Load chat: ${chat.id}`);
                        // TODO: Implement chat loading
                    });
                    
                    chatHistoryList.appendChild(chatItem);
                });
                
                console.log(`📋 Loaded ${data.history.length} chat(s)`);
            }
        } catch (error) {
            console.error('💥 History API Error:', error);
        }
    }
    
    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    
    // Mobile Menu Toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            toggleElement(sidebar);
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            hideElement(sidebar);
        });
    }
    
    // Model Selector
    if (modelSelectorButton && modelDropdown) {
        modelSelectorButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleElement(modelDropdown);
            
            // Rotate arrow
            const arrow = modelSelectorButton.querySelector('svg');
            if (arrow) {
                arrow.style.transform = modelDropdown.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            hideElement(modelDropdown);
            const arrow = modelSelectorButton.querySelector('svg');
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        });
        
        // Model selection
        modelDropdown.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-model')) {
                const selectedModel = e.target.getAttribute('data-model');
                if (currentModelName) currentModelName.textContent = selectedModel;
                hideElement(modelDropdown);
                console.log(`🔧 Model selected: ${selectedModel}`);
            }
        });
    }
    
    // More Button Functionality
    if (moreButton && moreDropdown) {
        moreButton.addEventListener('click', (e) => {
            e.stopPropagation();
            moreDropdownVisible = !moreDropdownVisible;
            
            if (moreDropdownVisible) {
                showElement(moreDropdown);
                // Rotate arrow
                const arrow = moreButton.querySelector('svg');
                if (arrow) arrow.style.transform = 'rotate(180deg)';
            } else {
                hideElement(moreDropdown);
                const arrow = moreButton.querySelector('svg');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            }
        });
        
        // Close more dropdown when clicking outside
        document.addEventListener('click', () => {
            if (moreDropdownVisible) {
                moreDropdownVisible = false;
                hideElement(moreDropdown);
                const arrow = moreButton.querySelector('svg');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            }
        });
    }
    
    // Main Input Form
    if (mainChatInput && mainSendButton) {
        const handleMainSubmit = () => {
            const message = mainChatInput.value.trim();
            if (message) {
                sendMessage(message, selectedAgent);
                mainChatInput.value = '';
                selectedAgent = null; // Reset after use
            }
        };
        
        mainSendButton.addEventListener('click', handleMainSubmit);
        
        mainChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleMainSubmit();
            }
        });
    }
    
    // Chat Textarea
    if (chatTextarea && chatSendButton) {
        const handleChatSubmit = () => {
            const message = chatTextarea.value.trim();
            if (message) {
                sendMessage(message);
                chatTextarea.value = '';
                chatTextarea.style.height = 'auto';
            }
        };
        
        chatSendButton.addEventListener('click', handleChatSubmit);
        
        chatTextarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleChatSubmit();
            }
        });
        
        // Auto-resize textarea
        chatTextarea.addEventListener('input', () => {
            chatTextarea.style.height = 'auto';
            chatTextarea.style.height = Math.min(chatTextarea.scrollHeight, 120) + 'px';
        });
    }
    
    // Action Buttons
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            
            // Don't process the "more" button here
            if (action === 'more') return;
            
            switch (action) {
                case 'web-dev':
                    selectedAgent = 'Web Dev';
                    if (mainChatInput) mainChatInput.placeholder = 'Ask me about web development...';
                    break;
                case 'deep-research':
                    selectedAgent = 'Deep Research';
                    if (mainChatInput) mainChatInput.placeholder = 'What would you like me to research?';
                    break;
                case 'image-generation':
                    selectedAgent = 'Image Generation';
                    if (mainChatInput) mainChatInput.placeholder = 'Describe the image you want to generate...';
                    break;
                case 'code-assistant':
                    selectedAgent = 'Code Assistant';
                    if (mainChatInput) mainChatInput.placeholder = 'Ask me about coding...';
                    break;
                case 'writing-helper':
                    selectedAgent = 'Writing Helper';
                    if (mainChatInput) mainChatInput.placeholder = 'What would you like help writing?';
                    break;
                case 'data-analysis':
                    selectedAgent = 'Data Analysis';
                    if (mainChatInput) mainChatInput.placeholder = 'What data would you like me to analyze?';
                    break;
                case 'language-tutor':
                    selectedAgent = 'Language Tutor';
                    if (mainChatInput) mainChatInput.placeholder = 'Which language would you like to learn?';
                    break;
                default:
                    console.log(`🔍 Action clicked: ${action}`);
                    break;
            }
            
            // Focus input after selection
            if (mainChatInput) mainChatInput.focus();
            
            console.log(`⚡ Agent selected: ${selectedAgent || action}`);
        });
    });
    
    // Search Button Toggle
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            webSearchEnabled = !webSearchEnabled;
            if (webSearchEnabled) {
                searchButton.classList.add('bg-purple-100', 'text-purple-700', 'dark:bg-purple-900', 'dark:text-purple-300');
            } else {
                searchButton.classList.remove('bg-purple-100', 'text-purple-700', 'dark:bg-purple-900', 'dark:text-purple-300');
            }
            console.log(`🔍 Web search: ${webSearchEnabled ? 'ON' : 'OFF'}`);
        });
    }
    
    // New Chat Button
    if (newChatButton) {
        newChatButton.addEventListener('click', () => {
            resetToWelcome();
        });
    }
    
    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    function initialize() {
        console.log("🚀 Initializing Qwen Clone - Logged-In Interface...");
        
        // Load initial data
        loadModelInfo();
        loadChatHistory();
        
        // Set initial state - always show welcome in logged-in interface
        resetToWelcome();
        
        console.log("✅ Qwen Clone initialized successfully!");
    }
    
    // Start the application
    initialize();
});