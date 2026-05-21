# 🏟️ TurfZone — Full-Stack Turf Booking Platform

> React.js + Spring Boot + MySQL | JWT Auth | Email Confirmation

---

## 📁 Project Structure

```
turfzone/
├── turf-booking-frontend/
│   └── index.html                  ← Complete React app (CDN-based, open directly)
│
└── turf-booking-backend/
    ├── pom.xml                     ← Maven dependencies
    ├── schema.sql                  ← MySQL setup script
    └── src/main/
        ├── resources/
        │   └── application.properties
        └── java/com/turfzone/
            ├── TurfZoneApplication.java
            ├── model/
            │   ├── User.java
            │   ├── Turf.java
            │   └── Booking.java
            ├── dto/
            │   ├── SignupRequest.java
            │   ├── LoginRequest.java
            │   ├── AuthResponse.java
            │   ├── BookingRequest.java
            │   ├── BookingResponse.java
            │   └── ErrorResponse.java
            ├── repository/
            │   ├── UserRepository.java
            │   ├── TurfRepository.java
            │   └── BookingRepository.java
            ├── service/
            │   ├── AuthService.java
            │   ├── TurfService.java
            │   ├── BookingService.java
            │   ├── EmailService.java
            │   └── CustomUserDetailsService.java
            ├── controller/
            │   ├── AuthController.java
            │   ├── TurfController.java
            │   └── BookingController.java
            ├── security/
            │   ├── JwtUtil.java
            │   └── JwtAuthFilter.java
            ├── config/
            │   ├── SecurityConfig.java
            │   ├── DataInitializer.java
            │   └── AsyncConfig.java
            └── exception/
                ├── GlobalExceptionHandler.java
                ├── ResourceNotFoundException.java
                ├── DuplicateEmailException.java
                └── InvalidCredentialsException.java
```

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.8+ |
| MySQL | 8.0+ |
| Node.js | Not required (frontend uses CDN) |

---

## 🗄️ Step 1 — MySQL Setup

1. Open MySQL Workbench or CLI
2. Run the schema file:

```sql
-- Option A: CLI
mysql -u root -p < schema.sql

-- Option B: Workbench
-- Open schema.sql and run it
```

This creates:
- `turfzone_db` database
- `users`, `turfs`, `bookings` tables
- Inserts the 3 initial turfs

---

## 🔧 Step 2 — Configure Backend

Edit `src/main/resources/application.properties`:

```properties
# MySQL — update password
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT Secret — change in production
jwt.secret=turfzone_super_secret_key_change_in_prod

# Email — Gmail with App Password
spring.mail.username=your_email@gmail.com
spring.mail.password=your_16_char_app_password
```

### Setting up Gmail App Password:
1. Go to your Google Account → Security
2. Enable 2-Step Verification
3. Go to Security → App Passwords
4. Generate password for "Mail" → "Other (TurfZone)"
5. Use the 16-character code in `spring.mail.password`

---

## ▶️ Step 3 — Run Backend

```bash
cd turf-booking-backend

# Build and run
mvn spring-boot:run

# Or build JAR and run
mvn clean package
java -jar target/turf-booking-backend-1.0.0.jar
```

Server starts at: `http://localhost:8080`

On startup, DataInitializer auto-seeds the 3 turfs if the table is empty.

---

## 🌐 Step 4 — Open Frontend

Simply open `turf-booking-frontend/index.html` in a browser.

> **Note:** If you get CORS errors, serve it via VS Code Live Server or:
```bash
# Python simple server
python3 -m http.server 5500
# Then open: http://localhost:5500
```

The frontend works in **demo mode** (with mock data) even without the backend.
When the backend is running, it automatically connects to `http://localhost:8080`.

---

## 🔌 REST API Reference

### Auth Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, get JWT |
| GET | `/api/auth/me` | ✅ JWT | Get current user |

### Turf Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/api/turfs` | ❌ | All turfs |
| GET | `/api/turfs/{id}` | ❌ | Single turf |
| GET | `/api/turfs/search?q=cricket` | ❌ | Search |
| GET | `/api/turfs/filter/sport?sport=Football` | ❌ | Filter by sport |
| GET | `/api/turfs/filter/rating?min=4.0` | ❌ | Filter by rating |
| GET | `/api/turfs/filter/price?min=500&max=800` | ❌ | Filter by price |

### Booking Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/bookings` | ✅ JWT | Create booking |
| GET | `/api/bookings` | ✅ JWT | All bookings |
| GET | `/api/bookings/my` | ✅ JWT | My bookings |

### Sample Requests (Postman / curl)

**Signup:**
```json
POST /api/auth/signup
{
  "fullName": "Ravi Kumar",
  "email": "ravi@example.com",
  "password": "secure123"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "ravi@example.com",
  "password": "secure123"
}
// Returns: { "token": "eyJ...", "user": { ... } }
```

**Book Turf (with JWT):**
```json
POST /api/bookings
Authorization: Bearer eyJ...
{
  "userName": "Ravi Kumar",
  "email": "ravi@example.com",
  "turfId": 1,
  "bookingDate": "2024-06-20",
  "bookingTime": "18:00"
}
```

---

## 🔒 Security Architecture

```
Request → JwtAuthFilter → Extract email from JWT
                        → Load user from DB
                        → Set Authentication in SecurityContext
                        → Continue to Controller
```

- Passwords: BCrypt with strength 12 (2^12 hash iterations)
- JWT: HS256 signed, 24-hour expiry
- Public routes: GET /api/turfs/**, POST /api/auth/**
- Protected routes: /api/bookings/** (requires `Authorization: Bearer <token>`)

---

## 📧 Email Flow

When a booking is created:
1. Booking saved to `bookings` table
2. `EmailService.sendBookingConfirmation()` called **asynchronously**
3. Gmail SMTP sends confirmation to user's email
4. API responds immediately (email sends in background)

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS error | Add frontend URL to `cors.allowed.origins` in properties |
| 403 Forbidden on booking | JWT token missing or expired — login again |
| Email not sending | Check Gmail App Password, not regular password |
| DB connection failed | Verify MySQL is running, password is correct |
| Port 8080 in use | Add `server.port=8081` to properties |

---

## 📌 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (CDN), Axios, CSS3 |
| Backend | Spring Boot 3.2, Java 17 |
| Security | Spring Security + JWT (jjwt 0.11.5) |
| Database | MySQL 8 + Spring Data JPA |
| Email | Spring Mail + Gmail SMTP |
| Build | Maven |

---

Built for: Interview-ready full-stack portfolio project 🚀
