# Quick Start: Deploy Your MANÉ GROUP Website

This guide provides the fastest path to get your MANÉ GROUP website live on the internet with both frontend and backend working together.

## Prerequisites
- A GitHub account
- A Supabase account (free tier available)
- A Vercel account (free tier available)

## Step 1: Set Up Supabase (Backend)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project" and sign up

2. **Create a New Project**
   - Click "New Project"
   - Enter project name (e.g., "mane-group")
   - Set a secure database password
   - Select a region near you
   - Click "Create New Project"

3. **Get Your Credentials**
   - Once created, go to "Project Settings" → "API"
   - Copy your "Project URL" and "anon public" key
   - Save these for later use

4. **Set Up Database Tables**
   - In the Supabase dashboard, go to "SQL Editor"
   - Run the migration files from your project in order:
     - `supabase/migrations/20251204155701_create_registrations_table.sql`
     - `supabase/migrations/20251211070000_create_messages_table.sql`
     - Continue with all migration files in numerical order

## Step 2: Prepare Your Code for Deployment

1. **Update Environment Variables**
   - In your project, update the `.env.example` file:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Commit Your Code**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   ```

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/mane-group.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy to Vercel (Frontend)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for the build to complete
   - Your site will be live!

## Step 4: Set Up Admin Access

1. **Create Admin User**
   - Visit your new website URL
   - Go to `/register` to create an account
   - Register with your email

2. **Make Admin in Database**
   - Go to your Supabase dashboard
   - Go to "Table Editor" → "users" table
   - Find your user and set `role` to "admin"

3. **Initialize Content**
   - Visit `/admin` and log in
   - The system will automatically create sample content
   - You can now manage all content through the admin panel

## Step 5: Update Your Google Maps Location

1. **Get Your Google Maps Embed URL**
   - Go to [Google Maps](https://maps.google.com)
   - Search for your business location
   - Click "Share" → "Embed a map"
   - Copy the iframe code

2. **Update in Admin Panel**
   - Go to your admin panel
   - Find the "contact" → "map" content item
   - Paste your Google Maps embed URL in the Image URL field
   - Save changes

## Your Website Is Live!

Congratulations! Your MANÉ GROUP website is now deployed and accessible to the world. Here's what you can do next:

### Manage Content
- Visit `/admin` to update text, images, and logos
- Add new services or modify existing ones
- Update contact information and business hours

### Monitor Performance
- Check Vercel analytics for visitor data
- Monitor Supabase for database usage
- Set up Google Analytics for detailed insights

### Customize Further
- Add your domain name in Vercel settings
- Customize the color scheme in `src/index.css`
- Add new pages by creating components in `src/pages/`

## Need Help?

Refer to the detailed guides:
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `CONTENT_MANAGEMENT_GUIDE.md` - How to manage content and images

For technical support, contact your development team.