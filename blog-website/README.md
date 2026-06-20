***

### 2. The Blog Website README
*Save this as `README.md` inside your `CANTILEVER/blog-website/` folder.*

```markdown
# ✍️ Cantilever Core: Blog Platform

A modern, full-stack publishing platform engineered for developers to share technical architecture paradigms, system patterns, and clean code principles. Built with a decoupled React frontend, a robust Node.js backend, and Firebase integration.

**🌍 Live Demo:** [https://cantilever-s-blog.vercel.app/](https://cantilever-s-blog.vercel.app/)

---

## ✨ System Features

* **Secure Authentication:** Dual-layer security featuring JWT-based session handling, email OTP verification for new sign-ups, and Google OAuth integration via Firebase.
* **Dynamic Content Engine:** Full CRUD (Create, Read, Update, Delete) capabilities for technical articles.
* **Interaction Telemetry:** Real-time "Admire" (like) system with optimistic UI updates.
* **Network Responses:** Integrated commenting module tied to specific user IDs and blog endpoints.
* **Category Filtering:** URL-parameter-based dynamic filtering for seamless content discovery.
* **Notification Matrix:** Scrollable command center tracking inbound interaction metrics.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React.js, Vite, Tailwind CSS, Shadcn UI |
| **State Management** | Redux Toolkit, React Hook Form, Zod |
| **Backend API** | Node.js, Express.js, CORS |
| **Database** | MongoDB Atlas, Mongoose |
| **Security & Auth** | JSON Web Tokens (JWT), Firebase Auth, Nodemailer (OTP), Bcrypt |

---

## 📂 Architecture Structure

```text
blog-website/
│
├── back-end/                # Node.js API Gateway & Database Models
│   ├── controllers/         # Core business logic (Auth, Blogs, Responses, Categories)
│   ├── models/              # Mongoose Schemas (User, Blog, Otp, Notification)
│   ├── routes/              # Express API route definitions
│   └── index.js             # Server initialization entrypoint
│
└── front-end/               
    └── client/              # React Application Layer
        ├── src/
        │   ├── components/  # Reusable UI modules (ConfirmDelete, Navbar)
        │   ├── helpers/     # API fetch hooks, Toast logic, Env routers
        │   └── pages/       # Main views (Index, Signup, BlogDetails)
        ├── vercel.json      # Production SPA routing fallback
        └── vite.config.js   # Bundler configuration
🚀 Local Development Guide
To run this platform on your local machine, initialize both the backend API and the frontend client simultaneously in two separate terminal windows.

1. Initialize the Backend
Bash
cd back-end
npm install
npm run dev
2. Initialize the Frontend
Bash
cd front-end/client
npm install
npm run dev
🔐 Environment Variables Blueprint
Create a .env file in both the back-end and front-end/client directories. Never commit these files to version control.

Backend (back-end/.env)
Code snippet
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_cryptographic_secret_key
EMAIL_USER=your_gmail_address
EMAIL_APP_PASSWORD=your_16_character_google_app_password
CLIENT_URL=[https://cantilever-s-blog.vercel.app](https://cantilever-s-blog.vercel.app)
Frontend (front-end/client/.env)
Code snippet
VITE_API_BASE_URL=your_render_backend_url
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket

🌐 API Endpoint Blueprint
  
Authentication Routes (/api/auth)  

POST /register - Create new user profile  

POST /send-otp - Trigger Nodemailer verification sequence  

POST /login - Authenticate existing credentials  

Blog Execution Routes (/api/blogs)  

GET /get-all - Retrieve global feed

GET /get/:id - Retrieve targeted user workspace

POST /add - Publish new article

DELETE /delete/:id - Erase record (Protected route)

PUT /admires/:id - Toggle interaction telemetry

Category & Notification Routing

GET /api/category/all-category - Fetch taxonomy tags

POST /api/category/add - Append new category parameter

GET /api/notifications/get - Fetch inbound activity metrics
