# 🚀 Οδηγός Deploy — Maria Portfolio

## Βήμα 1: Εγκατάσταση dependencies (τοπικά)

```bash
cd "portfolio marias"
npm install
```

---

## Βήμα 2: Ρύθμιση Gmail App Password

Για να στέλνει emails το site, χρειάζεσαι **Gmail App Password**
(δεν είναι ο κανονικός κωδικός — είναι ειδικός κωδικός για apps):

1. Πήγαινε στο **myaccount.google.com**
2. **Security** → **2-Step Verification** → Ενεργοποίησέ το
3. **Security** → **App Passwords**
4. Select app: **Mail** | Select device: **Other** → γράψε "Portfolio"
5. Κάνε **Generate** και αντέγραψε τον 16-ψήφιο κωδικό

---

## Βήμα 3: Δημιούργησε το .env αρχείο

```bash
cp .env.example .env
```

Άνοιξε το `.env` και συμπλήρωσε:

```
EMAIL_USER=maria@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop    ← ο App Password από το Βήμα 2
EMAIL_TO=maria@gmail.com
SITE_URL=https://maria-portfolio.up.railway.app
PORT=3000
```

---

## Βήμα 4: Δοκίμασε τοπικά

```bash
npm run dev
```

Άνοιξε το browser στο **http://localhost:3000**
Δοκίμασε να στείλεις μήνυμα από το Contact form — θα πρέπει να φτάσει email!

---

## Βήμα 5: Ανέβασε στο GitHub

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/USERNAME/maria-portfolio.git
git push -u origin main
```

> ⚠️ Το `.gitignore` εξαιρεί αυτόματα το `.env` — τα credentials ΔΕΝ ανεβαίνουν!

---

## Βήμα 6: Deploy στο Railway (δωρεάν)

**Railway** = δωρεάν hosting για Node.js apps, πολύ εύκολο.

1. Πήγαινε στο **railway.app** και κάνε Sign Up με GitHub
2. Κάνε κλικ **"New Project"** → **"Deploy from GitHub repo"**
3. Επίλεξε το `maria-portfolio` repository
4. Railway θα ανιχνεύσει αυτόματα το Node.js app

### Ρύθμιση Environment Variables στο Railway:

1. Κάνε κλικ στο project → **"Variables"**
2. Πρόσθεσε τις παρακάτω μεταβλητές:

| Variable    | Value                          |
|-------------|-------------------------------|
| EMAIL_USER  | maria@gmail.com               |
| EMAIL_PASS  | (ο App Password σου)          |
| EMAIL_TO    | maria@gmail.com               |
| SITE_URL    | (θα το πάρεις μετά το deploy) |

3. Κάνε **Deploy** — σε ~2 λεπτά το site είναι online!
4. Railway σου δίνει URL της μορφής: `https://maria-portfolio.up.railway.app`
5. Ενημέρωσε το `SITE_URL` με αυτό το URL

---

## Custom Domain (προαιρετικό)

Αν θέλεις δικό σου domain (π.χ. `mariapetrou.gr`):

1. Αγόρασε domain από **Papaki.gr** ή **Namecheap.com**
2. Στο Railway → Project → **"Custom Domain"**
3. Ακολούθησε τις οδηγίες DNS

---

## Δομή αρχείων

```
portfolio marias/
├── index.html          ← Η σελίδα
├── server.js           ← Backend (Express + Nodemailer)
├── package.json        ← Dependencies
├── .env                ← Credentials (ΔΕΝ ανεβαίνει στο GitHub!)
├── .env.example        ← Template για .env
├── .gitignore
├── css/
│   └── style.css
└── js/
    └── script.js
```

---

## Troubleshooting

**Δεν φτάνουν emails;**
- Έλεγξε ότι το 2-Step Verification είναι ενεργό στο Gmail
- Βεβαιώσου ότι χρησιμοποιείς App Password (όχι τον κανονικό κωδικό)
- Έλεγξε το Spam folder

**Railway error "Cannot find module"**
- Βεβαιώσου ότι έχεις κάνει `git add package.json` και `git push`

**Port error τοπικά;**
- Άλλαξε το PORT στο `.env` σε 3001 ή 8080
