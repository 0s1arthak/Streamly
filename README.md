 # Streamly

A video streaming platform in active development. The project currently focuses on a secure, OTP-based authentication flow and scaffolding for video upload and HLS streaming.

## Project Overview

Streamly is a full-stack video streaming application built with:
- **Frontend**: React with Vite
- **Backend**: Express.js with MongoDB
- **Current Branch**: `feat/Authentication`

The repository implements a secure signup flow using email OTPs and prepares the backend for video processing (FFmpeg/HLS).

## Features (Current Status)

### ✅ Authentication System (Fully Implemented)
- **Signup with OTP verification**: Users register with name, email and password. Registration completes only after verifying an OTP sent to the provided email.
- **Temporary user storage**: New signups are stored in a `TempUser` collection until OTP verification completes.
- **Hashed passwords**: Passwords are hashed with `bcrypt` before being stored (even in `TempUser`).
- **OTP model & service**: OTPs are generated, hashed, saved to the `Otp` collection and sent via Nodemailer. OTPs are deleted after use or expiry.
- **Resend OTP**: `resendOtp` endpoint re-generates and sends a new OTP if the temporary signup is still valid.
- **User creation upon verification**: `verifyOtp` verifies the OTP, creates a permanent `User` record using hashed password from `TempUser`, then deletes `TempUser` and its `Otp` record.
- **Login functionality**: Users can log in with email and password to receive a JWT token.
- **Logout functionality**: Clears user session/token on the frontend.

### ✅ Video Upload & Processing (Implemented)
- **Video upload**: Users upload video files which are stored in `uploads/raw/` and indexed in MongoDB
- **Video metadata**: Video records store title, description, user reference, thumbnail path, HLS stream URL, and processing status
- **HLS streaming**: Videos are automatically converted to multiple quality levels (360p, 480p, 720p) using FFmpeg
- **Master playlist generation**: Creates adaptive bitrate streaming manifest (`master.m3u8`) for quality adaptation
- **Thumbnail generation**: Automatic snapshot extraction from uploaded videos at 50% mark
- **Video retrieval**: Endpoints to fetch all videos and individual video details by ID
- **Polling mechanism**: Frontend polls for video processing status updates
- **Search and pagination**: Videos can be searched by title/description and paginated for efficient loading
- **In-memory caching**: Video lists are cached to reduce database load and improve response times
- **Rate limiting**: API endpoints and upload routes are protected with rate limits to prevent abuse

### 🔧 Backend Infrastructure
- Express.js server with CORS and JSON parsing
- MongoDB (Mongoose) connection and models
- Environment configuration with `dotenv`
- Email provider using Nodemailer
- File upload handling with multer middleware
- Authentication middleware for protected routes
- Rate limiting middleware for API protection
- In-memory caching utility for performance optimization

### 📁 Upload & Storage (Implemented)
- **Raw uploads**: `uploads/raw/` - stores original uploaded video files
- **HLS streams**: `uploads/hls/{videoId}/` - contains adaptive bitrate playlists (360p.m3u8, 480p.m3u8, 720p.m3u8) and segment files (.ts)
- **Thumbnails**: `uploads/thumbnails/` - stores generated video thumbnails as JPG images

### 🎨 Frontend Setup
- React 19 + Vite
- Tailwind CSS for styling
- ESLint configuration
- **Authentication pages**: Login, Signup, OTP Verification
- **Video pages**: Upload form with file handling, Watch page with HLS video player
- **Protected routes**: Dashboard and Upload pages accessible only to authenticated users
- **Public routes**: Home page accessible to all users
- **Route protection**: PrivateRoute and PublicRoute components for conditional rendering

## Project Structure

```
streamly/
├── backend/
│   ├── src/
│   │   ├── server.js              # Main Express server
│   │   ├── config/db.js           # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js  # Signup, verifyOtp, resendOtp
│   │   │   └── videoController.js # Video handling with caching, search, pagination
│   │   ├── middleware/
│   │   │   ├── authmiddleware.js  # JWT verification (used by protected routes)
│   │   │   ├── upload.js          # File upload handling
│   │   │   └── rateLimiter.js     # Rate limiting for API protection
│   │   ├── models/
│   │   │   ├── User.js            # User schema
│   │   │   ├── Otp.js             # OTP schema
│   │   │   ├── TempUser.js        # Temporary signup storage
│   │   │   └── Video.js           # Video schema with metadata
│   │   ├── providers/
│   │   │   └── email.provider.js  # Email sending logic
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # Auth endpoints (signup, verifyOtp, resendOtp)
│   │   │   └── videoRoutes.js     # Video endpoints with search/pagination
│   │   ├── services/
│   │   │   ├── otpService.js      # OTP generation & sending
│   │   │   └── videoService.js    # Video processing with FFmpeg/HLS
│   │   └── utils/
│   │       ├── cache.js           # In-memory caching utility
│   │       ├── generateToken.js   # JWT token creation
│   │       ├── hash.js            # Hash utilities for OTP
│   │       └── random.js          # Random generation utilities
│   ├── uploads/
│   │   ├── raw/                   # Raw uploaded video files
│   │   ├── hls/                   # HLS-encoded output
│   │   └── thumbnails/            # Generated thumbnails
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Login.jsx
    │   │   ├── VerifyOtp.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Upload.jsx
    │   │   └── Watch.jsx
    │   ├── routes/
    │   │   ├── PrivateRoute.jsx
    │   │   └── PublicRoute.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── public/
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Tech Stack

### Backend
- **Node.js** (ES Modules)
- **Express.js**
- **MongoDB** with Mongoose
- **bcrypt** for password hashing
- **jsonwebtoken** for auth tokens
- **nodemailer** for sending OTP emails
- **fluent-ffmpeg** for video processing

### Frontend
- **React** with Vite
- **Tailwind CSS** for styling
- **hls.js** for HLS video streaming

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB connection string
- SMTP credentials (for email OTPs)

### Backend

1. Install dependencies:

```powershell
cd backend
npm install
```

2. Create a `.env` with at least:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
SALT_ROUNDS=10
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password_or_app_password
FRONTEND_URL=http://localhost:5173
```

3. Run dev server:

```powershell
npm run dev
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /signup` — create a temporary signup and send OTP
  - Body: `{ name, email, password, confirmPassword }`
  - Response: `{ message, email }`

- `POST /verifyOtp` — verify an OTP and finalize user creation
  - Body: `{ email, otp }`
  - Response: User created successfully
  - Behavior: If OTP matches the stored hashed OTP, the server creates a `User` from `TempUser`, then deletes both the `TempUser` and the `Otp` record.

- `POST /resendOtp` — resend a new OTP to the email if the signup session still exists
  - Body: `{ email }`
  - Response: `{ message, email }`

- `POST /login` — authenticate user with email and password
  - Body: `{ email, password }`
  - Response: JWT token for authenticated requests

- `POST /logout` — clear user session (frontend-side)
  - Response: Logout confirmation

### Video Routes (`/api/video`)

- `POST /upload` — upload and process a video file (requires authentication)
  - Headers: `Authorization: Bearer {token}`
  - Body: FormData with `title`, `description`, and video file
  - Response: `{ message: "Uploaded. Processing started.", video }`
  - Processing: Video is converted to HLS (360p, 480p, 720p), thumbnail is generated, and master playlist is created

- `GET /` — retrieve all videos with optional search and pagination
  - Query params: `page` (default 1), `limit` (default 8, max 50), `search` (string for title/description)
  - Response: `{ page, limit, total, totalPages, videos }`

- `GET /:id` — retrieve a specific video by ID
  - Response: `{ video: {...} }`

## Authentication Flow (Detailed)

1. Client calls `POST /api/auth/signup` with signup details.
2. Backend hashes the password and saves a `TempUser` record.
3. Backend generates a numeric OTP, hashes it, saves a hashed value in `Otp`, and emails the numeric OTP to the user.
4. Client collects the OTP from the user and calls `POST /api/auth/verifyOtp`.
5. Backend compares the provided OTP (after string conversion) with the hashed value stored in `Otp` using `bcrypt.compare`.
6. On success, backend creates a permanent `User` record using the hashed password from `TempUser`, then deletes `TempUser` and `Otp` documents.
7. On expired or missing `TempUser`, `resendOtp` or re-signup is required.

## Development Status

### ✅ Completed
- Two-step email OTP signup flow (signup → verifyOtp)
- `TempUser` lifecycle and hashed-password storage
- OTP hashing, storage and deletion on success
- Resend OTP functionality
- User login with JWT token generation
- User logout functionality
- Video model with metadata fields (title, description, thumbnail, videoUrl, status)
- Video upload with multer middleware
- HLS streaming with multi-quality encoding (360p, 480p, 720p)
- Automatic thumbnail generation from videos
- Master playlist creation for adaptive bitrate streaming
- Video retrieval endpoints (all videos and by ID)
- Frontend authentication pages (Login, Signup, OTP Verification)
- Frontend dashboard with route protection (private routes)
- Video upload page with form handling and error management
- Video watch page with HLS player integration (hls.js)
- Tailwind CSS integration for consistent styling
- Public and private route components for conditional access
- Search and pagination for video listing
- In-memory caching for video retrieval
- Rate limiting for API and upload routes
- Polling mechanism for video processing status
- Enhanced authentication UI and user experience

### 🚧 In Progress
- User profile management
- Video deletion and editing capabilities

### 📋 Planned
- Social features (comments, likes, shares)
- Video recommendations based on viewing history
- User subscriptions/follows
- Video analytics and view tracking

## Environment Variables

Required:

```
PORT
MONGODB_URI
SALT_ROUNDS
JWT_SECRET
EMAIL_USER
EMAIL_PASSWORD
FRONTEND_URL
```

## Scripts

- Backend: `npm run dev` (nodemon)
- Frontend: `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`

## Notes & Next Steps

- The authentication implementation expects the frontend to store the signup email (e.g., in component state or localStorage) so the OTP page can send the email + OTP for verification.
- Video processing happens asynchronously after upload confirmation. The client receives an immediate response with `status: "processing"`.
- HLS segments are stored on disk in `uploads/hls/{videoId}/` directory structure for efficient streaming.
- FFmpeg encoding produces `.ts` (transport stream) segment files and `.m3u8` playlist manifests for each quality level.
- Video playback is implemented using hls.js for cross-browser HLS streaming support, with fallback for Safari's native HLS player.
- In-memory caching is used for video lists to improve performance; cache is invalidated on new uploads.
- Rate limiting protects against abuse; adjust limits in `rateLimiter.js` as needed.
- Search uses MongoDB text indexes for efficient querying of title and description fields.

## Video Processing Details

### HLS Encoding Flow
1. User uploads a video file → stored in `uploads/raw/`
2. Backend generates a unique `videoId` (timestamp-based) for organization
3. FFmpeg processes the video to create three quality variants:
   - **360p** (640×360) → bandwidth ~800 kbps
   - **480p** (854×480) → bandwidth ~1400 kbps
   - **720p** (1280×720) → bandwidth ~2800 kbps
4. Each quality produces:
   - `.m3u8` playlist file (manifest)
   - Multiple `.ts` segment files (6-second chunks)
5. A `master.m3u8` file is created for adaptive bitrate streaming
6. Thumbnail is extracted at the 50% mark of the video
7. All metadata is saved to the `Video` model with status `"completed"`

### Example Video Upload Request
```bash
curl -X POST http://localhost:5000/api/video/upload \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -F "title=My Video Title" \
  -F "description=Video description here" \
  -F "file=@path/to/video.mp4"
```

## License

ISC

## Author

0s1arthak (Streamly Team)

---

**Last Updated**: January 21, 2026  
**Current Branch**: `feat/Authentication`

### Recent Commits
- feat: implement in-memory caching for video retrieval and processing
- feat: implement search and pagination for video listing in Dashboard
- feat: implement rate limiting for API and upload routes
- feat: update video fetching logic to filter for ready status and add polling mechanism and removed uploads
- feat: enhance authentication UI and improve user experience across pages
