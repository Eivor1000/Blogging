# API Security and Documentation Features

## 🔒 XSS Prevention
- **Input Sanitization**: All user inputs are sanitized using DOMPurify
- **HTML Content**: Blog content allows safe HTML tags only (p, br, strong, em, etc.)
- **Text Fields**: Username, name, and title fields are stripped of all HTML
- **Password Security**: Passwords are not sanitized to preserve special characters

### Sanitization Implementation
- `sanitizeInput()`: Removes all HTML tags, keeps text content only
- `sanitizeHtml()`: Allows safe HTML tags for blog content
- `sanitizeObject()`: Recursively sanitizes object properties

## 📚 API Documentation (Swagger)
- **Swagger UI**: Available at `/swagger` endpoint
- **OpenAPI Spec**: Available at `/doc` endpoint
- **Comprehensive Documentation**: All endpoints documented with request/response schemas
- **Interactive Testing**: Use Swagger UI to test API endpoints directly

### Available Documentation
- **Authentication Endpoints**: `/api/v1/user/signup`, `/api/v1/user/signin`
- **Blog Management**: `/api/v1/blog/` (CRUD operations)
- **Blog Retrieval**: `/api/v1/blog/bulk`, `/api/v1/blog/{id}`

### How to Access Documentation
1. Start the development server: `npm run dev`
2. Visit: `http://127.0.0.1:8787/swagger`
3. Explore and test API endpoints interactively

## 🛡️ Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with 10 rounds
- **Input Validation**: Zod schema validation before database operations
- **XSS Protection**: DOMPurify sanitization on all inputs
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **CORS Enabled**: Cross-origin requests properly configured

## 🚀 Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access Swagger documentation
# http://127.0.0.1:8787/swagger

# Access OpenAPI spec
# http://127.0.0.1:8787/doc
```

All existing functionality remains unchanged - these are additive security and documentation improvements.