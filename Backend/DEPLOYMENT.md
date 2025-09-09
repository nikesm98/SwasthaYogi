# SwasthaYogi Backend Deployment Guide

## Production Start Script

- To start the server in production mode:
  ```sh
  npm run start:prod
  ```

## Using PM2 for Process Management

1. Install PM2 globally (if not already):
   ```sh
   npm install -g pm2
   ```
2. Start the server with PM2:
   ```sh
   pm2 start index.js --name swasthayogi-backend
   ```
3. To view logs:
   ```sh
   pm2 logs swasthayogi-backend
   ```
4. To stop the server:
   ```sh
   pm2 stop swasthayogi-backend
   ```

## Environment Preparation
- Ensure `.env` is set with production values.
- Set `NODE_ENV=production` for best performance.
- Remove dev dependencies if not needed in production.

## Cloud Deployment (Render/Heroku/Vercel)

### 1. MongoDB Atlas
- Create a free MongoDB Atlas cluster.
- Get your connection string and update `.env` as `MONGO_URI=...`

### 2. Deploy to Render (Recommended for Node.js)
- Go to https://render.com/
- Create a new Web Service, connect your GitHub repo or upload code.
- Set build command: `npm install`
- Set start command: `npm run start:prod`
- Add environment variables from your `.env` file.
- Deploy!

### 3. Deploy to Heroku (Alternative)
- Install Heroku CLI.
- Run `heroku create`
- Set config vars from `.env`.
- Deploy with `git push heroku main`.

### 4. Deploy to Vercel (API only, not recommended for full Express apps)
- Use only for serverless endpoints.

---

For any issues, check logs and ensure your MongoDB URI and JWT secret are correct.
