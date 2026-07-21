# Markdown Blog API Backend

A production-ready REST API backend for a Markdown-based blogging platform.

Built with Node.js, Express, PostgreSQL, JWT Authentication, Docker, Swagger, and Jest.  
The API supports authentication, Markdown post management, search, filtering, pagination, and secure access control.

---

## 🚀 Features

### Authentication
- User registration
- User login
- JWT access token authentication
- Refresh token based authentication
- Secure logout
- Password hashing using bcrypt
- Protected routes using JWT middleware

### Blog Posts
- Create Markdown posts
- Fetch all posts
- Fetch single post using slug
- Update posts
- Delete posts
- Automatic slug generation
- Automatic reading time calculation
- Automatic hashtag extraction

### Search & Filtering
- Search posts by title and content
- Filter posts by tags
- Pagination support

### Security
- Helmet security headers
- CORS configuration
- Authentication rate limiting
- Zod request validation
- Centralized error handling
- Parameterized SQL queries

### Developer Tools
- Swagger API Documentation
- Jest + Supertest API testing
- Docker support
- PostgreSQL support
- GitHub Actions CI pipeline

---

# 🛠️ Tech Stack

## Backend
- Node.js
- Express.js
- PostgreSQL

## Authentication
- JSON Web Token (JWT)
- bcrypt

## Validation
- Zod

## Documentation
- Swagger / OpenAPI

## Testing
- Jest
- Supertest

## DevOps
- Docker
- Docker Compose
- GitHub Actions

---

# 📂 Project Structure

```
Markdown-Blog-API-Backend
│
├── src
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   └── postController.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validate.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   │
│   ├── services
│   │   ├── authService.js
│   │   └── postService.js
│   │
│   ├── utils
│   │   ├── AppError.js
│   │   ├── asyncHandler.js
│   │   ├── extractTags.js
│   │   ├── readingTime.js
│   │   ├── slug.js
│   │   └── token.js
│   │
│   ├── validators
│   │   ├── authValidator.js
│   │   └── postValidator.js
│   │
│   ├── tests
│   │   ├── auth.test.js
│   │   ├── post.test.js
│   │   └── setup.js
│   │
│   ├── app.js
│   └── server.js
│
├── docs
│   └── swagger.yaml
│
├── Dockerfile
├── docker-compose.yml
├── schema.sql
├── jest.config.js
├── package.json
└── README.md
```

---

# ⚙️ Installation

Clone the repository:

```bash
git clone <repository-url>

cd Markdown-Blog-API-Backend
```

Install dependencies:

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file:

```env
PORT=2000

DB_HOST=localhost
DB_PORT=5432
DB_USER=khushi
DB_PASSWORD=password123
DB_NAME=markdown_blog_db

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

---

# 🗄️ Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE markdown_blog_db;
```

Run database schema:

```bash
psql -d markdown_blog_db -f schema.sql
```

---

# ▶️ Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server runs on:

```
http://localhost:2000
```

---

# 🐳 Docker Setup

Build and run using Docker:

```bash
docker compose up --build
```

Stop containers:

```bash
docker compose down
```

---

# 📚 Swagger Documentation

API documentation is available at:

```
http://localhost:2000/api-docs
```

---

# 🔑 Authentication Flow

1. Register user

```
POST /auth/register
```

2. Login user

```
POST /auth/login
```

3. Receive access token

4. Send token in protected routes:

```
Authorization: Bearer <access_token>
```

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout user |

---

## Posts

| Method | Endpoint | Description |
|---|---|---|
| GET | `/posts` | Get all posts |
| POST | `/posts` | Create post |
| GET | `/posts/:slug` | Get single post |
| PUT | `/posts/:slug` | Update post |
| DELETE | `/posts/:slug` | Delete post |

---

# 🔎 Query Parameters

## Search Posts

```
GET /posts?search=node
```

Searches posts by title and markdown content.

---

## Filter By Tag

```
GET /posts?tag=backend
```

---

## Pagination

```
GET /posts?page=1&limit=10
```

---

# 🧪 Testing

Run test suite:

```bash
npm test
```

Tests include:

- Authentication flow
- User registration
- Login validation
- Duplicate email handling
- Invalid credentials
- Protected routes
- Post creation
- Post update
- Post deletion
- Search functionality
- Tag filtering
- Pagination
- Error handling

---

# 🔄 Continuous Integration

GitHub Actions automatically runs on:

- Push to main branch
- Pull requests

Pipeline:

```
Checkout Code
      |
      ↓
Install Dependencies
      |
      ↓
Start PostgreSQL
      |
      ↓
Run Database Schema
      |
      ↓
Execute Jest Tests
```

---

# 🔒 Security

Implemented security practices:

- Password hashing with bcrypt
- JWT based authentication
- Refresh token storage
- SQL injection prevention using parameterized queries
- Input validation using Zod
- Rate limiting on authentication routes
- Environment based secrets
- Secure HTTP headers using Helmet

---

# 🏗️ Architecture

```
Routes
  |
  ↓
Controllers
  |
  ↓
Services
  |
  ↓
PostgreSQL Database
```

---

# 👩‍💻 Author

Khushi

GitHub:
https://github.com/Khushi78955
