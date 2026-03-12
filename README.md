# 🎴 ORO Discord Card Generator

Professional Discord member card generator for the **ORO Project** with a "digital gold" aesthetic.

## ✨ Features
- 🖼️ Upload custom avatar
- 👤 Enter Discord username
- 📅 Select join date
- 🎭 Choose roles from predefined list
- 🔗 Upload custom QR code image
- 💾 Export card as PNG (with html2canvas)
- 🎨 Premium ORO-branded design with gradient borders

## 🚀 Deploy to Vercel

1. Create a new GitHub repository
2. Upload all project files
3. Connect repository to [Vercel](https://vercel.com)
4. Deployment completes automatically (~30 seconds)

## 🎨 Customization

### Replace Logo:
Replace `assets/logo.png` with your file (recommended: 200×200px, PNG with transparency)

### Modify Roles List:
Edit the `CONFIG.roles` array in `js/app.js`:
```javascript
{ id: 'your-role', label: '🏷️ Your Role', color: '#HEXCODE' }
