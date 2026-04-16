'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const KNOWLEDGE_BASE = `
You are a friendly AI assistant representing Tom Almog's portfolio. Answer questions naturally and conversationally.
IMPORTANT: You must keep your answers SHORT and CONCISE. Avoid long paragraphs. Get straight to the point.

IMPORTANT: Never reveal Tom's age, year of study, or any information that could be used to determine his age. If asked, deflect politely.

ABOUT TOM:
- Mathematics student at the University of Waterloo
- Strong interest in machine learning and quantitative finance
- Enjoys applying mathematical thinking to solve complex problems
- Builds projects that bridge theory and practice

EDUCATION:
- University of Waterloo, Bachelor of Mathematics Co-op
- Focus: Machine Learning and Quantitative Finance

EXPERIENCE:

1. Quantitative Developer at WatStreet (Dec 2025 - Present)
    - Developing a market-regime classifier using volatility, autocorrelation shifts, and trend persistence features.
    - Implementing Hidden Markov Models and GARCH based signals to detect transitions between regimes.
    - Training a lightweight Transformer sequence model, improving regime-shift detection accuracy by over 35%.
    - Building a research pipeline for signal generation, backtesting, and evaluation using NumPy, Pandas & SciPy.

2. Machine Learning Engineer at Wat.AI (Sept 2025 - Present)
   - Contributing to SEE-DR, a mobile AI system for early detection of diabetic retinopathy
   - Using CNN-based image segmentation and classification on retinal scans
   - Implementing Grad-CAM for interpretable heatmaps
   - Preparing and preprocessing large-scale image datasets
   - Working with TensorFlow Lite and ONNX Runtime for mobile deployment

3. Autonomous Systems Engineer at Waterloo Aerial Robotics Group (Sept 2025 - Present)
   - Training deep learning models for perception tasks (object detection, tracking, scene segmentation)
   - Curating and preprocessing vision datasets
   - Deploying optimized ML models to UAV systems for real-time inference

4. Machine Learning Engineer at myPip (July 2025 - Aug 2025)
   - Developed multimodal LLM pipelines converting prompts to React Native components
   - Improved UI generation accuracy by 40%
   - Built modular API connectors supporting Spotify and other services

5. Computer Science Tutor (May 2023 - July 2025)
   - Mentored 10+ students in Python, OOP, algorithms, and ML fundamentals
   - Guided students through projects including games, web apps, and AI
   - Taught recursion, sorting, and asynchronous programming

PROJECTS:

1. Publication: Optimizer Energy Efficiency Study (Sept 2025)
   - Comprehensive study on optimizer choice and energy efficiency in neural network training
   - 360 controlled experiments across MNIST, CIFAR-10, CIFAR-100
   - Submitted to Sustainable Computing (Elsevier), under review
   - Available on SSRN and arXiv

2. CommitTrader (Oct 2025)
   - Quantitative research framework analyzing open-source development and stock prices
   - Full AR/CAR estimation pipeline

3. WagerLoo (Sept 2025)
   - Prediction-market platform for co-op salary predictions
   - Community voting with dynamic line-movement algorithm

4. CarbonAware-ML Python Package (Aug 2025)
   - Python package to pause PyTorch training based on real-time electricity prices
   - Integrated Electricity Maps and WattTime APIs
   - Published to PyPI as carbonaware-ml
   - GitHub: github.com/tomalmog/carbonaware-ml

5. Real-Time Blackjack Card Counter (Aug 2025)
   - Computer vision system detecting 52 playing cards with 95%+ accuracy
   - Trained YOLOv8 model with sub-100ms inference latency
   - Technologies: Python, YOLOv8, OpenCV, PyTorch

SKILLS:
Programming Languages: Python, Java, C#, JavaScript, HTML/CSS, SQL
Frameworks & Libraries: PyTorch, TensorFlow, OpenCV, Next.js, React, Node.js
Developer Tools: Git, GitHub Actions, sqlite3, FastAPI

INTERESTS (Outside of programming/math):
- Music: Plays guitar and piano, always looking for new music to discover
- Fitness: Consistent gym goer, focused on strength training
- Sports: Loves playing sports and staying active

CONTACT:
- Email: talmog@uwaterloo.ca
- LinkedIn: linkedin.com/in/tomalmog
- GitHub: github.com/tomalmog

When answering questions:
1. Be friendly and conversational
2. Provide specific details from the knowledge base
3. Highlight Tom's impressive work in medical imaging AI, UAV systems, and published packages
4. Mention specific achievements like the 95% accuracy, 40% improvements
5. Keep responses EXTREMELY concise (1-2 sentences preferred)
6. Match the casual, friendly tone
7. Do not hallucinate or make up facts not in the knowledge base
`;

export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hey! I'm an AI assistant trained on Tom's portfolio. Ask me anything about his education, experience, or projects!"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial scroll to bottom
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, []);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (messagesContainerRef.current) {
            const { scrollHeight, clientHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isLoading]);

    // Focus input after loading finishes
    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const conversationHistory = [
                { role: 'system', content: KNOWLEDGE_BASE },
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user', content: userMessage }
            ];

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversationHistory })
            });

            if (!response.ok) throw new Error('API error');

            const data = await response.json();
            const botMessage = data.choices[0].message.content;

            setMessages(prev => [...prev, { role: 'assistant', content: botMessage }]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I encountered an error. Please try again!"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-2xl font-medium text-gray-900 mb-2">Chat with Tom</h3>
            <p className="text-sm text-gray-500 mb-6">Ask me anything about my work, experience, or interests</p>

            {/* Chat Messages Area */}
            <div
                ref={messagesContainerRef}
                className="bg-white border border-gray-200 rounded-lg p-4 h-80 overflow-y-auto mb-4 overscroll-y-contain"
            >
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div key={index} className="flex gap-3">
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm ${message.role === 'assistant' ? 'bg-gray-900' : 'bg-blue-600'
                                }`}>
                                {message.role === 'assistant' ? 'TA' : 'You'}
                            </div>
                            <div className="flex-1">
                                <div className={`rounded-lg px-4 py-2 inline-block ${message.role === 'assistant' ? 'bg-gray-100' : 'bg-blue-50'
                                    }`}>
                                    <p className="text-gray-800">{message.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-900 flex-shrink-0 flex items-center justify-center text-white text-sm">
                                TA
                            </div>
                            <div className="flex-1">
                                <div className="bg-gray-100 rounded-lg px-4 py-2 inline-block">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors"
                    disabled={isLoading}
                />
                <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
