# SkillForge AI - Project Overview

## 🎯 Project Description

SkillForge AI is a comprehensive full-stack learning platform that combines AI-powered adaptive learning with intelligent code development assistance. Built with modern web technologies, it offers two distinct modes tailored to different learning styles.

## ✨ Key Innovation

**Dual-Mode Architecture**: Users choose between Learn Mode (structured courses with adaptive testing) or Build Mode (hands-on coding with AI assistance) during signup, creating personalized learning pathways.

## 🏗️ Architecture

### Frontend Architecture

```
React (Vite) + Tailwind CSS
├── Context API (State Management)
│   ├── AuthContext (User authentication state)
│   └── ThemeContext (Dark/Light mode)
├── React Router (Navigation)
└── Monaco Editor (Code editing)
```

### Backend Architecture

```
Firebase
├── Authentication (Email/Password)
└── Firestore Database
    └── users/{userId}
        ├── Profile data
        ├── completedCourses[]
        └── appliedJobs[]
```

## 📊 Data Flow

### User Registration Flow

```
1. User visits landing page
2. Clicks "Sign Up"
3. Enters: name, email, password
4. SELECTS MODE (Learn or Build) - REQUIRED
5. Firebase creates auth user
6. Firestore creates user document with:
   - name, email, selectedMode, createdAt
   - completedCourses: [] (empty)
   - appliedJobs: [] (empty)
7. Redirects to mode-specific dashboard
```

### Learn Mode Flow

```
1. User selects course (Python/HTML/CSS)
2. Pre-knowledge adaptive test starts
   ├── Correct answer → difficulty increases
   ├── Wrong answer → same difficulty
   └── 2 wrongs at same level → exit test
3. View learning resources (videos/notes)
4. Final adaptive test (10 questions)
5. Calculate accuracy percentage
6. If ≥85%: Generate certificate + enable job applications
7. Store in Firestore: {courseName, accuracy, completedAt}
```

### Build Mode Flow

```
1. User enters project idea
2. AI analyzes and generates:
   ├── Project structure
   ├── HTML file
   ├── CSS file
   └── JavaScript file
3. Monaco Editor displays code
4. AI Explanation panel shows:
   ├── What was created
   ├── Why certain approaches
   └── How it works
5. User can switch to Debug Mode
6. Load buggy code → AI detects errors → Explains fixes
```

## 🔒 Security Model

### Authentication

- Firebase Authentication with email/password
- Secure password hashing (handled by Firebase)
- JWT tokens for session management

### Database Security

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### Data Privacy

- Users can only access their own data
- No cross-user data sharing
- Mode switching maintains data isolation

## 🎨 Design System

### Color Palette

```css
Primary: #0ea5e9 (Blue)
Secondary: #764ba2 (Purple)
Success: #10b981 (Green)
Error: #ef4444 (Red)
Warning: #f59e0b (Yellow)
```

### Component Patterns

- **Card**: Consistent shadow, border, padding
- **Button Primary**: Blue gradient with hover effects
- **Button Secondary**: Gray with dark mode support
- **Input Field**: Focus ring with primary color

### Responsive Breakpoints

```css
sm: 640px   // Mobile
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large Desktop
```

## 📱 Features Breakdown

### Landing Page

- Hero section with gradient text
- Feature cards (3 columns)
- Dark/Light theme toggle
- Login/Signup navigation

### Authentication

- Email/password signup
- Mode selection (radio buttons)
- Form validation
- Error handling
- Auto-redirect after login

### Dashboard

- Mode-specific sidebar navigation
- Quick stats cards
- Quick action buttons
- Mobile-responsive hamburger menu

### Learn Mode Components

1. **Courses Page**
   - Course cards with icons
   - Completion status
   - Accuracy display
   - Retake option

2. **Course Test**
   - Adaptive question generation
   - Real-time difficulty adjustment
   - Progress tracking
   - Immediate feedback

3. **Job List**
   - Job cards with details
   - Requirement matching
   - Apply button with validation
   - Application tracking

4. **Applied Jobs**
   - Application history
   - Status tracking
   - Application tips

### Build Mode Components

1. **Build Workspace**
   - 3-panel layout:
     - Left: File explorer
     - Center: Monaco Editor
     - Right: AI explanations
   - Mode switcher (Build/Debug)
   - Demo project loader
   - Real-time code editing

### Profile Page

- User information display
- Mode switching functionality
- Progress summary
- Completed courses list
- Applied jobs list

## 🔧 Technical Implementation

### State Management

```javascript
// AuthContext
- currentUser: Firebase auth user
- userProfile: Firestore user data
- loading: Authentication state

// ThemeContext
- isDark: Boolean
- toggleTheme: Function
```

### Routing Structure

```
/                    → Landing
/login               → Login
/signup              → Signup
/dashboard           → Dashboard (protected)
/profile             → Profile (protected)
/courses             → Courses (protected, learn mode)
/courses/:id/test    → Course Test (protected, learn mode)
/jobs                → Job List (protected, learn mode)
/applied-jobs        → Applied Jobs (protected, learn mode)
/build               → Build Workspace (protected, build mode)
```

### Protected Routes

```javascript
<ProtectedRoute>
  // Only accessible if user is authenticated // Redirects to /login if not
  authenticated
</ProtectedRoute>
```

## 📚 Predefined Data (Static)

### Courses

```javascript
{
  python: { name: 'Python', description: '...', icon: '🐍' },
  html: { name: 'HTML', description: '...', icon: '🌐' },
  css: { name: 'CSS', description: '...', icon: '🎨' }
}
```

### Jobs

```javascript
[
  { id: 'frontend-intern', title: 'Frontend Developer Intern', ... },
  { id: 'python-dev', title: 'Python Developer', ... },
  { id: 'web-developer', title: 'Web Developer', ... }
]
```

### Demo Projects

```javascript
{
  counter: { /* Correct counter app */ },
  buggy_counter: { /* Counter with intentional bugs */ }
}
```

## 🧪 Testing Scenarios

### Scenario 1: New Learn Mode User

```
1. Sign up with Learn Mode
2. Select Python course
3. Take pre-test (answer some correctly, some wrong)
4. View learning resources
5. Take final test
6. Score 90% → Get certificate
7. View available jobs
8. Apply to Python Developer job
9. Check applied jobs page
```

### Scenario 2: New Build Mode User

```
1. Sign up with Build Mode
2. Go to Build Workspace
3. Enter: "Build a counter app"
4. View generated code
5. Read AI explanations
6. Switch to Debug Mode
7. Load buggy demo
8. Click "Analyze Code"
9. See bug detection
```

### Scenario 3: Mode Switching

```
1. Start in Learn Mode
2. Complete a course
3. Go to Profile
4. Switch to Build Mode
5. Verify sidebar changes
6. Verify completed courses don't show in Build Mode
7. Switch back to Learn Mode
8. Verify courses are still there
```

## 🚀 Performance Optimizations

### Code Splitting

- Lazy loading of Monaco Editor
- Route-based code splitting (can be added)

### Asset Optimization

- Tailwind CSS purging (automatic)
- Vite asset optimization
- SVG icons instead of images

### Firebase Optimizations

- Single user document per user
- Minimal database reads
- Efficient query structure

## 🔮 Future Enhancements

### Short-term

1. Real AI API integration (OpenAI, Anthropic)
2. More course subjects
3. Email notifications
4. Progress charts

### Medium-term

1. Video call with AI tutor
2. Code execution environment
3. Peer coding sessions
4. Achievement system

### Long-term

1. Mobile app (React Native)
2. Corporate training portal
3. API for third-party integrations
4. Marketplace for courses

## 📊 Metrics to Track

### User Engagement

- Daily active users
- Course completion rate
- Average test accuracy
- Job application rate

### Technical Metrics

- Page load time
- Time to interactive
- Firebase read/write operations
- Error rate

## 🎓 Learning Outcomes

Users will learn:

- Programming fundamentals (Python, HTML, CSS)
- Problem-solving skills
- Code debugging techniques
- Project structure understanding
- Best practices

## 💡 Unique Selling Points

1. **Adaptive Learning**: Tests adjust to user knowledge
2. **Dual Modes**: Learn OR build, not both simultaneously
3. **AI Integration**: Intelligent code assistance
4. **Job Ready**: Direct path from learning to employment
5. **No Bloat**: Clean, focused feature set

## 🛠️ Development Guidelines

### Code Style

- Functional components with hooks
- Clear, descriptive variable names
- Comprehensive comments
- Consistent formatting

### Component Structure

```javascript
// Imports
import React, { useState } from "react";

// Component
const ComponentName = () => {
  // State
  const [state, setState] = useState();

  // Functions
  const handleAction = () => {};

  // Render
  return <div>Content</div>;
};

export default ComponentName;
```

### File Organization

- One component per file
- Related components in same directory
- Clear file naming (PascalCase for components)

## 📄 Documentation

- **README.md**: Main project documentation
- **SETUP.md**: Step-by-step setup guide
- **DEPLOYMENT.md**: Deployment instructions
- **PROJECT.md**: This file - comprehensive overview

## 🤝 Contribution Guidelines

1. Fork the repository
2. Create feature branch
3. Make changes with clear commits
4. Test thoroughly
5. Submit pull request

## 📞 Support

For questions or issues:

- Review documentation files
- Check code comments
- Open GitHub issue
- Contact maintainer

---

**Built for hackathon demonstration**
**Showcasing modern web development practices**

© 2026 SkillForge AI - Learn, Build, Succeed
