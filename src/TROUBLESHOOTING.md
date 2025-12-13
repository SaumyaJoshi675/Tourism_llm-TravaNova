# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 🚨 Build/Development Issues

#### Issue: `npm install` fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue: Development server won't start
**Solution:**
```bash
# Check if port 5173 is already in use
lsof -i :5173  # On Mac/Linux
netstat -ano | findstr :5173  # On Windows

# Kill the process or use a different port
npm run dev -- --port 3000
```

#### Issue: TypeScript errors
**Solution:**
```bash
# Restart TypeScript server in VSCode
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Or rebuild
npm run build
```

---

### 🎨 Styling Issues

#### Issue: Tailwind classes not working
**Solution:**
1. Check that `globals.css` is imported in your entry file
2. Restart dev server after modifying Tailwind config
3. Clear browser cache (Cmd/Ctrl + Shift + R)

#### Issue: Dark mode not switching
**Solution:**
- The theme is managed by ThemeContext
- Check browser console for errors
- Verify localStorage is enabled

#### Issue: Animations not smooth
**Solution:**
```bash
# Ensure Motion is properly installed
npm install motion

# Check that you're importing from 'motion/react'
# Not 'framer-motion'
```

---

### 🌐 API/Backend Issues

#### Issue: API calls failing
**Solution:**
1. **Check backend is running:**
   ```bash
   # Backend should be on http://localhost:8000
   curl http://localhost:8000/health
   ```

2. **Check CORS settings** in FastAPI:
   ```python
   # backend/main.py should have:
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Check environment variable:**
   ```bash
   # .env file should have:
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Restart both frontend and backend** after env changes

#### Issue: Chat not responding
**Solution:**
- The app uses mock data if backend is unavailable
- Check Network tab in DevTools for failed requests
- Verify `/chat` endpoint is working:
  ```bash
  curl -X POST http://localhost:8000/chat \
    -H "Content-Type: application/json" \
    -d '{"query": "test"}'
  ```

---

### 📱 Responsive Design Issues

#### Issue: Layout broken on mobile
**Solution:**
1. Use Chrome DevTools device emulator
2. Check responsive breakpoints:
   - `sm:` 640px
   - `md:` 768px
   - `lg:` 1024px
   - `xl:` 1280px

3. Verify mobile-specific classes are applied

#### Issue: Touch events not working
**Solution:**
- Motion uses `whileTap` for touch feedback
- Test on actual mobile device or use Chrome remote debugging

---

### 🎯 Performance Issues

#### Issue: Slow animations
**Solution:**
```tsx
// Use transform and opacity (GPU-accelerated)
<motion.div
  animate={{ x: 100 }}  // ✅ Good
  // Not: animate={{ marginLeft: 100 }}  // ❌ Slow
/>
```

#### Issue: Large bundle size
**Solution:**
```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer

# Use code splitting
# Import heavy components dynamically:
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

---

### 🖼️ Image/Asset Issues

#### Issue: Images not loading
**Solution:**
1. **For Unsplash images**: Check internet connection
2. **For local images**: Use the ImageWithFallback component
3. **Check browser console** for 404 errors

#### Issue: SVG icons not appearing
**Solution:**
```tsx
// Ensure lucide-react is installed
npm install lucide-react

// Import correctly
import { IconName } from 'lucide-react';
```

---

### 🔐 Authentication/State Issues

#### Issue: Theme/language preference not persisting
**Solution:**
- Check localStorage in DevTools → Application → Local Storage
- Clear localStorage and try again:
  ```javascript
  localStorage.clear();
  location.reload();
  ```

#### Issue: React Query cache not updating
**Solution:**
```tsx
// Invalidate queries manually
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ['key'] });
```

---

### 🌍 Deployment Issues

#### Issue: Build fails on Vercel/Netlify
**Solution:**
1. **Check Node version** - should be 18+
   ```json
   // package.json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

2. **Check environment variables** are set in platform

3. **Build locally first:**
   ```bash
   npm run build
   npm run preview
   ```

#### Issue: Routes return 404 in production
**Solution:**
1. **Vercel**: Add `vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

2. **Netlify**: Add `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### Issue: Environment variables not working in production
**Solution:**
- Only variables prefixed with `VITE_` are exposed to client
- Rebuild after adding new env vars
- Don't store secrets in frontend env vars!

---

### 🐛 Browser-Specific Issues

#### Issue: Works in Chrome but not Safari
**Solution:**
- Check for unsupported CSS features
- Add vendor prefixes if needed
- Test backdrop-filter support:
  ```css
  /* Fallback for older browsers */
  @supports not (backdrop-filter: blur(10px)) {
    .glass-card {
      background: rgba(255, 255, 255, 0.95);
    }
  }
  ```

#### Issue: Animations janky on Firefox
**Solution:**
- Reduce animation complexity
- Use `will-change` CSS property sparingly
- Test with Firefox DevTools Performance monitor

---

## 🆘 Emergency Demo Fixes

### If Something Breaks During Demo:

1. **Hard refresh**: Cmd/Ctrl + Shift + R
2. **Clear localStorage**: F12 → Application → Clear Storage
3. **Restart dev server**: Ctrl+C, then `npm run dev`
4. **Have backup**: Deploy to Vercel/Netlify beforehand

### If Backend is Down:

**Don't panic!** The app is designed to work with mock data:
- Chat uses fallback responses
- Map shows sample attractions
- Events load from local data
- Just mention: "Designed with graceful degradation for reliability"

---

## 📞 Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Debugging
npm run dev -- --debug  # Verbose logging
npm run build -- --debug

# Clean slate
rm -rf node_modules package-lock.json dist
npm install
npm run dev
```

---

## 🔍 Debugging Checklist

Before asking for help, check:

- [ ] Node.js version is 18+
- [ ] All dependencies installed (`node_modules` exists)
- [ ] `.env` file exists with correct values
- [ ] No errors in browser console (F12)
- [ ] No errors in terminal running dev server
- [ ] Backend is running (if using real API)
- [ ] Internet connection working (for Unsplash images)
- [ ] Browser is up to date
- [ ] Tried hard refresh (Cmd/Ctrl + Shift + R)

---

## 💡 Pro Tips

1. **Keep DevTools open** during development
2. **Use React DevTools** extension for component debugging
3. **Monitor Network tab** for API issues
4. **Check Console** for warnings and errors
5. **Use browser incognito mode** to test without cache

---

## 🚀 If All Else Fails

```bash
# Nuclear option: Fresh install
rm -rf node_modules package-lock.json dist .vite
npm cache clean --force
npm install
npm run dev
```

If this doesn't work, check the GitHub issues or reach out for support!

---

**Remember**: Most issues are simple fixes - don't overthink it! 🎯
