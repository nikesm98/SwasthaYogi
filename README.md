# SwasthaYogi Project

SwasthaYogi is a full-stack health management platform for medicine reminders, medical report uploads, and health profile tracking.

## Project Structure
- `Backend/` - Node.js + Express + MongoDB backend
- `FrontEnd_Angular/` - Angular frontend

## Features
- Secure user authentication (JWT)
- Medicine timer and alerts
- Medical report upload and analysis
- Health profile dashboard
- Recent activity feed

## Getting Started

### Backend
- See `Backend/README.md` for setup instructions

### Frontend
- See `FrontEnd_Angular/README.md` for setup instructions

## Running Locally
1. Start MongoDB
2. Start backend server:
   ```bash
   cd Backend
   npm install
   npm start
   ```
3. Start frontend:
   ```bash
   cd FrontEnd_Angular
   npm install
   ng serve
   ```

## Environment Configuration
- API URLs are set in frontend environment files
- JWT secret is set in backend `.env`

## License
MIT
