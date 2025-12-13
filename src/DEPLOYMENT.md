# 🚀 Deployment Guide

Complete guide to deploy the Uttarakhand Tourism LLM frontend for your hackathon demonstration.

---

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Backend API endpoints configured
- [ ] Environment variables set
- [ ] Production build successful
- [ ] Images loading correctly
- [ ] All routes working
- [ ] Mobile responsive verified
- [ ] Dark mode tested
- [ ] Performance optimized

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⚡

**Why Vercel?**
- Zero configuration for React
- Automatic HTTPS
- Global CDN
- Instant rollbacks
- Free tier generous

**Steps:**

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: Uttarakhand Tourism Frontend"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_BASE_URL=https://your-backend-api.com`

4. **Deploy**
   - Click "Deploy"
   - Your site will be live at: `https://your-project.vercel.app`

**Custom Domain (Optional):**
- Go to Project Settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

---

### Option 2: Netlify 🦋

**Steps:**

1. **Build Locally**
```bash
npm run build
```

2. **Deploy via Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

3. **Or Deploy via Web Interface**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Configure environment variables in Site Settings

**Configuration File** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: GitHub Pages 📄

**Steps:**

1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Update package.json**
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/repo-name"
}
```

3. **Update vite.config.ts**
```typescript
export default defineConfig({
  base: '/repo-name/',
  plugins: [react()],
});
```

4. **Build and Deploy**
```bash
npm run build
npm run deploy
```

---

### Option 4: Docker Container 🐳

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Build and Run:**
```bash
# Build image
docker build -t uttarakhand-tourism-frontend .

# Run container
docker run -p 80:80 uttarakhand-tourism-frontend
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:8000
    depends_on:
      - backend
  
  backend:
    image: your-backend-image
    ports:
      - "8000:8000"
```

---

## 🔧 Environment Configuration

### Development (.env.development)
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Production (.env.production)
```env
VITE_API_BASE_URL=https://api.uttarakhand-tourism.com
```

### Staging (.env.staging)
```env
VITE_API_BASE_URL=https://staging-api.uttarakhand-tourism.com
```

---

## ⚡ Performance Optimization

### 1. Build Optimization

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['motion', 'lucide-react'],
          'chart-vendor': ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### 2. Image Optimization
- Use WebP format where possible
- Implement lazy loading for images
- Use Unsplash with proper width parameters

### 3. Code Splitting
```tsx
// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const ChatAssistant = lazy(() => import('./pages/ChatAssistant'));

// Wrap with Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/chat" element={<ChatAssistant />} />
  </Routes>
</Suspense>
```

### 4. Caching Headers (nginx)
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 📊 Analytics Integration

### Google Analytics
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🔒 Security Headers

### nginx Configuration
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;
```

---

## 🧪 Testing Before Deployment

### 1. Lighthouse Audit
```bash
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=http://localhost:4173
```

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

### 2. Cross-Browser Testing
Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 3. Responsive Testing
Test breakpoints:
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

---

## 📱 Progressive Web App (Optional)

### manifest.json
```json
{
  "name": "Uttarakhand Tourism AI",
  "short_name": "UK Tourism",
  "description": "AI-powered travel companion for Uttarakhand",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#10b981",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker
```typescript
// vite-plugin-pwa configuration
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        // ... manifest config
      },
    }),
  ],
});
```

---

## 🎯 Hackathon Demo Setup

### Pre-Demo Checklist

**1 Day Before:**
- [ ] Deploy to production
- [ ] Test all features on production URL
- [ ] Prepare demo account/data
- [ ] Check mobile responsiveness
- [ ] Verify backend connectivity
- [ ] Create backup deployment

**1 Hour Before:**
- [ ] Clear browser cache
- [ ] Test on demo device
- [ ] Check internet connectivity
- [ ] Have backup offline version ready
- [ ] Test all theme modes

### Demo Flow Preparation

1. **Open Multiple Tabs:**
   - Tab 1: Landing page
   - Tab 2: Chat interface
   - Tab 3: Map explorer
   - Tab 4: Itinerary builder
   - Tab 5: Dashboard

2. **Prepare Demo Queries:**
   - "Plan a 3-day trip to Nainital"
   - "What are the best adventure activities?"
   - "Show me spiritual places"

3. **Have Screenshots Ready:**
   - Architecture diagram
   - API documentation
   - Performance metrics
   - Mobile views

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Restart dev server after changes
- Check `.env` file is in root directory

### Routes Not Working on Production
- Add redirect rules for SPA
- Check base URL in router
- Verify nginx/server configuration

### Images Not Loading
- Check CORS headers on image sources
- Verify Unsplash API is accessible
- Use fallback images

---

## 📈 Post-Deployment Monitoring

### Tools to Use:
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Google Analytics**: User behavior

### Key Metrics to Monitor:
- Page load time
- Time to interactive
- First contentful paint
- API response times
- Error rates
- User engagement

---

## 🎊 Success Indicators

Your deployment is successful when:
- ✅ All pages load in < 2 seconds
- ✅ Mobile score 90+ on Lighthouse
- ✅ No console errors
- ✅ All animations smooth (60 FPS)
- ✅ API calls work correctly
- ✅ Theme switching instant
- ✅ Responsive on all devices

---

## 📞 Support

For deployment issues:
1. Check browser console for errors
2. Verify API connectivity
3. Test in incognito mode
4. Clear cache and cookies
5. Check environment variables

---

**Good Luck with Your Hackathon! 🚀**

Remember: A smooth demo is more important than fancy features. Test everything multiple times before the presentation!
