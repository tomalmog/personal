import ThemeToggle from './ThemeToggle';

export default function Home() {
    return (
        <main>
            <ThemeToggle />

            <h1>Tom Almog</h1>
            <p className="lede">CS @ Waterloo. I build ML systems that ship.</p>

            <ul>
                <li><a href="mailto:talmog@uwaterloo.ca">talmog@uwaterloo.ca</a></li>
                <li><a href="https://github.com/tomalmog">github.com/tomalmog</a></li>
                <li><a href="https://linkedin.com/in/tomalmog">linkedin.com/in/tomalmog</a></li>
                <li><a href="/resume.pdf">resume</a></li>
            </ul>

            <h2>Now</h2>
            <ul>
                <li>Founding engineer at Parkalytics — computer vision turning drone imagery into parking analytics.</li>
                <li><a href="https://github.com/tomalmog/crucible">Crucible</a> — agentic platform for fine-tuning and evaluating LLMs.</li>
            </ul>

            <h2>Before</h2>
            <ul>
                <li><strong>Polymarket</strong> (Apr 2026) — autoencoder flagging anomalous trades for insider-trading review.</li>
                <li><strong>WatStreet</strong> (Dec 2025 – Mar 2026) — transformer time-series models for market making.</li>
                <li><strong>Wat.AI</strong> (Sep – Dec 2025) — retinal lesion segmentation research, with a paper.</li>
                <li><strong>Waterloo Aerial Robotics Group</strong> (May – Aug 2025) — perception models running on real drones at 45 FPS.</li>
            </ul>

            <h2>Things I made</h2>
            <ul>
                <li><a href="https://arxiv.org/abs/2509.13516">An Analysis of Optimizer Choice on Energy Efficiency</a> — first-author paper, 360 experiments. Under review at Sustainable Computing.</li>
                <li><a href="https://huggingface.co/tomalmog/oct-retinal-classifier">Retinal OCT classifier</a> — 99.6% accuracy across 84,000+ scans.</li>
                <li><a href="https://pypi.org/project/carbonaware-ml/">CarbonAware-ML</a> — pauses PyTorch training on live carbon-intensity signals. 2,400+ downloads.</li>
                <li><a href="https://wagerloo.vercel.app/">WagerLoo</a> — prediction market for Waterloo co-op salaries.</li>
                <li><a href="https://github.com/tomalmog/tempo">Tempo</a> — Rust CLI that runs Claude Code overnight.</li>
                <li><a href="https://github.com/tomalmog/CV-CardCounting">Card counter</a> — real-time blackjack card detection, 95%+ accuracy.</li>
            </ul>

            <p><a href="https://www.last.fm/user/TomAlmog">Music I listen to.</a></p>
        </main>
    );
}
