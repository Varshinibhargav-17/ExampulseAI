# ExamPulse AI - Frontend Documentation

## 🎓 Overview

ExamPulse AI is a behavioral analytics platform for maintaining online assessment integrity without invasive video proctoring. The frontend is built with React, featuring a premium dark-themed UI with glassmorphism effects and real-time monitoring capabilities.

## ✨ Features Implemented

### 🎨 Design System
- **Premium Dark Theme** with gradient accents
- **Glassmorphism Effects** for modern aesthetics
- **Smooth Animations** and micro-interactions
- **Responsive Design** for all screen sizes
- **Custom Components** (buttons, cards, modals, badges, etc.)

### 👨‍🎓 Student Features

#### 1. **Authentication**
- Login page with role selection (Student/Proctor)
- Multi-step registration with progress indicator
- Protected routes with automatic redirection

#### 2. **Dashboard**
- Welcome screen with personalized greeting
- Stats overview (exams completed, average score, integrity score)
- Upcoming exams list with quick start
- Recent activity timeline
- Quick action buttons
- Exam tips sidebar

#### 3. **Baseline Setup**
- Onboarding flow for new students
- Practice test requirements (2 tests)
- Progress tracking
- Educational content about what's tracked
- Privacy-first messaging

#### 4. **Exam Interface**
- Clean, distraction-free exam environment
- Question navigation with visual indicators
- Timer with color-coded warnings
- Progress bar showing completion
- Flag questions for review
- Answer selection with visual feedback
- Question grid for quick navigation
- Submit confirmation modal

#### 5. **Behavioral Monitoring** (Active during exams)
- Tab switch detection and warnings
- Copy-paste prevention
- Right-click disabled
- Window blur tracking
- Real-time incident logging
- Warning modals for suspicious activity

#### 6. **Results Page**
- Exam history with scores
- Integrity score visualization
- Detailed performance breakdown
- Incident reports
- Download/email options

#### 7. **Exam Submission**
- Success confirmation screen
- Next steps guide
- Auto-redirect to dashboard
- Email notification info

### 👨‍🏫 Proctor Features

#### 1. **Live Monitoring Dashboard**
- Real-time exam overview
- Active student count
- Progress tracking
- Alert system with risk levels

#### 2. **Risk Scoring**
- Circular risk indicators
- Color-coded levels (Low/Medium/High)
- Real-time score updates
- Visual progress rings

#### 3. **Alert Management**
- High-risk student highlighting
- Incident timeline
- Detailed student views
- Behavior comparison tables

#### 4. **Student Detail Modal**
- Complete incident log
- Risk score breakdown
- Baseline vs current behavior
- Action buttons (flag/dismiss)

#### 5. **Analytics**
- Quick stats sidebar
- Recent incidents feed
- Behavior metrics
- Export capabilities

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Student dashboard
│   │   ├── Header.jsx              # Navigation header
│   │   ├── LoadingSpinner.jsx      # Loading states
│   │   ├── Modal.jsx               # Reusable modal
│   │   ├── RiskScoreIndicator.jsx  # Circular risk meter
│   │   └── StatCard.jsx            # Metric display cards
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx           # Authentication
│   │   ├── RegisterPage.jsx        # User registration
│   │   ├── BaselineSetup.jsx       # Baseline creation
│   │   ├── ExamPage.jsx            # Exam interface
│   │   ├── ExamSubmitted.jsx       # Submission confirmation
│   │   ├── ResultsPage.jsx         # Exam results
│   │   └── ProctorDashboard.jsx    # Proctor monitoring
│   │
│   ├── behavior/
│   │   └── typing.js               # Behavioral tracking
│   │
│   ├── App.jsx                     # Route configuration
│   ├── main.jsx                    # App entry point
│   ├── index.css                   # Design system & styles
│   ├── socket.js                   # WebSocket connection
│   └── api.js                      # API utilities
│
├── package.json
└── README.md
```

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--color-primary: hsl(250, 84%, 54%)        /* Purple */
--color-secondary: hsl(200, 98%, 39%)      /* Blue */
--color-accent: hsl(340, 82%, 52%)         /* Pink */

/* Status Colors */
--color-success: hsl(142, 76%, 36%)        /* Green */
--color-warning: hsl(38, 92%, 50%)         /* Orange */
--color-danger: hsl(0, 84%, 60%)           /* Red */

/* Background */
--color-bg-primary: hsl(240, 10%, 3.9%)    /* Dark */
--color-bg-secondary: hsl(240, 5.9%, 10%)  /* Darker */
--color-bg-tertiary: hsl(240, 4.8%, 15%)   /* Darkest */
```

### Component Classes

#### Buttons
- `btn` - Base button
- `btn-primary` - Primary action (gradient purple)
- `btn-secondary` - Secondary action
- `btn-success` - Success action (green)
- `btn-danger` - Destructive action (red)
- `btn-warning` - Warning action (orange)
- `btn-ghost` - Transparent button
- `btn-sm` / `btn-lg` - Size variants

#### Cards
- `card` - Standard card with hover effects
- `card-glass` - Glassmorphism effect
- `card-gradient` - Gradient background

#### Badges
- `badge-success` - Green badge
- `badge-warning` - Orange badge
- `badge-danger` - Red badge
- `badge-info` - Blue badge
- `badge-primary` - Purple badge

#### Inputs
- `input` - Text input field
- `input-group` - Input with label
- `input-label` - Input label

#### Alerts
- `alert-success` - Success message
- `alert-warning` - Warning message
- `alert-danger` - Error message
- `alert-info` - Info message

## 🔄 User Flows

### Student Registration Flow
```
1. Visit /register
2. Enter personal info (name, email, roll number)
3. Set password
4. Redirect to /baseline-setup
5. Complete 2 practice tests
6. Redirect to / (dashboard)
```

### Taking an Exam Flow
```
1. Dashboard → Click "Start Test" on exam
2. Redirect to /exam
3. Answer questions with behavioral tracking
4. Submit exam
5. Redirect to /exam-submitted
6. Auto-redirect to dashboard after 5s
```

### Proctor Monitoring Flow
```
1. Login as proctor
2. View /proctor dashboard
3. See live exam list
4. Monitor alerts in real-time
5. Click student to view details
6. Take action (flag/dismiss)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Setup

The app expects a backend running on `http://localhost:5000` by default. Update `src/api.js` and `src/socket.js` if your backend runs elsewhere.

## 🔌 API Integration

### Socket Events

#### Student Events
```javascript
// Join exam
socket.emit("join_exam", { user_id, exam_id, role: "student" })

// Submit exam
socket.emit("submit_exam", { user_id, exam_id, answers, time_taken })

// Report suspicious activity
socket.emit("suspicious_activity", { user_id, exam_id, type, count })
```

#### Proctor Events
```javascript
// Join monitoring room
socket.emit("join_exam", { user_id, exam_id, role: "proctor" })

// Listen for alerts
socket.on("student_alert", (data) => { ... })

// Listen for risk updates
socket.on("risk_update", (data) => { ... })
```

## 📊 Behavioral Tracking

### Metrics Tracked

1. **Keystroke Dynamics**
   - Typing speed (WPM)
   - Pause duration
   - Backspace frequency

2. **Mouse Patterns**
   - Movement speed
   - Idle time
   - Click patterns

3. **Window Activity**
   - Tab switches
   - Window blur events
   - Focus duration

4. **Answer Patterns**
   - Time per question
   - Answer changes
   - Skip patterns

### Implementation

Tracking is implemented in `src/behavior/typing.js` and activated during exams. All data is sent via WebSocket to the backend for real-time analysis.

## 🎯 Key Features

### Real-time Risk Scoring
- Circular progress indicators
- Color-coded risk levels
- Animated transitions
- Live updates via WebSocket

### Warning System
- Modal popups for violations
- Incident logging
- Proctor notifications
- Student awareness

### Privacy-First Design
- No video recording
- No screenshots
- Anonymous behavioral metrics
- GDPR/FERPA compliant

## 🎨 UI Highlights

### Animations
- Smooth page transitions
- Hover effects on cards
- Progress bar animations
- Loading spinners
- Float animations

### Responsive Design
- Mobile-friendly layouts
- Tablet optimization
- Desktop-first approach
- Flexible grids

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast compliance

## 🔒 Security Features

### Exam Protection
- Right-click disabled
- Copy-paste prevention
- Tab switch detection
- Window blur monitoring
- Auto-submit on time expiry

### Authentication
- Protected routes
- Role-based access
- Session management
- Auto-logout on inactivity

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { ... }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }
```

## 🎓 Best Practices

1. **Component Reusability** - All UI elements are modular
2. **Consistent Styling** - Design system enforced throughout
3. **Performance** - Optimized re-renders with React hooks
4. **Code Organization** - Clear separation of concerns
5. **Error Handling** - Graceful fallbacks for all states

## 🐛 Known Limitations

1. Mock data used for development (replace with API calls)
2. Practice test interface not fully implemented
3. Analytics charts need charting library integration
4. Email functionality requires backend integration

## 🚀 Future Enhancements

1. **Advanced Analytics**
   - Interactive charts (Chart.js/Recharts)
   - Trend analysis
   - Comparative metrics

2. **Enhanced Monitoring**
   - Live video feed option
   - Screen sharing
   - Audio monitoring

3. **Mobile App**
   - React Native version
   - Native notifications
   - Offline support

4. **Accessibility**
   - Screen reader optimization
   - High contrast mode
   - Font size controls

## 📄 License

This project is part of ExamPulse AI - Behavioral Analytics for Online Assessment Integrity.

## 👥 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ using React, Tailwind CSS, and Socket.io**
