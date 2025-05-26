import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { FaGithub, FaGlobe, FaExternalLinkAlt } from "react-icons/fa";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const experienceRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xcc3333, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff5555, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.01,
      color: 0x8a2be2,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    // Create a torus knot (representing blockchain complexity)
    // const torusGeometry = new THREE.TorusKnotGeometry(5, 1, 200, 32);
    // const torusMaterial = new THREE.MeshPhongMaterial({
    //   color: 0x000000,
    //   emissive: 0x300046,
    //   specular: 0xffffff,
    //   shininess: 50,
    //   wireframe: true,
    //   transparent: true,
    //   opacity: 0.6,
    // });

    // const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
    // torusMesh.position.set(-3, 1, -2);
    // scene.add(torusMesh);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // gsap.to(torusMesh.rotation, {
    //   y: Math.PI * 2,
    //   x: Math.PI * 2,
    //   duration: 15,
    //   repeat: -1,
    //   ease: "none",
    // });

    // Animation for section transitions
    const menuItems = document.querySelectorAll(".nav-item");
    menuItems.forEach((item) => {
      item.addEventListener("click", () => {
        const target = item.getAttribute("data-target");
        setActiveSection(target);

        // Scroll to section
        if (target === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const targetElement = document.getElementById(target);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        }

        // Animation effect
        if (target === "experience") {
          gsap.fromTo(
            ".experience-item",
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.2,
              duration: 0.8,
              ease: "power2.out",
            }
          );
        } else if (target === "skills") {
          gsap.fromTo(
            ".skill-item",
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              stagger: 0.1,
              duration: 0.5,
              ease: "back.out(1.7)",
            }
          );
        }
      });
    });

    // GSAP animations for scroll
    gsap.fromTo(
      ".header-content h1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );

    gsap.fromTo(
      ".header-content p",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" }
    );

    gsap.fromTo(
      ".cta-button",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: "power2.out" }
    );

    // Scroll triggers for sections
    ScrollTrigger.create({
      trigger: "#experience",
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(
          ".experience-item",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: "power2.out" }
        );
        setActiveSection("experience");
      },
    });

    ScrollTrigger.create({
      trigger: "#skills",
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(
          ".skill-item",
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            stagger: 0.1,
            duration: 0.5,
            ease: "back.out(1.7)",
          }
        );
        setActiveSection("skills");
      },
    });

    ScrollTrigger.create({
      trigger: "#contact",
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(
          ".contact-container",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        );
        setActiveSection("contact");
      },
    });

    // Mouse move effect for particles
    const onMouseMove = (event) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      gsap.to(particlesMesh.rotation, {
        x: mouseY * 0.1,
        y: mouseX * 0.1,
        duration: 0.5,
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.x += 0.0003;
      particlesMesh.rotation.y += 0.0003;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);

      // Dispose resources
      scene.remove(particlesMesh);
      // scene.remove(torusMesh);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      // torusGeometry.dispose();
      // torusMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="portfolio" ref={containerRef}>
      <canvas ref={canvasRef} className="webgl-canvas"></canvas>

      <nav className="navbar">
        <p className="logo">Abubakar</p>
        <div className="nav-links">
          <div
            className={`nav-item ${activeSection === "home" ? "active" : ""}`}
            data-target="home"
          >
            Home
          </div>
          <div
            className={`nav-item ${
              activeSection === "experience" ? "active" : ""
            }`}
            data-target="experience"
          >
            Experience
          </div>
          <div
            className={`nav-item ${activeSection === "skills" ? "active" : ""}`}
            data-target="skills"
          >
            Skills
          </div>
          <div
            className={`nav-item ${
              activeSection === "projects" ? "active" : ""
            }`}
            data-target="projects"
          >
            Projects
          </div>
          <div
            className={`nav-item ${
              activeSection === "contact" ? "active" : ""
            }`}
            data-target="contact"
          >
            Contact
          </div>
        </div>
      </nav>

      <header className="header">
        <div className="header-content">
          <h1>Abubakar Ibrahim</h1>
          <p>
            Software Engineer specializing in scalable web applications,
            blockchain solutions, and innovative web3 experiences.
          </p>
          <div className="hero-buttons">
            <button
              className="cta-button"
              onClick={() => {
                const targetElement = document.getElementById("experience");
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              View Portfolio
            </button>
            <button
              className="cta-button"
              onClick={() => {
                const targetElement = document.getElementById("contact");
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Get In Touch
            </button>
          </div>
        </div>
      </header>

      <section id="experience" className="section" ref={experienceRef}>
        <h2>Work Experience</h2>
        <div className="experience-container">
          <div className="experience-item">
            <div className="experience-date">Feb 2023 - Present</div>
            <div className="experience-role">Lead Full-Stack Developer</div>
            <div className="experience-company">Chedda Finance</div>
            <div className="experience-description">
              <ul>
                <li>Developed the Chedda SDK using Node.js and TypeScript</li>
                <li>
                  Led the development of a responsive UI for Chedda Finance
                  lending platform
                </li>
                <li>
                  Designed and implemented smart contracts for leaderboard
                  management
                </li>
                <li>
                  Spearheaded the creation and deployment of an automated
                  liquidation system.
                </li>
                <li>
                  Enhanced security with wallet SDKs and blockchain libraries
                </li>
              </ul>
            </div>
          </div>

          <div className="experience-item">
            <div className="experience-date">Sep 2022 - Feb 2023</div>
            <div className="experience-role">Full-stack Mobile Developer</div>
            <div className="experience-company">Gistoneer Limited</div>
            <div className="experience-description">
              <ul>
                <li>Built responsive mobile applications using React Native</li>
                <li>Integrated REST APIs and optimized data flows</li>
                <li>Created pixel-perfect, user-centric features</li>
                <li>Developed reusable React Native components</li>
                <li>Implemented push notifications and real-time updates</li>
              </ul>
            </div>
          </div>

          <div className="experience-item">
            <div className="experience-date">Jun 2021 - Feb 2023</div>
            <div className="experience-role">Software Engineer</div>
            <div className="experience-company">Lexington Technologies</div>
            <div className="experience-description">
              <ul>
                <li>Led development of new product features</li>
                <li>Implemented CI/CD pipelines for frequent releases</li>
                <li>Designed scalable backend services using Node.js</li>
                <li>
                  Built and optimized database schemas for PostgreSQL and
                  MongoDB
                </li>
                <li>Developed a real-time chat system using WebSockets</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="section" ref={skillsRef}>
        <h2>Technical Skills</h2>
        <div className="skills-container">
          <div className="skills-group">
            <h3>Web Technologies</h3>
            <div className="skills-grid">
              <div className="skill-item">React</div>
              <div className="skill-item">TypeScript</div>
              <div className="skill-item">Next.js</div>
              <div className="skill-item">Angular</div>
              <div className="skill-item">Redux</div>
              <div className="skill-item">Node.js</div>
              <div className="skill-item">MySQL</div>
              <div className="skill-item">PostgreSQL</div>
              <div className="skill-item">MongoDB</div>
              <div className="skill-item">Tailwind CSS</div>
              <div className="skill-item">Material-UI</div>
            </div>
          </div>

          <div className="skills-group">
            <h3>Blockchain & Web3</h3>
            <div className="skills-grid">
              <div className="skill-item">Solidity</div>
              <div className="skill-item">Foundry</div>
              <div className="skill-item">Hardhat</div>
              <div className="skill-item">RainbowKit</div>
              <div className="skill-item">Ethers.js</div>
              <div className="skill-item">Web3.js</div>
              <div className="skill-item">WalletConnect</div>
              <div className="skill-item">Wagmi</div>
              <div className="skill-item">Viem</div>
            </div>
          </div>

          <div className="skills-group">
            <h3>Tools & Platforms</h3>
            <div className="skills-grid">
              <div className="skill-item">Docker</div>
              <div className="skill-item">Git</div>
              <div className="skill-item">AWS</div>
              <div className="skill-item">Vercel</div>
              <div className="skill-item">Terraform</div>
              <div className="skill-item">Kubernetes</div>
              <div className="skill-item">Jest</div>
              <div className="skill-item">Cypress</div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="section" ref={skillsRef}>
        <h2>Projects</h2>
        <div className="projects-container">
          <div className="project-item">
            <img src="/images/chedda-img.webp" alt="Chedda Finance" />
            <div className="project-details">
              <h3>Chedda Finance</h3>
              <p>
                Decentralized lending protocol for memes, ai, stables and all
                tokens.
              </p>
              <a
                href="https://chedda.finance"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project
                <FaExternalLinkAlt
                  style={{
                    marginLeft: "5px",
                    width: "10px",
                    paddingTop: "5px",
                  }}
                />
              </a>
            </div>
          </div>

          <div className="project-item">
            <img src="/images/zerosoft-img.webp" alt="Zerosoft" />
            <div className="project-details">
              <h3>Zerosoft</h3>
              <p>
                A consultancy website offering cloud audits, migrations, and
                DevOps solutions.
              </p>
              <a
                href="https://zerosoft.ng"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project
                <FaExternalLinkAlt
                  style={{
                    marginLeft: "5px",
                    width: "10px",
                    paddingTop: "5px",
                  }}
                />
              </a>
            </div>
          </div>

          <div className="project-item">
            <img src="/images/boskify-img.png" alt="Boskify" />
            <div className="project-details">
              <h3>Boskify</h3>
              <p>
                An automated peer-to-peer (P2P) trading platform designed for
                merchants
              </p>
              <a
                href="https://boskify.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project
                <FaExternalLinkAlt
                  style={{
                    marginLeft: "5px",
                    width: "10px",
                    paddingTop: "5px",
                  }}
                />
              </a>
            </div>
          </div>
        </div>
        <div className="projects-container">
          <div className="project-item">
            <img src="/images/apexplast-img.webp" alt="Project 2" />
            <div className="project-details">
              <h3>Apex Plastics</h3>
              <p>
                A marketplace connecting buyers and sellers of various plastic
                materials
              </p>
              <a
                href="https://apexplast.shop"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project
                <FaExternalLinkAlt
                  style={{
                    marginLeft: "5px",
                    width: "10px",
                    paddingTop: "5px",
                  }}
                />
              </a>
            </div>
          </div>

          <div className="project-item">
            <img src="/images/roadrunner-img.webp" alt="Chedda Finance" />
            <div className="project-details">
              <h3>Roadrunner</h3>
              <p>Logistics platform for transporting goods and services.</p>
              <a
                href="https://roadrunnerapp.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project
                <FaExternalLinkAlt
                  style={{
                    marginLeft: "5px",
                    width: "10px",
                    paddingTop: "5px",
                  }}
                />
              </a>
            </div>
          </div>

          <div className="project-item">
            <img src="/images/netporch-img.webp" alt="Project 2" />
            <div className="project-details">
              <h3>Netporch</h3>
              <p>An ecommerce website for smart watches.</p>
              <a
                href="https://netporch.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Project
                <FaExternalLinkAlt
                  style={{
                    marginLeft: "5px",
                    width: "10px",
                    paddingTop: "5px",
                  }}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section" ref={contactRef}>
        <h2>Get In Touch</h2>
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <MdEmail />
              <span>abubakar.ibrahim.work@gmail.com</span>
            </div>
            <div className="contact-item">
              <MdLocationOn />
              <span>Lagos, Nigeria</span>
            </div>
            <div className="contact-item">
              <FaGithub />
              <span>github.com/abubakvr</span>
            </div>
            <div className="contact-item">
              <FaGlobe />
              <span>abubakar.life</span>
            </div>
          </div>

          <div className="contact-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Your Email"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Your Message"
                className="form-control"
              ></textarea>
            </div>
            <button className="submit-button">Send Message</button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Abubakar Ibrahim. All Rights Reserved.</p>
          <div className="social-links">
            <a
              href="https://github.com/abubakvr"
              target="_blank"
              className="social-link"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/abubakaribrahim1710/"
              target="_blank"
              className="social-link"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/abubakvr"
              target="_blank"
              className="social-link"
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
