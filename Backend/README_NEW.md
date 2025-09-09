# SwasthaYogi Backend

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up MongoDB and update `.env` if needed.
3. Start the server (development):
   ```sh
   npm run dev
   ```
4. Start the server (production):
   ```sh
   npm run start:prod
   ```

## API Endpoints
- `POST /api/register` — Register a new user
- `POST /api/login` — Login and get JWT

## API Testing
You can test the API endpoints using Postman or curl:

### Register
- **POST** `http://localhost:3000/api/register`
- Body (JSON):
  ```json
  {
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }
  ```

### Login
- **POST** `http://localhost:3000/api/login`
- Body (JSON):
  ```json
  {
    "email": "test@example.com",
    "password": "test123"
  }
  ```

**Expected:**
- Register returns success message.
- Login returns `{ token, user }`.
- Registering same email again returns error.
- Wrong password returns error.

## Deployment
See `DEPLOYMENT.md` for full production and cloud deployment instructions (Render, Heroku, PM2, MongoDB Atlas, etc).

## Environment Variables
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for JWT
- `PORT` — Server port (default: 3000)
