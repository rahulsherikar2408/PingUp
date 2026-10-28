<div align="center">

# 💬 PingUp

**A modern, full-stack real-time chat and video calling application with macOS-inspired desktop aesthetics.**

[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.3-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)
[![Stream Video](https://img.shields.io/badge/Stream-Video_SDK-005FFF?logo=stream&logoColor=white)](https://getstream.io/video/)
[![ImageKit](https://img.shields.io/badge/ImageKit-Media_CDN-0570DE)](https://imagekit.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📖 Overview

**PingUp** is a feature-rich communication platform designed to offer seamless, real-time 1-on-1 text messaging and HD video calling wrapped in a desktop experience. It integrates authentication, live presence detection, cloud media hosting, WebRTC-based video streaming, and appearance customization (including desktop wallpapers, accent theme presets, and mechanical keystroke sounds).

The application is structured as a client-server architecture with an Express + MongoDB backend and a React (Vite) frontend, also ready to be packaged as a single monolithic Docker container for production deployment.

---

## ✨ Features

### 💬 Real-Time Messaging
- **Instant Chat**: Fast, bi-directional message delivery powered by **Socket.io**.
- **Rich Media Sharing**: Send images and video attachments directly in conversations via **ImageKit** cloud storage and Multer streaming.
- **Smart Conversations**: Aggregate pipeline automatically sorts conversations by the most recent active message.
- **Message Video Player & Image Previews**: Built-in media renderers for smooth inline viewing of photos and videos.

### 📹 Video Calling (WebRTC)
- **1-on-1 HD Video & Audio**: Powered by the **Stream Video SDK** (`@stream-io/video-react-sdk` & `@stream-io/node-sdk`).
- **Real-Time Signaling**: Call initiation, ringing, acceptance, cancellation, and rejection synchronized instantly through Socket.io.
- **Interactive Call Overlays**: Native-feeling incoming call banner, ringtone audio notifications, and call modal controls (mute, camera toggle, screen share, and leave).

### 🟢 Live Presence & Status
- **Online Indicators**: Real-time user connection tracking with dynamic status indicators across the sidebar and conversation header.

### 🎨 Desktop UI & Customization
- **macOS Window Aesthetics**: Modern window framing with frosted glass backdrops, custom borders, and subtle shadow elevations.
- **Dynamic Desktop Wallpapers**: Curated desktop and abstract backgrounds (Sonoma Horizon, Redwoods, Iceland Coast, SF Bay, and more).
- **HeroUI Accent Presets**: Theme palette presets (Default, Sky, Lavender, Mint, Netflix, Uber, Spotify, Coinbase).
- **Light & Dark Mode**: Persistent theme switcher with system contrast adaptation.
- **Keystroke Audio**: Authentic mechanical keyboard sound effects when typing (toggleable in settings).

### 🔐 Authentication & Sync
- **Clerk Authentication**: Social and email-based sign-in/sign-up flows.
- **Clerk Webhooks**: Automatic synchronization of user profiles (`user.created`, `user.updated`, `user.deleted`) to MongoDB via secure SVIX signature verification.
- **Route Protection**: JWT Bearer token verification on all protected backend API routes.

### ⚙️ Production & Reliability
- **Keep-Alive Cron**: Automated 14-minute cron ping to keep free tier hosting instances (e.g. Render) awake.
- **Seed Scripts**: Pre-configured user seeding script (`npm run db:seed`) to quickly populate mock users for testing.
- **Multi-stage Dockerfile**: Clean build compiling the Vite frontend and serving it as static assets from Express in a single lightweight image.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Routing**: [React Router v8](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [HeroUI](https://heroui.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with persistent storage)
- **Authentication**: [@clerk/react](https://clerk.com/docs/quickstarts/react)
- **Video Calling**: [@stream-io/video-react-sdk](https://getstream.io/video/docs/react/)
- **Real-Time Communication**: [socket.io-client](https://socket.io/docs/v4/client-api/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **WebSockets**: [Socket.io](https://socket.io/)
- **Authentication & Middleware**: [@clerk/express](https://clerk.com/docs/references/express/overview) & [@clerk/backend](https://clerk.com/)
- **Video Service**: [@stream-io/node-sdk](https://getstream.io/video/docs/node/)
- **Media Uploads**: [ImageKit](https://imagekit.io/) & [Multer](https://github.com/expressjs/multer)
- **Scheduler**: [Cron](https://www.npmjs.com/package/cron)

---

## 📁 Project Structure

```plaintext
PingUp/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Request handlers (auth, message, stream)
│   │   ├── lib/                 # Core utilities (db, socket, stream, imagekit, cron)
│   │   ├── middleware/          # Route protection and multer file upload handlers
│   │   ├── models/              # Mongoose schemas (User, Message)
│   │   ├── routes/              # Express API route declarations
│   │   ├── seeds/               # Mock data seeding scripts
│   │   ├── webhooks/            # Clerk webhook handler with SVIX verification
│   │   └── index.js             # Express server and socket initialization
│   ├── .env                     # Backend environment configuration
│   └── package.json
│
├── frontend/
│   ├── public/                  # Public static assets (audio, wallpapers, icons)
│   ├── src/
│   │   ├── assets/              # Static illustration & image assets
│   │   ├── components/
│   │   │   ├── auth/            # Authentication view components
│   │   │   ├── chat/            # Chat bubbles, sidebar, composer, headers
│   │   │   └── video/           # Video calling modals and incoming call dialogs
│   │   ├── context/             # Theme & wallpaper context providers
│   │   ├── data/                # Wallpapers & theme preset definitions
│   │   ├── hooks/               # Custom React hooks (keyboard sounds, scrolling, etc.)
│   │   ├── lib/                 # Axios configuration, ringtone player, utilities
│   │   ├── pages/               # Top-level route pages (AuthPage, ChatPage)
│   │   ├── store/               # Zustand state stores (auth, chat, calls)
│   │   ├── styles/              # Global and theme-specific styling
│   │   ├── App.jsx              # Main routing & authentication shell
│   │   └── main.jsx             # React root entry point
│   ├── .env                     # Frontend environment configuration
│   └── package.json
│
├── Dockerfile                   # Multi-stage production container build
├── .dockerignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)
- Accounts for third-party services:
  - [Clerk](https://clerk.com/) (Authentication)
  - [Stream](https://getstream.io/) (Video SDK)
  - [ImageKit](https://imagekit.io/) (Media storage)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/PingUp.git
cd PingUp
```

---

### 2. Environment Variables Setup

#### Backend (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173

# Clerk Configuration
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# Stream Video Configuration
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# ImageKit Configuration
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

# Optional: Deployment self-ping URL (e.g. Render)
RENDER_EXTERNAL_URL=
```

#### Frontend (`frontend/.env`)

Create a `.env` file in the `frontend/` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STREAM_API_KEY=your_stream_api_key
```

---

### 3. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Seed demo users for testing:
   ```bash
   npm run db:seed
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:3000` (or the configured `PORT`).*

---

### 4. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run at `http://localhost:5173`.*

---

## 🔔 Setting Up Clerk Webhooks

To sync Clerk user accounts to MongoDB in real time:

1. Go to your **[Clerk Dashboard](https://dashboard.clerk.com/)** > **Webhooks**.
2. Add an Endpoint:
   - For local development, use a tunnel like [ngrok](https://ngrok.com/) or [localtunnel](https://localtunnel.github.io/www/):
     `https://<your-tunnel-url>/api/webhooks/clerk`
   - For production:
     `https://<your-domain>/api/webhooks/clerk`
3. Subscribe to the following events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy the **Signing Secret** and paste it into `backend/.env` as `CLERK_WEBHOOK_SIGNING_SECRET`.

---

## 📡 API & WebSocket Events

### REST API Endpoints

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server health check endpoint | No |
| `POST` | `/api/webhooks/clerk` | Clerk user sync webhook | No (Verified via secret) |
| `GET` | `/api/auth/check` | Fetch logged-in user details | Yes |
| `GET` | `/api/messages/users` | List all users for sidebar | Yes |
| `GET` | `/api/messages/conversations` | List existing conversations | Yes |
| `GET` | `/api/messages/:id` | Fetch chat history with specific user | Yes |
| `POST` | `/api/messages/send/:id` | Send a text, image, or video message | Yes |
| `GET` | `/api/stream/token` | Generate a Stream Video user token | Yes |
| `POST` | `/api/stream/call` | Initiate a video call session | Yes |

### Socket.io Signaling Events

| Event | Direction | Description |
| :--- | :--- | :--- |
| `getOnlineUsers` | Server $\rightarrow$ Client | Broadcast list of currently active user IDs |
| `newMessage` | Server $\rightarrow$ Client | Deliver new real-time message to receiver |
| `incomingCall` | Server $\rightarrow$ Client | Notify peer of an incoming video call |
| `acceptCall` | Client $\rightarrow$ Server $\rightarrow$ Client | Accept call and notify caller |
| `rejectCall` | Client $\rightarrow$ Server $\rightarrow$ Client | Decline/unanswered call and notify caller |
| `cancelCall` | Client $\rightarrow$ Server $\rightarrow$ Client | Cancel outgoing call before it is answered |
| `endCall` | Client $\rightarrow$ Server $\rightarrow$ Client | Terminate an ongoing video call |

---

## 🐳 Docker Deployment

The project includes a multi-stage `Dockerfile` that builds the Vite frontend and packages the Express backend together into a single, production-optimized container:

```bash
# Build the Docker image
docker build \
  --build-arg VITE_CLERK_PUBLISHABLE_KEY=pk_test_... \
  --build-arg VITE_STREAM_API_KEY=your_stream_api_key \
  -t pingup:latest .

# Run the container
docker run -p 3001:3001 \
  -e PORT=3001 \
  -e NODE_ENV=production \
  -e MONGO_URI="your_mongodb_connection_string" \
  -e CLERK_SECRET_KEY="sk_test_..." \
  -e CLERK_PUBLISHABLE_KEY="pk_test_..." \
  -e CLERK_WEBHOOK_SIGNING_SECRET="whsec_..." \
  -e STREAM_API_KEY="your_stream_api_key" \
  -e STREAM_API_SECRET="your_stream_api_secret" \
  -e IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key" \
  pingup:latest
```

The container will serve the frontend static build from Express and host the API on port `3001`.
