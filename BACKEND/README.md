A full-stack turf booking web app built with React, Spring Boot, and MySQL.


- Frontend: React.js
- Backend: Spring Boot (Java 17)
- Database: MySQL 8
- Auth: JWT


1. Run schema.sql in MySQL
2. Update application.properties with your DB password and Gmail credentials
3. Run: mvn spring-boot:run


Open index.html directly in browser or use Live Server


- POST /api/auth/signup
- POST /api/auth/login
- GET /api/turfs
- POST /api/bookings (JWT required)
