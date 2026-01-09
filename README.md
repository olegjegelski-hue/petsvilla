# PetsVilla OÜ - Next.js Website

Lemmikloomade aretuse ja toodete müügi veebileht.

## 🚀 Kiire Alustamine

### 1. Klooni Repositoory

```bash
git clone https://github.com/olegjegelski-hue/petsvilla.git
cd petsvilla
```

### 2. Installi Dependencies

```bash
yarn install
# või
npm install
```

### 3. Seadista Environment Muutujad

**OLULINE:** Projekti töötamiseks on VAJALIK `.env` fail!

```bash
# Kopeeri .env.example ja täida päris väärtustega
cp .env.example .env
```

Seejärel ava `.env` fail ja täida järgmised VAJALIKUD väärtused:

#### Notion API (VAJALIK)
- `NOTION_API_KEY` - Notion integratsioon API võti
- `NOTION_HAY_DATABASE_ID` - Heinatellimuste andmebaas
- `NOTION_GUINEA_PIG_DATABASE_ID` - Merisigade andmebaas
- `NOTION_BLOG_DATABASE_ID` - Blogi andmebaas
- `NOTION_PETRA_AQUA_DATABASE_ID` - Petra Aqua toodete andmebaas

#### Montonio Makse Integratsioon (VAJALIK maksete jaoks)
- `MONTONIO_ACCESS_KEY` - Montonio API access key
- `MONTONIO_SECRET_KEY` - Montonio API secret key
- `MONTONIO_ENVIRONMENT=production` - Kas kasutada live või sandbox keskkonda
- `MONTONIO_ENABLED=true` - Kas Montonio on sisse lülitatud
- `NEXT_PUBLIC_MONTONIO_ENABLED=true` - Client-side flag

#### Email SMTP (VAJALIK tellimuste jaoks)
- `SMTP_HOST=smtp.alfanetti.ee`
- `SMTP_PORT=465`
- `SMTP_USER=service@petsvilla.ee`
- `SMTP_PASSWORD` - Alfanet email parool

#### Google Analytics (valikuline)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - GA4 Measurement ID

### 4. Build Projekt

```bash
yarn build
# või
npm run build
```

### 5. Käivita Development Server

```bash
yarn dev
# või
npm run dev
```

Leht avaneb aadressil: http://localhost:3000

### 6. Production Build

```bash
yarn build
yarn start
# või
npm run build
npm run start
```

---

## 📦 Peamised Funktsioonid

### ✅ Toimivad Funktsioonid

1. **Montonio Makse Integratsioon**
   - Heinatellimuste makse
   - Automaatne tellimuse staatuse uuendamine
   - Email kinnitused

2. **Notion Integratsioon**
   - Merisigade galerii (filtreerimine staatuse järgi)
   - Heinatellimuste haldus
   - Blogi artiklid
   - Petra Aqua tooted

3. **Email Teavitused**
   - Tellimuse kinnitused kliendile
   - Tellimuse teated `service@petsvilla.ee`

4. **SEO Optimeerimine**
   - Dünaamilised metadata
   - OpenGraph tags
   - Sitemap ja robots.txt
   - Structured data (Schema.org)

---

## 🗂️ Projekti Struktuur

```
petsvilla/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API endpoints
│   │   ├── montonio/     # Montonio makse API
│   │   ├── guinea-pigs/  # Merisigade API
│   │   ├── hay-order/    # Heinatellimuste API
│   │   └── contact/      # Kontaktivormi API
│   ├── blogi/            # Blogi lehed
│   ├── merisead/         # Merisigade leht
│   ├── hein/             # Heina leht
│   ├── telli-hein/       # Heinatellimuse leht
│   └── ...               # Muud lehed
├── components/            # React komponendid
│   ├── ui/               # Shadcn UI komponendid
│   ├── hay-order-form.tsx # Heinatellimuse vorm
│   ├── navigation.tsx    # Navigatsioon
│   └── footer.tsx        # Footer
├── lib/                   # Utility funktsioonid
│   ├── email.ts          # Email saatmine
│   ├── montonio.ts       # Montonio integratsioon
│   └── db.ts             # Database utils
├── public/                # Staatilised failid
│   ├── parent-*.jpg      # Merisigade pildid
│   └── ...               # Muud pildid
├── .env.example          # Environment muutujate näidis
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
└── README.md             # See fail
```

---

## 🔧 Troubleshooting

### Probleem: Montonio ei avane

**Põhjus:** `.env` fail puudub või `NEXT_PUBLIC_MONTONIO_ENABLED` on vale.

**Lahendus:**
1. Veendu, et `.env` fail eksisteerib ja sisaldab:
   ```
   NEXT_PUBLIC_MONTONIO_ENABLED=true
   MONTONIO_ENABLED=true
   MONTONIO_ACCESS_KEY=...
   MONTONIO_SECRET_KEY=...
   ```
2. Tee rebuild:
   ```bash
   yarn build
   ```
3. Restart dev server:
   ```bash
   yarn dev
   ```

### Probleem: Notioni andmed ei laadu

**Põhjus:** `NOTION_API_KEY` või database ID'd on valed.

**Lahendus:**
1. Kontrolli `.env` failis:
   ```
   NOTION_API_KEY=ntn_...
   NOTION_HAY_DATABASE_ID=...
   ```
2. Veendu, et Notion integratsioon on jagatud vastavate andmebaasidega.

### Probleem: Email teavitused ei saadetud

**Põhjus:** SMTP credentials on valed.

**Lahendus:**
1. Kontrolli Alfanet SMTP seadeid:
   ```
   SMTP_HOST=smtp.alfanetti.ee
   SMTP_PORT=465
   SMTP_USER=service@petsvilla.ee
   SMTP_PASSWORD=...
   ```
2. Veendu, et parool on õige.

---

## 📝 Environment Muutujad

| Muutuja | Kirjeldus | Vajalik? |
|---------|-----------|----------|
| `NOTION_API_KEY` | Notion API võti | ✅ JAH |
| `NOTION_HAY_DATABASE_ID` | Heinatellimuste DB | ✅ JAH |
| `NOTION_GUINEA_PIG_DATABASE_ID` | Merisigade DB | ✅ JAH |
| `MONTONIO_ACCESS_KEY` | Montonio API võti | ✅ JAH (maksete jaoks) |
| `MONTONIO_SECRET_KEY` | Montonio secret | ✅ JAH (maksete jaoks) |
| `NEXT_PUBLIC_MONTONIO_ENABLED` | Montonio sisse/välja | ✅ JAH |
| `SMTP_HOST` | Email SMTP host | ✅ JAH (emailide jaoks) |
| `SMTP_PASSWORD` | Email parool | ✅ JAH (emailide jaoks) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics | ❌ EI (valikuline) |

---

## 🚀 Deployment

### Vercel

1. Push GitHubi
2. Ühenda Vercel GitHubiga
3. Lisa environment muutujad Vercel dashboardis
4. Deploy

### Muud Platvormid

1. Build projekt:
   ```bash
   yarn build
   ```
2. Käivita production server:
   ```bash
   yarn start
   ```

---

## 📞 Kontakt

**PetsVilla OÜ**  
Registrikood: 14980686  
Email: service@petsvilla.ee  
Veebileht: https://petsvilla.ee

---

## ⚠️ OLULINE TURVALISUS

**ÄRGE KUNAGI:**
- ❌ Lisage `.env` faili GitHubi
- ❌ Jagage API võtmeid avalikult
- ❌ Commitige `.env` faili

**`.gitignore` fail PEAB sisaldama:**
```
.env
.env*.local
```

---

## 📄 Litsents

See projekt on PetsVilla OÜ privaatne omand.
