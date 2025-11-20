# GitHub Actions Auto-Build Setup

## Kya Hoga:

Jab bhi aap code **push** karoge GitHub pe:
1. ✅ Automatically build hoga
2. ✅ React app compile hoga  
3. ✅ **`dist/` folder Git mein commit ho jayega**
4. ✅ Aap Hostinger se direct Git pull kar sakte ho

## Setup (No secrets needed!)

Kuch setup ki zarurat nahi! Bas code push karo:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

**GitHub Actions automatically:**
- Build karega
- `dist/` folder update karega
- Wapas Git mein commit karega

## Hostinger Se Deploy:

### Option 1: Git Integration (Recommended)

1. **Hostinger hPanel** > **Git** section
2. Repository connect karo:
   - Repository URL: `https://github.com/kumaranujranchi/techandaidaily.git`
   - Branch: `main`
3. **Deploy Path**: `/public_html`
4. Enable **Auto-deploy** (har push pe automatic pull)

Bas! Ab jab bhi push karoge, Hostinger automatic pull kar lega.

### Option 2: Manual SSH Pull

Hostinger pe SSH karo aur:
```bash
cd public_html
git pull origin main
```

## File Structure Hostinger Pe:

```
public_html/
├── dist/              ← GitHub se build files
│   ├── index.html
│   └── assets/
├── api/               ← PHP backend
├── .env              ← Manually create (DB credentials)
└── .htaccess         ← From public/ folder
```

## Important Notes:

1. **`.env` file manually banao** server pe (Git mein nahi hai)
2. **Database import** manually karo (phpMyAdmin se)
3. **`dist/` files ko copy** karo root mein:
   ```bash
   cp -r dist/* .
   ```

## Monitor Build Status:

GitHub repository > **Actions** tab
- Green ✅ = Build successful
- Red ❌ = Build failed (logs check karo)
