// Qwen Clone - Pixel Perfect Implementation
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Qwen Clone v2.0 - Pixel Perfect Edition");

    // ==========================================
    // DOM ELEMENTS & STATE
    // ==========================================
    
    // Navigation & Layout
    const modelSelectorButton = document.getElementById('model-selector-button');
    const modelDropdown = document.getElementById('model-dropdown');
    const currentModelName = document.getElementById('current-model-name');
    const sidebarModelName = document.getElementById('sidebar-model-name');
    
    // Welcome State Elements
    const mainChatInput = document.getElementById('main-chat-input');
    const mainSendButton = document.getElementById('main-send-button');
    const actionButtons = document.querySelectorAll('.action-button');
    const addButton = document.getElementById('add-button');
    const thinkingButton = document.getElementById('thinking-button');
    const searchButton = document.getElementById('search-button');
    
    // Sidebar Elements
    const sidebar = document.getElementById('sidebar');
    const newChatButton = document.getElementById('new-chat-button');
    const sidebarClose = document.getElementById('sidebar-close');
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
    
    // API Configuration
    const API_BASE = '/api';
    
    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    function showElement(element) {
        if (element) element.classList.remove('hidden');
    }
    
    function hideElement(element) {
        if (element) element.classList.add('hidden');
    }
    
    function toggleElement(element) {
        if (element) element.classList.toggle('hidden');
    }
    
    function setLoadingState(loading) {
        isLoading = loading;
        if (mainSendButton) mainSendButton.disabled = loading;
        if (chatSendButton) chatSendButton.disabled = loading;
        
        // Update button content
        const spinner = '<div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>';
        const sendIcon = '<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>';
        
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
        
        // Hide welcome area, show chat area and sidebar
        const welcomeArea = document.querySelector('.flex-1.overflow-hidden');
        if (welcomeArea) hideElement(welcomeArea);
        
        showElement(chatArea);
        showElement(sidebar);
        
        console.log("🔄 Transitioned to chat mode");
    }
    
    function resetToWelcome() {
        currentState = 'welcome';
        currentChatId = null;
        
        // Show welcome area, hide chat area and sidebar  
        const welcomeArea = document.querySelector('.flex-1.overflow-hidden');
        if (welcomeArea) showElement(welcomeArea);
        
        hideElement(chatArea);
        hideElement(sidebar);
        
        // Clear chat messages
        if (messagesContainer) messagesContainer.innerHTML = '';
        
        console.log("🏠 Reset to welcome state");
    }
    
    // ==========================================
    // MESSAGE HANDLING
    // ==========================================
    
    function addMessage(sender, content, isImage = false) {
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex items-start space-x-3 mb-6 ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
        
        const avatarUrl = sender === 'user' 
            ? 'https://www.gravatar.com/avatar/?d=mp&s=32' 
            : 'https://assets.alicdn.com/g/qwenweb/qwen-webui-fe/0.0.169/static/qwen_icon_light_84.png';
        
        const messageContent = isImage 
            ? `<img src="${content}" class="max-w-md rounded-lg shadow-lg" alt="Generated image" />`
            : `<div class="prose dark:prose-invert max-w-none">${content.replace(/\n/g, '<br>')}</div>`;
        
        messageDiv.innerHTML = `
            ${sender === 'user' ? '' : `<img src="${avatarUrl}" alt="${sender}" class="w-8 h-8 rounded-full flex-shrink-0" />`}
            <div class="flex-1 ${sender === 'user' ? 'text-right' : 'text-left'}">
                <div class="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                    ${sender === 'user' ? 'You' : 'Qwen'}
                </div>
                <div class="bg-${sender === 'user' ? 'purple-600 text-white' : 'gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'} rounded-lg px-4 py-2 inline-block max-w-2xl">
                    ${messageContent}
                </div>
            </div>
            ${sender === 'user' ? `<img src="${avatarUrl}" alt="${sender}" class="w-8 h-8 rounded-full flex-shrink-0" />` : ''}
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
        
        try {
            const response = await fetch(`${API_BASE}/image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });
            
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
                    chatItem.className = 'w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-800';
                    chatItem.textContent = chat.title || 'Untitled Chat';
                    chatItem.dataset.chatId = chat.id;
                    
                    chatItem.addEventListener('click', () => {
                        // TODO: Load specific chat
                        console.log(`📂 Load chat: ${chat.id}`);
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
    
    // Model Selector
    if (modelSelectorButton && modelDropdown) {
        modelSelectorButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleElement(modelDropdown);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            hideElement(modelDropdown);
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
            chatTextarea.style.height = chatTextarea.scrollHeight + 'px';
        });
    }
    
    // Action Buttons
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            
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
                case 'more':
                    console.log('🔍 More options clicked');
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
            searchButton.classList.toggle('bg-purple-100', webSearchEnabled);
            searchButton.classList.toggle('text-purple-700', webSearchEnabled);
            console.log(`🔍 Web search: ${webSearchEnabled ? 'ON' : 'OFF'}`);
        });
    }
    
    // Sidebar Controls
    if (newChatButton) {
        newChatButton.addEventListener('click', () => {
            resetToWelcome();
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            hideElement(sidebar);
        });
    }
    
    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    function initialize() {
        console.log("🚀 Initializing Qwen Clone...");
        
        // Load initial data
        loadModelInfo();
        loadChatHistory();
        
        // Set initial state
        resetToWelcome();
        
        console.log("✅ Qwen Clone initialized successfully!");
    }
    
    // Start the application
    initialize();
});