# SkillVerse - Educational Platform

A comprehensive educational platform for Computer Science courses with integrated code compilation, assignment management, and separate interfaces for teachers and students.

## Features

### For Teachers
- Create and manage classes with auto-generated join codes
- Create assignments with multiple programming languages
- View student submissions and provide grades/feedback
- Real-time code execution and testing

### For Students
- Join classes using 6-character codes
- View and complete assignments
- Write code with Monaco Editor
- Run code against test cases
- Submit solutions and view grades

## Technology Stack

- **Frontend**: React.js with modern UI components
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Code Editor**: Monaco Editor
- **Code Execution**: Judge0 API
- **Styling**: CSS Modules with responsive design

## Quick Start

1. Install dependencies:
```bash
npm run install-deps
```

2. Set up environment variables:
```bash
# In backend/.env
MONGODB_URI=mongodb+srv://skillverse:skillverse2025@cluster0.sj8hddi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
SESSION_SECRET=your-secret-key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your-judge0-api-key
```

3. Start the development servers:
```bash
npm run dev
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
skillverse/
├── backend/           # Node.js Express server
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   ├── config/        # Database configuration
│   └── server.js      # Main server file
├── frontend/          # React.js application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API services
│   │   ├── hooks/      # Custom hooks
│   │   └── styles/     # CSS modules
│   └── public/        # Static files
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Classes
- `POST /api/classes` - Create class (teacher)
- `GET /api/classes` - Get user's classes
- `POST /api/classes/join` - Join class (student)
- `GET /api/classes/:id` - Get class details

### Assignments
- `POST /api/assignments` - Create assignment (teacher)
- `GET /api/assignments/class/:classId` - Get class assignments
- `GET /api/assignments/:id` - Get assignment details
- `PUT /api/assignments/:id` - Update assignment (teacher)

### Submissions
- `POST /api/submissions` - Submit solution (student)
- `GET /api/submissions/assignment/:assignmentId` - Get submissions (teacher)
- `GET /api/submissions/my/:assignmentId` - Get my submission (student)
- `PUT /api/submissions/:id/grade` - Grade submission (teacher)

### Code Execution
- `POST /api/compile` - Execute code with Judge0 API

## Database Schema

### Users
- email, password (hashed), name, role, createdAt

### Classes
- name, description, teacherId, joinCode, students, createdAt

### Assignments
- classId, title, description, language, starterCode, testCases, dueDate, totalPoints, createdAt

### Submissions
- assignmentId, studentId, code, submittedAt, grade, feedback, status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details