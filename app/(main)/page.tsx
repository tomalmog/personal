import ThemeToggle from './ThemeToggle';

export default function Home() {
    return (
        <main>
            <ThemeToggle />

            <h1>Tom Almog</h1>
            <p className="lede">cs @ waterloo. building ML systems.</p>

            <ul>
                <li><a href="mailto:talmog@uwaterloo.ca">talmog@uwaterloo.ca</a></li>
                <li><a href="https://github.com/tomalmog">github.com/tomalmog</a></li>
                <li><a href="https://linkedin.com/in/tomalmog">linkedin.com/in/tomalmog</a></li>
                <li><a href="/resume.pdf">resume</a></li>
            </ul>

            <h2>now</h2>
            <ul>
                <li>founding engineer at Parkalytics, where i build computer vision that turns drone imagery into parking analytics.</li>
                <li><a href="https://github.com/tomalmog/crucible">Crucible</a>, an agentic platform for fine-tuning and evaluating LLMs.</li>
            </ul>

            <h2>before</h2>
            <ul>
                <li><strong>Polymarket</strong> (apr 2026). built an autoencoder that flags anomalous trades for insider trading review.</li>
                <li><strong>WatStreet</strong> (dec 2025 to mar 2026). transformer time series models for market making.</li>
                <li><strong>Wat.AI</strong> (sep to dec 2025). retinal lesion segmentation research, with a paper.</li>
                <li><strong>Waterloo Aerial Robotics Group</strong> (may to aug 2025). perception models running on real drones at 45 FPS.</li>
            </ul>

            <h2>things i made</h2>
            <ul>
                <li><a href="https://arxiv.org/abs/2509.13516">an analysis of optimizer choice on energy efficiency</a>, a first author paper with 360 experiments. under review at Sustainable Computing.</li>
                <li><a href="https://huggingface.co/tomalmog/oct-retinal-classifier">retinal OCT classifier</a> with 99.6% accuracy across 84,000+ scans.</li>
                <li><a href="https://pypi.org/project/carbonaware-ml/">CarbonAware-ML</a>, which pauses PyTorch training on live carbon intensity signals. 2,400+ downloads.</li>
                <li><a href="https://wagerloo.vercel.app/">WagerLoo</a>, a prediction market for waterloo co-op salaries.</li>
                <li><a href="https://github.com/tomalmog/tempo">Tempo</a>, a rust CLI that runs Claude Code overnight.</li>
                <li><a href="https://github.com/tomalmog/CV-CardCounting">card counter</a> that detects blackjack cards in real time at 95%+ accuracy.</li>
            </ul>

            <p><a href="https://www.last.fm/user/TomAlmog">music i listen to.</a></p>
        </main>
    );
}
