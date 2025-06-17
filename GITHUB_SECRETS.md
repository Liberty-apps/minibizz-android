# Configuration des Secrets GitHub pour MiniBizz

Pour automatiser la génération d'APK avec GitHub Actions, vous devez configurer les secrets suivants dans votre repository GitHub.

## 📍 Accès aux Secrets

1. Allez sur votre repository GitHub
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Secrets and variables** > **Actions**
4. Cliquez sur **New repository secret**

## 🔑 Secrets à Configurer

### KEYSTORE_BASE64

- **Nom** : `KEYSTORE_BASE64`
- **Description** : Keystore encodé en base64 pour signer les APK
- **Valeur** : Copiez le contenu complet du fichier `keystore_base64.txt`

**Comment obtenir la valeur :**
```bash
# Le fichier keystore_base64.txt contient déjà la valeur encodée
cat keystore_base64.txt
```

### KEYSTORE_PASSWORD

- **Nom** : `KEYSTORE_PASSWORD`
- **Description** : Mot de passe du keystore
- **Valeur** : `minibizz2025!`

### KEY_ALIAS

- **Nom** : `KEY_ALIAS`
- **Description** : Alias de la clé dans le keystore
- **Valeur** : `minibizz`

### KEY_PASSWORD

- **Nom** : `KEY_PASSWORD`
- **Description** : Mot de passe de la clé
- **Valeur** : `minibizz2025!`

## ✅ Vérification

Une fois tous les secrets configurés, vous devriez voir :

- ✅ KEYSTORE_BASE64
- ✅ KEYSTORE_PASSWORD  
- ✅ KEY_ALIAS
- ✅ KEY_PASSWORD

## 🚀 Déclenchement du Workflow

Le workflow se déclenchera automatiquement lors de :

- Push sur les branches `main` ou `develop`
- Pull Request vers `main`
- Déclenchement manuel via l'interface GitHub

## 📁 Résultat

Après exécution réussie, vous trouverez l'APK dans :
- **Onglet Actions** > **Votre workflow** > **Artifacts** > `minibizz-release-apk`

## ⚠️ Sécurité

- Ne partagez jamais ces secrets
- Le keystore et ses mots de passe sont critiques pour la signature de vos APK
- Gardez une sauvegarde sécurisée du fichier `minibizz.keystore`

