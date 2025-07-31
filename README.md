# 💼 Jobify — Job Searching Platform

Jobify is a full-stack job searching application where users can register, create/edit profiles, post job listings (if admin), apply for jobs, and manage applications. It provides a modern user experience with advanced filtering, authentication, and dashboard analytics.

---

## 🚀 Live Demo

👉 [Jobify live link](jobify-neon-iota.vercel.app)

---

## ✨ Features

- 🔐 User Authentication (JWT)
- 📊 User Dashboard with Analytics
- 📄 Create/Edit/Delete Job Listings
- 📍 Filter & Search Jobs by location, title, status
- 🔒 Role-based Access (Admin/User)
- ⚙️ Responsive UI

---

## 🛠 Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Axios
- Tailwind CSS / CSS Modules
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (for file/image uploads)

---

## 📁 Folder Structure


## Run Locally

Clone the project

```bash
git clone https://github.com/sumitprajapati1/jobify.git
cd jobify
```



## Installation

Setup of backend 

```bash
  cd server
  npm install
  node src/server.js
```

Setup of frontend 

```bash
  cd client
  npm install
  npm run dev
```
    
## Environment Variables for backend

To run this project, you will need to add the following environment variables to your .env file of backend .

PORT=5000          
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

