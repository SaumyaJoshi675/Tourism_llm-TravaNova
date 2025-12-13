# 🚀 Quick Start Guide

Get your Uttarakhand Tourism LLM frontend up and running in 5 minutes!

---

## ⚡ Fast Setup (2 minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- A modern browser (Chrome/Firefox/Edge)

### Installation

```bash
# 1. Clone or navigate to project directory
cd uttarakhand-tourism-frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

**That's it!** 🎉

The app will open at `http://localhost:3000`

---

## 🎮 Try It Out

### Quick Demo Flow

1. **Landing Page** - You'll see a stunning hero section
   - Click "Try Tourism Assistant"

2. **Chat** - Test the AI assistant
   - Type: "Tell me about Nainital"
   - Watch the animated response

3. **Map** - Explore attractions
   - Click the "Explore Map" link
   - Click on any pin to see details

4. **Itinerary** - Build a trip plan
   - Click "Build Itinerary"
   - Try "AI Generate" feature

5. **Settings** - Switch themes
   - Go to Settings
   - Try Dark mode and Glass mode

---

## 🔧 Configuration

### Environment Setup (Optional)

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000
```

**Note:** App works without backend using mock data!

---

## 📱 Mobile Testing

```bash
# Find your local IP
# Windows: ipconfig
# Mac/Linux: ifconfig

# Access from phone
http://YOUR_IP:3000
```

---

## 🏗️ Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

Output in `dist/` folder.

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Edit vite.config.ts and change port
server: {
  port: 3001
}
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Animations Not Smooth
- Close other applications
- Use Chrome for best performance
- Check browser hardware acceleration enabled

---

## 📚 Next Steps

1. Read [README.md](./README.md) for full documentation
2. Check [FEATURES.md](./FEATURES.md) for complete feature list
3. See [PRESENTATION.md](./PRESENTATION.md) for demo tips
4. Review [COMPONENTS.md](./COMPONENTS.md) for code details
5. Follow [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy

---

## 🎯 Key Files to Explore

```
/App.tsx                    → Main app structure
/pages/Home.tsx             → Landing page
/pages/ChatAssistant.tsx    → AI chat interface
/hooks/useAPI.ts            → API integration
/components/ui/GlassCard.tsx → Reusable component
```

---

## 💡 Tips

- **Mock Data**: App uses mock data automatically if backend unavailable
- **Hot Reload**: Changes auto-refresh in development
- **TypeScript**: All components are type-safe
- **Responsive**: Works on mobile, tablet, and desktop

---

## 🎨 Customization

### Change Colors
Edit `/styles/globals.css` - look for gradient definitions

### Add New Page
1. Create file in `/pages/NewPage.tsx`
2. Add route in `/App.tsx`
3. Add link in `/components/layout/Navbar.tsx`

### Modify Mock Data
Edit `/hooks/useAPI.ts` - see `mockAttractions`, `mockEvents`, etc.

---

## 🆘 Need Help?

- Check console for errors (F12 in browser)
- Ensure Node version is 18+
- Try in incognito mode
- Clear browser cache

---

## ✨ You're Ready!

Your tourism LLM frontend is now running. Start exploring and customizing!

**For hackathon demo, rehearse the flow:**  
Home → Chat → Map → Itinerary → Dashboard → Settings

**Good luck! 🚀**
