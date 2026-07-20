# PetsVilla.ee Parandused ja Täiendused

## ✅ Tehtud Parandused

### 7. Turvanõrkuste Parandamine
- **Probleem**: 4 turvanõrku kohta (2 low, 2 moderate)
  - eslint: Regular Expression Denial of Service (ReDoS) - LOW
  - next-auth: Email misdelivery Vulnerability - MODERATE
  - postcss: PostCSS line return parsing error - MODERATE
- **Lahendus**: 
  - Uuendatud eslint 9.24.0 → 9.39.2
  - Uuendatud next-auth 4.24.11 → 4.24.13
  - Uuendatud postcss 8.4.30 → 8.5.6
- **Tulemus**: ✅ 0 turvanõrku kohta (kõik parandatud)
- **Failid**: `package.json`

### 8. Next.js Uuendamine 14.2.28 → 15.5.9
- **Probleem**: Next.js 14.2.28 versioonil oli turvanõrkus
- **Lahendus**: 
  - Uuendatud Next.js 14.2.28 → 15.5.9
  - React 18.3.1 (hiljem uuendatud kui oli vaja)
  - Parandatud kõik API route'id kasutama Promise params Next.js 15 jaoks
  - Parandatud page.tsx failid kasutama Promise params
  - Parandatud next.config.js (outputFileTracingRoot viidud experimental'st välja)
  - Parandatud kõik [id] ja [slug] route'id:
    - `app/api/blog-image/[id]/route.ts`
    - `app/api/guinea-pig-image/[id]/route.ts`
    - `app/api/product-image/[id]/route.ts`
    - `app/api/blog-posts/[slug]/route.ts`
    - `app/blogi/[slug]/page.tsx`
    - `app/pood/[category]/[slug]/page.tsx`
    - `app/pood/[category]/page.tsx`
- **Failid**: `package.json`, `next.config.js`, API route'id, page.tsx failid

## ✅ Tehtud Parandused

### 1. Prisma Schema Parandus
- **Probleem**: Hardcoded output path Prisma client'ile (`/home/ubuntu/petsvilla/nextjs_space/...`)
- **Lahendus**: Eemaldatud hardcoded path, kasutatakse nüüd Prisma vaikimisi path'i
- **Fail**: `prisma/schema.prisma`

### 2. .gitignore Fail
- **Probleem**: `.gitignore` fail puudus, mis võib põhjustada, et `.env` ja teised tundlikud failid commititakse
- **Lahendus**: Lisatud täielik `.gitignore` fail, mis hõlmab:
  - `node_modules/`
  - `.env` failid
  - Build väljundid (`.next/`, `/out/`)
  - IDE seaded
  - Logid ja ajutised failid

### 3. Guinea Pigs API Route Parandus
- **Probleem**: Kasutati `NOTION_DATABASE_ID` asemel õiget `NOTION_GUINEA_PIG_DATABASE_ID`
- **Lahendus**: Parandatud environment variable nimi
- **Fail**: `app/api/guinea-pigs/route.ts`

### 4. Client-Side Environment Variable Kasutamine
- **Probleem**: `process.env` kasutamine client-side komponendis korduvalt
- **Lahendus**: Optimeeritud, et kontrollida üks kord komponendi alguses
- **Fail**: `components/hay-order-form.tsx`

### 5. Environment Variable Valideerimine
- **Probleem**: Puudus keskkonnmuutujate valideerimine rakenduse käivitamisel
- **Lahendus**: Lisatud `lib/env.ts` fail, mis valideerib kõik vajalikud environment muutujad
- **Funktsioonid**:
  - `validateEnv()` - valideerib ja tagastab konfiguratsiooni
  - `getEnvConfig()` - tagastab cache'itud konfiguratsiooni
  - Näitab selgeid vigu, kui midagi puudub

### 6. Email Veahaldus
- **Probleem**: Email saatmisel puudus täielik veahaldus
- **Lahendus**: 
  - Lisatud try-catch plokid kõigile email funktsioonidele
  - Parem veateadete väljastamine
  - SMTP konfiguratsiooni valideerimine enne transporteri loomist
  - Debug/release režiimid
- **Fail**: `lib/email.ts`

## 📋 Järgmised Täiendused (Soovitatud)

### 7. Error Tracking/Monitoring
- **Prioriteet**: Kõrge
- **Kirjeldus**: Lisada Sentry või sarnane error tracking süsteem
- **Eelised**: 
  - Näeb vead reaalajas
  - Performance monitoring
  - User feedback

### 8. Tellimuste Andmebaasi Salvestamine
- **Prioriteet**: Keskmine
- **Kirjeldus**: Praegu salvestatakse ainult Notioni, aga peaks olema ka PostgreSQL backup
- **Eelised**: 
  - Andmebaasi päringud on kiiremad
  - Backup kui Notion on kättesaamatu
  - Analytics ja reporting

### 9. TypeScript Tüüpide Parandamine
- **Prioriteet**: Keskmine
- **Kirjeldus**: Lisada täielik tüübiturva kõikidele API endpointidele
- **Näited**: 
  - Request/Response tüübid
  - Error tüübid
  - Notion API response tüübid

### 10. Testid
- **Prioriteet**: Keskmine
- **Kirjeldus**: Lisada testid kriitilistele funktsioonidele
- **Fookus**: 
  - Montonio integratsioon
  - Email saatmine
  - Notion API kutsed
  - Form valideerimine

### 11. Accessibility (a11y) Parandused
- **Prioriteet**: Madal
- **Kirjeldus**: Lisada ARIA labelid ja parandada klaviatuurinavigatsiooni
- **Eelised**: 
  - Parem kasutatavus erinevatele kasutajatele
  - SEO parandus
  - Juriidilised nõuded

### 12. Montonio Shipping Aadress Kontrollimine
- **Prioriteet**: Madal → **Valmis (2026-07)**
- **Kirjeldus**: Saatja aadress peab olema kanooniline Soinaste, mitte vana Jüri
- **Lahendus**: `lib/site-contact.ts` + `lib/montonio-shipping.ts` kasutab `getMontonioSenderAddress()`
- **Aadress**: Tartu mnt 80, Soinaste, Kambja vald, Tartumaa 61709
- **Märkus**: kontrolli ka Montonio partneriportaali saatja seadeid

## 🔍 Lisatud Uued Failid

1. **`.gitignore`** - Git ignore reeglid
2. **`lib/env.ts`** - Environment variable valideerimine

## 📝 Märkused

- Kõik parandused on tagasiühilduvad (backward compatible)
- Ei ole muudetud API endpoint'e struktuuri
- Environment variable valideerimine on valikuline (võib lisada rakenduse käivitamisse, kui soovid)
- Email veahaldus ei muuda olemasolevat käitumist, lihtsalt lisab paremad veateated

## 🚀 Järgmised Sammud

1. Testida kõiki muudatusi staging keskkonnas
2. Kontrollida, et `.env` fail on õigesti seadistatud
3. Veenduda, et Montonio shipping aadress on õige (kood OK; dashboard eraldi)
4. Kaaluda error tracking süsteemi lisamist
5. Kaaluda tellimuste andmebaasi salvestamist PostgreSQL'i
