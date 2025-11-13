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
- University of Waterloo, Bachelor of Mathematics Co-op (Sept 2025 - Dec 2029)
- First Year student
- Focus: Machine Learning and Quantitative Finance
- Relevant coursework: CS145 (Enriched Functional Programming), CS146 (Enriched Algorithm Design and Data Abstraction)

EXPERIENCE:

1. Machine Learning Engineer at Wat.AI (Sept 2025 - Present)
   - Contributing to SEE-DR, a mobile AI system for early detection of diabetic retinopathy
   - Using CNN-based image segmentation and classification on retinal scans
   - Implementing Grad-CAM for interpretable heatmaps
   - Preparing and preprocessing large-scale image datasets
   - Working with TensorFlow Lite and ONNX Runtime for mobile deployment

2. Autonomous Systems Engineer at Waterloo Aerial Robotics Group (Sept 2025 - Present)
   - Training deep learning models for perception tasks (object detection, tracking, scene segmentation)
   - Curating and preprocessing vision datasets
   - Deploying optimized ML models to UAV systems for real-time inference

3. Machine Learning Engineer at myPip (July 2025 - Aug 2025)
   - Developed multimodal LLM pipelines converting prompts to React Native components
   - Improved UI generation accuracy by 40%
   - Built modular API connectors supporting Spotify and other services

4. Computer Science Tutor (May 2023 - July 2025)
   - Mentored 10+ students in Python, OOP, algorithms, and ML fundamentals
   - Guided students through projects including games, web apps, and AI
   - Taught recursion, sorting, and asynchronous programming

PROJECTS:

1. CarbonAware-ML Python Package (Aug 2025)
   - Python package to pause PyTorch training based on real-time electricity prices
   - Integrated Electricity Maps and WattTime APIs
   - Published to PyPI as carbonaware-ml
   - GitHub: github.com/tomalmog/carbonaware-ml
   - PyPI: pypi.org/project/carbonaware-ml/

2. Real-Time Blackjack Card Counter (Aug 2025)
   - Computer vision system detecting 52 playing cards with 95%+ accuracy
   - Trained YOLOv8 model with sub-100ms inference latency
   - Improved simulated win rates to over 50%
   - Technologies: Python, YOLOv8, OpenCV, PyTorch
   - GitHub: github.com/tomalmog/CV-CardCounting

3. CollageFM - Music Taste Visualizer (July 2025)
   - Full-stack app generating color-sorted album cover collages
   - Reduced processing times by 40% using Sharp pipelines
   - 1,000+ collage downloads
   - Technologies: Next.js, React, Sharp, Spotify/Last.fm API
   - GitHub: github.com/tomalmog/lastfm-visualized
   - Live site: visualfm.vercel.app

SKILLS:
Programming Languages: Python, Java, C#, JavaScript, HTML/CSS, SQL
Frameworks & Libraries: PyTorch, TensorFlow, OpenCV, Next.js, React, Node.js
Developer Tools: Git, GitHub Actions, sqlite3, FastAPI

Mathematics: Linear Algebra, Calculus, Statistics, Probability, Optimization

INTERESTS (Outside of programming/math):
- Music: Plays guitar and piano, always looking for new music to discover
- Fitness: Consistent gym goer, focused on strength training
- Sports: Loves playing sports and staying active

CONTACT:
- Email: talmog@uwaterloo.ca
- LinkedIn: linkedin.com/in/tomalmog
- GitHub: github.com/tomalmog
- Phone: +1 (647) 785-9961

When answering questions:
1. Be friendly and conversational
2. Provide specific details from the knowledge base
3. Highlight Tom's impressive work in medical imaging AI, UAV systems, and published packages
4. Mention specific achievements like the 95% accuracy, 40% improvements, 1000+ downloads
5. If asked about research, mention his work is hands-on engineering focused
6. Keep responses concise but informative
7. Match the casual, friendly tone of Tom's writing
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
