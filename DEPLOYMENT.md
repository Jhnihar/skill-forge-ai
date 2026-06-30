# Project Deployment Checklist

## Pre-Deployment

- [ ] Update Firebase config in `src/firebase.js`
- [ ] Test all features locally
- [ ] Build production version: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Update Firestore security rules
- [ ] Review authentication settings

## Firebase Security Rules

### Firestore Rules (Production)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Only authenticated users can read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Apply Rules

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Click on "Rules" tab
4. Paste the rules above
5. Click "Publish"

## Environment Variables

Create `.env` file (don't commit to git):

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_actual_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Deployment Steps

### Option 1: Vercel (Easiest)

1. Install Vercel CLI

   ```bash
   npm i -g vercel
   ```

2. Login to Vercel

   ```bash
   vercel login
   ```

3. Deploy

   ```bash
   vercel
   ```

4. Follow prompts to deploy

### Option 2: Netlify

1. Build the project

   ```bash
   npm run build
   ```

2. Install Netlify CLI

   ```bash
   npm i -g netlify-cli
   ```

3. Deploy

   ```bash
   netlify deploy --prod
   ```

4. Point to `dist` directory when prompted

### Option 3: Firebase Hosting

1. Install Firebase CLI

   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase

   ```bash
   firebase login
   ```

3. Initialize hosting

   ```bash
   firebase init hosting
   ```

   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as SPA: Yes
   - Don't overwrite index.html

4. Build the project

   ```bash
   npm run build
   ```

5. Deploy
   ```bash
   firebase deploy
   ```

## Post-Deployment

- [ ] Test signup/login on live site
- [ ] Verify all routes work
- [ ] Test Learn Mode flow
- [ ] Test Build Mode flow
- [ ] Check dark/light theme toggle
- [ ] Test on mobile devices
- [ ] Monitor Firebase console for errors

## Performance Optimization

### Enable Gzip Compression

Most hosting providers do this automatically.

### Add Analytics (Optional)

```javascript
// In src/firebase.js
import { getAnalytics } from "firebase/analytics";
const analytics = getAnalytics(app);
```

### Enable Caching

Add to `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "firebase-vendor": [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
          ],
          "monaco-vendor": ["@monaco-editor/react"],
        },
      },
    },
  },
});
```

## Monitoring

### Check Firebase Console

- Authentication → Users (monitor signups)
- Firestore → Data (verify user data)
- Analytics (if enabled)

### Error Tracking

Consider adding Sentry or similar:

```bash
npm install @sentry/react
```

## Domain Configuration

### Custom Domain on Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Update DNS records as instructed

### Custom Domain on Netlify

1. Go to Netlify Dashboard
2. Site settings → Domain management
3. Add custom domain
4. Update DNS records

### Custom Domain on Firebase

1. Firebase Console → Hosting
2. Add custom domain
3. Verify ownership
4. Update DNS records

## Security Checklist

- [ ] Firebase Security Rules applied
- [ ] Environment variables not exposed
- [ ] HTTPS enabled (automatic on most platforms)
- [ ] CORS configured if needed
- [ ] Authentication properly configured
- [ ] Rate limiting considered

## Backup Strategy

### Firestore Backup

1. Go to Firebase Console
2. Firestore → Import/Export
3. Set up scheduled backups

### Code Backup

- Regularly push to GitHub
- Tag releases
- Maintain changelog

## Support & Maintenance

### Regular Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions carefully
npm install react@latest react-dom@latest
```

### Monitor Issues

- Check Firebase Console daily
- Review user feedback
- Monitor error logs
- Track performance metrics

---

**Deployment Complete!** 🎉

Your SkillForge AI platform is now live and ready for users!
