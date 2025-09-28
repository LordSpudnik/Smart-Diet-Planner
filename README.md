# 🚀 Smart Diet Planner

Smart Diet Planner helps you log meals, track calories, maintain a health profile, and get personalized recommendations for a healthier lifestyle.

---

## ✨ What's New

- **Machine Learning Recommendations:** Get AI-powered personalized meal and health recommendations.
- **Improved Authentication:** More robust login/signup and JWT user sessions.
- **Health Profile Editing:** Better UI/UX and extended fields.
- **Meal Logging Enhancements:** Faster logging, multi-food entries, and improved daily summaries.
- **Dashboard Overhaul:** Real-time updates, error feedback, and cleaner layout.
- **Mobile Optimization:** Enhanced responsiveness and touch support.
- **Bug Fixes:** Improved error handling and more reliable API connections.

---

## 🛠️ Tech Stack

- **Frontend:** React, CSS
- **Backend:** Node.js, Express
- **Machine Learning:** Python (recommendation engine)
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT
- **Deployment:** Netlify (frontend), Render (backend), MongoDB Atlas (database)

---

## 🚦 Features

- **User Authentication:** Secure signup, login, and account management.
- **Meal Logging:** Add, edit, and view meals for any time of day.
- **Calorie Tracking:** Automatic calorie totals and daily breakdowns.
- **Health Profile:** Track age, weight, height, activity level, and goals.
- **Personalized Dashboard:** See progress, recent meals, profile, and recommendations.
- **AI Recommendations:** Get smarter suggestions for diet and health.
- **Mobile-Friendly Design:** Works smoothly on desktop and mobile.

---

## 📦 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/LordSpudnik/Smart-Diet-Planner.git
cd Smart-Diet-Planner
```

### 2. Setup Backend

```bash
cd backend
npm install
# Copy .env.example to .env and set your MongoDB URI and secrets
npm start
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

### 4. Run Machine Learning Service (if using recommendations)

```bash
cd ../ml_service
pip install -r requirements.txt
python app.py
```

---

## 🔒 Environment Variables

- Set your MongoDB URI and JWT secret in `backend/.env`
- Configure frontend API endpoint in `frontend/.env` if needed.
