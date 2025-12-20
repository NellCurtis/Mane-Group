# MANÉ GROUP Website Deployment Guide

This guide provides step-by-step instructions for deploying your MANÉ GROUP website with both frontend and backend working simultaneously, along with instructions for managing images, logos, and content.

## Table of Contents
1. [Deployment Options](#deployment-options)
2. [Frontend Deployment](#frontend-deployment)
3. [Backend Deployment (Supabase)](#backend-deployment-supabase)
4. [Connecting Frontend and Backend](#connecting-frontend-and-backend)
5. [Managing Images and Logos](#managing-images-and-logos)
6. [Updating Content](#updating-content)
7. [Troubleshooting](#troubleshooting)

## Deployment Options

### Recommended Hosting Platforms:
1. **Vercel** (Recommended for React/Vite apps)
2. **Netlify** (Alternative option)
3. **Traditional Web Server** (Apache/Nginx with Node.js)

### Backend (Database):
- **Supabase** (Already configured in your project)

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Prepare your code:**
   ```bash
   # Make sure your code is committed to Git
   git add .
   git commit -m "Prepare for deployment"
   ```

2. **Push to GitHub:**
   ```bash
   # Create a new repository on GitHub first
   git remote add origin https://github.com/yourusername/mane-group.git
   git branch -M main
   git push -u origin main
   ```

3. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be available at a Vercel URL

### Option 2: Deploy to Netlify

1. **Push to GitHub** (same as above)

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up or log in
   - Click "New site from Git"
   - Connect to GitHub
   - Select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Deploy:**
   - Click "Deploy site"
   - Wait for the build to complete

## Backend Deployment (Supabase)

Your project already uses Supabase for the backend. Here's how to set it up:

### 1. Create a Supabase Account
- Go to [supabase.com](https://supabase.com)
- Sign up for a free account
- Create a new project

### 2. Get Your Supabase Credentials
- Project URL: Found in your project settings
- Anonymous Key: Found in your project settings under API

### 3. Set Up Database Tables
Run the SQL migration files in the `supabase/migrations` directory in order:
1. `20251204155701_create_registrations_table.sql`
2. `20251211070000_create_messages_table.sql`
3. `20251211080000_create_content_table.sql`
4. And so on...

You can run these in the Supabase SQL editor.

## Connecting Frontend and Backend

### Environment Variables
Create a `.env.production` file in your project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

When deploying to Vercel or Netlify, add these as environment variables in your dashboard:
- Vercel: Settings → Environment Variables
- Netlify: Site settings → Build & deploy → Environment

## Managing Images and Logos

### 1. Uploading Images Through Admin Panel
- Navigate to `/admin` on your deployed site
- Log in with admin credentials
- Go to the "Content Management" section
- Find the content item you want to update
- Click "Edit"
- Upload a new image using the file upload feature
- Save your changes

### 2. Supported Image Formats
- JPEG/JPG
- PNG
- GIF
- WEBP

### 3. Recommended Image Sizes
- Hero banners: 1920x1080 pixels
- Service images: 800x600 pixels
- Logo: 200x200 pixels (square)
- Team photos: 600x400 pixels

### 4. Image Optimization Tips
- Compress images before uploading
- Use descriptive filenames
- Maintain consistent styling across all images

## Updating Content

### 1. Through Admin Panel (Recommended)
- Navigate to `/admin` on your deployed site
- Log in with admin credentials
- Go to the "Content Management" section
- Find the content item you want to update
- Click "Edit"
- Modify the English and French text
- Save your changes

### 2. Direct Database Updates
You can also update content directly in the Supabase database:
1. Go to your Supabase project dashboard
2. Navigate to Table Editor
3. Select the "content" table
4. Edit rows directly

### 3. Adding New Content Sections
To add new content sections:
1. Add new entries to the content table in Supabase
2. Update the frontend code to fetch and display the new content
3. The content structure follows this pattern:
   ```javascript
   {
     section: 'section-name',  // e.g., 'home-hero', 'about-mission'
     key: 'field-key',         // e.g., 'title', 'description'
     englishText: 'English content',
     frenchText: 'French content',
     imageUrl: 'optional-image-url'
   }
   ```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Google Maps refused to connect" Error
- Solution: Ensure the map URL is properly formatted as a Google Maps embed URL
- Check that the URL starts with `https://www.google.com/maps/embed`
- Verify the URL in the admin panel under Contact → Map

#### 2. Images Not Loading
- Check that image URLs are correct
- Ensure images are publicly accessible
- Verify file formats are supported

#### 3. Content Not Updating
- Clear browser cache
- Check that you're viewing the correct language
- Verify content changes were saved in the admin panel

#### 4. Database Connection Issues
- Double-check Supabase credentials
- Ensure environment variables are correctly set
- Check Supabase project settings and network restrictions

### Contact Support
If you continue to experience issues:
1. Check the browser console for error messages
2. Review the network tab for failed requests
3. Contact your development team for assistance

## Maintenance

### Regular Tasks
1. **Backup your database** weekly through Supabase dashboard
2. **Update dependencies** monthly:
   ```bash
   npm outdated
   npm update
   ```
3. **Monitor usage** through your hosting platform dashboards
4. **Review analytics** to understand user behavior

### Security Best Practices
1. Keep Supabase credentials secure
2. Regularly rotate API keys
3. Monitor access logs
4. Keep your deployment platform updated

---

For additional support, refer to the project README.md file or contact the development team.