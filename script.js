const chatBubble = document.getElementById('chatBubble');
const chatWidget = document.getElementById('chatWidget');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');
const chatBody = document.getElementById('chatBody');
const typingIndicator = document.getElementById('typingIndicator');
const welcomeTooltip = document.getElementById('welcomeTooltip');
const closeTooltipBtn = welcomeTooltip.querySelector('button.close-tooltip');
const chatFooter = document.getElementById('chatFooter');
const tabs = document.querySelectorAll('.chat-tab');
const tabContents = {
  chat: document.getElementById('tabChat'),
  help: document.getElementById('tabHelp'),
  faq: document.getElementById('tabFAQ'),
};

// Track active tab
let activeTab = 'chat';
let isChatOpen = false;

// On page load: widget minimized, show bubble + welcome tooltip with animation
window.addEventListener('load', () => {
  chatWidget.style.display = 'none';
  chatBubble.style.display = 'flex';
  setTimeout(() => {
    welcomeTooltip.classList.add('show');
  }, 500);
  switchTab('chat');
});

// Minimize chat widget
function minimizeChat() {
  chatWidget.style.display = 'none';
  chatBubble.style.display = 'flex';
  welcomeTooltip.classList.add('show');
  isChatOpen = false;
}

// Open chat widget
chatBubble.addEventListener('click', () => {
  if (isChatOpen) {
    minimizeChat();
  } else {
    chatWidget.style.display = 'flex';
    welcomeTooltip.classList.remove('show');
    welcomeTooltip.classList.add('hidden');
    chatInput.focus();
    isChatOpen = true;
  }
});

chatCloseBtn.addEventListener('click', minimizeChat);

closeTooltipBtn.addEventListener('click', () => {
  welcomeTooltip.classList.remove('show');
  welcomeTooltip.classList.add('hidden');
});

// Switch tab function
function switchTab(tab) {
  if (tab === activeTab) return;
  activeTab = tab;

  tabs.forEach((tabEl) => {
    const tabId = tabEl.id.replace('Btn', '').toLowerCase();
    const isActive = tabId === tab;
    tabEl.classList.toggle('active', isActive);
    tabEl.setAttribute('aria-selected', isActive);
  });

  Object.keys(tabContents).forEach((key) => {
    tabContents[key].style.display = key === tab ? 'block' : 'none';
  });

  // Show/hide footer based on active tab
  chatFooter.style.display = tab === 'chat' ? 'flex' : 'none';

  if (tab === 'chat') {
    chatInput.focus();
  }
}

// Add message to chat body
function addMessage(text, sender, avatarUrl = null) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);

  const avatar = document.createElement('div');
  avatar.classList.add('avatar', sender);
  if (sender === 'user' && avatarUrl) {
    avatar.style.backgroundImage = `url(${avatarUrl})`;
  }
  messageDiv.appendChild(avatar);

  const textDiv = document.createElement('div');
  textDiv.classList.add('message-text');
  textDiv.textContent = text;
  messageDiv.appendChild(textDiv);

  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Convenience for bot messages
function addBotMessage(text) {
  addMessage(text, 'bot');
}

// Convenience for user messages
function addUserMessage(text, avatarUrl = null) {
  addMessage(text, 'user', avatarUrl);
}

// Simulate sending message and bot reply
async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || activeTab !== 'chat') return;
  addUserMessage(text);
  chatInput.value = '';
  typingIndicator.style.display = 'block';

  await new Promise((resolve) => setTimeout(resolve, 1200));
  addBotMessage(`You said: "${text}"`);
  typingIndicator.style.display = 'none';
}

sendBtn.addEventListener('click', sendMessage);

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && activeTab === 'chat') {
    e.preventDefault();
    sendMessage();
  }
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => switchTab(tab.id.replace('Btn', '').toLowerCase()));
});