# Smart Diet Planner

Smart Diet Planner is a full-stack web application that helps users log their meals, track calories, manage their health profile, and set dietary goals. Built for students and health-conscious individuals, it provides an intuitive interface for daily nutrition tracking and goal management.

---

## 🚀 Features

- **User Authentication:** Sign up, log in, and securely manage your account.
- **Meal Logging:** Add, edit, and view meals for different times of day (Breakfast, Lunch, Dinner, Snacks).
- **Calorie Tracking:** Automatically sums up calories for meals and daily intake.
- **Health Profile:** Maintain your age, height, weight, activity level, and dietary goals.
- **Personalized Dashboard:** See your logged data and progress at a glance.
- **Responsive Design:** Works on desktop and mobile devices.

---

## 🛠️ Tech Stack

- **Frontend:** React, CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT
- **Deployment:** Netlify (frontend), Render (backend), MongoDB Atlas (database)

---

## 🖥️ Local Setup

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB Atlas account

### 1. Clone the repository

```bash
git clone https://github.com/LordSpudnik/Smart-Diet-Planner.git
cd Smart-Diet-Planner
```

### 2. Setup Backend

```bash
cd backend
npm install
# Create a .env file with the following variables:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
npm start
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```
---

## 📝 Future Improvements & Next Steps

- **Next Steps:**
  - Implement Python-based ML engine.
  - Collect nutritional datasets (from Kaggle or USDA).
  - Develop personalized meal suggestion logic.

- **Optional Features:**
  - Integration with fitness wearables (e.g., steps data).
  - Daily motivational tips for healthy living.
  - Option to generate grocery lists based on meal plans.
