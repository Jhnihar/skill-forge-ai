# SkillForge AI - AI-Powered Learning Platform

A full-stack AI-based learning platform that offers two distinct modes: **Learn Mode** for adaptive learning tests and **Build Mode** for AI-assisted code development.

## 🚀 Features

### Core Features

- **Dual Mode System**: Choose between Learn Mode and Build Mode
- **Firebase Authentication**: Secure user signup and login
- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Works seamlessly on all devices
- **Mode Switching**: Switch between modes anytime (progress is mode-specific)

### Learn Mode Features

- **Adaptive AI Testing**: Dynamic difficulty adjustment based on performance
- **Pre-Knowledge Tests**: Assess your level before learning
- **Learning Resources**: Curated video tutorials and study notes
- **Final Assessment**: Comprehensive test with accuracy tracking
- **Certificate Generation**: Earn certificates with 85%+ accuracy
- **Job Application System**: Apply for jobs after completing courses
- **Progress Tracking**: Monitor completed courses and applications

### Build Mode Features

- **Monaco Code Editor**: Professional-grade code editor
- **Build From Scratch**: Generate projects from natural language descriptions
- **Debug Assistant**: AI-powered bug detection and fixing
- **Multi-File Support**: Work with HTML, CSS, and JavaScript files
- **Real-Time AI Explanations**: Understand concepts as you code
- **Demo Projects**: Pre-loaded examples for learning

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Language**: JavaScript (No TypeScript)
- **Routing**: React Router DOM

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hcf
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore Database
   - Copy your Firebase configuration
   - Update `src/firebase.js` with your credentials:

   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
   };
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
hcf/
├── src/
│   ├── components/           # Reusable components (if needed)
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.jsx  # Authentication state management
│   │   └── ThemeContext.jsx # Dark/Light theme management
│   ├── pages/               # Page components
│   │   ├── Landing.jsx      # Landing page
│   │   ├── Login.jsx        # Login page
│   │   ├── Signup.jsx       # Signup page
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── Profile.jsx      # User profile page
│   │   ├── LearnMode/       # Learn Mode pages
│   │   │   ├── Courses.jsx
│   │   │   ├── CourseTest.jsx
│   │   │   ├── JobList.jsx
│   │   │   └── AppliedJobs.jsx
│   │   └── BuildMode/       # Build Mode pages
│   │       └── BuildWorkspace.jsx
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   ├── firebase.js          # Firebase configuration
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Dependencies
```

## 🎯 Usage

### Getting Started

1. **Sign Up**
   - Visit the landing page
   - Click "Sign Up"
   - Enter your name, email, password
   - **Important**: Choose your learning mode (Learn or Build)
   - Submit to create your account

2. **Learn Mode Flow**
   - Browse available courses (Python, HTML, CSS)
   - Start a course to take the pre-knowledge test
   - Get adaptive questions based on your performance
   - Study recommended resources
   - Take the final test
   - Earn certificate with 85%+ accuracy
   - Apply for jobs

3. **Build Mode Flow**
   - Enter a project idea (e.g., "Build a counter app")
   - AI generates complete project structure
   - View code in Monaco editor
   - Read AI explanations in the right panel
   - Switch to Debug Mode to fix buggy code
   - Load demo projects to practice

### Switching Modes

- Go to Profile page
- Click "Switch to [Build/Learn] Mode"
- Confirm the switch
- Note: Progress does not transfer between modes

## 🔥 Firebase Database Structure

```javascript
users/
  {userId}/
    name: string
    email: string
    selectedMode: "learn" | "build"
    createdAt: timestamp
    completedCourses: [
      {
        courseName: string,
        accuracy: number,
        completedAt: timestamp
      }
    ]
    appliedJobs: [
      {
        jobId: string,
        title: string,
        company: string,
        appliedAt: timestamp
      }
    ]
```

## 🎨 Available Courses (Learn Mode)

1. **Python** - Master Python programming
2. **HTML** - Web development foundation
3. **CSS** - Modern styling techniques

## 💼 Available Jobs (Learn Mode)

1. **Frontend Developer Intern** - TechCorp Solutions
2. **Python Developer** - DataFlow Inc
3. **Web Developer** - Creative Designs Studio

## 🐛 Demo Bug Examples (Build Mode)

The Counter App demo includes intentional bugs:

- Missing semicolons
- Variable name typo (`coun` instead of `count`)
- AI detects and explains these errors

## 🎨 Customization

### Updating Courses

Edit `src/pages/LearnMode/Courses.jsx`:

```javascript
const AVAILABLE_COURSES = [
  {
    id: "python",
    name: "Python",
    description: "Your description",
    icon: "🐍",
    color: "from-blue-600 to-cyan-600",
  },
];
```

### Updating Jobs

Edit `src/pages/LearnMode/JobList.jsx`:

```javascript
const AVAILABLE_JOBS = [
  {
    id: "job-id",
    title: "Job Title",
    company: "Company Name",
    // ... more fields
  },
];
```

## 📝 Important Notes

### CRITICAL RULES

- **No Pre-Seeded Data**: Every user starts fresh
- **Empty Progress**: No pre-existing user history
- **Mode Isolation**: Learn and Build modes maintain separate data
- **Dynamic Creation**: All progress created after signup

### Security

- Firebase Authentication handles password security
- Firestore Security Rules should be configured
- Environment variables for sensitive data

### Performance

- Code splitting with React.lazy (can be added)
- Optimized Monaco Editor loading
- Efficient state management with Context API

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Firebase Hosting (Optional)

```bash
firebase init hosting
firebase deploy
```

### Other Hosting Options

- Vercel
- Netlify
- GitHub Pages

## 🧪 Testing

To test the platform:

1. **Test Learn Mode**:
   - Sign up with Learn Mode
   - Take Python course test
   - Answer questions to see adaptive difficulty
   - Check learning resources
   - Complete final test
   - Apply for jobs if 85%+ accuracy

2. **Test Build Mode**:
   - Sign up with Build Mode
   - Enter: "Build a simple counter app"
   - Review generated code
   - Switch to Debug Mode
   - Load buggy counter demo
   - See AI bug detection

## 🤝 Contributing

This is a hackathon project. Feel free to:

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

MIT License - feel free to use for your own projects

## 🎓 Educational Purpose

This platform demonstrates:

- Full-stack development with React + Firebase
- AI-assisted learning concepts
- Code editor integration
- Adaptive testing algorithms
- Mode-based application architecture

## 🙏 Acknowledgments

- **React** - UI framework
- **Vite** - Build tool
- **Firebase** - Backend services
- **Monaco Editor** - Code editor
- **Tailwind CSS** - Styling

## 📞 Support

For issues or questions:

- Open an issue on GitHub
- Check the documentation
- Review the code comments

---

**Built with ❤️ for hackathon demo**

Happy Learning & Building! 🚀
