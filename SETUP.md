# SkillForge AI - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
npm install
```

This will install:

- React 18.3.1
- React Router DOM 6.22.0
- Firebase 10.8.0
- Monaco Editor 4.6.0
- Tailwind CSS 3.4.1
- Vite 5.4.11

### Step 2: Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add Project"
   - Name it "SkillForge AI" (or any name)
   - Disable Google Analytics (optional)
   - Click "Create Project"

2. **Enable Authentication**
   - In Firebase Console, go to "Authentication"
   - Click "Get Started"
   - Click on "Email/Password"
   - Enable it and Save

3. **Create Firestore Database**
   - In Firebase Console, go to "Firestore Database"
   - Click "Create Database"
   - Choose "Start in test mode" (for development)
   - Select a location
   - Click "Enable"

4. **Get Firebase Config**
   - In Firebase Console, go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click on "</>" (Web app icon)
   - Register app with nickname "SkillForge Web"
   - Copy the firebaseConfig object

5. **Update Firebase Configuration**
   - Open `src/firebase.js`
   - Replace the config values with your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};
```

### Step 3: Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Step 4: Test the Application

1. **Create Account**
   - Click "Sign Up"
   - Enter name, email, password
   - Choose "Learn Mode"
   - Sign up

2. **Test Learn Mode**
   - Go to "Courses"
   - Click "Start Learning" on Python
   - Take the adaptive test
   - View learning resources
   - Complete final test

3. **Test Mode Switch**
   - Go to "Profile"
   - Click "Switch to Build Mode"
   - Confirm switch

4. **Test Build Mode**
   - Go to "Build Workspace"
   - Enter: "Build a simple counter app"
   - Click "Generate"
   - View generated code and AI explanation

5. **Test Debug Mode**
   - In Build Workspace, click "Debug Mode"
   - Click "Load Demo Buggy Project"
   - Click "Analyze Code"
   - View AI bug detection

## 🔧 Troubleshooting

### Issue: "npm install" fails

**Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Issue: Firebase errors

**Solution**:

- Check that you've enabled Email/Password authentication
- Verify your Firebase config in `src/firebase.js`
- Make sure Firestore is in test mode for development

### Issue: Monaco Editor not loading

**Solution**: Clear browser cache or try a different browser

### Issue: Dark mode not working

**Solution**: Check browser's localStorage is enabled

## 📝 Firestore Security Rules (Production)

For production, update Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎯 Project Features Checklist

- ✅ Landing page with dark/light toggle
- ✅ Firebase authentication (signup/login)
- ✅ Mode selection during signup
- ✅ Dashboard with mode-based navigation
- ✅ Learn Mode with adaptive tests
- ✅ Static courses (Python, HTML, CSS)
- ✅ Job application system
- ✅ Build Mode with Monaco editor
- ✅ AI code generation and debugging
- ✅ Profile page with mode switching
- ✅ Responsive design
- ✅ No pre-seeded user data

## 🚀 Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 📦 Deployment Options

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🎓 Learning Path

1. **Explore the Code**
   - Start with `src/App.jsx` to see routing
   - Check `src/contexts/` for state management
   - Review individual pages in `src/pages/`

2. **Customize**
   - Add more courses in `Courses.jsx`
   - Add more jobs in `JobList.jsx`
   - Modify demo projects in `BuildWorkspace.jsx`

3. **Extend**
   - Add more AI features
   - Implement real AI API (OpenAI, etc.)
   - Add user analytics
   - Create admin dashboard

## 🐛 Known Limitations

- AI responses are mocked (not real AI API)
- Test questions are predefined
- Job applications don't send real emails
- No payment integration
- No real-time collaboration

## 💡 Future Enhancements

- Integrate real AI API (OpenAI GPT-4)
- Add more programming languages
- Real code execution environment
- Video tutorials integration
- Social features (forums, discussions)
- Leaderboards and achievements
- Email notifications
- Advanced analytics dashboard

## 📚 Resources

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)
- [Vite Documentation](https://vitejs.dev)

---

**Need Help?** Check the main README.md or open an issue on GitHub.

Happy coding! 🚀
