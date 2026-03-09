# 🧪 LabSearch — Laboratory Procedure Search System

A production-ready full-stack application for laboratory analysts to quickly find test procedures from digital lab manuals.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Fill in your values in .env.local
```

### 3. Seed the database (create admin user)
Open your browser and visit:
```
http://localhost:3000/api/seed?secret=labsearch-init-2024
```

### 4. Run the development server
```bash
npm run dev
```

### 5. Login
- Admin: `admin@lab.com` / `admin123`
- Analyst: `analyst@lab.com` / `analyst123`

---

## 📋 Environment Variables

```env
MONGODB_URI="your-mongodb-uri"
NEXTAUTH_SECRET="your-secret-string-32-chars+"
NEXTAUTH_URL="http://localhost:3000"

IMAGEKIT_PUBLIC="your_imagekit_public_key"
IMAGEKIT_PRIVATE="your_imagekit_private_key"
IMAGEKIT_URL="https://ik.imagekit.io/your_id"
```

---

## 🏗️ Architecture

```
app/
├── auth/login/          — Login page
├── dashboard/           — Protected dashboard
│   ├── page.tsx         — Dashboard home
│   ├── upload/          — File upload + OCR
│   ├── library/         — Document library
│   ├── search/          — Full-text search
│   ├── favorites/       — Bookmarked procedures
│   └── settings/        — User settings
├── api/
│   ├── auth/            — NextAuth handler
│   ├── upload/          — File upload + ImageKit
│   ├── ocr/             — OCR processing
│   ├── search/          — Full-text search
│   ├── documents/       — CRUD for documents
│   ├── favorites/       — Favorites management
│   └── seed/            — Admin user seeding
```

---

## 👥 User Roles

| Feature | Admin | Analyst | Viewer |
|---|---|---|---|
| Search & View | ✅ | ✅ | ✅ |
| Upload Documents | ✅ | ✅ | ❌ |
| Delete Documents | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| Favorites | ✅ | ✅ | ❌ |

---

## 📄 Supported File Types

- **PDF** — Text extraction via pdf-parse, OCR fallback
- **JPG/JPEG** — OCR via Tesseract.js
- **PNG** — OCR via Tesseract.js
- **TIFF** — OCR via Tesseract.js

Maximum file size: **50MB**

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `/` | Open search |

---

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

---

## 🔧 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB + Mongoose
- **Auth**: NextAuth.js (Credentials)
- **File Storage**: ImageKit CDN
- **OCR**: Tesseract.js v5
- **PDF Parsing**: pdf-parse
- **State**: TanStack Query (React Query)

---

## 📊 Structured Data Extraction

The parser automatically extracts lab procedure sections:

- 🔬 **Principle** — What the test measures
- ⚗️ **Reagents** — Chemicals and materials needed
- 📋 **Procedure** — Step-by-step instructions
- 🧮 **Calculations** — Formulas and computation
- ⚠️ **Precautions** — Safety warnings
- 📝 **Notes** — Additional information
