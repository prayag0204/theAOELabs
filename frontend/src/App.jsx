
import { useEffect, useState } from "react";
import { fetchHealth } from "./api/healthApi";
import ContactForm from "./features/contact/ContactForm";
import brandLogo from "../public/images/theaoe-logo-lockup.png";

const capabilities = [
  {
    number: "01",
    category: "TRANSFORM",
    title: "Custom Software Engineering",
    description:
      "Purpose-built digital products and applications designed around your business needs, users, and goals.",
    tags: ["Web applications", "Modernization", "System integration"],
    symbol: "⌘",
  },
  {
    number: "02",
    category: "AUTOMATE",
    title: "Intelligent Automation",
    description:
      "Connect systems, eliminate repetitive work, and streamline operations with thoughtful automation.",
    tags: ["Workflow automation", "Process improvement", "AI-powered workflows"],
    symbol: "⟳",
  },
  {
    number: "03",
    category: "SCALE",
    title: "AI & Business Intelligence",
    description:
      "Turn business data into actionable insights and build technology that evolves as your business grows.",
    tags: ["AI solutions", "Business analytics", "Scalable architecture"],
    symbol: "↗",
  },
];

export default function App() {
  const [health, setHealth] = useState(null);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    let active = true;

    fetchHealth()
      .then((data) => {
        if (active) {
          setHealth(data);
          setApiError(false);
        }
      })
      .catch(() => {
        if (active) {
          setApiError(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main>
      {/* Header */}
      <header className="navbar">
        <a className="brand" href="#home" aria-label="theAOE Labs home">
          <img
            className="brand-logo"
            src={brandLogo}
            alt="theAOE Labs — Transform. Automate. Scale Beyond Limits."
          />
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#brand-story">Our story</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#approach">Our approach</a>
          <a className="nav-contact" href="mailto:hello@theaoelabs.com">
            Let's talk <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero section-shell" id="home">
        <div className="hero-content">
          <p className="eyebrow">
            <span className="status-dot" />
            SOFTWARE · AUTOMATION · AI
          </p>

          <h1>
            Business has
            <br />
            no fixed limits.
            <br />
            <span className="gradient-text">
              Neither should you.
            </span>
          </h1>

          <p className="hero-copy">
            We turn business challenges into digital opportunities through
            custom software engineering, intelligent automation, and
            scalable technology.
          </p>

          <div className="hero-actions">
            <a className="button-primary" href="mailto:hello@theaoelabs.com">
              Let's build something <span aria-hidden="true">↗</span>
            </a>

            <a className="button-secondary" href="#brand-story">
              Discover our story <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="hero-proof">
            <span className="proof-line" />
            <span>ENGINEERED FOR WHAT'S NEXT</span>
          </div>
        </div>

        {/* Brand-inspired visual */}
        <div className="hero-art" aria-hidden="true">
          <div className="art-grid" />
          <div className="art-glow" />

          <div className="art-orbit art-orbit-one" />
          <div className="art-orbit art-orbit-two" />
          <div className="art-orbit art-orbit-three" />

          <div className="art-cross cross-one">+</div>
          <div className="art-cross cross-two">+</div>
          <div className="art-cross cross-three">+</div>

          <div className="art-core">
            <div className="core-inner">
              <span className="core-bracket">{"{"}</span>
              <span className="core-letters">AOE</span>
              <span className="core-bracket">{"}"}</span>
            </div>
            <span className="core-caption">BEYOND THE ORDINARY</span>
          </div>

          <div className="art-node node-one" />
          <div className="art-node node-two" />
          <div className="art-node node-three" />
          <div className="overflow-square" />

          <span className="art-label art-label-top">SYSTEMS / 001</span>
          <span className="art-label art-label-bottom">
            BOUNDARIES ARE OPTIONAL.
          </span>
        </div>
      </section>

      {/* Brand Story */}
      <section className="brand-story section-shell" id="brand-story">
        <div className="story-heading">
          <p className="eyebrow">THE THINKING BEHIND THE BRAND</p>

          <h2>
            We believe business should never be limited by{" "}
            <span className="gradient-text">
              conventional boundaries.
            </span>
          </h2>
        </div>

        <div className="story-content">
          <p>
            In software engineering, an Arithmetic Overflow Exception
            occurs when a calculation exceeds its defined limits. At{" "}
            <strong className="story-brand">theAOE Labs</strong>, we bring
            this concept to business—challenging conventional boundaries
            to unlock new possibilities for growth.
          </p>

          <p>
            We partner with businesses to{" "}
            <strong className="story-purple">transform</strong> the way
            they operate,{" "}
            <strong className="story-blue">automate</strong> what holds
            them back, and{" "}
            <strong className="story-cyan">
              scale beyond traditional limits.
            </strong>
          </p>

          <p>
            By combining strategic business transformation, intelligent
            software solutions, and AI-powered automation with continuous
            feedback loops, we help organizations modernize legacy
            processes, improve operational efficiency, and build systems
            that evolve with their ambitions.
          </p>

          <div className="story-mission">
            <span className="mission-label">OUR MISSION</span>
            <p>
              Transform. <span className="story-blue">Automate.</span>{" "}
              <span className="story-cyan">
                Scale Beyond Limits.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="capabilities section-shell" id="capabilities">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHAT WE DO</p>

            <h2>
              Technology that moves
              <br />
              <span className="gradient-text">business forward.</span>
            </h2>
          </div>

          <p className="section-intro">
            From solving today's operational challenges to building
            tomorrow's opportunities, we make technology work for your
            business.
          </p>
        </div>

        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article
              className="capability-card"
              key={capability.number}
            >
              <div className="card-topline">
                <span className="card-number">
                  {capability.number}
                </span>
                <span className="card-category">
                  {capability.category}
                </span>
              </div>

              <div className="card-symbol" aria-hidden="true">
                {capability.symbol}
              </div>

              <h3>{capability.title}</h3>
              <p>{capability.description}</p>

              <div className="tag-list">
                {capability.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <a
                className="card-link"
                href="mailto:hello@theaoelabs.com"
                aria-label={`Discuss ${capability.title}`}
              >
                Discuss your needs <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Our Approach */}
      <section className="approach section-shell" id="approach">
        <div className="approach-panel">
          <div className="approach-copy">
            <p className="eyebrow">A BETTER WAY FORWARD</p>

            <h2>
              Less complexity.
              <br />
              <span className="gradient-text">
                More possibility.
              </span>
            </h2>

            <p>
              Great technology starts with understanding the problem.
              We focus on practical solutions, thoughtful engineering,
              and measurable business value—not complexity for its own
              sake.
            </p>

            <a
              className="button-primary"
              href="mailto:hello@theaoelabs.com"
            >
              Start a conversation <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="approach-steps">
            <div className="approach-step">
              <span className="step-index">01</span>
              <div>
                <h3>Understand</h3>
                <p>
                  Discover the real challenge and define the outcome.
                </p>
              </div>
            </div>

            <div className="approach-step">
              <span className="step-index">02</span>
              <div>
                <h3>Engineer</h3>
                <p>
                  Design and build a solution with purpose.
                </p>
              </div>
            </div>

            <div className="approach-step">
              <span className="step-index">03</span>
              <div>
                <h3>Evolve</h3>
                <p>
                  Improve, automate, and scale with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact section-shell" id="contact">
        <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>

        <h2>
          Have a challenge
          <br />
          <span className="gradient-text">worth solving?</span>
        </h2>

        <p>
          Let's explore what the right technology can make possible
          for your business.
        </p>

        <ContactForm />
      </section>

      {/* Footer */}
      <footer className="footer">
        <a className="footer-brand" href="#home">
          theAOE <span>Labs</span>
        </a>

        <p>Transform. Automate. Scale Beyond Limits.</p>

        <div className="footer-meta">
          <span>© {new Date().getFullYear()} theAOE Labs</span>

          <span
            className={`api-status ${health ? "api-online" : ""}`}
            title={
              apiError
                ? "Spring Boot API is unavailable"
                : health
                  ? "Spring Boot API is connected"
                  : "Checking Spring Boot API"
            }
          >
            <span className="status-dot" />

            {apiError
              ? "API unavailable"
              : health
                ? `API ${health.status}`
                : "Connecting to API"}
          </span>
        </div>
      </footer>
    </main>
  );
}
