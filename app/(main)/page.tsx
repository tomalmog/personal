import ThemeToggle from './ThemeToggle';
import Music from './Music';

export default function Home() {
    return (
        <main>
            <ThemeToggle />

            <h1>Tom Almog</h1>
            <p className="lede">cs @ waterloo. building ML systems.</p>

            <ul>
                <li><a href="https://github.com/tomalmog">github.com/tomalmog</a></li>
                <li><a href="https://linkedin.com/in/tomalmog">linkedin.com/in/tomalmog</a></li>
            </ul>

            <h2>now</h2>
            <ul>
                <li>founding engineer at <strong>Parkalytics</strong>. building models and systems for drone data collection</li>
                <li>building <strong>Peira</strong>. RL environments for physics and engineering</li>
            </ul>

            <h2>before</h2>
            <ul>
                <li><strong>Polymarket</strong> (apr 2026) - autoencoder flagging anomalous trades for insider trading review.</li>
                <li><strong>WatStreet</strong> (dec 2025 to mar 2026) - transformer time series models for market making.</li>
                <li><strong>Wat.AI</strong> (sep to dec 2025) - conducted research on retinal lesion segmentation, built the best model for diabetic retinopathy detection</li>
                <li><strong>Waterloo Aerial Robotics Group</strong> (may to aug 2025) - perception models running on real drones at 45 FPS.</li>
            </ul>

            <h2>things i made</h2>
            <ul>
                <li><a href="https://github.com/tomalmog/crucible">Crucible</a> - agentic platform for fine-tuning and evaluating LLMs.</li>
                <li><a href="https://github.com/tomalmog/tempo">Tempo</a> - rust CLI that runs Claude Code overnight. 9,000+ downloads.</li>
                <li><a href="https://pypi.org/project/carbonaware-ml/">CarbonAware-ML</a> - pauses PyTorch training on live carbon intensity signals. 2,400+ downloads.</li>
                <li><a href="https://arxiv.org/abs/2509.13516">an analysis of optimizer choice on energy efficiency</a> - first author paper, under review at Sustainable Computing.</li>
                <li><a href="https://wagerloo.vercel.app/">WagerLoo</a> - prediction market for waterloo co-op salaries. 80+ student sign ups.</li>
            </ul>

            <h2>hackathons</h2>
            <ul>
                <li>1st @ NexHacks, polymarket track</li>
                <li>1st @ LAHacks, fetch.ai track</li>
                <li>1st @ HackBrown, fetch.ai track</li>
            </ul>

            <Music />

            <p className="outro">want to reach out? email me here <a href="mailto:talmog@uwaterloo.ca">talmog@uwaterloo.ca</a></p>
        </main>
    );
}
