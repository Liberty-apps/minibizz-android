# Guide Complet - MiniBizz Android APK

## 📱 Conversion Netlify vers Android Native

Votre application MiniBizz a été convertie avec succès de Netlify vers une application Android native utilisant Capacitor.

---

## 🚀 Prérequis

- Node.js 18 ou 20
- Android Studio avec SDK Android
- Java 17 ou supérieur
- Un compte Google Play Console (pour publication)

---

## 🧱 Structure du projet

```
minibizz-android/
├── .github/workflows/           # (Optionnel) GitHub Actions
├── android/                     # Projet Android généré par Capacitor
│   └── app/
│       ├── build.gradle        # Configuration signature
│       └── src/main/
│           ├── AndroidManifest.xml # Manifest Android
│           └── res/            # Ressources (icônes, splash)
├── src/                        # Code source React/TypeScript
├── dist/                       # Build de production
├── capacitor.config.ts         # Configuration Capacitor
├── minibizz.keystore          # Keystore de production
└── keystore_base64.txt        # Keystore encodé base64
```

---

## ⚙️ Configuration Capacitor

Le fichier `capacitor.config.ts` est configuré avec :

```typescript
const config: CapacitorConfig = {
  appId: 'com.minibizz.app',
  appName: 'MiniBizz',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};
```

---

## 🧪 Compilation locale

### 1. Prérequis sur votre machine

```bash
# Installer Node.js et npm
# Installer Android Studio
# Configurer les variables d'environnement :
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 2. Installation des dépendances

```bash
cd minibizz-android
npm install
```

### 3. Build de l'application web

```bash
npm run build
```

### 4. Synchronisation Capacitor

```bash
npx cap sync android
```

### 5. Compilation APK

```bash
# APK Debug
cd android
./gradlew assembleDebug

# APK Release (signé)
./gradlew assembleRelease
```

---

## 🔐 Signature APK (release)

### Keystore de production

- **Fichier** : `minibizz.keystore`
- **Alias** : `minibizz`
- **Mot de passe** : `minibizz2025!`
- **Validité** : 10 000 jours

### Configuration dans build.gradle

```gradle
signingConfigs {
    release {
        keyAlias 'minibizz'
        keyPassword 'minibizz2025!'
        storeFile file('../../minibizz.keystore')
        storePassword 'minibizz2025!'
    }
}
```

---

## 📦 Personnalisation

### Icônes Android
- **Emplacement** : `android/app/src/main/res/mipmap-*`
- **Formats** : hdpi, mdpi, xhdpi, xxhdpi, xxxhdpi
- **Fichier** : `ic_launcher.png`

### Splash Screen
- **Emplacement** : `android/app/src/main/res/drawable/splash.png`
- **Design** : Logo MiniBizz avec document et symbole dollar
- **Couleur de fond** : Blanc (#ffffff)

---

## 🔁 Automatisation avec GitHub Actions (Optionnel)

Pour automatiser la génération d'APK, créez `.github/workflows/android.yml` :

```yaml
name: Build Android APK

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '17'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build web app
      run: npm run build
      
    - name: Sync Capacitor
      run: npx cap sync android
      
    - name: Decode keystore
      run: echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > minibizz.keystore
      
    - name: Build APK
      run: |
        cd android
        ./gradlew assembleRelease
        
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: minibizz-release-apk
        path: android/app/build/outputs/apk/release/app-release.apk
```

### Secrets GitHub requis :
- `KEYSTORE_BASE64` : Contenu du fichier `keystore_base64.txt`

---

## 📤 Publication sur Google Play Store

### 1. Préparer l'APK release

```bash
cd android
./gradlew assembleRelease
```

L'APK signé sera dans : `android/app/build/outputs/apk/release/app-release.apk`

### 2. Vérifier la signature

```bash
jarsigner -verify -verbose -certs app-release.apk
```

### 3. Créer un compte Google Play Console

1. Allez sur [Google Play Console](https://play.google.com/console)
2. Créez un compte développeur (25$ unique)
3. Créez une nouvelle application

### 4. Télécharger l'APK

1. Dans Play Console, allez dans "Production"
2. Créez une nouvelle version
3. Téléchargez votre APK
4. Remplissez les informations requises
5. Soumettez pour révision

---

## 🛠 Résolution de problèmes

### Erreur de build
- Vérifiez que `npm run build` fonctionne
- Vérifiez que Java 17+ est installé
- Vérifiez que Android SDK est configuré

### Erreur de signature
- Vérifiez le chemin du keystore dans `build.gradle`
- Vérifiez les mots de passe

### Erreur Capacitor
- Relancez `npx cap sync android`
- Vérifiez que le répertoire `dist` existe

---

## 📞 Support

Pour toute question :
1. Consultez la documentation Capacitor
2. Vérifiez les logs de build Android
3. Testez d'abord en mode debug

---

**🎉 Votre application MiniBizz est maintenant prête pour Android !**

*Développé avec React, TypeScript et Capacitor*

