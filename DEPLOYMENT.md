# Deploying Logic Gate Simulator to GitHub Pages

This guide will help you deploy your Logic Gate Simulator to GitHub Pages so it's publicly accessible.

## Prerequisites

- Git installed on your computer
- A GitHub account
- Node.js and npm installed

## Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository**:
   - Go to [github.com](https://github.com) and create a new repository
   - Name it something like `logic-gate-simulator`
   - Don't initialize with README (you already have code)

3. **Connect local repo to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/logic-gate-simulator.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Configure Vite for GitHub Pages

1. **Update `vite.config.ts`**:
   
   Add the `base` property to match your repository name:
   
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/logic-gate-simulator/', // Replace with your repo name
   })
   ```

2. **Update `package.json`**:
   
   Add these scripts to the `"scripts"` section:
   
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "tsc && vite build",
       "preview": "vite preview",
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

## Step 3: Deploy to GitHub Pages

1. **Build and deploy**:
   ```bash
   npm run deploy
   ```

   This command will:
   - Build your app (`npm run build`)
   - Create a `gh-pages` branch
   - Push the `dist` folder to that branch

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select branch: `gh-pages` and folder: `/ (root)`
   - Click **Save**

3. **Wait a few minutes** for GitHub to build and deploy

4. **Access your site**:
   - Your app will be available at: `https://YOUR_USERNAME.github.io/logic-gate-simulator/`

## Step 4: Update and Redeploy

Whenever you make changes:

```bash
git add .
git commit -m "Your commit message"
git push origin main
npm run deploy
```

## Troubleshooting

### Blank Page After Deployment

- Make sure `base` in `vite.config.ts` matches your repository name exactly
- Check browser console for errors (usually path issues)

### 404 Errors

- Verify the `gh-pages` branch exists
- Check that GitHub Pages is enabled in repository settings
- Ensure the source is set to `gh-pages` branch

### Build Errors

- Run `npm run build` locally first to catch errors
- Check that all dependencies are installed: `npm install`
- Verify TypeScript has no errors: `npx tsc --noEmit`

## Custom Domain (Optional)

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure DNS settings with your domain provider
3. Enable "Enforce HTTPS" in GitHub Pages settings

## Success!

Your Logic Gate Simulator should now be live and accessible to anyone with the URL!
