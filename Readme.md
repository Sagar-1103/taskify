# **Project Links**

* **Backend URL:** **[Taskify-Backend-Link](https://taskify-backend-eight.vercel.app)**
* **Expo Go APK Link: [Taskify-Frontend-Link](https://expo.dev/accounts/sagar1103/projects/frontend/builds/8a990062-7119-469e-9761-092f7be8645b)**

# **Taskify Setup Guide**

This guide will help you set up the **Expo** React Native app and also the **Express** backend for taskify.

**1. Taskify Frontend (React Native + Expo)**

1. Clone the Repository

   ```
   git clone https://github.com/Sagar-1103/taskify.git
   cd taskify/frontend
   ```
2. Clone the Repository

   ```
   npx expo install
   ```
3. Configure Backend URL

   This app requires a backend. The backend URL is already set, but you can update it if needed.

   In the **`constants/Backend.tsx`** file, make sure this line exists:

   ```
   export const BACKEND_URL = `https://taskify-backend-eight.vercel.app`;
   ```
4. Start the Development Server

   ```
   npx expo start
   ```

**2. Taskify Backend (Node.js + Express.js)**

1. Clone the Repository

   ```
   git clone https://github.com/Sagar-1103/taskify.git
   cd taskify/backend
   ```
2. Install Dependencies

   ```
   npm install
   ```
3. Setup Environment Variables

   You can refer to the **`.env.sample`** file for the required environment variables.

   Create a `.env` file in the **backend** folder and ensure it includes:

   ```
   MONGODB_URI=mongodb://localhost:27017/taskify
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   ACCESS_TOKEN_EXPIRY=13600
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   REFRESH_TOKEN_EXPIRY=604800
   ```
4. Start the Server

   ```
   npm run dev
   ```
