// js/data.js
const portfolioData = {
  experiences: [
    {
      role: "Research Intern",
      company: "Space Application Center, ISRO",
      date: "Jan - May 2026",
      description: "Investigated and published the application of continuous-control Reinforcement Learning algorithms to maintain unstable Halo orbits around the L2 Lagrange point of the Sun-Earth system to minimize fuel cost and compute requirements for staion-keeping."
    }
  ],

  projects: [
    { 
      id: "project-1", 
      title: "CodeGraph",
      coverImage: "images/CodeGraph_Screenshot_3.png",
      description: [
        "CodeGraph is a graph-augmented code intelligence tool designed to make unfamiliar codebases easier to understand. It combines AST-based structural analysis with semantic search and LLM-powered RAG, allowing you to find symbols, explore callers and callees, trace execution paths, analyze potential impact, and ask natural-language questions about a repository.",
        "It supports configurable embedding models and LLM providers, including local models, with locally cached embeddings for offline-friendly use. Incremental indexing keeps the graph up to date by processing only changed files, while CodeGraph Studio provides an interactive interface for exploring the resulting code graph.",
        "Tech Stack: Python, FastAPI, SQLite, HuggingFace SentenceTransformers, Vis.js"
      ],
      github: "https://github.com/kavan0610/CodeGraph",
      // live: "https://kavan0610.github.io",
      screenshots: [
        "images/CodeGraph_Screenshot_1.png",
        "images/CodeGraph_Screenshot_2.png",
        "images/CodeGraph_Screenshot_3.png",
        "images/CodeGraph_Screenshot_4.png"
      ]
    },
    { 
      id: "project-2", 
      title: "CloudStream",
      coverImage: "images/CloudStream_Screenshot_1.png",
      description: [
        "A Progressive Web App (PWA) that bridges the gap between raw cloud storage and a premium music streaming experience. While Google Drive is excellent for hosting media, it lacks the intuitive UI, playlist capabilities, and library management of a dedicated streaming platform. CloudStream solves this by acting as a feature-rich interface layered over your personal Drive. By treating a single Drive folder as the definitive source of truth, users can effortlessly manage their entire collection and update the application via one-click synchronization. Under the hood, a custom audio engine delivers a native-like listening experience, automatically caching favorite tracks to persistent local storage for seamless, offline playback.",
        "Tech Stack: React, Node.js, Express.js, Prisma ORM, PostgreSQL, Google Drive & Picker APIs"
      ],
      github: "https://github.com/kavan0610/CloudStream",
      live: "https://cloudstream-kavan.vercel.app",
      screenshots: [
        "images/CloudStream_Screenshot_1.png",
        "images/CloudStream_Screenshot_2.png",
        "images/CloudStream_Screenshot_3.png",
        "images/CloudStream_Screenshot_4.png"
      ]
    },
    { 
      id: "project-3", 
      title: "RL-Based Station Keeping",
      coverImage: "images/StationKeeping_Screenshot_1.png",
      description: [
        "A full-stack, containerized machine learning application that deploys a reinforcement learning (RL) agent for autonomous orbital station-keeping. Maintaining a spacecraft in a chaotic, highly unstable Halo orbit traditionally relies on rigid, computationally intensive maneuver schedules. This project shifts to a closed-loop control strategy, utilizing a neural network policy that processes a 21-dimensional state space to output real-time corrective thrusts. The agent operates within a simulated Circular Restricted Three-Body Problem (CR3BP) environment, streaming live telemetry to a custom, interactive 3D web interface.",
        "Tech Stack: React, Three.js, FastAPI, PyTorch, Python (Gymnasium), Docker."
      ],
      github: "https://github.com/kavan0610/Autonomous-Station-Keeping-Using-RL",
      live: "https://autonomous-station-keeping-using-rl.vercel.app/",
      screenshots: [
        "images/StationKeeping_Screenshot_2.png",
        "images/StationKeeping_Screenshot_3.png"
      ]
    },
    { 
      id: "project-4", 
      title: "Paper Parser",
      coverImage: "images/PaperParser_Screenshot_1.png",
      description: [
        "PaperParser is a full-stack application that transforms dense PDFs, such as research papers, into beautifully structured PowerPoint presentations. By leveraging Google's Gemini AI alongside highly optimized libraries for high-speed PDF text extraction, the app intelligently summarizes and formats content into user-selected design templates.",
        "Tech Stack: Python, FastAPI, JavaScript, Tailwind, Docker"
      ],
      github: "https://github.com/kavan0610/PaperParser",
      live: "https://paperparser-kavan.vercel.app",
      screenshots: [
        "images/PaperParser_Screenshot_1.png"
      ]
    }
  ]
};