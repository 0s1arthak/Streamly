# Streamly

A video streaming platform with authentication and HLS video processing capabilities. This project is currently in development with focus on the authentication system and video infrastructure.

## Project Overview

Streamly is a full-stack video streaming application built with:
- **Frontend**: React with Vite
- **Backend**: Express.js with MongoDB
- **Current Branch**: `feat/Authentication`

The project implements a secure user authentication system with OTP verification and is preparing the infrastructure for video storage and HLS streaming.

## Features (Current Status)

### ✅ Authentication System
- **User Registration** with email verification via OTP
- **Email-based OTP Verification** for secure signup
- **Password Hashing** using bcrypt for security
- **Temporary User Model** to hold signup data until OTP verification
- **OTP Expiration Management** with automatic cleanup
- **Resend OTP** functionality for expired codes
- **JWT Token Generation** ready for authenticated endpoints

### 🔧 Backend Infrastructure
- Express.js server with CORS support
- MongoDB database integration
- Environment configuration with dotenv
- Structured controllers, routes, and middleware
- Email provider for OTP delivery (Nodemailer)
- User and OTP models with schema validation

### 📁 Upload & Storage System
- Directory structure for video uploads:
  - `raw/` - Original uploaded videos
  - `hls/` - HLS-encoded video files for streaming
  - `thumbnails/` - Video thumbnails
- FFmpeg integration for video processing

### 🎨 Frontend Setup
- React 19 with Vite build tool
- ESLint configuration for code quality
- Modern JavaScript (ES modules)

## Project Structure

```
streamly/
├── backend/
│   ├── src/
│   │   ├── server.js              # Main Express server
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js  # Authentication logic
│   │   │   └── videoController.js # Video handling (WIP)
│   │   ├── middleware/
│   │   │   ├── authmiddleware.js  # JWT verification
│   │   │   └── upload.js          # File upload handling
│   │   ├── models/
│   │   │   ├── User.js            # User schema
│   │   │   ├── Otp.js             # OTP schema
│   │   │   ├── TempUser.js        # Temporary user during signup
│   │   │   └── Video.js           # Video schema (Empty - WIP)
│   │   ├── providers/
│   │   │   └── email.provider.js  # Email service
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # Auth endpoints
│   │   │   └── videoRoutes.js     # Video endpoints (WIP)
│   │   ├── services/
│   │   │   └── otpService.js      # OTP generation & sending
│   │   └── utils/
│   │       ├── generateToken.js   # JWT token creation
│   │       ├── hash.js            # Hashing utilities
│   │       └── random.js          # Random generation utilities
│   ├── uploads/
│   │   ├── raw/                   # Raw video files
│   │   ├── hls/                   # HLS-encoded streams
│   │   └── thumbnails/            # Video thumbnails
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── assets/
    ├── public/
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js
    └── package.json
```

## Tech Stack

### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js v5.1.0
- **Database**: MongoDB with Mongoose v8.19.4
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer v7.0.10
- **Video Processing**: fluent-ffmpeg v2.1.3
- **Dev Tool**: Nodemon v3.1.11

### Frontend
- **Framework**: React v19.2.0
- **Build Tool**: Vite v7.2.2
- **State Management**: React Hooks (ready to implement)
- **Linting**: ESLint v9.39.1

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance
- SMTP credentials for email sending

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
SALT_ROUNDS=10
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Current API Endpoints

### Authentication Routes (`/api/auth`)

- **POST** `/signup` - Register a new user
  - Request: `{ name, email, password, confirmPassword }`
  - Response: OTP sent to email

- **POST** `/verify-otp` - Verify OTP and complete registration
  - Request: `{ email, otp }`
  - Response: User created successfully

- **POST** `/resend-otp` - Resend OTP to email
  - Request: `{ email }`
  - Response: New OTP sent

## Authentication Flow

1. User provides name, email, password during signup
2. Backend hashes password and stores user data in TempUser collection
3. OTP is generated and sent to user's email via Nodemailer
4. User enters OTP from email
5. Backend verifies OTP against database
6. If valid, TempUser is moved to User collection
7. TempUser and OTP records are deleted
8. User can now login with credentials

## Development Status

### ✅ Completed
- Authentication system with OTP verification
- User model and schema
- Email service integration
- Password hashing and security
- Temporary user management
- OTP expiration handling

### 🚧 In Progress
- Video upload and processing
- HLS streaming setup
- Video model and schema
- Video controller implementation
- Authentication middleware integration

### 📋 Planned
- Video playback interface
- User dashboard
- Video library management
- Streaming quality adaptation
- Video recommendations
- Social features (comments, likes)

## Environment Variables

Required environment variables in `.env`:

```
PORT                 # Server port (default: 5000)
MONGODB_URI          # MongoDB connection string
SALT_ROUNDS          # Bcrypt salt rounds
JWT_SECRET           # Secret for JWT token signing
EMAIL_USER           # Email account for sending OTPs
EMAIL_PASSWORD       # Email account password/app password
FRONTEND_URL         # Frontend URL for CORS
```

## Scripts

### Backend
- `npm run dev` - Start development server with hot reload

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Dependencies Overview

### Backend Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **nodemailer**: Email sending
- **fluent-ffmpeg**: Video processing
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend Dependencies
- **react**: UI library
- **react-dom**: React DOM binding

## Notes

- The project uses a two-step signup process with email verification for enhanced security
- Video model is ready but implementation is pending
- Video controller exists but needs development
- The upload directory structure is prepared for HLS streaming
- FFmpeg is integrated for video encoding (ready to be used in video controller)

## Future Enhancements

- Implement video upload and processing
- Setup HLS streaming infrastructure
- Add video playback components
- Implement user authentication middleware
- Add refresh token mechanism
- Setup video thumbnails generation
- Add video quality variants for adaptive streaming
- Implement video deletion and management
- Add user profile management

## License

ISC

## Author

0s1arthak (Streamly Team)

---

**Last Updated**: November 26, 2025  
**Current Branch**: `feat/Authentication`
