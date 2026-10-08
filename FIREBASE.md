# Firebase Migration Guide

## Prerequisites

1. Node.js 18+ installed
2. Firebase CLI installed: `npm install -g firebase-tools`
3. A Firebase project created at https://console.firebase.google.com
4. Firebase services enabled:
   - **Firestore Database**
   - **Authentication** (Email/Password provider)
   - **Storage**
   - **Hosting**
   - **Cloud Functions**

## Step 1: Configure Firebase Project

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init
```

Select:
- Hosting (configure as single-page app)
- Firestore
- Functions
- Storage (optional, for photos)

When prompted:
- Public directory: `dist`
- Single-page app: Yes
- Overwrite index.html: No
- Functions language: JavaScript
- Use ESLint: No (or Yes if you want)
- Install dependencies: Yes

## Step 2: Update Firebase Configuration

Edit `.firebaserc` and replace `tap-and-pass-prod` with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

Edit `.env.firebase` and add your actual Firebase config values from the Firebase Console:
- Go to Project Settings > General > Your apps > Web app
- Copy the firebaseConfig values

## Step 3: Install Dependencies

```bash
npm install
cd functions && npm install && cd ..
```

## Step 4: Migrate Data to Firestore

Option A - Automated migration from existing JSON files:
```bash
# Set up service account credentials
# Download serviceAccountKey.json from Firebase Console > Project Settings > Service Accounts
export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
npm run migrate:firestore
```

Option B - Manual seeding via Cloud Function:
```bash
firebase deploy --only functions
# Call the seed function endpoint
```

## Step 5: Deploy to Firebase

### Deploy everything:
```bash
npm run firebase:deploy
```

### Deploy individually:
```bash
npm run firebase:deploy:hosting      # Deploy frontend only
npm run firebase:deploy:functions    # Deploy backend API
npm run firebase:deploy:firestore    # Deploy Firestore rules
```

## Step 6: Configure Firebase Auth

1. Go to Firebase Console > Authentication > Sign-in method
2. Enable **Email/Password** provider
3. Create your first admin user manually or via script

## Step 7: Test Locally with Emulators

```bash
npm run firebase:emulators:start
```

This starts:
- Hosting emulator on http://localhost:5000
- Functions emulator on http://localhost:5001
- Firestore emulator on http://localhost:8080
- Auth emulator on http://localhost:9099

## Architecture Overview

```
Firebase Hosting (Frontend)
    ↓
Cloud Functions (API)
    ↓
Firestore (Database)
    ↓
Firebase Auth (Authentication)
```

## Migration Checklist

- [ ] Create Firebase project
- [ ] Enable Firestore, Auth, Hosting, Functions
- [ ] Update `.firebaserc` with project ID
- [ ] Update `.env.firebase` with config
- [ ] Install dependencies
- [ ] Migrate data to Firestore
- [ ] Deploy Firestore rules
- [ ] Deploy Cloud Functions
- [ ] Deploy frontend to Hosting
- [ ] Configure Auth providers
- [ ] Test all features
- [ ] Update DNS (if using custom domain)

## Notes

- WebSocket hardware integration requires Cloud Run or a separate server
- MQTT integration requires a persistent connection (not suitable for Cloud Functions)
- For production, consider using Cloud Run for the hardware WebSocket server
- File uploads (traveler photos) use Firebase Storage
- Offline mode is handled by Firestore's built-in persistence
