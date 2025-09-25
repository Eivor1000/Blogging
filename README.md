# Blogging Platform

A full-stack blogging platform similar to Medium, built with modern web technologies.

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation

**Backend:**
- Hono framework
- Cloudflare Workers for serverless deployment
- Prisma ORM with Accelerate
- JWT authentication with bcryptjs

**Shared:**
- TypeScript validation with Zod
- Shared types via npm package

## Features

- 🔐 **Authentication**: Secure signup/signin with JWT
- ✍️ **Blog Management**: Create, read, update, and delete blog posts
- 🛡️ **Security**: XSS protection with input sanitization
- 📚 **API Documentation**: Interactive Swagger UI
- 🚀 **Serverless**: Deployed on Cloudflare Workers

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd medium
```

2. Install dependencies for all packages:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Common package
cd ../common
npm install
```

### Development

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### API Documentation

Access the interactive API documentation at:
- Swagger UI: `http://127.0.0.1:8787/swagger`
- OpenAPI Spec: `http://127.0.0.1:8787/doc`

## Security Features

- **XSS Protection**: DOMPurify sanitization on all inputs
- **Password Security**: bcrypt hashing with 10 rounds
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **CORS**: Properly configured cross-origin requests

## Deployment

The backend is configured for Cloudflare Workers deployment:

```bash
cd backend
npm run deploy
```

## Project Structure

```
medium/
├── backend/          # Hono API server
├── frontend/         # React application
├── common/           # Shared types and validation
└── API_FEATURES.md   # Security and API documentation
```