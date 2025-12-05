# 🚀 ExamPulse AI - Quick Start Guide

## Welcome to ExamPulse AI! 

This guide will help you get started with the behavioral analytics platform for online exam integrity.

## 📋 What You Have

✅ **Complete Frontend Application** with:
- Premium dark-themed UI with glassmorphism
- Student dashboard and exam interface
- Proctor monitoring dashboard
- Real-time behavioral tracking
- Risk scoring system
- Authentication flow
- Baseline creation system

## 🎯 Quick Start (3 Steps)

### Step 1: Start the Development Server

The server should already be running! If not:

```bash
cd frontend
npm run dev
```

Visit: `http://localhost:5173`

### Step 2: Explore the Application

#### As a Student:
1. Click "Create Account" on login page
2. Fill in your details
3. Complete baseline setup (2 practice tests)
4. Take an exam from the dashboard
5. View your results

#### As a Proctor:
1. Login and select "Proctor" role
2. View live monitoring dashboard
3. See real-time alerts
4. Click on students to view details
5. Review behavioral analytics

### Step 3: Test the Features

**Student Flow:**
```
Login → Dashboard → Start Test → Exam Interface → Submit → Results
```

**Proctor Flow:**
```
Login → Proctor Dashboard → View Alerts → Student Details → Take Action
```

## 🎨 Design Highlights

### Color-Coded Risk Levels
- 🟢 **Green (0-30%)**: Normal behavior
- 🟡 **Yellow (30-70%)**: Warning - minor deviations
- 🔴 **Red (70-100%)**: High risk - significant anomalies

### Key UI Components
- **Glassmorphism Cards**: Frosted glass effect with blur
- **Gradient Buttons**: Smooth color transitions
- **Animated Progress**: Real-time visual feedback
- **Risk Indicators**: Circular progress with color coding
- **Modal Dialogs**: Overlay popups for details

## 📊 Features to Test

### 1. Behavioral Tracking (During Exam)
- Try switching tabs → Warning appears
- Attempt to copy text → Blocked & logged
- Right-click → Disabled
- Window blur → Tracked

### 2. Real-time Monitoring (Proctor)
- See active students
- View risk scores update
- Check incident timeline
- Review behavior comparisons

### 3. Results & Analytics
- View exam history
- Check integrity scores
- Download reports
- See performance trends

## 🔑 Test Credentials

Use any email/password combination - the app uses mock authentication for development.

**Example:**
- Email: `student@university.edu`
- Password: `password123`

## 🎓 User Roles

### Student
- Take exams
- View results
- Update baseline
- Track progress

### Proctor
- Monitor live exams
- Review alerts
- Analyze behavior
- Generate reports

## 📱 Pages Overview

| Route | Description | Role |
|-------|-------------|------|
| `/login` | Authentication | Public |
| `/register` | New user signup | Public |
| `/` | Student dashboard | Student |
| `/exam` | Exam interface | Student |
| `/baseline-setup` | Baseline creation | Student |
| `/results` | Exam results | Student |
| `/exam-submitted` | Submission confirmation | Student |
| `/proctor` | Live monitoring | Proctor |

## 🎨 Customization

### Change Theme Colors

Edit `src/index.css`:

```css
:root {
  --color-primary: hsl(250, 84%, 54%);  /* Purple */
  --color-accent: hsl(340, 82%, 52%);   /* Pink */
  /* Modify these for different color schemes */
}
```

### Modify Risk Thresholds

Edit risk calculation in components:

```javascript
// Low: < 0.3
// Medium: 0.3 - 0.7
// High: > 0.7
```

## 🔌 Backend Integration

### Connect to Your Backend

1. Update `src/api.js`:
```javascript
const API_BASE_URL = "http://your-backend-url:5000";
```

2. Update `src/socket.js`:
```javascript
export const socket = io("http://your-backend-url:5000");
```

### API Endpoints Needed

```
POST /api/auth/login
POST /api/auth/register
GET  /api/exams
POST /api/exams/:id/submit
GET  /api/results
POST /api/baseline/create
```

### WebSocket Events

```javascript
// Student
socket.emit("join_exam", { user_id, exam_id, role })
socket.emit("submit_exam", { user_id, exam_id, answers })
socket.emit("suspicious_activity", { user_id, exam_id, type })

// Proctor
socket.on("student_alert", (data) => { ... })
socket.on("risk_update", (data) => { ... })
```

## 🐛 Troubleshooting

### Dev Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Styles Not Loading
- Check if `index.css` is imported in `main.jsx`
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)

### Routes Not Working
- Ensure React Router is installed
- Check browser console for errors
- Verify all imports in `App.jsx`

## 📚 Learn More

### Key Technologies
- **React 19**: UI framework
- **Tailwind CSS 4**: Styling
- **React Router**: Navigation
- **Socket.io**: Real-time communication
- **Vite**: Build tool

### Documentation
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Socket.io](https://socket.io)

## 🎯 Next Steps

1. **Connect Backend**: Integrate with your Flask API
2. **Add Charts**: Install Chart.js or Recharts for analytics
3. **Implement ML**: Connect risk scoring to ML models
4. **Add Tests**: Write unit tests with Vitest
5. **Deploy**: Build and deploy to production

## 💡 Pro Tips

1. **Use Browser DevTools**: Inspect network requests and console
2. **Test Responsiveness**: Use device emulation
3. **Check Accessibility**: Use Lighthouse audit
4. **Monitor Performance**: Watch for re-renders
5. **Follow React Best Practices**: Use hooks properly

## 🎉 You're All Set!

Your ExamPulse AI frontend is ready to use. Start exploring the features and customize as needed!

### Need Help?
- Check the main README.md for detailed documentation
- Review component code for implementation details
- Test each feature thoroughly before production

---

**Happy Coding! 🚀**
