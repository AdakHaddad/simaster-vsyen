# simaster-vsyen

Attendance System with CCTV and LMS API integration for swift, automated attendance tracking.

## Overview

**simaster-vsyen** streamlines class attendance by combining:
- **CCTV Face Recognition** – students are automatically marked present when identified by an IP camera
- **LMS API Integration** – attendance records sync in real-time to the Learning Management System
- **Role-based access** – Admin, Lecturer, and Student roles with appropriate permissions

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (v18+) |
| Framework | Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) |
| Face Recognition | External face recognition API (configurable) |
| LMS Integration | REST API (configurable) |

## Project Structure

```
simaster-vsyen/
├── server.js                    # Entry point
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User (student/lecturer/admin)
│   │   ├── Course.js            # Course
│   │   ├── Session.js           # Class session
│   │   ├── Attendance.js        # Attendance record
│   │   └── FaceProfile.js       # Face recognition profile
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── sessionController.js
│   │   ├── attendanceController.js
│   │   └── faceProfileController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── sessions.js
│   │   ├── attendance.js
│   │   └── faceProfiles.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication & authorization
│   │   └── errorHandler.js      # Global error handler
│   └── services/
│       ├── faceRecognitionService.js  # CCTV face identification
│       └── lmsService.js              # LMS API sync
└── tests/
    ├── auth.test.js
    ├── coursesAndSessions.test.js
    └── attendance.test.js
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Face Recognition API endpoint (optional, required for CCTV attendance)
- LMS API endpoint (optional, required for LMS sync)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd simaster-vsyen

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your settings
```

### Environment Variables

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port (default: 3000) | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRES_IN` | JWT expiry (default: `7d`) | No |
| `LMS_API_URL` | LMS API base URL | For LMS sync |
| `LMS_API_KEY` | LMS API key | For LMS sync |
| `LMS_API_SECRET` | LMS API secret | For LMS sync |
| `FACE_RECOGNITION_API_URL` | Face recognition service URL | For CCTV attendance |
| `FACE_RECOGNITION_API_KEY` | Face recognition API key | For CCTV attendance |
| `FACE_MATCH_THRESHOLD` | Minimum confidence (0-1, default: `0.85`) | No |
| `ATTENDANCE_GRACE_PERIOD_MINUTES` | Late threshold in minutes (default: `15`) | No |

### Run

```bash
# Development (auto-reload)
npm run dev

# Production
npm start

# Tests
npm test
```

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and get JWT | Public |
| GET | `/api/auth/me` | Get current user | Any |

### Courses

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/courses` | List courses | Any |
| GET | `/api/courses/:id` | Get course details | Any |
| POST | `/api/courses` | Create course | Admin |
| PUT | `/api/courses/:id` | Update course | Admin, Lecturer |
| POST | `/api/courses/:id/enroll` | Enroll a student | Admin |
| DELETE | `/api/courses/:id/enroll/:studentId` | Unenroll student | Admin |

### Sessions

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| GET | `/api/sessions` | List sessions | Any |
| GET | `/api/sessions/:id` | Get session | Any |
| POST | `/api/sessions` | Create session | Admin, Lecturer |
| PUT | `/api/sessions/:id` | Update session | Admin, Lecturer |
| PUT | `/api/sessions/:id/open` | Open for attendance | Admin, Lecturer |
| PUT | `/api/sessions/:id/close` | Close attendance | Admin, Lecturer |

### Attendance

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| POST | `/api/attendance/cctv` | **CCTV face-recognition capture** | Any |
| POST | `/api/attendance/manual` | Manual attendance entry | Admin, Lecturer |
| GET | `/api/attendance` | List attendance records | Any (students see own) |
| GET | `/api/attendance/summary/:courseId` | Course attendance summary | Admin, Lecturer |
| POST | `/api/attendance/sync-lms` | Sync unsynced records to LMS | Admin, Lecturer |

### Face Profiles

| Method | Endpoint | Description | Roles |
|---|---|---|---|
| POST | `/api/face-profiles` | Register/update face profile | Any |
| GET | `/api/face-profiles/:userId` | Get face profile | Any (own only for students) |
| DELETE | `/api/face-profiles/:userId` | Delete face profile | Admin |

## CCTV Attendance Flow

```
CCTV Camera
    │ captures frame
    ▼
POST /api/attendance/cctv
    │ image + sessionId
    ▼
Face Recognition API ──► identifies student (externalFaceId + confidence)
    │
    ▼
FaceProfile lookup ──► maps externalFaceId → User
    │
    ▼
Attendance.findOneAndUpdate ──► upsert (prevents duplicates)
    │
    ▼
LMS sync (async, non-blocking) ──► POST /sessions/:id/attendance
```

## LMS Sync

Attendance records are synced to the LMS either:
1. **Automatically** (async, non-blocking) after each CCTV capture if the student has an `lmsUserId` and the session has an `lmsSessionId`
2. **Manually** via `POST /api/attendance/sync-lms` to retry failed/unsynced records

## Running Tests

```bash
npm test
```

Tests use Jest with full mocking of Mongoose and external services — no database or external API needed.
