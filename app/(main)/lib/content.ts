// All site copy and data. Edit this file to update the site's content.

export const identity = {
    name: 'Tom Almog',
    tagline: 'CS @ Waterloo — building ML systems that ship.',
    email: 'talmog@uwaterloo.ca',
    github: 'https://github.com/tomalmog',
    linkedin: 'https://linkedin.com/in/tomalmog',
    resume: '/resume.pdf',
    lastfmUser: 'TomAlmog',
    lastfmUrl: 'https://www.last.fm/user/TomAlmog',
};

export const about = {
    paragraphs: [
        "I study computer science at Waterloo and spend most of my time building — right now that's computer-vision systems turning drone imagery into parking analytics at Parkalytics, and Crucible, an agentic platform for fine-tuning and evaluating LLMs. Before that: anomaly detection at Polymarket, retinal-disease research with a paper out of it, and perception models running on real drones at 45 FPS.",
        "Off the keyboard, music is the big one — I play guitar and piano, and I log basically everything I listen to (the music tab is live, go look). I lift most days and I'm always chasing new albums.",
    ],
};

export interface ProjectLink {
    label: string;
    url: string;
}

export interface Project {
    slug: string;
    name: string;
    oneLiner: string;
    detail: string;
    tags: string[];
    links: ProjectLink[];
}

export const projects: Project[] = [
    {
        slug: 'crucible',
        name: 'Crucible',
        oneLiner: 'Agentic model improvement platform',
        detail:
            'An LLM fine-tuning and evaluation suite: 13 training methods, 4,000+ benchmarks, and custom evals, with an AI agent wired to 35+ MCP tools that diagnoses model failures, launches training jobs, and compares results. Orchestrates PyTorch workloads across local machines, SSH boxes, and Slurm GPU clusters with experiment tracking and reproducibility.',
        tags: ['Python', 'PyTorch', 'Tauri', 'React'],
        links: [{ label: 'GitHub', url: 'https://github.com/tomalmog/crucible' }],
    },
    {
        slug: 'optimizer-energy-study',
        name: 'Optimizer Energy Efficiency Study',
        oneLiner: 'First-author publication on optimizer choice and energy use',
        detail:
            'An empirical study of how optimizer choice affects energy efficiency and performance in neural network training — 360 controlled experiments across MNIST, CIFAR-10, and CIFAR-100. Submitted to Sustainable Computing (Elsevier), under review.',
        tags: ['Research', 'PyTorch', 'Sustainable AI'],
        links: [
            { label: 'arXiv', url: 'https://arxiv.org/abs/2509.13516' },
            { label: 'SSRN', url: 'https://ssrn.com/abstract=5465242' },
            { label: 'GitHub', url: 'https://github.com/tomalmog/optimizer-energy-study' },
        ],
    },
    {
        slug: 'retinal-oct-classifier',
        name: 'Retinal OCT Disease Classifier',
        oneLiner: '99.6% accuracy on 84,000+ retinal scans',
        detail:
            'Fine-tuned EfficientNet-B3 on 84,000+ retinal OCT images to classify four disease categories at 99.6% test accuracy, with an FP16 pipeline, data augmentation, and Grad-CAM interpretability. Published to Hugging Face.',
        tags: ['PyTorch', 'EfficientNet', 'Grad-CAM'],
        links: [
            { label: 'Hugging Face', url: 'https://huggingface.co/tomalmog/oct-retinal-classifier' },
            { label: 'GitHub', url: 'https://github.com/tomalmog/retinal-oct-classifier' },
        ],
    },
    {
        slug: 'carbonaware-ml',
        name: 'CarbonAware-ML',
        oneLiner: 'PyTorch scheduler with 2,400+ PyPI downloads',
        detail:
            'A Python package that pauses and resumes PyTorch training based on live carbon-intensity and electricity-price signals. Integrates Electricity Maps and WattTime across 230+ regions, with CLI and TensorBoard support.',
        tags: ['Python', 'PyTorch', 'PyPI'],
        links: [
            { label: 'PyPI', url: 'https://pypi.org/project/carbonaware-ml/' },
            { label: 'GitHub', url: 'https://github.com/tomalmog/carbonaware-ml' },
        ],
    },
];

export const moreProjects: Project[] = [
    {
        slug: 'wagerloo',
        name: 'WagerLoo',
        oneLiner: 'Prediction market for Waterloo co-op salaries',
        detail:
            'A platform where Waterloo students get over/under salary predictions driven by community voting, with a dynamic line-movement algorithm.',
        tags: ['Next.js', 'Prisma', 'PostgreSQL'],
        links: [
            { label: 'Live', url: 'https://wagerloo.vercel.app/' },
            { label: 'GitHub', url: 'https://github.com/tomalmog/WagerLoo' },
        ],
    },
    {
        slug: 'tempo',
        name: 'Tempo',
        oneLiner: 'Automated Claude Code runner in Rust',
        detail:
            'A CLI that runs long Claude Code tasks overnight: rate-limit detection, multi-cycle support, markdown logging, crash recovery.',
        tags: ['Rust', 'CLI'],
        links: [
            { label: 'Live', url: '/tempo' },
            { label: 'GitHub', url: 'https://github.com/tomalmog/tempo' },
        ],
    },
    {
        slug: 'committrader',
        name: 'CommitTrader',
        oneLiner: 'Does GitHub activity move stock prices?',
        detail:
            'A quantitative research framework correlating open-source development activity with stock prices, with a full AR/CAR estimation pipeline.',
        tags: ['Pandas', 'yFinance'],
        links: [
            { label: 'Live', url: '/committrader' },
            { label: 'GitHub', url: 'https://github.com/tomalmog/CommitTrader' },
        ],
    },
    {
        slug: 'card-counter',
        name: 'Blackjack Card Counter',
        oneLiner: 'Real-time card detection at 95%+ accuracy',
        detail:
            'A computer-vision system detecting all 52 playing cards with a YOLOv8 model at sub-100ms inference, driving simulated win rates above 50%.',
        tags: ['YOLOv8', 'OpenCV'],
        links: [{ label: 'GitHub', url: 'https://github.com/tomalmog/CV-CardCounting' }],
    },
];

export interface ExperienceEntry {
    role: string;
    org: string;
    dates: string;
    oneLiner: string;
    bullets: string[];
}

export const experience: ExperienceEntry[] = [
    {
        role: 'Founding Engineer',
        org: 'Parkalytics',
        dates: 'May 2026 – Present',
        oneLiner: 'Computer vision turning drone imagery into parking analytics.',
        bullets: [
            'Automating vehicle counts from orthomosaic drone imagery with computer-vision models, reducing manual review.',
            'Building a parking-stall detection model predicting valid spaces at 90%+ accuracy, cutting processing time by over 60%.',
            'Engineering cloud pipelines on AWS (S3, Lambda, Aurora) to store, process, and serve interactive aerial imagery to clients.',
        ],
    },
    {
        role: 'Data Engineer Intern',
        org: 'Polymarket',
        dates: 'Apr 2026',
        oneLiner: 'Anomaly detection for potential insider trading.',
        bullets: [
            'Built an autoencoder to flag potential insider trading from anomalous signals, greatly reducing human investigation time.',
            'Engineered features from historical trades and performance, ranking suspicious activity by reconstruction error.',
            'Reduced false positives by 20% with market-specific anomaly thresholds, preventing legitimate users from being flagged.',
        ],
    },
    {
        role: 'Machine Learning Engineer',
        org: 'WatStreet',
        dates: 'Dec 2025 – Mar 2026',
        oneLiner: 'Transformer time-series models for market making.',
        bullets: [
            'Built a Transformer-based time-series model improving market-making backtest performance by 25% over a static baseline.',
            'Cut model experimentation time with a reusable sequence-generation and training pipeline in Pandas and PyTorch.',
            'Integrated model predictions into a regime-aware quoting engine that adapted trading behavior as conditions changed.',
        ],
    },
    {
        role: 'Machine Learning Engineer',
        org: 'Wat.AI',
        dates: 'Sep 2025 – Dec 2025',
        oneLiner: 'Retinal lesion segmentation research — with a paper.',
        bullets: [
            'Designed HydraLA-Net, a segmentation model with four prediction heads to improve retinal lesion segmentation accuracy.',
            'Built a training pipeline across three datasets, ablating CLAHE preprocessing and class-imbalance-aware losses.',
            'Improved microaneurysm recall by 15.4% and mean F1 by 3.2% through architecture, preprocessing, and loss optimization.',
        ],
    },
    {
        role: 'Autonomous Systems Engineer',
        org: 'Waterloo Aerial Robotics Group',
        dates: 'May 2025 – Aug 2025',
        oneLiner: 'Perception models running on real drones.',
        bullets: [
            'Trained deep-learning models for object detection, tracking, and scene segmentation in autonomous UAV perception.',
            'Built preprocessing pipelines for vision datasets of 200K+ images to improve generalization during flight.',
            'Optimized and deployed perception models to onboard UAV systems, achieving real-time inference at over 45 FPS.',
        ],
    },
];

export const education = {
    school: 'University of Waterloo',
    degree: 'Bachelor of Computer Science, Co-op',
    dates: 'Sep 2025 – May 2030',
};

// The "now" tab's hand-edited section. Update whenever focus changes.
export const now = {
    updated: 'July 2026',
    items: [
        {
            title: 'Parkalytics',
            note: 'Founding engineer — building the CV pipeline that turns drone flights into parking analytics.',
        },
        {
            title: 'Crucible',
            note: 'An agentic model-improvement platform: fine-tuning, evals, and an agent that runs the whole loop.',
        },
    ],
};

export const askSuggestions = [
    'What is he building right now?',
    'Why should I hire him?',
    'What music does he listen to?',
];
