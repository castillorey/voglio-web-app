# Voglio 🎁

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
</p>

<p align="center">
  <em>The wishlist app that helps friends find the perfect gift for you.</em>
</p>

---

## ✨ What is Voglio?

**Voglio** (Italian for *"I want"*) is a social wishlist app where you can organize your desires into categories, share them with friends, and never receive another unwanted gift again.

Whether it's your birthday, Christmas, or any special occasion — Voglio makes gift-giving intentional, personal, and fun.

---

## 🚀 Features

### 🗂️ Smart Categories
Organize your wishes into custom categories — from *"Birthday Gifts"* to *"Home Vibes"*. Each category can be public or private.

### 🎁 Voglios (Wishes)
Add detailed wishlist items with:
- 📸 Reference images
- 🔗 External product links
- 📏 Sizes (shirt, pants, shoe — US/EU/UK formats)
- 💰 Price tracking
- ✅ Taken / claimed status

### 👤 Rich Profiles
Share your personality with:
- 🎂 Birthday & zodiac sign
- 📍 Location
- 👔 Clothing sizes
- 🎨 Favorite colors
- 💡 Custom preferences (books, hobbies, interests...)

### 👥 Social & Follow
- Follow friends and discover their public wishlists
- Browse public categories without logging in
- See what your friends are really hoping for

### 🌍 International
Full i18n support with **English**, **Spanish**, and **Portuguese**.

### 📱 Mobile-First Design
Beautiful, responsive UI built with Tailwind CSS and shadcn/ui — optimized for phones but stunning on desktop too.

---

## 📸 Screenshots

> _Coming soon — the app is currently in active development._

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **Routing** | React Router v6 |
| **i18n** | i18next |
| **Icons** | Lucide React |

---

## ⚡ Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn
- A Supabase project (free tier works!)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/voglio.git
cd voglio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase URL and anon key

# Start the dev server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
VITE_CDNURL=https://your-cdn-url.com/
```

### Database Setup

Run the migration script in your Supabase SQL Editor:

```bash
# Found in docs/migration.sql
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── profile/         # Profile display, edit, utilities
│   ├── ui/              # shadcn/ui components
│   └── ...
├── pages/
│   ├── Account.tsx      # Own profile (edit mode)
│   ├── UserProfile.tsx  # Public/private profile view
│   ├── Collections.tsx  # Wishlist categories
│   ├── Friends.tsx      # Social & follow
│   └── ...
├── services/
│   ├── profile.ts       # Profile CRUD
│   ├── preferences.ts   # User preferences
│   ├── follow.ts        # Follow/unollow logic
│   └── voglioTaken.ts   # Claimed wishes
├── contexts/            # Auth, Toast
├── i18n/                # Translations (EN, ES, PT)
└── supabase-client.ts   # Supabase client
```

---

## 🧪 Testing

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests
npx playwright test
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 💖 Support

If you like this project, give it a ⭐️ and share it with your friends!

<p align="center">
  Made with ❤️ by the Voglio team
</p>
