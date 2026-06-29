# 🎓 Shikshak Recruitment Portal

A modern, full-stack web application for teacher recruitment — connecting **Teachers/Candidates**, **Educational Institutes**, **Recruiters**, and **Platform Administrators** in a unified hiring marketplace.

> **Shikshak** (शिक्षक) means "Teacher" in Sanskrit/Hindi.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Features](#-features)
- [Role-Based Dashboards](#-role-based-dashboards)
- [Project Structure](#-project-structure)
- [Database Setup](#-database-setup)
- [How to Run Backend](#-how-to-run-backend)
- [How to Run Frontend](#-how-to-run-frontend)
- [API Testing](#-api-testing)
- [Sample Credentials](#-sample-credentials)
- [API Endpoints](#-api-endpoints)
- [Design Patterns Used](#-design-patterns-used)
- [Security](#-security)
- [Future Scope](#-future-scope)

---

## 🌟 Overview

Shikshak Recruitment Portal is a purpose-built platform for the education sector. It enables:

- **Teachers/Candidates** to discover teaching jobs, build resumes, and track applications
- **Institutes** to post vacancies, manage job listings, and review candidates
- **Recruiters** to manage hiring pipelines, review applications, and update hiring stages
- **Admins** to oversee the entire platform, manage users, verify institutes, and view analytics

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17+ | Core language |
| Spring Boot | 3.2.0 | Application framework |
| Spring Security | 6.x | Authentication & authorization |
| Spring Data JPA | 3.x | Database ORM |
| Hibernate | 6.x | JPA implementation |
| JWT (jjwt) | 0.12.3 | Token-based authentication |
| MapStruct | 1.5.5 | DTO mapping |
| Lombok | Latest | Boilerplate reduction |
| PostgreSQL / MySQL | - | Database (switchable profiles) |
| OpenCSV | 5.9 | CSV export support |
| Maven | 3.8+ | Build & dependency management |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3+ | UI library |
| TypeScript | 5.5+ | Type safety |
| Vite | 5.4+ | Build tool & dev server |
| Tailwind CSS | 3.4+ | Utility-first CSS |
| React Router | 6.26+ | Client-side routing |
| Axios | 1.7+ | HTTP client |
| Recharts | 2.12+ | Data visualization |
| React Hook Form + Zod | Latest | Form validation |
| Lucide React | Latest | Icons |
| React Hot Toast | Latest | Notifications |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   Auth   │ │  Admin   │ │ Institute│ │  Candidate   │  │
│  │   Pages  │ │ Dashboards│ │ Dashboards│ │  Dashboards  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘  │
│       └──────────────┬───────────┴──────────────┘          │
│                      │ HTTP (Axios)                         │
└──────────────────────┼──────────────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────────────┐
│           Backend (Spring Boot) [localhost:8080]             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   Auth   │ │  User    │ │   Job    │ │ Application  │  │
│  │Controller│ │Controller│ │Controller│ │  Controller  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘  │
│       └──────────────┬───────────┴──────────────┘          │
│                      │ Service Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Repository Layer (Spring Data JPA)          │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                   │
│              ┌──────────┴──────────┐                        │
│              │  PostgreSQL / MySQL  │                        │
│              └─────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Layered Architecture (Backend)

```
Controller → Service → Repository → Database
     ↓           ↓          ↓
    DTOs     @Async     Entities
     ↓           ↓          ↓
   Mappers   Events    JPA/Hibernate
```

---

## ✨ Features

### Authentication & Authorization
- JWT-based authentication (access tokens)
- Role-based access control with `@PreAuthorize`
- BCrypt password encryption
- Registration with role selection (Candidate, Institute, Recruiter)
- Email/username login

### User Management
- Profile creation and management
- Role-based dashboards
- Account activation/deactivation by admin

### Job Management
- Create, update, delete, and manage job listings
- Rich job details (salary, experience, qualifications, subjects)
- Job status workflow (Draft → Active → Closed/Expired)
- Search & filter jobs by title, location, subject, experience, employment type
- Remote job support

### Application Management
- Apply to jobs with optional cover letter and resume
- Track application status through hiring stages
- Recruiter review and status update workflow
- Duplicate application prevention

### Resume Builder
- Create and manage multiple resumes
- Rich fields (summary, education, experience, certifications, etc.)
- Set primary resume
- Multiple template support

### Hiring Workflow
- Custom hiring stages per job
- Move candidates through stages
- Track progress of each candidate

### Dashboard & Analytics
- **Admin**: System-wide stats, user distribution, monthly trends
- **Institute**: Job posting stats, application overview
- **Recruiter**: Assigned jobs, review metrics
- **Candidate**: Application tracking, active job counts

### Search & Filter
- Full-text search across job listings
- Filter by location, subject, experience, employment type
- Pagination support

---

## 👥 Role-Based Dashboards

### Admin Dashboard
- System-wide statistics (users, jobs, applications)
- User management (view, activate/deactivate)
- Institute verification
- View all jobs and applications
- Charts: Application status distribution, monthly trends

### Institute Dashboard
- Profile management
- Post and manage job listings
- View applications received
- Track job posting statistics

### Recruiter Dashboard
- View assigned jobs
- Review and manage applications
- Update application status (Shortlist, Interview, Select, Reject)
- Add feedback and notes

### Candidate Dashboard
- Browse and search jobs
- Apply to positions
- Track application status
- Build and manage resumes
- Update profile with skills, experience, qualifications

---

## 📁 Project Structure

```
ShikshakRecruitment/
├── backend/
│   ├── pom.xml
│   ├── src/main/java/com/shikshak/recruitment/
│   │   ├── ShikshakRecruitmentApplication.java
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   ├── CorsConfig.java
│   │   │   ├── AsyncConfig.java
│   │   │   └── DataSeeder.java
│   │   ├── common/
│   │   │   ├── ApiResponse.java
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── ResourceNotFoundException.java
│   │   │   ├── BadRequestException.java
│   │   │   ├── UnauthorizedException.java
│   │   │   └── DuplicateResourceException.java
│   │   ├── enums/
│   │   │   ├── ERole.java
│   │   │   ├── JobStatus.java
│   │   │   ├── ApplicationStatus.java
│   │   │   ├── Gender.java
│   │   │   ├── Qualification.java
│   │   │   └── EmploymentType.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Role.java
│   │   │   ├── Institute.java
│   │   │   ├── Job.java
│   │   │   ├── CandidateProfile.java
│   │   │   ├── Application.java
│   │   │   ├── HiringStage.java
│   │   │   ├── Resume.java
│   │   │   └── PasswordResetToken.java
│   │   ├── dto/
│   │   │   ├── request/ (LoginRequest, SignupRequest, JobRequest,
│   │   │   │             ApplicationRequest, ProfileUpdateRequest,
│   │   │   │             ResumeRequest, HiringStageRequest,
│   │   │   │             UpdateApplicationStatusRequest)
│   │   │   └── response/ (JwtResponse, UserResponse, JobResponse,
│   │   │                  InstituteResponse, ApplicationResponse,
│   │   │                  CandidateProfileResponse, ResumeResponse,
│   │   │                  HiringStageResponse, DashboardStatsResponse,
│   │   │                  PagedResponse)
│   │   ├── repository/ (8 JPA repositories)
│   │   ├── mapper/ (6 MapStruct mappers)
│   │   ├── security/
│   │   │   ├── JwtUtil.java
│   │   │   ├── JwtAuthFilter.java
│   │   │   └── CustomUserDetailsService.java
│   │   ├── service/ (8 services)
│   │   └── controller/ (9 REST controllers)
│   └── src/main/resources/
│       └── application.yml
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── types/index.ts
│       ├── api/ (6 API modules)
│       ├── contexts/AuthContext.tsx
│       ├── layouts/ (MainLayout, AuthLayout)
│       ├── components/ (StatCard, DataTable, StatusBadge, LoadingSpinner)
│       └── pages/
│           ├── auth/ (Login, Register)
│           ├── admin/ (Dashboard, Users, Institutes, Jobs)
│           ├── institute/ (Dashboard, Jobs, Applications, Profile)
│           ├── recruiter/ (Dashboard, Jobs, Applications)
│           └── candidate/ (Dashboard, Jobs, Applications, Resumes, Profile)
└── README.md
```

---

## 🗄 Database Setup

### Option 1: PostgreSQL (Recommended)

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib  # Ubuntu/Debian
# or: brew install postgresql  # macOS

# Start PostgreSQL
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql

CREATE DATABASE shikshak_recruitment;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE shikshak_recruitment TO postgres;
\q
```

### Option 2: MySQL

```bash
# Install MySQL
sudo apt install mysql-server  # Ubuntu/Debian

# Create database
mysql -u root -p
CREATE DATABASE shikshak_recruitment;
EXIT;

# Run with MySQL profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```

### Database Configuration

All database settings are in `backend/src/main/resources/application.yml`. The default config:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/shikshak_recruitment
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update  # Auto-creates tables on startup
```

> **Note:** `ddl-auto: update` will automatically create/update tables. Change to `validate` or `none` in production.

---

## 🚀 How to Run Backend

### Prerequisites
- Java 17 or higher
- Maven 3.8+
- PostgreSQL or MySQL (configured and running)

### Steps

```bash
# 1. Navigate to backend directory
cd ShikshakRecruitment/backend

# 2. Build the project
./mvnw clean install -DskipTests

# 3. Run the application
./mvnw spring-boot:run

# For MySQL profile:
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql

# 4. The API will start at:
http://localhost:8080/api/v1
```

### Build Executable JAR

```bash
./mvnw clean package -DskipTests
java -jar target/recruitment-1.0.0.jar
```

---

## 🖥 How to Run Frontend

### Prerequisites
- Node.js 18+
- npm 9+ or yarn

### Steps

```bash
# 1. Navigate to frontend directory
cd ShikshakRecruitment/frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. The app will open at:
http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output in: frontend/dist/
```

---

## 🧪 API Testing

The backend seeds an admin user on startup. You can test APIs using **cURL**, **Postman**, or any HTTP client.

### Using cURL

```bash
# 1. Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"admin","password":"admin123"}'

# Response includes JWT token. Save it for subsequent requests.

# 2. Get current user (with token)
curl http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer <your-jwt-token>"

# 3. Register a new candidate
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teacher1",
    "email": "teacher1@example.com",
    "password": "password123",
    "firstName": "Priya",
    "lastName": "Sharma",
    "roles": ["CANDIDATE"]
  }'

# 4. Get all active jobs (public)
curl http://localhost:8080/api/v1/public/jobs

# 5. Search jobs
curl "http://localhost:8080/api/v1/jobs/search?subject=Mathematics&location=Mumbai"
```

### Using Postman

1. **Import the API collection** (create requests manually or use the cURL commands above)
2. **Set up environment variables:**
   - `base_url`: `http://localhost:8080/api/v1`
   - `token`: (populated after login)
3. **Test flow:**
   - POST `/auth/login` → copy token
   - GET `/users/me` with Bearer token
   - POST `/auth/register` to create new users
   - GET `/public/jobs` to list active jobs
   - POST `/candidate/applications` to apply (as candidate)
   - PUT `/recruiter/applications/status` to update status (as recruiter)

### Postman Collection Example

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | No | Login |
| POST | `/auth/register` | No | Register |
| GET | `/users/me` | JWT | Current user |
| GET | `/public/jobs` | No | List active jobs |
| GET | `/jobs/search?title=&location=&subject=` | No | Search jobs |
| POST | `/institute/jobs` | Institute | Create job |
| GET | `/institute/jobs` | Institute | My jobs |
| POST | `/candidate/applications` | Candidate | Apply for job |
| GET | `/candidate/applications` | Candidate | My applications |
| PUT | `/recruiter/applications/status` | Recruiter | Update status |
| GET | `/admin/dashboard` | Admin | Dashboard stats |
| GET | `/admin/users` | Admin | List users |
| PUT | `/admin/institutes/{id}/verify` | Admin | Verify institute |

---

## 👤 Sample Credentials

The application seeds default users on first startup:

| Role | Username | Email | Password |
|------|----------|-------|----------|
| **Admin** | `admin` | `admin@shikshak.com` | `admin123` |

Register additional users via the `/api/v1/auth/register` endpoint or the frontend registration form:

| Role | How to Register |
|------|----------------|
| **Candidate** | Register with role `CANDIDATE` |
| **Institute** | Register with role `INSTITUTE` (requires institute details) |
| **Recruiter** | Register with role `RECRUITER` (can be assigned jobs by institute) |

---

## 📡 API Endpoints

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | No | Login with username/email & password |
| POST | `/auth/register` | No | Register new user |
| GET | `/auth/check-username` | No | Check username availability |
| GET | `/auth/check-email` | No | Check email availability |

### User Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/me` | JWT | Get current user profile |
| GET | `/users/{id}` | Admin | Get user by ID |
| GET | `/users` | Admin | Get all users |
| PUT | `/users/{id}/toggle-active` | Admin | Activate/deactivate user |

### Job Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/jobs` | Public | Get active jobs (paginated) |
| GET | `/jobs/search` | Public | Search/filter jobs |
| GET | `/jobs/{id}` | Public | Get job details |
| POST | `/jobs` | Institute | Create job |
| PUT | `/jobs/{id}` | Institute | Update job |
| DELETE | `/jobs/{id}` | Institute | Delete job |
| PATCH | `/jobs/{id}/status` | Institute/Recruiter | Update job status |

### Institute Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/institute/profile` | Institute | Get institute profile |
| PUT | `/institute/profile` | Institute | Update institute profile |
| POST | `/institute/jobs` | Institute | Create job posting |
| GET | `/institute/jobs` | Institute | List institute jobs |
| GET | `/institute/jobs/all` | Institute | List all jobs (no pagination) |
| GET | `/institute/applications` | Institute | View applications |
| GET | `/institute/dashboard` | Institute | Dashboard stats |

### Candidate Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/candidate/profile` | Candidate | Get profile |
| PUT | `/candidate/profile` | Candidate | Update profile |
| POST | `/candidate/applications` | Candidate | Apply to job |
| GET | `/candidate/applications` | Candidate | My applications |
| GET | `/candidate/resumes` | Candidate | List resumes |
| POST | `/candidate/resumes` | Candidate | Create resume |
| PUT | `/candidate/resumes/{id}` | Candidate | Update resume |
| DELETE | `/candidate/resumes/{id}` | Candidate | Delete resume |
| GET | `/candidate/dashboard` | Candidate | Dashboard stats |

### Recruiter Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/recruiter/jobs` | Recruiter | Assigned jobs |
| GET | `/recruiter/applications` | Recruiter | View applications |
| GET | `/recruiter/applications/job/{jobId}` | Recruiter | Job applications |
| PUT | `/recruiter/applications/status` | Recruiter | Update application status |
| GET | `/recruiter/dashboard` | Recruiter | Dashboard stats |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/dashboard` | Admin | System stats |
| GET | `/admin/users` | Admin | All users |
| GET | `/admin/institutes` | Admin | All institutes |
| PUT | `/admin/institutes/{id}/verify` | Admin | Verify institute |
| PUT | `/admin/users/{id}/toggle-active` | Admin | Toggle user status |

### Hiring Stage Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/hiring-stages/job/{jobId}` | JWT | Get stages for job |
| POST | `/hiring-stages` | Institute/Admin | Create stage |
| DELETE | `/hiring-stages/{id}` | Institute/Admin | Delete stage |
| PUT | `/hiring-stages/{id}/toggle` | Institute/Admin | Toggle stage active |

### Public Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/public/jobs` | No | Active jobs |
| GET | `/public/jobs/{id}` | No | Job details |
| GET | `/public/jobs/search` | No | Search jobs |
| GET | `/public/institutes` | No | Verified institutes |

---

## 🧩 Design Patterns Used

| Pattern | Usage |
|---------|-------|
| **Singleton** | Spring Beans (services, repositories, controllers) |
| **Factory** | `ApiResponse` static factory methods |
| **Builder** | Lombok `@Builder` on entities and DTOs |
| **DTO** | Request/Response DTOs for data transfer |
| **Mapper** | MapStruct for entity ↔ DTO mapping |
| **DAO/Repository** | Spring Data JPA repositories |
| **Service Layer** | Business logic encapsulation |
| **Template Method** | JPA Repository base methods |
| **Chain of Responsibility** | Spring Security filter chain |
| **Global Exception Handler** | `@RestControllerAdvice` |
| **Value Object** | Enums for roles, statuses |
| **Strategy** | Role-based authentication |
| **Observer** | Hibernate entity lifecycle events |
| **Async** | `@Async` for background tasks (email, job expiry) |

---

## 🔒 Security

### JWT Authentication Flow

```
Client                    Server
  │                        │
  │── POST /auth/login ────│─▶ Authenticate
  │                        │─▶ Generate JWT
  │◀── { token, user } ───│
  │                        │
  │── GET /api/resource ───│─▶ Extract JWT from header
  │   Authorization:       │─▶ Validate token
  │   Bearer <token>      │─▶ Load user details
  │                        │─▶ Check authorization
  │◀── Response ──────────│
```

### Security Features
- **Password Encryption**: BCrypt with configurable strength
- **JWT Tokens**: 24-hour expiry, signed with HMAC-SHA256
- **Role-Based Access**: `@PreAuthorize` annotations on controllers
- **CORS**: Configured for frontend origins
- **Stateless Sessions**: No HTTP session, JWT only
- **Input Validation**: Jakarta Bean Validation
- **SQL Injection Protection**: JPA parameterized queries

### Security Configuration

```yaml
app:
  jwt:
    secret: <base64-encoded-secret>
    expiration-ms: 86400000  # 24 hours
```

---

## 📈 Future Scope

- [ ] **Email Notifications**: Send email alerts for application updates, new jobs, etc.
- [ ] **File Upload**: Resume/CV upload using cloud storage (AWS S3, Azure Blob)
- [ ] **Real-time Chat**: Messaging between candidates and recruiters
- [ ] **Video Interview**: Integrated video interview scheduling
- [ ] **Assessment Engine**: Online teaching aptitude tests
- [ ] **AI Resume Parsing**: Extract skills and experience from uploaded resumes
- [ ] **Advanced Analytics**: ML-powered insights, hiring predictions
- [ ] **Multi-language Support**: i18n for Hindi, English, and regional languages
- [ ] **Mobile App**: React Native companion app
- [ ] **Payment Gateway**: Premium job listings, featured posts
- [ ] **Notification System**: In-app + email + SMS notifications
- [ ] **Audit Logging**: Track all user activities for compliance
- [ ] **Docker Support**: Containerized deployment with docker-compose
- [ ] **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- [ ] **OAuth2.0**: Social login (Google, LinkedIn)

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 🙏 Acknowledgments

- Spring Boot Team for the amazing framework
- React & Vite communities for frontend tools
- Tailwind CSS for the utility-first CSS framework
- All open-source libraries used in this project

---

<p align="center">Made with ❤️ for the education community</p>
