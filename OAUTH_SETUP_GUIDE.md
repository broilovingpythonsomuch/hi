# 🚀 OAuth Setup Guide - Class 7.3

## 📋 Daftar Provider yang Tersedia:
- ✅ GitHub OAuth (Recommended - Paling Mudah)
- ✅ Discord OAuth (Alternatif Google)
- ✅ Facebook OAuth (Reach Luas)

---

## 🔑 GitHub OAuth Setup (Recommended)

### 1. Buat OAuth App
1. Buka: https://github.com/settings/applications
2. Klik "New OAuth App"
3. Isi form:
   - **Application name**: `Class 7.3`
   - **Homepage URL**: `https://class73web.vercel.app`
   - **Authorization callback URL**: `https://class73web.vercel.app/api/auth/callback/github`
4. Klik "Register application"

### 2. Dapatkan Credentials
Setelah dibuat, kamu akan dapatkan:
- **Client ID**: Copy ini
- **Client Secret**: Generate dan copy ini

### 3. Update Environment Variables
```env
GITHUB_ID="github_client_id_anda"
GITHUB_SECRET="github_client_secret_anda"
```

---

## 🎮 Discord OAuth Setup

### 1. Buat Discord Application
1. Buka: https://discord.com/developers/applications
2. Klik "New Application"
3. Isi form:
   - **NAME**: `Class 7.3`
   - Klik "Create"

### 2. Setup OAuth2
1. Pergi ke "OAuth2" → "General"
2. Redirect URLs: `https://class-web.vercel.app/api/auth/callback/discord`
3. Klik "Save Changes"

### 3. Dapatkan Credentials
1. Di halaman OAuth2 yang sama, kamu akan lihat:
   - **APPLICATION ID**: Ini adalah Client ID
   - **CLIENT SECRET**: Klik "View Secret" untuk melihat

### 4. Update Environment Variables
```env
DISCORD_CLIENT_ID="discord_application_id_anda"
DISCORD_CLIENT_SECRET="discord_client_secret_anda"
```

---

## 👥 Facebook OAuth Setup

### 1. Buat Facebook App
1. Buka: https://developers.facebook.com
2. Login dengan Facebook
3. Klik "Create App" → "Business"
4. Isi form:
   - **App name**: `Class 7.3`
   - **App purpose**: `Business`
   - Klik "Create App"

### 2. Setup Facebook Login
1. Di dashboard, cari "Products" → "Add Product"
2. Pilih "Facebook Login"
3. Pilih "Web"
4. Site URL: `https://class-web.vercel.app`

### 3. Setup OAuth Redirect
1. Pergi ke "Facebook Login" → "Settings"
2. Valid OAuth Redirect URIs: `https://class-web.vercel.app/api/auth/callback/facebook`
3. Klik "Save Changes"

### 4. Dapatkan Credentials
1. Pergi ke "Settings" → "Basic"
2. Kamu akan lihat:
   - **App ID**: Ini adalah Client ID
   - **App Secret**: Klik "Show" untuk melihat

### 5. Update Environment Variables
```env
FACEBOOK_CLIENT_ID="facebook_app_id_anda"
FACEBOOK_CLIENT_SECRET="facebook_app_secret_anda"
```

---

## 🌍 Update Environment Variables

### Untuk Development (.env):
```env
# GitHub OAuth
GITHUB_ID="your_github_client_id_here"
GITHUB_SECRET="your_github_client_secret_here"

# Discord OAuth
DISCORD_CLIENT_ID="your_discord_client_id_here"
DISCORD_CLIENT_SECRET="your_discord_client_secret_here"

# Facebook OAuth
FACEBOOK_CLIENT_ID="your_facebook_client_id_here"
FACEBOOK_CLIENT_SECRET="your_facebook_client_secret_here"
```

### Untuk Vercel Production:
1. Buka Vercel Dashboard
2. Pilih project "Class 7.3"
3. Settings → Environment Variables
4. Tambahkan semua variables di atas

---

## 🧪 Testing Setup

### 1. Restart Development Server
```bash
npm run dev
```

### 2. Test Social Login
1. Buka http://localhost:3000
2. Coba login dengan GitHub (paling mudah)
3. Jika berhasil, user akan dibuat otomatis di database

---

## 🚨 Common Issues & Solutions

### GitHub OAuth Issues:
- **Error**: "redirect_uri_mismatch"
- **Solution**: Pastikan callback URL exactly: `https://class-web.vercel.app/api/auth/callback/github`

### Discord OAuth Issues:
- **Error**: "Invalid redirect URI"
- **Solution**: Check Discord Dashboard → OAuth2 → Redirects

### Facebook OAuth Issues:
- **Error**: "Can't Load URL"
- **Solution**: Pastikan App sudah di "Live" mode (bukan Development)

---

## 📞 Need Help?

Jika ada masalah:
1. Check callback URLs (harus exact match)
2. Pastikan app sudah di-approve/active
3. Restart development server setelah update .env
4. Check browser console untuk error details

---

## ✅ Setup Checklist

- [ ] GitHub OAuth App created
- [ ] Discord Application created  
- [ ] Facebook App created
- [ ] All Client IDs & Secrets obtained
- [ ] .env file updated
- [ ] Vercel environment variables updated
- [ ] Development server restarted
- [ ] Test login with each provider

**Start with GitHub first - it's the easiest!** 🎯
