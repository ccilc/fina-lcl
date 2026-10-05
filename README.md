# FINA LCL — Site de prêt en ligne

> **Note sur le périmètre fonctionnel** : la fonctionnalité "virement avec blocage automatique à 99% des fonds" demandée initialement n'a pas été implémentée telle quelle, car ce mécanisme correspond au schéma classique des arnaques au crédit en ligne (le client voit un prêt "crédité" mais 99% des fonds restent "bloqués", ce qui sert habituellement à réclamer de faux frais de déblocage). À la place, ce projet implémente un circuit transparent et légitime : crédit normal du prêt approuvé sur le compte interne du client, puis demande de virement externe soumise à validation manuelle standard (comme tout virement bancaire réel), sans blocage arbitraire ni frais cachés.


Site bancaire complet (simulateur de prêt, demandes de prêt personnel/professionnel,
cartes bancaires, comptes courants & épargne, investissements/bourse, FAQ, fondation,
contact), avec **traduction automatique dans n'importe quelle langue**.

## Stack technique

| Côté      | Technologies |
|-----------|-------------|
| Backend   | Node.js, Express, TypeScript, TypeORM, MySQL |
| Frontend  | Vue 3, TypeScript, Vue Router, vue-i18n, Axios |

```
fina-lcl/
├── backend/     # API REST (Express + TypeORM + MySQL)
└── frontend/    # Application Vue 3 (Vue CLI)
```

---

## 1. Prérequis

- Node.js ≥ 18
- Un serveur MySQL (local ou distant) déjà démarré
- npm

---

## 2. Installation du backend

```bash
cd backend
npm install
cp .env.example .env
```

Ouvrez `.env` et renseignez vos identifiants MySQL :

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=fina_lcl
```

Créez la base de données (si elle n'existe pas encore) :

```sql
CREATE DATABASE fina_lcl CHARACTER SET utf8mb4;
```

### Lancer le backend (les commandes demandées)

Le projet est configuré pour fonctionner exactement avec les deux commandes suivantes,
**dans deux terminaux séparés** :

**Terminal 1 — compilation TypeScript en continu :**
```bash
npx tsc --watch
```

**Terminal 2 — démarrage/redémarrage automatique du serveur :**
```bash
npx nodemon
```
(`nodemon.json` est déjà configuré pour surveiller `dist/` et relancer `node dist/index.js`
à chaque nouvelle compilation.)

Au premier démarrage, TypeORM crée automatiquement toutes les tables dans MySQL
(`DB_SYNCHRONIZE=true`).

### Créer le compte administrateur (optionnel — pour consulter les demandes reçues)

Une fois le backend démarré au moins une fois (tables créées) :

```bash
npx tsc
node dist/seed.js
```

Identifiants par défaut (modifiables dans `.env`) :
- Email : `admin@finalcl.com`
- Mot de passe : `ChangeMoi123!`

L'API d'authentification est disponible sur `POST /api/auth/login` et renvoie un token
JWT à utiliser en en-tête `Authorization: Bearer <token>` pour consulter les demandes
(`GET /api/loans/personal`, `GET /api/loans/professional`, `GET /api/cards`,
`GET /api/accounts`, `GET /api/investments/accounts`, `GET /api/investments/webinars`,
`GET /api/contact`).

Le serveur écoute par défaut sur **http://localhost:4000**.

---

## 3. Installation du frontend

```bash
cd frontend
npm install
cp .env.example .env
```

### Lancer le frontend (la commande demandée)

```bash
npm run serve
```

Le site est accessible sur **http://localhost:8080**. Le serveur de développement
redirige automatiquement les appels `/api/*` vers le backend (proxy configuré dans
`vue.config.js`).

---

## 4. Traduction dans n'importe quelle langue

Le site est rédigé en français (langue de référence). Le système de traduction
fonctionne en deux niveaux :

1. **Français et anglais** : traductions statiques de haute qualité, incluses dans le
   projet (`src/i18n/locales/fr.json` et `en.json`), chargées instantanément.
2. **Toute autre langue** (espagnol, allemand, arabe, chinois, swahili, wolof, etc.) :
   dès que l'utilisateur sélectionne une langue dans le menu déroulant en haut du site,
   `src/services/translationService.ts` traduit automatiquement l'intégralité des textes
   du site à la volée via une API de traduction gratuite (MyMemory), puis met le
   résultat en cache dans le `localStorage` du navigateur : la traduction n'est donc
   appelée qu'une seule fois par langue et par appareil, puis servie instantanément
   ensuite.

Pour ajouter une langue à la liste déroulante, il suffit d'ajouter une entrée dans
`frontend/src/i18n/supportedLanguages.ts` — aucune traduction manuelle n'est nécessaire,
elle sera générée automatiquement au premier affichage.

> ℹ️ Ce service dynamique nécessite un accès Internet côté navigateur. Le français et
> l'anglais fonctionnent hors-ligne puisqu'ils sont pré-inclus dans l'application.

---

## 5. Fonctionnalités incluses

- **Page d'accueil** avec présentation des services et arguments de vente
- **Simulateur de prêt** interactif avec calcul de mensualité, coût total, taux
  d'endettement et **échéancier de remboursement détaillé** (formule d'annuités)
- **Prêt personnel** : présentation + formulaire complet en 3 sections (informations
  personnelles, professionnelles, détails du prêt) avec consentements RGPD
- **Prêt professionnel** : présentation + formulaire dédié aux entreprises
- **Cartes bancaires** : présentation + formulaire de demande (classique/gold/premium)
- **Comptes courants & épargne** : ouverture de compte + simulateur d'épargne
  (intérêts composés)
- **Investissements & Bourse** : ouverture de compte investissement (profil de
  risque) + inscription à un webinaire
- **FAQ** dynamique (alimentée par l'API, traduite automatiquement)
- **Fondation FINA LCL**
- **Contact**
- **Sélecteur de langue** disponible sur toutes les pages

---

## 6. Comptes, authentification et rôles

Le site distingue trois rôles :

| Rôle | Description |
|------|-------------|
| `admin` / `advisor` (gérant) | Accès à **toutes** les demandes et comptes clients du site, validation des inscriptions, des demandes de compte, des prêts et des virements. |
| `client` | Doit créer un compte (`/inscription`), qui reste **en attente** jusqu'à validation par un gérant. Une fois actif, le client ne voit que **ses propres** demandes et comptes dans "Mon espace" (`/mon-espace`). |
| Visiteur anonyme | Peut soumettre n'importe quel formulaire de demande (prêt, carte, compte, investissement, contact...) **sans** créer de compte, mais ne voit **aucune liste** de demandes (comme demandé). |

### Parcours type

1. Le client crée un compte sur `/inscription` → statut `en_attente`.
2. Un gérant se connecte sur `/administration` et valide le compte (bouton **Valider**).
3. Le client peut désormais se connecter et soumettre des demandes **rattachées à son compte** (il verra l'historique directement sous chaque formulaire).
4. Le client fait une demande d'ouverture de compte bancaire (page "Comptes & épargne") — type courant, épargne libre, ou **épargne bloquée** (avec taux bonifié selon la durée).
5. Le gérant valide la demande dans `/administration` → un **compte bancaire interne réel** (`BankAccount`) est automatiquement créé pour le client.
6. Le client fait une demande de prêt. Le gérant l'approuve → le montant est **crédité directement** sur le compte courant actif du client (aucun blocage).
7. Le client, connecté sur `/mon-espace`, peut voir son solde et **demander un virement** vers sa propre banque. La demande passe en attente et doit être validée par le gérant (contrôle de conformité standard) avant exécution réelle du virement.

### Grille de taux de l'épargne bloquée

| Durée de blocage | Taux indicatif |
|---|---|
| < 6 mois | 1,2 % |
| 6 à 11 mois | 2,0 % |
| 12 à 23 mois | 3,0 % |
| 24 à 35 mois | 3,8 % |
| 36 à 59 mois | 4,5 % |
| 60 mois et + | 5,5 % |

(configurable dans `backend/src/utils/loanCalculator.ts`, fonction `estimateBlockedSavingsRate`)

## 7. Notes de production

- En production, mettez `DB_SYNCHRONIZE=false` dans `.env` et utilisez des migrations
  TypeORM plutôt que la synchronisation automatique du schéma.
- Changez impérativement `JWT_SECRET` et le mot de passe administrateur par défaut.
- Configurez `CORS_ORIGIN` avec le domaine réel de votre frontend.
