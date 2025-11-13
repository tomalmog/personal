// Chatbot functionality with Groq API (via serverless function)

// API endpoint - will be our serverless function
const API_ENDPOINT = '/.netlify/functions/chat';

// Knowledge base about Tom - Update this with your actual information
const KNOWLEDGE_BASE = `
You are a friendly AI assistant representing Tom Almog's portfolio. Answer questions naturally and conversationally.

ABOUT TOM:
- First-year Mathematics student at the University of Waterloo
- Strong interest in machine learning and quantitative finance
- Enjoys applying mathematical thinking to solve complex problems
- Builds projects that bridge theory and practice

EDUCATION:
- University of Waterloo, Bachelor of Mathematics (2024 - Present)
- First Year student
- Focus: Machine Learning and Quantitative Finance
- Relevant coursework: [User should fill in their courses]

SKILLS:
Programming Languages:
- Python
- C++
- R
- SQL
- JavaScript

Machine Learning:
- TensorFlow
- PyTorch
- Scikit-learn
- Pandas
- NumPy

Mathematics:
- Linear Algebra
- Calculus
- Statistics
- Probability
- Optimization

Quantitative Finance:
- Financial Modeling
- Data Analysis
- Risk Analysis
- Time Series

INTERESTS (Outside of programming/math):
- Music: Plays guitar and piano, always looking for new music to listen to
- Fitness: Consistent gym goer
- Sports: Loves to play sports

PROJECTS:
[User should add their actual projects here]

CONTACT:
- Email: [User email]
- LinkedIn: [User LinkedIn]
- GitHub: [User GitHub]

When answering questions:
1. Be friendly and conversational
2. Provide specific details from the knowledge base
3. If asked about projects that aren't listed, mention that Tom is actively working on projects and the portfolio is being updated
4. If you don't know something, be honest and suggest checking the full portfolio sections
5. Keep responses concise but informative
6. Match the casual, friendly tone of Tom's writing
`;

// Conversation history
let conversationHistory = [
    {
        role: 'system',
        content: KNOWLEDGE_BASE
    }
];

// Toggle chatbot open/close
function toggleChatbot() {
    const chatWindow = document.getElementById('chatbot-window');
    const toggleText = document.getElementById('chat-toggle-text');

    if (chatWindow.classList.contains('open')) {
        chatWindow.classList.remove('open');
        toggleText.textContent = 'OPEN';
    } else {
        chatWindow.classList.add('open');
        toggleText.textContent = 'CLOSE';
    }
}

// Add message to chat
function addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById('chat-messages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user-message' : 'bot-message'}`;

    const icon = document.createElement('span');
    icon.className = 'message-icon';
    icon.textContent = isUser ? '👤' : '🤖';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content pixel-text-tiny';
    messageContent.textContent = content;

    messageDiv.appendChild(icon);
    messageDiv.appendChild(messageContent);

    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        typingDiv.appendChild(dot);
    }

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Send message to Groq API
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to chat
    addMessage(message, true);

    // Clear input
    input.value = '';

    // Add message to conversation history
    conversationHistory.push({
        role: 'user',
        content: message
    });

    // Show typing indicator
    showTypingIndicator();

    try {
        // Call serverless function (which calls Groq API securely)
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const botMessage = data.choices[0].message.content;

        // Add bot response to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: botMessage
        });

        // Remove typing indicator
        removeTypingIndicator();

        // Add bot message to chat
        addMessage(botMessage, false);

    } catch (error) {
        console.error('Chatbot error:', error);
        removeTypingIndicator();
        addMessage('Sorry, I encountered an error. Please try again!', false);
    }
}

// Handle Enter key in input
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

console.log('💬 Chatbot loaded! Powered by Groq + Llama 3.1');
