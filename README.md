# Scalable React & Node.js Dashboard Application

## Project Overview
This repository contains a full-stack, scalable web application featuring a secure authentication system and a functional dashboard. Built over a three-day timeline as part of a Frontend Developer Intern assignment, the project demonstrates proficiency in modern web development practices, focusing heavily on security, performance, and modularity. The application allows users to securely register, manage their profiles, and interact with a persistent data source through an intuitive interface.

## Features
* Secure dual-token mechanism using HttpOnly cookies for session management.
* Comprehensive dashboard with interactive CRUD operations.
* Real-time search and filtering capabilities.
* Persistent state management and data caching.
* Graceful error handling and form validation on both the client and server.

## Tech Stack

### Frontend
* Framework: React.js (Vite)
* Styling: TailwindCSS
* Data Fetching & Caching: React Query (TanStack Query)
* Routing: React Router v6
* HTTP Client: Axios (with global interceptors)

### Backend
* Runtime: Node.js
* Framework: Express.js
* Database: MongoDB (via Mongoose ODM)
* Authentication: JSON Web Tokens (JWT)
* Security Utilities: Helmet, Express-Rate-Limit, bcryptjs
* Validation: Zod

## System Architecture Overview
The application follows a standard Client-Server architecture. The frontend operates as a Single Page Application (SPA), communicating with the backend via a RESTful API. 

The backend architecture is layered, separating routing, middleware (authentication, rate-limiting, and request validation), and business logic (controllers) from data persistence models. This separation of concerns ensures that the codebase remains maintainable and easily scalable.

## Installation & Setup Instructions

### Prerequisites
* Node.js (v18 or higher recommended)
* MongoDB Database (Atlas cluster or local instance)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Read the `Environment Variables Structure` section below and configure the `.env` file.
4. Start the server (development mode):
   ```bash
   npm run start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Environment Variables Structure

### Backend (`/backend/.env`)
```
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/database_name
JWT_SECRET=your_super_secret_jwt_string
FRONTEND_URL=http://localhost:5174
```

### Frontend (`/frontend/.env`)
```
VITE_API_URL=http://localhost:4000
```

## API Endpoints Overview
The backend exposes a REST API for client communication. A comprehensive list of endpoints has been documented in `API_DOCS.md`. Below is a brief summary of the primary domains:
* `POST /user/sign-up` - Registers a new user and issues a secure session cookie.
* `POST /user/sign-in` - Authenticates a user and issues a secure session cookie.
* `GET /user/logout` - Terminates the session by clearing secure cookies.
* `GET /user/profile` - Retrieves authenticated identity data.
* `PUT /user/profile` - Updates identity fields (First Name, Last Name).
* `GET /todo` - Fetches the authenticated user's records with pagination controls.
* `POST /todo` - Creates a new record.
* `PUT /todo/:id` - Updates specific record metadata or completion statuses.
* `DELETE /todo/:id` - Removes a record.

## Authentication Flow Explanation
The platform avoids storing sensitive tokens in `localStorage` to mitigate Cross-Site Scripting (XSS) vulnerabilities. 

1. Upon successful login or registration, the backend generates an expiring JWT.
2. The server attaches this JWT to the HTTP response Header via a `Set-Cookie` directive marked specifically as `httpOnly`, `secure`, and `sameSite: strict`.
3. Subsequent frontend requests handled via centralized Axios instances automatically send these cookies to the server under the `withCredentials: true` configuration.
4. An Express middleware intercepts protected routes, unwraps the cookie, verifies the JWT, and attaches the resolved identity to the request parameters.
5. If the token expires, the backend responds with a 401 Unauthorized status. An Axios response interceptor on the frontend catches this globally and redirects the user to the login screen.

## Folder Structure Explanation

```text
├── backend
│   ├── controller     # Business logic parsing requests and managing DB interactions
│   ├── jwt            # Token generation and validation mechanisms
│   ├── middleware     # Pre-controller logic (Zod validation schemas, token extractors)
│   ├── model          # Mongoose schemas (User, Todo)
│   ├── routes         # Express routers mapping endpoints to controllers
│   └── index.js       # Express application entry point, mounting global protections
└── frontend
    ├── src
    │   ├── components # Reusable UI pieces (Sidebar, Navbar, Input forms)
    │   ├── utils      # Axios configurations and global formatters
    │   ├── App.jsx    # Component and Provider mapping (Router, QueryClient)
    │   └── main.jsx   # React DOM injection point
```

## Security Considerations
* **Password Exfiltration**: Raw passwords are never stored. The system hashes all passwords utilizing `bcryptjs` with a cost factor of 10 prior to database insertion.
* **Brute Force Attacks**: Express-Rate-Limit is bound to authentication endpoints to prevent credential stuffing.
* **XSS (Cross-Site Scripting)**: Token persistence relies entirely on HttpOnly cookies, drastically reducing the threat of injected scripts harvesting active sessions.
* **CSRF (Cross-Site Request Forgery)**: Cookie policies strictly map to `sameSite: strict` restricting inter-domain request submissions.
* **Component Injection**: `helmet` is integrated to enforce strict HTTP headers, preventing MIME-sniffing and clickjacking.
* **Data Sanitization**: Incoming request payloads pass through a centralized Express middleware running Zod schema validation to ensure types and formats match exact expectations before reaching business logic.

## Scalability & Production Improvements
Significant structural upgrades were implemented specifically to optimize resource usage inside production environments. Detail regarding specific architectural decisions is documented inside `SCALING_NOTE.md`. Some primary modifications include Data Pagination natively integrating MongoDB cursors and TanStack's local state query caching.

## Deployment Strategy
In a production setting, this application should be deployed using decoupled hosting solutions tailored for SPA and persistent servers:
1. **Frontend Hosting**: The React application should be built via `npm run build` and the resulting static bundle hosted on a High-Availability CDN (e.g., Vercel, AWS S3 + CloudFront, or Netlify).
2. **Backend Hosting**: The Node.js application is packaged and deployed onto a managed PaaS (e.g., Render, Railway, or AWS Elastic Beanstalk) mapping environment variables to the instance securely.
3. **Database Environment**: Moving off standard clusters to a regionally localized MongoDB Atlas instance, utilizing database indexing specifically targeting the `user` reference identifiers within the `Todo` schema to accelerate read times during heavy multi-tenant access.

## Conclusion
This submission demonstrates an ability to rapidly architect and ship full-stack systems focusing on more than just aesthetic output. Security mitigations, data structure validation, structured error handling, and performance caching have all been implemented to mock standard production environments ensuring the assignment's technical quality.
