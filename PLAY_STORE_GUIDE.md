# Google Play Store Deployment Guide (`Mystic 8-Ball`)

This project is pre-configured for native Android packaging using **Capacitor 6** (`com.mystic8ball.oracle`).

## 1. Prerequisites
- **Node.js** 18+ and `npm`
- **Android Studio** (Koala or newer) with Android SDK 34 (API Level 34+)
- **Java JDK 17** (bundled with Android Studio)

## 2. Generate & Sync the Android Project
From the project root (`mystic-8-ball`):

```bash
# 1. Install Capacitor dependencies
npm install

# 2. Generate the Android native project (first time only)
npm run android:init

# 3. Copy modular web assets into ./www and sync native plugins
npm run android:sync

# 4. Generate adaptive launcher icons & splash screens from ./assets/icon.svg
npx @capacitor/assets generate --android
```

## 3. Configure Release Signing (Security Best Practices)
> **Security Directive**: Never commit `.keystore` / `.jks` files or signing passwords to Git. `.gitignore` already excludes `*.keystore`, `*.jks`, and `key.properties`.

1. Generate an upload keystore using `keytool`:
   ```bash
   keytool -genkey -v -keystore mystic8ball-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
   ```
2. Create `android/key.properties` (excluded from Git):
   ```properties
   storePassword=[REDACTED_STORE_PASSWORD]
   keyPassword=[REDACTED_KEY_PASSWORD]
   keyAlias=upload
   storeFile=../mystic8ball-upload.jks
   ```

## 4. Build the Signed Android App Bundle (`.aab`)
Google Play requires an **Android App Bundle (`.aab`)** targeting API level 34+:

1. Open the Android project in Android Studio:
   ```bash
   npm run android:open
   ```
2. In Android Studio, select **Build → Generate Signed App Bundle / APK...** → choose **Android App Bundle** → select your `mystic8ball-upload.jks` key → choose the **release** build variant.
3. Or build via Gradle CLI from `android/`:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   The signed bundle will be output at `android/app/build/outputs/bundle/release/app-release.aab`.

## 5. Google Play Console Checklist
- **Application ID**: `com.mystic8ball.oracle`
- **Category**: Entertainment / Casual
- **Data Safety**: The app stores Oracle Chronicle history strictly on-device (`localStorage`), requires no account creation, and transmits zero personal data.
- **Content Rating**: Complete the IARC questionnaire (no violence, no user-generated public content, no purchases).
- **Store Listing Assets**:
  - High-res icon: 512×512 PNG (exportable from `assets/icon.svg`)
  - Feature graphic: 1024×500 PNG/JPEG
  - Phone screenshots: Minimum 2 screenshots (16:9 or 9:16 aspect ratio)
