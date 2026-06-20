# CANTILEVER Monorepo Hub 🚀

**🌍 Live Demo:** [Cantilever Blog Platform](https://cantilever-s-blog.vercel.app/)

Welcome to the **CANTILEVER** project repository. This is an enterprise-grade monorepo containing decoupled, highly scalable application suites engineered during the software engineering internship program.

This single repository architecture utilizes a structural pattern designed to handle isolated, parallel micro-frontend and decoupled backend services under one unified code tracking platform.

---

## 📂 Core Monorepo Architecture

```text
CANTILEVER/
│
├── .gitignore                   # Monorepo-wide safety filters (guards node_modules and env keys)
├── README.md                    # Root manifest index (This document)
│
├── blog-website/                # App Suite 01: Dev Publishing Network
│   ├── back-end/                # Node.js + Express REST API (Deployed on Render)
│   └── front-end/               
│       └── client/              # React + Vite Client Engine (Deployed on Vercel)
│
└── task-management/             # App Suite 02: Operational Tracking Telemetry (Upcoming module)
end Routing Framework (Vercel)Framework Preset Configuration: ViteLinked Subdirectory target: blog-website/front-end/clientStatic Environment Target Injections: VITE_API_BASE_URL linked securely to the live production Render API link route.
