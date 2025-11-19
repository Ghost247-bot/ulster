# Vercel Deployment Guide

This guide will help you deploy the Ulster Banking Application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Git repository hosted on GitHub, GitLab, or Bitbucket
3. Supabase project credentials

## Deployment Steps

### 1. Push Your Code to Git

Make sure your code is pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will auto-detect the Vite framework

### 3. Configure Environment Variables

In the Vercel project settings, add the following environment variables:

**Required Environment Variables:**

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_connection_string
```

**How to add environment variables in Vercel:**

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add each variable for all environments (Production, Preview, Development)
4. Click "Save"

**⚠️ Important:** 
- Never commit your `.env` file to Git
- Service role keys should be kept secure
- Use Vercel's environment variables for all sensitive data

### 4. Configure Build Settings

Vercel will automatically detect:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

If needed, you can override these in the Vercel project settings.

### 5. Deploy

1. Click "Deploy" button
2. Vercel will build and deploy your application
3. Wait for the deployment to complete
4. Your app will be available at `https://your-project.vercel.app`

## Post-Deployment

### 1. Update Supabase Redirect URLs

In your Supabase dashboard:

1. Go to Authentication → URL Configuration
2. Add your Vercel URL to "Redirect URLs":
   - Production: `https://your-project.vercel.app`
   - Preview: `https://your-project-*.vercel.app` (for PR previews)
3. Add the URLs to "Site URL" as well

### 2. Test the Deployment

- Visit your Vercel URL
- Test authentication flow
- Verify API connections to Supabase
- Check all routes work correctly

## Configuration Files

### `vercel.json`

The `vercel.json` file configures:
- **Rewrites:** All routes redirect to `index.html` for client-side routing
- **Headers:** Cache control for static assets
- **Build settings:** Automatically detected from Vite

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificates are automatically provisioned

## Environment-Specific Variables

You can set different values for:
- **Production:** Main deployment
- **Preview:** Branch/PR deployments
- **Development:** Local development

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (Vercel uses Node 18.x by default)

### Environment Variables Not Working

- Ensure variables start with `VITE_` prefix for client-side access
- Check variable names match exactly (case-sensitive)
- Redeploy after adding new variables

### Routing Issues

- Verify `vercel.json` rewrites are configured
- Check that all routes redirect to `index.html`
- Ensure React Router is configured correctly

### API Connection Issues

- Verify Supabase URL and keys are correct
- Check CORS settings in Supabase
- Ensure redirect URLs are added in Supabase dashboard

## Continuous Deployment

Vercel automatically deploys:
- **Production:** Pushes to `main` branch
- **Preview:** All other branches and PRs

Each deployment gets a unique URL for testing.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Supabase Documentation](https://supabase.com/docs)

