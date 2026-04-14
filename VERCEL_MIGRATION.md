# Vercel API Routes Migration

## Overview

Your backend has been converted from a standalone Node.js/Express server to Vercel API Routes (serverless functions). This means your entire application is now deployable as a single unit to Vercel.

## Project Structure

```
api/                          # Vercel API Routes (serverless functions)
├── lib/
│   ├── db.js                # MongoDB connection with caching
│   ├── models.js            # Mongoose models
│   ├── cors.js              # CORS middleware
│   └── auth.js              # JWT utilities
├── users/
│   ├── register.js          # POST /api/users/register
│   ├── login.js             # POST /api/users/login
│   └── index.js             # GET/PUT /api/users
├── doctors/
│   ├── index.js             # GET/POST /api/doctors
│   └── [id].js              # GET/PUT/DELETE /api/doctors/:id
├── appointments/
│   ├── index.js             # GET/POST /api/appointments
│   ├── [id].js              # GET/PUT/DELETE /api/appointments/:id
│   ├── patient/[pid].js     # GET /api/appointments/patient/:pid
│   └── doctor/[did].js      # GET /api/appointments/doctor/:did
├── services/
│   ├── index.js             # GET/POST /api/services
│   └── [id].js              # GET/PUT/DELETE /api/services/:id
├── reviews/
│   ├── index.js             # GET/POST /api/reviews
│   └── [id].js              # GET/PUT/DELETE /api/reviews/:id
└── health.js                # GET /api/health

src/
├── api/
│   ├── apiClient.js         # Updated to use /api routes
│   ├── authApi.js           # Uses /api/users/login & register
│   ├── appointmentApi.js    # Updated endpoints
│   ├── doctorApi.js         # Unchanged
│   ├── serviceApi.js        # Unchanged
│   └── reviewApi.js         # Unchanged
```

## Key Changes

### 1. **Endpoint Changes**

- Auth: `POST /api/users/register`, `POST /api/users/login`
- Appointments by patient: `GET /api/appointments/patient/:patientId`
- Appointments by doctor: `GET /api/appointments/doctor/:doctorId`
- All other endpoints remain the same path

### 2. **Environment Variables**

**Local Development (.env):**

```
VITE_API_URL=/api
MONGODB_URI=mongodb+srv://your_user:your_password@your_cluster.mongodb.net/hospital_db
JWT_SECRET=your_local_jwt_secret
```

**Production (Vercel Dashboard):**
Set these in your Vercel project settings:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A strong secret key for JWT signing

### 3. **How It Works**

- Each file in the `api/` directory becomes a serverless function
- File structure determines the URL path:
  - `api/users/register.js` → `POST /api/users/register`
  - `api/doctors/[id].js` → `GET/PUT/DELETE /api/doctors/:id`
  - etc.
- CORS is automatically handled for all endpoints
- MongoDB connection is cached within each function execution

## Setting Up for Vercel Deployment

### 1. **Install Dependencies**

```bash
npm install
```

### 2. **Create MongoDB Atlas Database**

- Go to mongodbatlascom
- Create a free cluster
- Get your connection string
- Set `MONGODB_URI` in your Vercel environment variables

### 3. **Deploy to Vercel**

```bash
npm run build
# Then connect your GitHub repo to Vercel and deploy
```

### 4. **Set Environment Variables in Vercel Dashboard**

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong random string

## Local Development

### Running Locally

```bash
npm install
npm run dev
```

The Vite dev server will run on `http://localhost:5173` and the API routes will be accessible at `http://localhost:5173/api/*` (proxied by Vite).

### Testing Endpoints

- Use Postman or the provided [api-tests.http](backend/api-tests.http) file in VS Code REST Client extension
- All endpoints require JSON content-type headers

## Backend Removed

The old `backend/` directory can now be safely deleted as all functionality has been migrated to Vercel API Routes:

- Models moved to `api/lib/models.js`
- Routes converted to serverless functions in `api/`
- Authentication uses JWT stored in localStorage

## Migration Completed ✅

- ✅ Created Vercel API Routes
- ✅ Updated frontend API client
- ✅ Updated environment variables
- ✅ Added CORS support
- ✅ Added MongoDB connection pooling
- ✅ Updated package.json

## Troubleshooting

**"MONGODB_URI not defined"**

- Set the environment variable in Vercel dashboard or .env file

**"Cannot connect to API"**

- Ensure MongoDB connection string is correct
- Check that `JWT_SECRET` is set
- Verify Vercel deployment logs

**CORS errors**

- All endpoints have CORS enabled by default
- If issues persist, check the cors.js middleware

## Next Steps

1. Delete the `backend/` folder (no longer needed)
2. Delete `db.json` (no longer used)
3. Delete old backend scripts in `scripts/`
4. Push to GitHub and deploy to Vercel
