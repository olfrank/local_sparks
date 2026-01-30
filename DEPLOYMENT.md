# Local Deployment Guide

This guide will help you run the application locally.

## Prerequisites

- Node.js 18+ and Yarn (for both frontend and backend)
- MongoDB (running locally or connection string)

## Setup Steps

### 1. Frontend Setup

Dependencies are already installed. To start the frontend:

```bash
cd frontend
yarn start
```

The frontend will run on `http://localhost:3000` (or the next available port).

### 2. Backend Setup

#### Install Dependencies

First, install the backend dependencies:

```bash
cd backend
npm install
```

Or if you prefer yarn:

```bash
cd backend
yarn install
```

#### Create Environment File

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

Add the following to `backend/.env`:

```env
# MongoDB Connection
MONGO_URL=mongodb://localhost:27017
DB_NAME=local_sparks

# CORS Origins (comma-separated, or use * for all)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Optional: Server Port (defaults to 8000)
PORT=8000
```

**Note:** If you're using MongoDB Atlas or a remote MongoDB instance, update `MONGO_URL` accordingly.

#### Start the Backend Server

For development (with auto-reload using nodemon):

```bash
cd backend
npm run dev
```

Or for production:

```bash
cd backend
npm start
```

The backend API will run on `http://localhost:8000` (or the port specified in your `.env` file).

### 3. Running Both Services

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
```

## API Endpoints

Once the backend is running, you can access:

- API Root: `http://localhost:8000/api/`
- Status Check POST: `http://localhost:8000/api/status`
- Status Check GET: `http://localhost:8000/api/status`

## Troubleshooting

### Frontend Issues

- **"craco: command not found"**: Make sure you've run `yarn install` in the `frontend` directory
- **Port already in use**: The frontend will automatically try the next available port

### Backend Issues

- **"Module not found"**: Make sure you've installed dependencies with `npm install` or `yarn install` in the `backend` directory
- **MongoDB connection error**: Ensure MongoDB is running and the `MONGO_URL` in `.env` is correct
- **Port already in use**: Change the `PORT` in your `.env` file or stop the process using port 8000
