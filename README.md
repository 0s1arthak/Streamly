 # Streamly

A video streaming platform in active development. The project currently focuses on a secure, OTP-based authentication flow and scaffolding for video upload and HLS streaming.

## Project Overview

Streamly is a full-stack video streaming application built with:
- **Frontend**: React with Vite
- **Backend**: Express.js with MongoDB
- **Current Branch**: `feat/Authentication`

The repository implements a secure signup flow using email OTPs and prepares the backend for video processing (FFmpeg/HLS).

## Features (Current Status)

### ✅ Authentication System (Implemented)
- **Signup with OTP verification**: Users register with name, email and password. Registration completes only after verifying an OTP sent to the provided email.
- **Temporary user storage**: New signups are stored in a `TempUser` collection until OTP verification completes.
- **Hashed passwords**: Passwords are hashed with `bcrypt` before being stored (even in `TempUser`).
- **OTP model & service**: OTPs are generated, hashed, saved to the `Otp` collection and sent via Nodemailer. OTPs are deleted after use or expiry.
- **Resend OTP**: `resendOtp` endpoint re-generates and sends a new OTP if the temporary signup is still valid.
- **User creation upon verification**: `verifyOtp` verifies the OTP, creates a permanent `User` record using hashed password from `TempUser`, then deletes `TempUser` and its `Otp` record.

### 🔧 Backend Infrastructure
- Express.js server with CORS and JSON parsing
- MongoDB (Mongoose) connection and models
- Environment configuration with `dotenv`
- Email provider using Nodemailer

### 📁 Upload & Storage (Scaffolded)
- Upload directories created: `uploads/raw`, `uploads/hls`, `uploads/thumbnails`
- `fluent-ffmpeg` is available for encoding / HLS packaging

### 🎨 Frontend Setup
- React 19 + Vite
- ESLint configuration

## Project Structure

```
streamly/
├── backend/
│   ├── src/
│   │   ├── server.js              # Main Express server
│   │   ├── config/db.js           # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js  # Signup, verifyOtp, resendOtp
│   │   │   └── videoController.js # Video handling (WIP)
│   │   ├── middleware/
│   │   │   ├── authmiddleware.js  # JWT verification (used by protected routes)
│   │   │   └── upload.js          # File upload handling (scaffold)
│   │   ├── models/
│   │   │   ├── User.js            # User schema
│   │   │   ├── Otp.js             # OTP schema
│   │   │   ├── TempUser.js        # Temporary signup storage
│   │   │   └── Video.js           # Video schema (empty / WIP)
│   │   ├── providers/
│   │   │   └── email.provider.js  # Email sending logic
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # Auth endpoints (signup, verifyOtp, resendOtp)
│   │   │   └── videoRoutes.js     # Video endpoints (WIP)
│   │   ├── services/
│   │   │   └── otpService.js      # OTP generation & sending
│   │   └── utils/
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

## API Endpoints (Auth)

Base: `/api/auth`

- `POST /signup` — create a temporary signup and send OTP
  - Body: `{ name, email, password, confirmPassword }`

- `POST /verifyOtp` — verify an OTP and finalize user creation
  - Body: `{ email, otp }`
  - Behavior: If OTP matches the stored hashed OTP, the server creates a `User` from `TempUser`, then deletes both the `TempUser` and the `Otp` record.

- `POST /resendOtp` — resend a new OTP to the email if the signup session still exists
  - Body: `{ email }`

> Note: Endpoint names are implemented in `authController.js` as `signup`, `verifyOtp`, and `resendOtp` respectively.

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

### 🚧 In Progress
- Video model & controller (`Video.js` is currently empty and `videoController.js` is a work-in-progress)
- File uploads and HLS packaging
- Frontend pages for video upload/playback and authenticated dashboards

### 📋 Planned
- Video playback with adaptive streaming (HLS)
- Thumbnails generation and storage
- User profiles and video management (delete/edit)

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
- `Video.js` and `videoController.js` are the immediate next tasks: implement the Video schema, upload endpoints, FFmpeg processing and HLS packaging.

## License

ISC

## Author

0s1arthak (Streamly Team)

---

**Last Updated**: December 5, 2025
**Current Branch**: `feat/Authentication`
