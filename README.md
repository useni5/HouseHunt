# 🏡 HouseHunt – Full Stack Real Estate Web App

**HouseHunt** is a modern fullstack web application for browsing and managing real estate listings. It features user authentication, property cards, responsive UI, and seamless frontend-backend integration.

---

## 🚀 Tech Stack

- **Frontend**: React, MUI (Material UI), React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT-based login/register with secure routing

---

## 🌟 Features

- 🔐 User authentication (register, login, forgot password)
- 🏘️ Property listing with detailed cards
- 📱 Responsive design with modern UI (MUI)
- 🔎 View all properties in a clean layout
- ➕ Add new property (admin/owner feature)
- 🔄 Persistent user sessions via JWT
- 💬 Flash messages / notifications (optional)

---


## 🔧 Project Structure

HouseHunt/
├── backend/
│   ├── config/
│   │   └── connect.js
│
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── ownerController.js
│   │   └── userController.js
│
│   ├── middlewares/
│   │   └── authMiddleware.js
│
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── ownerRoutes.js
│   │   └── userRoutes.js
│
│   ├── schemas/
│   │   ├── bookingModel.js
│   │   ├── propertyModel.js
│   │   └── userModel.js
│
│   ├── uploads/
│   │   ├── Blank diagram.jpeg
│   │   └── pexels-binyaminmellish-106399.jpg
│
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── node_modules/
│
│   ├── public/
│   │   └── index.html
│
│   ├── src/
│   │   ├── images/
│   │   │   ├── p.jpg
│   │   │   ├── p0.jpg
│   │   │   ├── p1.jpg
│   │   │   ├── p2.jpg
│   │   │   ├── p3.jpg
│   │   │   ├── p4.jpg
│   │   │   ├── p5.jpg
│   │   │   ├── p6.jpg
│   │   │   ├── p7.jpg
│   │   │   ├── p8.jpg
│   │   │   ├── p9.jpg
│   │   │   └── p10.jpg
│   │
│   │   ├── modules/
│   │   │   ├── admin/
│   │   │   │   ├── AdminHome.jsx
│   │   │   │   ├── AllBookings.jsx
│   │   │   │   ├── AllProperty.jsx
│   │   │   │   └── AllUsers.jsx
│   │   │
│   │   │   ├── common/
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │
│   │   │   └── user/
│   │   │       ├── Owner/
│   │   │       │   ├── AddProperty.jsx
│   │   │       │   ├── AllBookings.jsx
│   │   │       │   ├── AllProperties.jsx
│   │   │       │   └── OwnerHome.jsx
│   │   │
│   │   │       └── renter/
│   │   │           ├── AllProperties.jsx
│   │   │           ├── RenterHome.jsx
│   │   │           └── AllPropertiesCards.jsx
│
│   ├── App.css
│   ├── App.js
│   ├── index.js
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── README.md

yaml
Copy code

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/househunt.git
cd househunt
2. Setup the Backend
bash
Copy code
cd backend
npm install
Create a .env file:
ini
Copy code
PORT=8001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
bash
Copy code
npm run dev
3. Setup the Frontend
bash
Copy code
cd ../frontend
npm install
npm start
The frontend runs on http://localhost:3000
The backend runs on http://localhost:8001

🌐 Deployment
You can deploy this stack on:

Frontend: Vercel / Netlify

Backend: Render / Railway / Cyclic / Fly.io

Database: MongoDB Atlas

Update CORS and .env variables accordingly before deployment.

🧠 Future Improvements
🗺️ Add location-based filtering

📧 Email verification

📊 Admin dashboard

🔍 Full-text search

📱 Mobile-first PWA

