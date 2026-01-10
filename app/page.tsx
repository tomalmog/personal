'use client';

import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ProjectCard from './components/ProjectCard';
import Chatbot from './components/Chatbot';
import { Mail, MapPin } from 'lucide-react';

export default function Home() {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'experience', 'projects', 'contact'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const projects = [
        {
            title: 'Publication: Optimizer Energy Efficiency Study',
            description: 'Comprehensive empirical study investigating optimizer choice and energy efficiency in neural network training. 360 controlled experiments across MNIST, CIFAR-10, CIFAR-100. Submitted to Sustainable Computing (Elsevier), under review.',
            tags: ['Energy Efficiency', 'Machine Learning', 'Sustainable AI'],
            links: [
                { label: 'SSRN', url: 'https://ssrn.com/abstract=5465242' },
                { label: 'arXiv', url: 'https://arxiv.org/abs/2509.13516' },
                { label: 'GitHub', url: 'https://github.com/tomalmog/optimizer-energy-study' }
            ]
        },
        {
            title: 'CommitTrader - Financial Research',
            description: 'Quantitative research framework analyzing correlation between open-source development and stock prices. Full AR/CAR estimation pipeline with Market, Mean-Adjusted, and Market-Adjusted models.',
            tags: ['Pandas', 'yFinance', 'GitHub API'],
            links: [{ label: 'Live Site', url: 'https://tomalmog.github.io/CommitTrader/' }]
        },
        {
            title: 'WagerLoo - Co-op Salary Prediction Market',
            description: 'Prediction-market platform where Waterloo students receive over/under salary predictions driven by community voting. Dynamic line-movement algorithm updates predictions.',
            tags: ['Next.js', 'Prisma', 'PostgreSQL'],
            links: [{ label: 'Live Site', url: 'https://wagerloo.vercel.app/' }]
        },
        {
            title: 'CarbonAware-ML Python Package',
            description: 'Python package to pause PyTorch training based on real-time electricity prices. Integrated Electricity Maps and WattTime APIs. Published to PyPI.',
            tags: ['Python', 'PyTorch', 'API Integration'],
            links: [
                { label: 'GitHub', url: 'https://github.com/tomalmog/carbonaware-ml' },
                { label: 'PyPI', url: 'https://pypi.org/project/carbonaware-ml/' }
            ]
        },
        {
            title: 'Real-Time Blackjack Card Counter',
            description: 'Computer vision system detecting 52 playing cards with 95%+ accuracy. YOLOv8 model with sub-100ms inference. Improved simulated win rates to over 50%.',
            tags: ['Python', 'YOLOv8', 'OpenCV', 'PyTorch'],
            links: [{ label: 'GitHub', url: 'https://github.com/tomalmog/CV-CardCounting' }]
        }
    ];

    const experiences = [
        {
            title: 'Quantitative Developer',
            company: 'WatStreet',
            subtitle: 'Financial Markets, Machine Learning',
            date: 'Dec 2025 - Present',
            bullets: [
                'Developing a market-regime classifier using volatility, autocorrelation shifts, and trend persistence features',
                'Implementing Hidden Markov Models and GARCH based signals to detect transitions between regimes',
                'Training a lightweight Transformer sequence model, improving regime-shift detection accuracy by over 35%',
                'Building a research pipeline for signal generation, backtesting, and evaluation using NumPy, Pandas & SciPy'
            ]
        },
        {
            title: 'Machine Learning Engineer',
            company: 'Wat.AI',
            subtitle: 'Deep Learning, Medical Imaging, Explainable AI',
            date: 'Sept 2025 - Present',
            bullets: [
                'Contributing to SEE-DR, a mobile AI system for early detection of diabetic retinopathy using CNN-based image segmentation',
                'Implementing Grad-CAM to generate interpretable heatmaps highlighting clinically relevant regions',
                'Preparing and preprocessing large-scale image datasets for model training',
                'Collaborating on model deployment pipelines using TensorFlow Lite and ONNX Runtime for mobile platforms'
            ]
        },
        {
            title: 'Autonomous Systems Engineer',
            company: 'Waterloo Aerial Robotics Group',
            subtitle: 'Machine Learning, Computer Vision, UAV Autonomy',
            date: 'Sept 2025 - Present',
            bullets: [
                'Training deep learning models for perception tasks including object detection, tracking, and scene segmentation',
                'Curating and preprocessing vision datasets to improve model generalization and robustness',
                'Deploying optimized ML models to UAV systems for real-time inference, integrating with navigation pipelines'
            ]
        },
        {
            title: 'Machine Learning Engineer',
            company: 'myPip',
            subtitle: 'AI Research & Product Development',
            date: 'July 2025 - Aug 2025',
            bullets: [
                'Developing multimodal LLM pipelines that convert user prompts into deployable React Native app components',
                'Improved accuracy of generated UI structures by 40% through iterative fine-tuning and model pipeline optimization',
                'Built modular API connectors for generated apps, supporting services like Spotify and allowing real-time data access'
            ]
        },
        {
            title: 'Computer Science Tutor',
            company: 'Private Tutoring',
            subtitle: 'Python, TensorFlow',
            date: 'May 2023 - July 2025',
            bullets: [
                'Mentored 10+ students in Python, OOP, algorithms, and ML fundamentals, resulting in grade improvements',
                'Guided students through projects including games, web applications, and AI projects',
                'Introduced recursion, sorting, and asynchronous programming in an accessible, project-based style'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navigation activeSection={activeSection} />

            {/* HOME Section */}
            <section id="home" className="min-h-screen flex items-center justify-center px-6 py-32">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <div className="mb-12">
                                <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6">Tom Almog</h1>
                                <p className="text-xl md:text-2xl text-gray-600 mb-4">
                                    Mathematics Student | Machine Learning | Quantitative Finance
                                </p>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <MapPin size={18} />
                                    <span className="text-lg">University of Waterloo</span>
                                </div>
                            </div>

                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                <p>
                                    Hi! I'm Tom, a first-year Mathematics student at the University of Waterloo
                                    with a strong interest in machine learning and quantitative finance. I enjoy
                                    applying mathematical thinking to solve complex problems and building projects
                                    that genuinely have an impact.
                                </p>
                                <p>
                                    Outside of programming and math, music is my biggest passion. I play the guitar
                                    and piano, and am always looking for new music to listen to. I'm also a consistent
                                    gym goer and stay active.
                                </p>
                            </div>
                        </div>

                        <div className="lg:sticky lg:top-32">
                            <Chatbot />
                        </div>
                    </div>
                </div>
            </section>



            {/* EXPERIENCE Section */}
            <section id="experience" className="min-h-screen flex items-center justify-center px-6 py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto w-full">
                    <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-12">Experience</h2>
                    <div className="space-y-8">
                        {experiences.map((exp, index) => (
                            <div key={index} className={`border-l-2 border-gray-300 pl-8 ${index < experiences.length - 1 ? 'pb-8' : ''}`}>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                    <h3 className="text-2xl font-medium text-gray-900">{exp.title}</h3>
                                    <span className="text-gray-500">{exp.date}</span>
                                </div>
                                <p className="text-xl text-gray-600 mb-1">{exp.company}</p>
                                <p className="text-gray-500 mb-4 italic">{exp.subtitle}</p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    {exp.bullets.map((bullet, i) => (
                                        <li key={i}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROJECTS Section */}
            <section id="projects" className="min-h-screen flex items-center justify-center px-6 py-20">
                <div className="max-w-6xl mx-auto w-full">
                    <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-12">Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <ProjectCard key={index} {...project} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT Section */}
            <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto w-full text-center">
                    <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">Get In Touch</h2>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Thanks for visiting my portfolio! Feel free to reach out if you'd like to connect or discuss opportunities.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
                        <a href="mailto:talmog@uwaterloo.ca" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
                            <Mail size={24} />
                            <span className="text-lg">talmog@uwaterloo.ca</span>
                        </a>
                        <div className="flex items-center gap-3 text-gray-600">
                            <MapPin size={24} />
                            <span className="text-lg">Waterloo, Ontario</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-8">
                        <a href="https://linkedin.com/in/tomalmog" target="_blank" rel="noopener noreferrer"
                            className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors">
                            LinkedIn
                        </a>
                        <a href="https://github.com/tomalmog" target="_blank" rel="noopener noreferrer"
                            className="px-8 py-3 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                            GitHub
                        </a>
                    </div>
                </div>
            </section>

            <footer className="py-8 px-6 border-t border-gray-200">
                <div className="max-w-6xl mx-auto text-center text-gray-500">
                    <p>© 2026 Tom Almog. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
