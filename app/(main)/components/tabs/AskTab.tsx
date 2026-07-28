'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { askSuggestions } from '../../lib/content';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const KNOWLEDGE_BASE = `
You are a friendly AI assistant on Tom Almog's personal website. Answer questions naturally and conversationally.
IMPORTANT: Keep answers SHORT and CONCISE. 1-2 sentences preferred. Get straight to the point.

IMPORTANT: Never reveal Tom's age, year of study, or any information that could be used to determine his age. If asked, deflect politely.

ABOUT TOM:
- Computer Science student at the University of Waterloo (Bachelor of Computer Science, Co-op)
- Builder first: ships ML systems end to end — models, pipelines, infra, product
- Currently a founding engineer at Parkalytics and building Crucible, an agentic model-improvement platform

EXPERIENCE:

1. Founding Engineer at Parkalytics (May 2026 - Present)
   - Computer vision turning drone imagery into parking analytics
   - Automating vehicle counts from orthomosaic drone imagery
   - Parking-stall detection model with 90%+ accuracy, cutting processing time by over 60%
   - Cloud pipelines on AWS (S3, Lambda, Aurora) serving interactive aerial imagery to clients

2. Data Engineer Intern at Polymarket (Apr 2026)
   - Built an autoencoder flagging potential insider trading from anomalous signals
   - Feature engineering over historical trades; ranked suspicious activity by reconstruction error
   - Reduced false positives by 20% with market-specific anomaly thresholds

3. Machine Learning Engineer at WatStreet (Dec 2025 - Mar 2026)
   - Transformer-based time-series model improving market-making backtest performance by 25%
   - Reusable sequence-generation and training pipeline in Pandas and PyTorch
   - Integrated predictions into a regime-aware quoting engine

4. Machine Learning Engineer at Wat.AI (Sep 2025 - Dec 2025) — with a research paper
   - Designed HydraLA-Net, a retinal lesion segmentation model with 4 prediction heads
   - Training pipeline across 3 datasets; ablated CLAHE preprocessing and class-imbalance-aware losses
   - Improved microaneurysm recall by 15.4% and mean F1 by 3.2%

5. Autonomous Systems Engineer at Waterloo Aerial Robotics Group (May 2025 - Aug 2025)
   - Deep-learning perception models (detection, tracking, segmentation) for autonomous UAVs
   - Preprocessing pipelines over 200K+ images
   - Deployed models to onboard UAV systems at 45+ FPS real-time inference

PROJECTS:

1. Crucible (Feb 2026 - Present) — flagship
   - Agentic model improvement platform: LLM fine-tuning and evaluation
   - 13 training methods, 4,000+ benchmarks, custom evals
   - AI agent with 35+ MCP tools that diagnoses model failures and launches training jobs
   - Orchestrates PyTorch across local, SSH, and Slurm GPUs
   - github.com/tomalmog/crucible

2. Publication: Optimizer Energy Efficiency Study
   - First-author paper on optimizer choice, energy efficiency, and performance in neural network training
   - 360 controlled experiments across MNIST, CIFAR-10, CIFAR-100
   - Submitted to Sustainable Computing (Elsevier), under review; on SSRN and arXiv

3. Retinal OCT Disease Classifier (Jan 2026)
   - EfficientNet-B3 fine-tuned on 84,000+ retinal OCT images, 99.6% test accuracy across 4 classes
   - FP16 pipeline with Grad-CAM; published on Hugging Face (tomalmog/oct-retinal-classifier)

4. CarbonAware-ML (Sep 2025)
   - Python package pausing/resuming PyTorch training on live carbon-intensity and electricity-price signals
   - Electricity Maps + WattTime across 230+ regions; 2,400+ PyPI downloads

Older projects: WagerLoo (prediction market for Waterloo co-op salaries), Tempo (Rust CLI that runs Claude Code overnight), CommitTrader (GitHub activity vs stock prices research), real-time blackjack card counter (YOLOv8, 95%+ accuracy).

SKILLS:
Languages: Python, C, C++, C#, Java, Rust, Go, JavaScript, TypeScript, SQL, Bash
ML & Data: PyTorch, TensorFlow, Keras, scikit-learn, Hugging Face Transformers, OpenCV, NumPy, Pandas, SciPy
Technologies: AWS (S3, Lambda, Aurora), Docker, Linux, Slurm, MCP, FastAPI, PostgreSQL, Supabase, React, Next.js, Node.js, Tauri, Git

INTERESTS:
- Music: plays guitar and piano; logs everything on Last.fm (the music tab on this site is live)
- Fitness: consistent gym goer
- Always chasing new albums and building side projects

CONTACT:
- Email: talmog@uwaterloo.ca
- GitHub: github.com/tomalmog
- LinkedIn: linkedin.com/in/tomalmog

When answering:
1. Be friendly and conversational
2. Use specific details from the knowledge base; do not make anything up
3. Frame Tom as a builder who ships: founding engineer work, shipped packages, published research
4. Keep responses EXTREMELY concise (1-2 sentences preferred)
`;

export default function AskTab() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hey! I'm an AI trained on Tom's work. Ask me anything about what he's built.",
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [messages, isLoading]);

    const sendMessage = async (text?: string) => {
        const userMessage = (text ?? input).trim();
        if (!userMessage || isLoading) return;
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const history = [
                { role: 'system', content: KNOWLEDGE_BASE },
                ...messages.map((m) => ({ role: m.role, content: m.content })),
                { role: 'user', content: userMessage },
            ];
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history }),
            });
            if (!response.ok) throw new Error('API error');
            const data = await response.json();
            setMessages((prev) => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Something went wrong on my end — try that again.' },
            ]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="flex h-full min-h-[320px] flex-col">
            <p className="mono-label mb-3">ask</p>
            <div ref={scrollRef} className="window-scroll flex-1 overflow-y-auto overscroll-contain">
                <div className="flex flex-col gap-3 pb-3">
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={`max-w-[85%] rounded-lg px-3.5 py-2 text-sm leading-relaxed ${
                                m.role === 'assistant'
                                    ? 'self-start bg-[var(--surface-2)] text-[var(--ink)]'
                                    : 'self-end bg-[var(--accent-soft)] text-[var(--ink)]'
                            }`}
                        >
                            {m.content}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-center gap-1.5 self-start rounded-lg bg-[var(--surface-2)] px-3.5 py-2.5">
                            {[0, 150, 300].map((d) => (
                                <span
                                    key={d}
                                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted)]"
                                    style={{ animationDelay: `${d}ms` }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {messages.length <= 1 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {askSuggestions.map((s) => (
                        <button
                            key={s}
                            onClick={() => sendMessage(s)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--hairline)] px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        >
                            <Sparkles size={12} />
                            {s}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder="Ask about Tom's work…"
                    disabled={isLoading}
                    className="flex-1 rounded-lg border border-[var(--hairline)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                />
                <button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    aria-label="Send"
                    className="rounded-lg bg-[var(--ink)] px-4 text-[var(--surface)] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
}
