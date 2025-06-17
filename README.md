# MiniBizz 📱

> Application de gestion simplifiée pour les auto-entrepreneurs et micro-entreprises.

MiniBizz est une application mobile et web innovante qui vise à accompagner les auto-entrepreneurs dans la gestion de leur activité au quotidien. Conçue pour être intuitive, rapide et modulable, elle intègre des outils puissants de facturation, de gestion client, de rentabilité et même de comparaison de tarifs grâce à l'intelligence artificielle.

---

## 🌟 Objectif principal

Offrir un **outil tout-en-un** pour aider les auto-entrepreneurs à gérer leur business sans stress, tout en respectant les normes juridiques et fiscales françaises et européennes.

---

## 🚀 Fonctionnalités principales

### ✉️ Gestion de Devis & Factures

* Génération de devis PDF conformes
* Conversion automatique devis → facture
* Numérotation automatique
* Signature électronique intégrée
* Ajout de QR code Revolut ou Stripe pour paiement

### 💳 Gestion Financiere

* Calcul de rentabilité pour chaque mission
* Estimation de charges
* Comparaison des tarifs avec la moyenne du marché via IA

### 📅 Gestion Clients

* Création et sauvegarde de fiches clients
* Historique des missions et paiements

### 🏰 CGV Automatisées

* Conditions générales de vente générées automatiquement en fonction de la mission

### 🚜 Partage de missions (bêta)

* Possibilité de proposer des missions qu'on ne peut pas réaliser
* Mise en relation entre indépendants

---

## 🛠️ Stack Technique

| Outil             | Rôle                         |
| ----------------- | ---------------------------- |
| Ionic + Capacitor | Framework mobile             |
| Angular / Vite    | Frontend rapide et modulaire |
| Firebase          | Analytics + Crashlytics      |
| Gradle            | Build Android (v8.x)         |
| GitHub / GitLab   | CI/CD et versioning          |

---

## 📗 Structure du projet

```
minibizz/
├── android/              # Projet Android natif
├── src/                  # Code source Angular
├── capacitor.config.ts   # Config Capacitor
├── dist/                 # Build de l’app Web
├── firebase.json         # Config Firebase (si nécessaire)
└── README.md             # Documentation principale
```

---

## 🚪 Installation locale

```bash
git clone https://github.com/TON-UTILISATEUR/minibizz.git
cd minibizz
npm install
npx cap sync
npm run build
npx cap open android
```

> ⚡ Conseil : utilise Android Studio pour générer l’APK ou déployer sur émulateur.

---

## 🎓 Pour les développeurs

### Environnement requis

* Node.js >= 20.18
* NPM >= 10
* Java 17
* Capacitor CLI
* Android SDK 34

### Lancer un build Android

```bash
npm run build
npx cap copy android
npx cap open android
```

### Variables utiles

Vérifie le fichier `variables.gradle` pour les versions de dépendances.

---

## 🧡 Support communautaire

Tu as repéré un bug, une fonctionnalité manquante ou tu veux proposer une idée ?

* Crée une **issue** sur GitHub
* Participe via une **pull request**
* Échange avec la communauté sur les forums d'auto-entrepreneurs !

---

## 🌟 A venir

* Espace client professionnel en ligne (gestion docs, profil, historique)
* Module IA de prospection et recommandation de tarifs
* Intégration d'un système de parrainage
* Notifications push Firebase
* Export complet des données (.zip / .csv / .pdf)

---

## 🌐 Licence

MiniBizz est distribué sous licence MIT. Voir [LICENSE](LICENSE) pour plus d'infos.

---

## 👤 Auteur

**Gary**
Entrepreneur, développeur et créateur de solutions sur mesure pour les indépendants.

> "Rendre les outils pros aussi simples que les applis qu'on aime utiliser."

---
