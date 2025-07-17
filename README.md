# SkillVerse - Full-Stack Educational Platform

A comprehensive educational platform similar to Google Classroom but specifically designed for Computer Science courses with integrated code compiler and AI-powered skill assessment.

## Features

### Student POV
- Student-specific dashboard with AI recommendations
- Join and manage classes
- Complete coding assignments with Monaco Editor
- View progress and skill reports
- Submit code with automated testing

### Teacher POV
- Teacher-specific dashboard with class overview
- Create and manage classes
- Create coding assignments with test cases
- Grade student submissions
- View student analytics and progress

## Tech Stack

- **Frontend**: React.js (TypeScript), Material-UI, Monaco Editor
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: Session-based with express-session
- **Package Manager**: pnpm

## Setup Instructions

### Backend Setup
```bash
cd backend
pnpm install
pnpm start
```

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm start
```

## Environment Variables

Create `.env` files in both frontend and backend directories with the provided configuration.

## Role-Based Access

- **Students**: Access student-specific features only
- **Teachers**: Access teacher-specific features only
- Completely separate UI/UX based on user role

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/check` - Check auth status

### Student Routes
- GET `/api/student/dashboard` - Student dashboard data
- GET `/api/student/classes` - Student's classes
- GET `/api/student/assignments` - Student's assignments
- POST `/api/student/submit/:assignmentId` - Submit assignment

### Teacher Routes
- GET `/api/teacher/dashboard` - Teacher dashboard data
- GET `/api/teacher/classes` - Teacher's classes
- POST `/api/teacher/classes` - Create new class
- POST `/api/teacher/assignments` - Create new assignment
- GET `/api/teacher/submissions/:assignmentId` - View submissions