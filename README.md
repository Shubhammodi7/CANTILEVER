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
🛠️ Global Subsystem TrackingApplication SuiteLayerTech StackTarget Cloud PlatformBlog WebsiteFrontend ClientReact.js, Vite, Tailwind CSS, FirebaseVercelBlog WebsiteBackend API EngineNode.js, Express, MongoDB AtlasRenderTask ManagementComplete Suite[Pending System Specification Architecture][To Be Assigned]🔒 Security Gatekeeping (.gitignore Setup)To prevent severe server credential leaks or repository bloat, an absolute catch-all .gitignore has been injected at the root of the workspace. This guarantees local dependencies and cryptographic keys are never committed to cloud versioning systems.Plaintext# Exclude system resolution modules across all nested trees
**/node_modules/

# Restrict environmental cryptographic payloads
**/.env
🚀 Execution & Local Standup GuidesTo build, test, and run an application module locally, navigate from the root into the respective targeted execution directory.Running App Suite 01: Blog Website Backend APIBash# 1. Step into the API directory
cd blog-website/back-end

# 2. Synchronize local package trees
npm install

# 3. Fire up the development execution loop
npm run dev
Running App Suite 01: Blog Website Frontend ClientBash# 1. Step into the client application layer
cd blog-website/front-end/client

# 2. Synchronize local package trees
npm install

# 3. Ignite the local development server hot-reload route
npm run dev
🌐 Production Deployment Mapping StrategiesThis monorepo requires custom Root Directory targeting to ensure deployment nodes compile code smoothly without root build errors.📡 Backend Routing Framework (Render)Linked Subdirectory target: blog-website/back-endRuntime Target: NodeCompilation Command Execution: npm installInitialization Entrypoint Route: node index.js🖥️ Frontend Routing Framework (Vercel)Framework Preset Configuration: ViteLinked Subdirectory target: blog-website/front-end/clientStatic Environment Target Injections: VITE_API_BASE_URL linked securely to the live production Render API link route.
