// Qwen Clone - Complete Functionality Implementation
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Qwen Clone v4.0 - Complete Functionality Edition");

    // ==========================================
    // DOM ELEMENTS & STATE
    // ==========================================
    
    // Navigation & Layout
    const modelSelectorButton = document.getElementById('model-selector-button');
    const modelDropdown = document.getElementById('model-dropdown');
    const currentModelName = document.getElementById('current-model-name');
    const currentModelDisplay = document.getElementById('current-model-display');
    const sidebarModelName = document.getElementById('sidebar-model-name');
    
    // Sidebar Controls
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarToggleChat = document.getElementById('sidebar-toggle-chat');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    // Welcome State Elements
    const welcomeArea = document.getElementById('welcome-area');
    const mainChatInput = document.getElementById('main-chat-input');
    const mainSendButton = document.getElementById('main-send-button');
    const actionButtons = document.querySelectorAll('.action-button');
    
    // Input Area Features
    const fileUploadButton = document.getElementById('file-upload-button');
    const fileInput = document.getElementById('file-input');
    const thinkingButton = document.getElementById('thinking-button');
    const thinkingDropdown = document.getElementById('thinking-dropdown');
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
    
    // Enhanced DOM elements
    const voiceInputButton = document.getElementById('voice-input-button');
    const cameraInputButton = document.getElementById('camera-input-button');
    const testModelsButton = document.getElementById('test-models-button');
    const voiceInput = document.getElementById('voice-input');
    const cameraInput = document.getElementById('camera-input');
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    const currentModelStatus = document.getElementById('current-model-status');
    const responseSpeed = document.getElementById('response-speed');
    const messageCount = document.getElementById('message-count');
    const sessionTime = document.getElementById('session-time');
    const modelsAvailable = document.getElementById('models-available');
    
    // Enhanced state management (keeping original + new)
    let currentState = 'welcome'; // 'welcome', 'chatting'
    let currentChatId = null;
    let isLoading = false;
    let webSearchEnabled = false;
    let thinkingModeEnabled = false;
    let thinkingDropdownVisible = false;
    let selectedAgent = null;
    let moreDropdownVisible = false;
    let sidebarVisible = false;
    let selectedFiles = [];
    let messageCounter = 0;
    let sessionStartTime = Date.now();
    let isVoiceRecording = false;
    let voiceRecognition = null;
    
    // API Configuration
    const API_BASE = '/api';
    
    // Available Models Data
    const AVAILABLE_MODELS = [
        {
            id: 'Qwen3-235B-A22B-2507',
            name: 'Qwen3-235B-A22B-2507',
            description: 'Latest flagship model',
            category: 'latest',
            badge: 'New'
        },
        {
            id: 'Qwen3-Plus',
            name: 'Qwen3-Plus',
            description: 'Enhanced reasoning capabilities',
            category: 'latest',
            badge: 'Pro'
        },
        {
            id: 'Qwen-Max',
            name: 'Qwen-Max',
            description: 'Maximum performance model',
            category: 'standard'
        },
        {
            id: 'Qwen-Turbo',
            name: 'Qwen-Turbo',
            description: 'Fast and efficient responses',
            category: 'standard',
            badge: 'Fast'
        },
        {
            id: 'Qwen-Long',
            name: 'Qwen-Long',
            description: 'Extended context length',
            category: 'standard'
        },
        {
            id: 'Qwen-VL',
            name: 'Qwen-VL',
            description: 'Vision and language model',
            category: 'specialized',
            badge: 'Vision'
        },
        {
            id: 'Qwen-Audio',
            name: 'Qwen-Audio',
            description: 'Audio processing capabilities',
            category: 'specialized',
            badge: 'Audio'
        }
    ];
    
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
    
    function updateProgress(step, status, details = '') {
        console.log(`📊 PROGRESS: Step ${step} - ${status} ${details}`);
    }
    
    function setLoadingState(loading) {
        isLoading = loading;
        updateProgress('Loading', loading ? 'Started' : 'Completed');
        
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
    // SIDEBAR MANAGEMENT
    // ==========================================
    
    function showSidebar() {
        if (sidebar) {
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('hidden');
        }
        sidebarVisible = true;
        updateProgress('Sidebar', 'Opened');
    }
    
    function hideSidebar() {
        if (sidebar) {
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.add('hidden');
        }
        sidebarVisible = false;
        updateProgress('Sidebar', 'Closed');
    }
    
    function toggleSidebar() {
        if (sidebarVisible) {
            hideSidebar();
        } else {
            showSidebar();
        }
    }
    
    // ==========================================
    // STATE TRANSITIONS
    // ==========================================
    
    function transitionToChat() {
        currentState = 'chatting';
        updateProgress('State', 'Transition to Chat Mode');
        
        // Hide welcome area, show chat area
        if (welcomeArea) hideElement(welcomeArea);
        showElement(chatArea);
        
        // Update model display in chat header
        if (currentModelDisplay && currentModelName) {
            currentModelDisplay.textContent = currentModelName.textContent;
        }
        
        console.log("🔄 Transitioned to chat mode");
    }
    
    function resetToWelcome() {
        currentState = 'welcome';
        currentChatId = null;
        updateProgress('State', 'Reset to Welcome Mode');
        
        // Show welcome area, hide chat area
        showElement(welcomeArea);
        if (chatArea) hideElement(chatArea);
        
        // Clear chat messages
        if (messagesContainer) messagesContainer.innerHTML = '';
        
        // Reset input placeholder
        if (mainChatInput) mainChatInput.placeholder = 'How can I help you today?';
        
        // Reset selected agent
        selectedAgent = null;
        
        console.log("🏠 Reset to welcome state");
    }
    
    // ==========================================
    // MESSAGE HANDLING
    // ==========================================
    
    function addMessage(sender, content, isImage = false, isError = false) {
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex items-start space-x-3 animate-fade-in ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
        
        const userAvatar = 'https://www.gravatar.com/avatar/?d=mp&s=32';
        const aiAvatar = 'https://assets.alicdn.com/g/qwenweb/qwen-webui-fe/0.0.169/static/qwen_icon_light_84.png';
        
        const avatarUrl = sender === 'user' ? userAvatar : aiAvatar;
        
        const messageContent = isImage 
            ? `<img src="${content}" class="max-w-md rounded-lg shadow-lg" alt="Generated image" />`
            : `<div class="prose dark:prose-invert max-w-none text-sm">${formatMessageContent(content)}</div>`;
        
        let bubbleClass = 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700';
        
        if (sender === 'user') {
            bubbleClass = 'bg-purple-600 text-white';
        } else if (isError) {
            bubbleClass = 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800';
        }
        
        messageDiv.innerHTML = `
            ${sender === 'user' ? '' : `<img src="${avatarUrl}" alt="${sender}" class="w-8 h-8 rounded-full flex-shrink-0 mt-1" />`}
            <div class="flex-1 ${sender === 'user' ? 'text-right' : 'text-left'} max-w-2xl">
                <div class="font-medium text-xs text-gray-500 dark:text-gray-400 mb-1">
                    ${sender === 'user' ? 'You' : isError ? 'Error' : 'Qwen'}
                </div>
                <div class="${bubbleClass} rounded-2xl px-4 py-3 inline-block shadow-sm">
                    ${messageContent}
                </div>
            </div>
            ${sender === 'user' ? `<img src="${avatarUrl}" alt="${sender}" class="w-8 h-8 rounded-full flex-shrink-0 mt-1" />` : ''}
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        updateProgress('Message', `Added ${sender} message`);
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
    
    // Enhanced model count functionality with live data
    async function updateModelCount() {
        const modelDropdown = document.getElementById('model-dropdown');
        const modelCountBadge = document.getElementById('model-count-badge');
        
        if (modelDropdown && modelCountBadge) {
            // Count static models from HTML first
            const modelItems = modelDropdown.querySelectorAll('[data-model]');
            const staticCount = modelItems.length;
            
            // Show static count immediately
            modelCountBadge.textContent = `${staticCount} Models`;
            
            try {
                // Try to get live count from backend
                updateProgress('Model Count', 'Fetching live model count...');
                const response = await fetch(`${API_BASE}/model_count`);
                const data = await response.json();
                
                if (data.status === 'success') {
                    const liveCount = data.live_count;
                    const categories = data.categories;
                    
                    if (liveCount !== null) {
                        // Update with live count
                        modelCountBadge.textContent = `${liveCount} Models (Live)`;
                        modelCountBadge.classList.add('bg-green-100', 'text-green-800');
                        modelCountBadge.classList.remove('bg-purple-100', 'text-purple-800');
                        
                        console.log(`📊 Live Model Count from Qwen: ${liveCount}`);
                        console.log(`📊 Static Model Count in UI: ${staticCount}`);
                        updateProgress('Model Count', `Live: ${liveCount} models, Static: ${staticCount} models`);
                    } else {
                        // Fallback to enhanced static display
                        modelCountBadge.textContent = `${staticCount} Models`;
                        console.log(`📊 Using Static Model Count: ${staticCount}`);
                        updateProgress('Model Count', `Static: ${staticCount} models (live unavailable)`);
                    }
                    
                    // Log detailed breakdown
                    console.log(`📊 Model Categories:`);
                    console.log(`  • Latest Models: ${categories.latest}`);
                    console.log(`  • Standard Models: ${categories.standard}`);
                    console.log(`  • Specialized Models: ${categories.specialized}`);
                    
                    return {
                        total: liveCount || staticCount,
                        live: liveCount,
                        static: staticCount,
                        categories: categories
                    };
                }
            } catch (error) {
                console.log(`⚠️ Could not fetch live model count: ${error.message}`);
                updateProgress('Model Count', `Using static count: ${staticCount} models`);
            }
            
            // Default return for fallback
            return {
                total: staticCount,
                live: null,
                static: staticCount,
                categories: { latest: 4, standard: 7, specialized: 5 }
            };
        }
    }
    
    async function sendMessage(message, agent = null, files = null) {
        if (!message.trim() || isLoading) return;
        
        setLoadingState(true);
        updateProgress('API', `Sending chat message with agent: ${agent || 'none'}`);
        
        // Add user message immediately
        addMessage('user', message);
        messageCounter++;
        updateUIStats();
        
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
                use_web_search: webSearchEnabled,
                thinking_mode: thinkingModeEnabled
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
                updateProgress('API', 'Chat response received successfully');
                
                // Update chat history if this was a new chat
                loadChatHistory();
            } else {
                addMessage('error', `Error: ${data.message || 'Unknown error occurred'}`, false, true);
                updateProgress('API', 'Chat response failed', data.message);
            }
            
        } catch (error) {
            removeTypingIndicator();
            console.error('💥 Chat API Error:', error);
            addMessage('error', `Failed to get response: ${error.message}`, false, true);
            updateProgress('API', 'Chat request failed', error.message);
        } finally {
            setLoadingState(false);
        }
    }
    
    async function generateImage(prompt) {
        if (!prompt.trim() || isLoading) return;
        
        setLoadingState(true);
        updateProgress('API', 'Generating image');
        
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
                updateProgress('API', 'Image generated successfully');
            } else {
                addMessage('error', `Image generation failed: ${data.message || 'Unknown error'}`, false, true);
                updateProgress('API', 'Image generation failed', data.message);
            }
            
        } catch (error) {
            removeTypingIndicator();
            console.error('💥 Image API Error:', error);
            addMessage('error', `Failed to generate image: ${error.message}`, false, true);
            updateProgress('API', 'Image generation request failed', error.message);
        } finally {
            setLoadingState(false);
        }
    }
    
    async function loadModelInfo() {
        updateProgress('API', 'Loading model information');
        try {
            const response = await fetch(`${API_BASE}/model`);
            const data = await response.json();
            
            if (data.status === 'success' && data.model_name) {
                const modelName = data.model_name;
                if (currentModelName) currentModelName.textContent = modelName;
                if (currentModelDisplay) currentModelDisplay.textContent = modelName;
                if (sidebarModelName) sidebarModelName.textContent = modelName;
                updateProgress('API', 'Model info loaded successfully', modelName);
                console.log(`📡 Model loaded: ${modelName}`);
            }
        } catch (error) {
            console.error('💥 Model API Error:', error);
            if (currentModelName) currentModelName.textContent = 'Error';
            if (currentModelDisplay) currentModelDisplay.textContent = 'Error';
            if (sidebarModelName) sidebarModelName.textContent = 'Error';
            updateProgress('API', 'Model info loading failed', error.message);
        }
    }
    
    async function loadChatHistory() {
        updateProgress('API', 'Loading chat history');
        try {
            const response = await fetch(`${API_BASE}/history`);
            const data = await response.json();
            
            if (data.status === 'success' && data.history) {
                if (!chatHistoryList) return;
                
                // Keep the sample items and add real ones
                const existingItems = chatHistoryList.querySelectorAll('.chat-history-item');
                
                data.history.forEach(chat => {
                    const chatItem = document.createElement('div');
                    chatItem.className = 'chat-history-item p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors';
                    chatItem.innerHTML = `
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">${chat.title || 'Untitled Chat'}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Active conversation...</div>
                    `;
                    chatItem.dataset.chatId = chat.id;
                    
                    chatItem.addEventListener('click', () => {
                        console.log(`📂 Load chat: ${chat.id}`);
                        // TODO: Implement chat loading
                    });
                    
                    chatHistoryList.appendChild(chatItem);
                });
                
                updateProgress('API', 'Chat history loaded successfully', `${data.history.length} chats`);
                console.log(`📋 Loaded ${data.history.length} chat(s)`);
            }
        } catch (error) {
            console.error('💥 History API Error:', error);
            updateProgress('API', 'Chat history loading failed', error.message);
        }
    }
    
    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    
    // Sidebar Controls
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
        updateProgress('Events', 'Sidebar toggle registered');
    }
    
    if (sidebarToggleChat) {
        sidebarToggleChat.addEventListener('click', toggleSidebar);
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', hideSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', hideSidebar);
    }
    
    // Model Selector
    if (modelSelectorButton && modelDropdown) {
        modelSelectorButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleElement(modelDropdown);
            updateProgress('Model Selector', 'Clicked');
            
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
        
        // Model selection with enhanced functionality
        modelDropdown.addEventListener('click', (e) => {
            if (e.target.closest('[data-model]')) {
                const selectedModel = e.target.closest('[data-model]').getAttribute('data-model');
                if (currentModelName) currentModelName.textContent = selectedModel;
                if (currentModelDisplay) currentModelDisplay.textContent = selectedModel;
                if (sidebarModelName) sidebarModelName.textContent = selectedModel;
                hideElement(modelDropdown);
                updateProgress('Model Selector', 'Model changed', selectedModel);
                console.log(`🔧 Model selected: ${selectedModel}`);
            }
        });
        
        updateProgress('Events', 'Model selector registered');
    }
    
    // File Upload
    if (fileUploadButton && fileInput) {
        fileUploadButton.addEventListener('click', () => {
            fileInput.click();
            updateProgress('File Upload', 'Button clicked');
        });
        
        fileInput.addEventListener('change', (e) => {
            selectedFiles = Array.from(e.target.files);
            updateProgress('File Upload', 'Files selected', `${selectedFiles.length} files`);
            
            if (selectedFiles.length > 0) {
                fileUploadButton.classList.add('text-purple-600', 'bg-purple-50');
                fileUploadButton.title = `${selectedFiles.length} file(s) selected`;
            } else {
                fileUploadButton.classList.remove('text-purple-600', 'bg-purple-50');
                fileUploadButton.title = 'Upload file';
            }
        });
        
        updateProgress('Events', 'File upload registered');
    }
    
    // Thinking Mode Toggle with Dropdown
    if (thinkingButton && thinkingDropdown) {
        thinkingButton.addEventListener('click', (e) => {
            e.stopPropagation();
            thinkingDropdownVisible = !thinkingDropdownVisible;
            
            if (thinkingDropdownVisible) {
                showElement(thinkingDropdown);
                updateProgress('Thinking Dropdown', 'Opened');
            } else {
                hideElement(thinkingDropdown);
                updateProgress('Thinking Dropdown', 'Closed');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (thinkingDropdownVisible) {
                thinkingDropdownVisible = false;
                hideElement(thinkingDropdown);
            }
        });
        
        // Handle thinking option selection
        const thinkingOptions = thinkingDropdown.querySelectorAll('.thinking-option');
        thinkingOptions.forEach(option => {
            option.addEventListener('click', () => {
                const thinkingMode = option.getAttribute('data-thinking');
                thinkingModeEnabled = (thinkingMode === 'on');
                
                // Update button appearance
                if (thinkingModeEnabled) {
                    thinkingButton.classList.add('bg-purple-100', 'text-purple-700', 'dark:bg-purple-900', 'dark:text-purple-300');
                } else {
                    thinkingButton.classList.remove('bg-purple-100', 'text-purple-700', 'dark:bg-purple-900', 'dark:text-purple-300');
                }
                
                // Hide dropdown
                thinkingDropdownVisible = false;
                hideElement(thinkingDropdown);
                
                updateProgress('Thinking Mode', thinkingModeEnabled ? 'Enabled' : 'Disabled');
                console.log(`🧠 Thinking mode: ${thinkingModeEnabled ? 'ON' : 'OFF'}`);
            });
        });
        
        updateProgress('Events', 'Thinking mode dropdown registered');
    } else if (thinkingButton) {
        // Fallback for simple toggle if dropdown not available
        thinkingButton.addEventListener('click', () => {
            thinkingModeEnabled = !thinkingModeEnabled;
            if (thinkingModeEnabled) {
                thinkingButton.classList.add('bg-purple-100', 'text-purple-700', 'dark:bg-purple-900', 'dark:text-purple-300');
            } else {
                thinkingButton.classList.remove('bg-purple-100', 'text-purple-700', 'dark:bg-purple-900', 'dark:text-purple-300');
            }
            updateProgress('Thinking Mode', thinkingModeEnabled ? 'Enabled' : 'Disabled');
            console.log(`🧠 Thinking mode: ${thinkingModeEnabled ? 'ON' : 'OFF'}`);
        });
        
        updateProgress('Events', 'Thinking mode toggle registered');
    }
    
    // Web Search Toggle
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            webSearchEnabled = !webSearchEnabled;
            if (webSearchEnabled) {
                searchButton.classList.add('bg-purple-100', 'text-purple-700', 'dark:bg-purple-900', 'dark:text-purple-300');
            } else {
                searchButton.classList.remove('bg-purple-100', 'text-purple-700', 'dark:bg-purple-900', 'dark:text-purple-300');
            }
            updateProgress('Web Search', webSearchEnabled ? 'Enabled' : 'Disabled');
            console.log(`🔍 Web search: ${webSearchEnabled ? 'ON' : 'OFF'}`);
        });
        
        updateProgress('Events', 'Web search toggle registered');
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
                updateProgress('More Button', 'Opened');
            } else {
                hideElement(moreDropdown);
                const arrow = moreButton.querySelector('svg');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
                updateProgress('More Button', 'Closed');
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
        
        updateProgress('Events', 'More button registered');
    }
    
    // Main Input Form
    if (mainChatInput && mainSendButton) {
        const handleMainSubmit = () => {
            const message = mainChatInput.value.trim();
            if (message) {
                sendMessage(message, selectedAgent, selectedFiles.length > 0 ? selectedFiles : null);
                mainChatInput.value = '';
                selectedAgent = null; // Reset after use
                selectedFiles = []; // Reset files
                
                // Reset file upload button appearance
                if (fileUploadButton) {
                    fileUploadButton.classList.remove('text-purple-600', 'bg-purple-50');
                    fileUploadButton.title = 'Upload file';
                }
                
                updateProgress('Main Input', 'Message sent');
            }
        };
        
        mainSendButton.addEventListener('click', handleMainSubmit);
        
        mainChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleMainSubmit();
            }
        });
        
        updateProgress('Events', 'Main input registered');
    }
    
    // Chat Textarea
    if (chatTextarea && chatSendButton) {
        const handleChatSubmit = () => {
            const message = chatTextarea.value.trim();
            if (message) {
                sendMessage(message);
                chatTextarea.value = '';
                chatTextarea.style.height = 'auto';
                updateProgress('Chat Input', 'Message sent');
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
        
        updateProgress('Events', 'Chat textarea registered');
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
                    if (mainChatInput) mainChatInput.placeholder = 'Ask me about web development, React, JavaScript, CSS...';
                    updateProgress('Action Button', 'Web Dev selected');
                    break;
                case 'deep-research':
                    selectedAgent = 'Deep Research';
                    if (mainChatInput) mainChatInput.placeholder = 'What topic would you like me to research in depth?';
                    updateProgress('Action Button', 'Deep Research selected');
                    break;
                case 'image-generation':
                    selectedAgent = 'Image Generation';
                    if (mainChatInput) mainChatInput.placeholder = 'Describe the image you want me to create...';
                    updateProgress('Action Button', 'Image Generation selected');
                    break;
                case 'code-assistant':
                    selectedAgent = 'Code Assistant';
                    if (mainChatInput) mainChatInput.placeholder = 'Ask me about coding, debugging, algorithms...';
                    updateProgress('Action Button', 'Code Assistant selected');
                    break;
                case 'writing-helper':
                    selectedAgent = 'Writing Helper';
                    if (mainChatInput) mainChatInput.placeholder = 'What would you like help writing or editing?';
                    updateProgress('Action Button', 'Writing Helper selected');
                    break;
                case 'data-analysis':
                    selectedAgent = 'Data Analysis';
                    if (mainChatInput) mainChatInput.placeholder = 'What data would you like me to analyze or visualize?';
                    updateProgress('Action Button', 'Data Analysis selected');
                    break;
                case 'language-tutor':
                    selectedAgent = 'Language Tutor';
                    if (mainChatInput) mainChatInput.placeholder = 'Which language would you like to learn or practice?';
                    updateProgress('Action Button', 'Language Tutor selected');
                    break;
                default:
                    updateProgress('Action Button', 'Unknown action', action);
                    console.log(`🔍 Action clicked: ${action}`);
                    break;
            }
            
            // Visual feedback for selected button
            actionButtons.forEach(btn => btn.classList.remove('ring-2', 'ring-purple-500', 'ring-offset-2'));
            button.classList.add('ring-2', 'ring-purple-500', 'ring-offset-2');
            
            // Focus input after selection
            if (mainChatInput) mainChatInput.focus();
            
            console.log(`⚡ Agent selected: ${selectedAgent || action}`);
        });
    });
    
    updateProgress('Events', 'Action buttons registered', `${actionButtons.length} buttons`);
    
    // Voice Input Button
    if (voiceInputButton) {
        voiceInputButton.addEventListener('click', () => {
            toggleVoiceInput();
            updateProgress('Voice Input', isVoiceRecording ? 'Started recording' : 'Stopped recording');
        });
        updateProgress('Events', 'Voice input button registered');
    }
    
    // Camera Input Button  
    if (cameraInputButton && cameraInput) {
        cameraInputButton.addEventListener('click', () => {
            cameraInput.click();
            updateProgress('Camera Input', 'Button clicked');
        });
        
        cameraInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                selectedFiles = [...selectedFiles, ...files];
                cameraInputButton.classList.add('text-purple-600', 'bg-purple-50');
                cameraInputButton.title = `${files.length} image(s) captured`;
                updateProgress('Camera Input', 'Images captured', `${files.length} files`);
            }
        });
        
        updateProgress('Events', 'Camera input registered');
    }
    
    // Test Models Button
    if (testModelsButton) {
        testModelsButton.addEventListener('click', () => {
            testSelectedModels();
            updateProgress('Model Testing', 'Started model testing');
        });
        updateProgress('Events', 'Test models button registered');
    }
    
    // Quick Action Buttons
    quickActionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-quick');
            handleQuickAction(action);
            updateProgress('Quick Action', `${action} executed`);
        });
    });
    
    if (quickActionButtons.length > 0) {
        updateProgress('Events', 'Quick action buttons registered', `${quickActionButtons.length} buttons`);
    }
    
    // Voice Input Button
    if (voiceInputButton) {
        voiceInputButton.addEventListener('click', () => {
            toggleVoiceInput();
            updateProgress('Voice Input', isVoiceRecording ? 'Started recording' : 'Stopped recording');
        });
        updateProgress('Events', 'Voice input button registered');
    }
    
    // Enhanced Functions for New Features
    
    function toggleVoiceInput() {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice recognition is not supported in this browser.');
            return;
        }
        
        if (isVoiceRecording) {
            // Stop recording
            if (voiceRecognition) {
                voiceRecognition.stop();
            }
            isVoiceRecording = false;
            voiceInputButton.classList.remove('bg-red-100', 'text-red-700');
            voiceInputButton.title = 'Voice input';
        } else {
            // Start recording
            voiceRecognition = new webkitSpeechRecognition();
            voiceRecognition.continuous = false;
            voiceRecognition.interimResults = false;
            voiceRecognition.lang = 'en-US';
            
            voiceRecognition.onstart = () => {
                isVoiceRecording = true;
                voiceInputButton.classList.add('bg-red-100', 'text-red-700');
                voiceInputButton.title = 'Recording... Click to stop';
            };
            
            voiceRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (mainChatInput) {
                    mainChatInput.value = transcript;
                    mainChatInput.focus();
                }
                updateProgress('Voice Input', 'Transcript received', transcript);
            };
            
            voiceRecognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                isVoiceRecording = false;
                voiceInputButton.classList.remove('bg-red-100', 'text-red-700');
            };
            
            voiceRecognition.onend = () => {
                isVoiceRecording = false;
                voiceInputButton.classList.remove('bg-red-100', 'text-red-700');
                voiceInputButton.title = 'Voice input';
            };
            
            voiceRecognition.start();
        }
    }
    
    async function testSelectedModels() {
        if (isLoading) return;
        
        setLoadingState(true);
        testModelsButton.classList.add('btn-loading');
        
        try {
            const response = await fetch(`${API_BASE}/test_models`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: 'Hello, can you respond briefly?',
                    models: ['Qwen3-235B-A22B-2507', 'Qwen3-Plus', 'Qwen3-Coder-32B-Instruct', 'Qwen-Turbo']
                })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                const results = `Model Test Results:\n✅ Working: ${data.working_count}/${data.total_tested}\n✅ Models: ${data.working_models.join(', ')}\n❌ Failed: ${data.failed_models.join(', ')}`;
                alert(results);
                updateProgress('Model Testing', `Tested ${data.total_tested} models`, `${data.working_count} working`);
            } else {
                alert('Model testing failed: ' + data.message);
            }
            
        } catch (error) {
            console.error('Model testing error:', error);
            alert('Model testing failed: ' + error.message);
        } finally {
            setLoadingState(false);
            testModelsButton.classList.remove('btn-loading');
        }
    }
    
    function handleQuickAction(action) {
        switch (action) {
            case 'clear':
                if (confirm('Are you sure you want to clear the current chat?')) {
                    resetToWelcome();
                    messageCounter = 0;
                    updateUIStats();
                }
                break;
            case 'export':
                exportChatHistory();
                break;
            case 'share':
                shareChatLink();
                break;
            case 'feedback':
                openFeedbackDialog();
                break;
            default:
                console.log(`Quick action: ${action}`);
        }
    }
    
    function exportChatHistory() {
        const messages = document.querySelectorAll('#messages-container .message-container');
        let chatText = 'Qwen Chat Export\n================\n\n';
        
        messages.forEach(msg => {
            const isUser = msg.classList.contains('user-message');
            const content = msg.querySelector('.message-content')?.textContent || '';
            chatText += `${isUser ? 'You' : 'Qwen'}: ${content}\n\n`;
        });
        
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qwen-chat-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    function shareChatLink() {
        if (currentChatId) {
            const shareUrl = `${window.location.origin}/?chat=${currentChatId}`;
            if (navigator.share) {
                navigator.share({
                    title: 'Qwen Chat',
                    url: shareUrl
                });
            } else {
                navigator.clipboard.writeText(shareUrl);
                alert('Chat link copied to clipboard!');
            }
        } else {
            alert('No active chat to share');
        }
    }
    
    function openFeedbackDialog() {
        const feedback = prompt('Please share your feedback about this chat session:');
        if (feedback && feedback.trim()) {
            console.log('User feedback:', feedback);
            alert('Thank you for your feedback!');
        }
    }
    
    function updateUIStats() {
        if (messageCount) messageCount.textContent = `${messageCounter} messages`;
        if (sessionTime) {
            const elapsed = Math.floor((Date.now() - sessionStartTime) / 60000);
            sessionTime.textContent = `${elapsed}m`;
        }
        if (modelsAvailable) modelsAvailable.textContent = '16 models';
        if (currentModelStatus) currentModelStatus.textContent = currentModelName?.textContent || 'Loading...';
        if (responseSpeed) responseSpeed.textContent = webSearchEnabled ? 'Detailed response' : 'Fast response';
    }
    
    // Update stats every minute
    setInterval(updateUIStats, 60000);
    
    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    async function initialize() {
        console.log("🚀 Initializing Qwen Clone - Complete Functionality Interface...");
        updateProgress('Initialize', 'Starting application');
        
        // Load initial data
        loadModelInfo();
        loadChatHistory();
        
        // Update model count display (async)
        const modelStats = await updateModelCount();
        
        // Set initial state - always show welcome in logged-in interface
        resetToWelcome();
        
        // Initialize sidebar state
        if (window.innerWidth >= 1024) { // lg breakpoint
            showSidebar();
        } else {
            hideSidebar();
        }
        
        // Initialize UI stats
        updateUIStats();
        
        updateProgress('Initialize', 'Application ready');
        console.log("✅ Qwen Clone initialized successfully!");
        console.log("📊 Features enabled:");
        console.log("  - ✅ Collapsible sidebar");
        console.log(`  - ✅ ${modelStats?.total || 15} model selection options`);
        if (modelStats?.live) {
            console.log(`  - ✅ Live model count: ${modelStats.live}`);
        }
        console.log("  - ✅ File upload support");
        console.log("  - ✅ Thinking mode toggle");
        console.log("  - ✅ Web search toggle");
        console.log("  - ✅ 7 specialized action buttons");
        console.log("  - ✅ Enhanced chat interface");
        console.log("  - ✅ Progressive enhancement");
        console.log("  - ✅ Real-time model count display");
    }
    
    // Window resize handler
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            showSidebar();
        } else if (!moreDropdownVisible) {
            hideSidebar();
        }
    });
    
    // Start the application
    initialize();
});