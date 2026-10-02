import Link from 'next/link';
import Charm from './charm';
import { Navigation, CopyEmail } from './ui';

const projects = [
  {
    id: 'total-recall', number: '01', title: 'Total Recall', category: 'VOICE & SEMANTIC SEARCH',
    description: 'A personal memory assistant for the things you don’t want to forget.',
    problem: 'Remembering where you left something should be as easy as asking a question.',
    implementation: 'Voice input is transcribed, converted into embeddings, and stored in PostgreSQL. A separate recall flow searches for related memories and returns a spoken response.',
    note: 'The project separates recording from retrieval. Sentence embeddings let the recall flow look for meaning rather than an exact keyword match.',
    stack: ['Python', 'PostgreSQL', 'pgvector', 'SentenceTransformers'],
    source: 'https://github.com/akshaycg46/Total-Recall',
    files: 'main.py → genemb.py / recall.py → p2.py',
  },
  {
    id: 'gradfinance', number: '02', title: 'GradFinance', category: 'FRONTEND & FINANCIAL TOOLS',
    description: 'A budgeting and goal-tracking application for new graduates.',
    problem: 'A first salary comes with decisions about expenses, savings, and debt. GradFinance brings those decisions into one interface.',
    implementation: 'The browser-based application includes budget allocation, financial goals, savings progress, and an investment projection calculator. Local browser storage preserves the user’s data.',
    note: 'Built for the SASE Hackathon. The browser-only approach keeps the prototype easy to run, with no backend service required.',
    stack: ['JavaScript', 'HTML', 'CSS', 'Local storage'],
    source: 'https://github.com/akshaycg46/FinanceWebAppFinal',
    files: 'grad-finance-enhanced.html / budget-update.js',
  },
  {
    id: 'mars', number: '03', title: 'Mars / Jigyasa', category: 'JAVA & API INTEGRATION',
    description: 'An application for exploring images from NASA’s Curiosity rover.',
    problem: 'A date is the starting point for exploring what the rover photographed on Mars.',
    implementation: 'A Java servlet accepts a selected date, requests photos from NASA’s Mars Rover API, and passes the JSON response to a JSP view. MySQL supports account data through a DAO layer.',
    note: 'The project connects a server-rendered interface, an external REST API, and a relational database. The source also includes tests for the user model, DAO, and login servlet.',
    stack: ['Java', 'Servlets / JSP', 'MySQL', 'REST APIs'],
    source: 'https://github.com/akshaycg46/Mars',
    files: 'FetchDataServlet.java / UserDAO.java / marslanding.jsp',
  },
];

function ProjectVisual({ id }: { id: string }) {
  if (id === 'total-recall') return <div className="project-visual recall-visual" aria-label="Total Recall workflow: voice input, embedding storage, semantic retrieval">
    <div className="visual-top"><span>MEMORY / RETRIEVAL</span><span className="visual-symbol">↗</span></div>
    <div className="waveform" aria-hidden="true">{[12,24,18,40,60,36,76,52,84,40,67,30,50,24,12,32,54,28,44,16,25,12].map((v,i)=><i key={i} style={{height:v}} />)}</div>
    <div className="memory-example"><small>RECORD</small><p>“My keys are in the hallway drawer.”</p></div>
    <div className="memory-flow"><span>Voice</span><b>→</b><span>Embeddings</span><b>→</b><span>Recall</span></div>
    <div className="visual-bottom">PYTHON <span>POSTGRESQL + PGVECTOR</span></div>
  </div>;
  if (id === 'gradfinance') return <div className="project-visual finance-visual" aria-label="GradFinance architecture: budget allocation, savings goals and browser storage">
    <div className="visual-top"><span>GRADFINANCE / FEATURE MAP</span><span className="visual-symbol">↗</span></div>
    <div className="finance-graphic"><span className="finance-ring" aria-hidden="true"/><div><small>A FIRST SALARY.<br/>A FINANCIAL PLAN.</small><h4>Budget.<br/>Save.<br/>Plan.</h4></div></div>
    <div className="finance-categories"><span>Budget allocation</span><span>Savings goals</span><span>Projections</span></div>
    <div className="visual-bottom">BROWSER APPLICATION <span>LOCAL STORAGE</span></div>
  </div>;
  return <div className="project-visual mars-visual" aria-label="Mars application: select date, query NASA API, display rover photos">
    <div className="visual-top"><span>CURIOSITY / DATA EXPLORER</span><span className="visual-symbol">↗</span></div>
    <div className="mars-planet" aria-hidden="true"><span/><i/><b/></div>
    <div className="mars-label">A different view<br/>of another world.</div>
    <div className="memory-flow"><span>Date</span><b>→</b><span>NASA API</span><b>→</b><span>Photos</span></div>
    <div className="visual-bottom">JAVA SERVLETS <span>JSP + MYSQL</span></div>
  </div>;
}

export default function Home() {
  return <>
    <Navigation />
    <main id="main">
      <section className="hero" aria-labelledby="intro-title">
        <div className="hero-copy"><p className="overline"><span/> COMPUTER SCIENCE · UNIVERSITY OF CENTRAL FLORIDA</p><h1 id="intro-title">Akshay<br/><span>Gupta</span><i>.</i></h1><p className="hero-role">Software development, with a human perspective.</p><p className="hero-description">I build projects around everyday problems — from remembering where you left your keys to making financial planning easier.</p><div className="hero-actions"><a className="button primary" href="#work">Explore my work <span>↓</span></a><Link className="button quiet" href="/resume">View résumé <span>↗</span></Link></div><div className="hero-meta"><span>BASED IN ORLANDO, FL</span><a href="https://github.com/akshaycg46" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="https://www.linkedin.com/in/akshay-gupta-2aa3942b2" target="_blank" rel="noreferrer">LINKEDIN ↗</a></div></div>
        <div className="hero-image"><img src="/ahri-hero.webp" alt="Spirit Blossom-inspired Ahri portrait with luminous lavender tails" fetchPriority="high"/><div className="image-gradient"/><div className="image-caption"><span>PERSONAL INSPIRATION</span><span>AHRI / SPIRIT BLOSSOM</span></div><span className="image-corner" aria-hidden="true">AG / 01</span></div>
      </section>
      <section id="work" className="work section">
        <div className="section-intro"><div><p className="overline">01 / SELECTED WORK</p><h2>Ideas, implemented.</h2></div><p>Three projects across AI, web development,<br className="desktop"/> and data-backed applications.</p></div>
        {projects.map(project=><article className="project" key={project.id} id={project.id}>
          <ProjectVisual id={project.id}/>
          <div className="project-content"><div className="project-heading"><span className="project-number">{project.number}</span><p className="overline">{project.category}</p></div><h3>{project.title}</h3><p className="project-description">{project.description}</p><div className="tags">{project.stack.map(t=><span key={t}>{t}</span>)}</div><p className="project-summary">{project.implementation}</p><div className="project-links"><a href={project.source} target="_blank" rel="noreferrer">Explore source code <span>↗</span></a></div><details className="project-details"><summary>Project notes <span>+</span></summary><div><h4>The problem</h4><p>{project.problem}</p><h4>Implementation choices</h4><p>{project.note}</p><h4>Start in the code</h4><code>{project.files}</code></div></details></div>
        </article>)}
        <a className="all-work" href="https://github.com/akshaycg46" target="_blank" rel="noreferrer">More on GitHub <span>↗</span></a>
      </section>
      <section id="about" className="about section"><div className="section-intro"><div><p className="overline">02 / BACKGROUND</p><h2>A practical approach<br/>to learning.</h2></div></div><div className="about-grid"><div className="about-copy"><p className="lead">I’m a Computer Science student at the University of Central Florida, interested in software that makes information easier to use.</p><p>My projects have taken me from voice recognition and semantic search to browser interfaces and Java backend development. I like working through the whole path: what a user needs, how data moves, and what the interface should make clear.</p><p>Outside of code, I enjoy League of Legends. Ahri’s visual world inspired the palette and artwork here — a personal detail in a portfolio about my work.</p><Link className="inline-link" href="/resume">View my résumé <span>↗</span></Link></div><div className="education"><span className="education-mark" aria-hidden="true">UCF</span><p className="overline">EDUCATION</p><h3>University of<br/>Central Florida</h3><p>Computer Science</p><div className="education-bottom"><span>Orlando, Florida</span><span>UNDERGRADUATE</span></div></div></div></section>
      <section id="skills" className="skills section"><div className="section-intro"><div><p className="overline">03 / TECHNICAL TOOLKIT</p><h2>Tools behind the work.</h2></div><p>Technologies used in the projects above.<br className="desktop"/> Each skill has a place in the source.</p></div><div className="skills-grid"><div><span className="skill-index">01</span><h3>Languages & interfaces</h3><p>Python · Java · JavaScript<br/>HTML · CSS · SQL</p><a href="#gradfinance">See GradFinance <span>↗</span></a></div><div><span className="skill-index">02</span><h3>AI & retrieval</h3><p>Speech recognition · Embeddings<br/>SentenceTransformers · pgvector</p><a href="#total-recall">See Total Recall <span>↗</span></a></div><div><span className="skill-index">03</span><h3>Backend & data</h3><p>PostgreSQL · MySQL · REST APIs<br/>Java Servlets · JSP · JDBC</p><a href="#mars">See Mars / Jigyasa <span>↗</span></a></div></div></section>
      <Charm />
      <section id="contact" className="contact section"><div className="contact-heading"><p className="overline">04 / CONTACT</p><h2>Have a role or project<br/>in mind?</h2><p>I’d welcome a conversation about software development<br className="desktop"/> internships and opportunities to collaborate.</p></div><div className="contact-links"><a className="email-link" href="mailto:akshay.c.gupta@icloud.com">akshay.c.gupta@icloud.com <span>↗</span></a><CopyEmail/><div className="social-links"><a href="https://www.linkedin.com/in/akshay-gupta-2aa3942b2" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/akshaycg46" target="_blank" rel="noreferrer">GitHub ↗</a><Link href="/resume">Résumé ↗</Link></div></div></section>
    </main><footer><a href="#main" className="wordmark">AKSHAY GUPTA<span>© {new Date().getFullYear()}</span></a><p>Computer Science · UCF</p><a href="#main">Back to top ↑</a></footer><p className="art-credit">Ahri-inspired artwork. League of Legends and Ahri are owned by Riot Games.</p>
  </>;
}
