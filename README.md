# Job Tracker API

A full-stack CRUD web application for tracking job applications with multi-user support, secure authentication, and email verification. Built to demonstrate industry-standard backend and frontend practices.

## Tech Stack

### Frontend: 
- React with tailwind and lucide — dynamic UI for job management 
### Backend: 
- Node.js + Express — RESTful API with modular routes and middleware
### Database: 
- SQLite — persistent storage with relational tables (users, jobs)
### Authentication & Security:
- Password hashing with bcrypt
- JWT authentication
- Email verification via unique tokens (in progress)
- Email Handling: Nodemailer or similar library (in progress)
- Version Control: GitHub

## Key Features

- CRUD Operations: Create, read, update, and delete job entries
- Multi-user Support: Jobs linked to unique user_ID
- Validation & Middleware:
- JSON parsing
- Input validation (status, email, etc.)
- Request logging
- Authentication:
- Secure registration and login
- JWT-based access for protected routes
- Email verification workflow
- Error Handling: Returns meaningful HTTP status codes and messages

## Why This Project Matters

- Demonstrates real-world backend patterns like authentication, validation, and token management
- Shows secure, maintainable, and modular code architecture
- Teaches data flow between frontend, backend, and database, emphasizing multi-user systems
- A strong portfolio piece for full-stack development and API design roles

## Future Improvements

- Complete email verification
- Error handling middleware
- Add password reset workflow
- Deployment (.env usage, environment variables, render/railway/fly.io)
- Develop UX
- Implement role-based access control for admins
- Deploy API with HTTPS and environment-based configuration
