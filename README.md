# Deepfake Detector

Simple mobile app to detect deepfake videos.

## Quick Start

1. Clone repo
2. Run: `npm install`
3. Run: `npx expo start`
4. Scan QR with Expo Go app

## Build APK (GitHub Actions)

1. Go to https://expo.dev → Get access token
2. Add token to GitHub repo secrets as `EXPO_TOKEN`
3. Push code or click "Actions" → "Build APK" → "Run workflow"
4. Download APK from https://expo.dev after 10 mins

## Local Development

```bash
npm install
npx expo start
```

Press `a` for Android or `i` for iOS.
```

### 8. `setup.sh` (Optional)
```bash
#!/bin/bash
echo "🚀 Setting up Deepfake Detector..."
npm install
npx expo install expo-image-picker expo-av
echo "✅ Done! Run: npx expo start"
