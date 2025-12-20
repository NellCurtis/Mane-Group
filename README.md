# MANÉ GROUP Website - Complete Setup & Optimization Guide

A comprehensive, production-ready multi-page website for MANÉ GROUP with professional services across immigration, education, technology, and design sectors.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Prerequisites](#prerequisites)
5. [Project Structure](#project-structure)
6. [Installation & Setup](#installation--setup)
   - [Project Setup](#1-project-setup)
   - [Supabase Configuration](#2-supabase-configuration)
   - [Environment Variables](#3-environment-variables)
   - [Database Migration](#4-database-migration)
   - [Admin User Setup](#5-admin-user-setup)
7. [Running the Application](#running-the-application)
8. [Performance Optimization Guide](#performance-optimization-guide)
   - [Code Splitting](#1-code-splitting)
   - [Image Optimization](#2-image-optimization)
   - [Bundle Size Reduction](#3-bundle-size-reduction)
   - [Caching Strategies](#4-caching-strategies)
   - [Database Optimization](#5-database-optimization)
   - [Vite Configuration](#6-vite-configuration-enhancements)
9. [Available Scripts](#available-scripts)
10. [Authentication System](#authentication-system)
11. [Internationalization](#internationalization)
12. [Customization Options](#customization-options)
13. [Deployment](#deployment)
14. [Troubleshooting](#troubleshooting)
15. [Security Considerations](#security-considerations)
16. [Maintenance Guidelines](#maintenance-guidelines)
17. [Support](#support)

## Overview

The MANÉ GROUP website is a modern, responsive web application built with cutting-edge technologies to provide a seamless user experience across all devices. The application features a comprehensive suite of services including immigration consulting, driving school enrollment, language training, innovation services, and graphic design solutions.

This application is designed with scalability, maintainability, and performance in mind, implementing industry best practices for React development, database management, and deployment strategies.

## Key Features

### Core Functionality
- **Multi-page Navigation**: Full-featured single-page application with 10+ distinct pages
- **Responsive Design**: Mobile-first approach ensuring optimal viewing on all devices
- **Dynamic Service Selection**: Smart registration forms that auto-populate based on URL parameters
- **Interactive Components**: Modern UI elements including image sliders, testimonials, and statistics
- **Admin Dashboard**: Comprehensive content management system with role-based access control
- **Social Media Integration**: Direct links to all major social platforms

### Advanced Features
- **Multi-language Support**: Full internationalization with English and French translations
- **Database Integration**: Supabase backend with real-time data synchronization
- **Form Validation**: Client and server-side validation for all user inputs
- **SEO Optimization**: Meta tags and structured data for improved search rankings
- **Accessibility Compliance**: WCAG 2.1 AA compliant design and functionality
- **Performance Monitoring**: Built-in analytics and performance tracking

## Technology Stack

### Frontend
- **React 18** - Component-based UI library
- **TypeScript** - Strongly typed JavaScript for enhanced development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router v6** - Declarative routing for React applications
- **Vite** - Next-generation frontend tooling for fast builds

### Backend & Database
- **Supabase** - Open-source Firebase alternative with PostgreSQL database
- **Supabase Auth** - Authentication and authorization system
- **Supabase Storage** - File storage and CDN delivery
- **PostgreSQL** - Robust relational database management system

### Additional Libraries
- **Lucide React** - Beautiful, consistent icon set
- **Recharts** - Declarative charting library built on D3
- **Canvas Confetti** - High-performance confetti effects
- **Framer Motion** - Production-ready motion library for React

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. **Node.js** (v16.14.0 or higher)
2. **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
3. **Git** (v2.30.0 or higher)
4. **Supabase Account** - Free tier available at [supabase.com](https://supabase.com)

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+, CentOS 8+)
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Disk Space**: Minimum 1GB free space
- **Internet Connection**: Required for installation and runtime operations

## Project Structure

```
mane-group/
├── public/                    # Static assets
├── src/                       # Source code
│   ├── components/            # Reusable UI components
│   ├── contexts/              # React context providers
│   ├── lib/                   # Utility functions and external integrations
│   ├── pages/                 # Page components
│   ├── utils/                 # Helper functions
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Entry point
├── supabase/                  # Database migrations and seed data
│   ├── migrations/            # SQL migration files
│   └── seeds/                 # Database seed data
├── .env                       # Environment variables (gitignored)
├── .env.example               # Environment variable template
├── index.html                 # HTML entry point
├── package.json               # Project dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite build configuration
```

## Installation & Setup

### 1. Project Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/mane-group.git
cd mane-group
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

### 2. Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Navigate to Project Settings > API
3. Copy "Project URL" to `VITE_SUPABASE_URL`
4. Copy "anon public" key to `VITE_SUPABASE_ANON_KEY`

### 3. Environment Variables

1. Create a `.env` file in the project root:
```bash
cp .env.example .env
```

2. Update the `.env` file with your Supabase credentials:
``env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3BxcnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU3NDQwMH0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 4. Database Migration

This project includes pre-built SQL migration files in the `supabase/migrations/` directory that define the complete database schema. You can either run these migrations directly or copy and paste the SQL into your Supabase dashboard.

#### Option 1: Run migrations using Supabase CLI
```bash
npx supabase migration up
# or if using the Supabase CLI
supabase db push
```

#### Option 2: Manual SQL execution
Copy and paste the SQL from the migration files in `supabase/migrations/` directory directly into your Supabase SQL editor. The files are organized in a specific structure where:

1. **Creation migrations** (earlier dates) create the basic table structures
2. **Enhancement migrations** (later dates) add constraints, indexes, and validation functions
3. **Specialized migrations** create triggers, functions, and populate initial data

All migration files should be applied in chronological order. None of the files are redundant - they follow a pattern where base tables are created first and then enhanced with additional features.

The migrations will create the following tables:
- `registrations` - Stores user registration form submissions
- `messages` - Stores contact form messages
- `content` - Stores website content for the CMS
- `content_versions` - Tracks content changes for rollback capability
- `users` - Manages user accounts and roles

All tables include proper data validation constraints, performance indexes, Row Level Security (RLS) policies, and triggers for data integrity.

### 5. Admin User Setup

To set up an admin user:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" and create an admin account
4. Set the user role to "admin" in the database

## Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Production Build
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

### Type Checking
```bash
npm run typecheck
# or
yarn typecheck
```

## Performance Optimization Guide

### 1. Code Splitting

The application implements code splitting through React.lazy and Suspense:

``tsx
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
```

This reduces the initial bundle size and improves loading times.

### 2. Image Optimization

All images use optimized URLs with compression parameters:

```tsx
<ImageSlider 
  images={[
    'https://images.pexels.com/photos/example.jpg?auto=compress&cs=tinysrgb&w=1920'
  ]} 
/>
```

### 3. Bundle Size Reduction

- Tree-shaking enabled through Vite
- Unused dependencies regularly audited
- Dynamic imports for heavy components

### 4. Caching Strategies

- HTTP caching headers configured for static assets
- Service worker implementation for offline support
- Database query caching for frequently accessed content

### 5. Database Optimization

Recent enhancements include:
- Indexes on frequently queried columns
- Data validation constraints
- Query optimization through proper indexing
- Efficient pagination for large datasets

### 6. Vite Configuration Enhancements

The Vite configuration includes:
- ESBuild for fast transpilation
- Rollup for efficient bundling
- Built-in minification and compression
- Hot Module Replacement (HMR) for development

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Authentication System

The application uses Supabase Auth for authentication with the following features:

- Email/password authentication
- Session persistence
- Role-based access control
- Protected routes for admin areas

### Admin Access

To access the admin dashboard:
1. Navigate to `/login`
2. Enter admin credentials
3. Upon successful authentication, you'll be redirected to `/admin`

## Internationalization

Full support for English and French with:
- Automatic language detection based on browser settings
- Manual language switching through the language selector
- Comprehensive translation files for all UI elements
- RTL support for future language expansions

Translation files are located in `src/lib/translations/`.

## Customization Options

### Content Management

The admin dashboard allows for:
- Real-time content editing
- Version history and rollback capabilities
- Multi-language content management
- Media asset management

### Styling

- Color scheme customization through Tailwind CSS
- Responsive design breakpoints
- Component-based styling approach
- Dark mode support (coming soon)

## Deployment

### Vercel Deployment (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with one click

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Upload the `dist/` folder to your hosting provider

3. Configure your web server to serve `index.html` for all routes (SPA routing)

### Environment Variables for Production

Ensure the following environment variables are set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `NODE_ENV=production`

## Troubleshooting

### Common Issues

1. **White Screen on Load**
   - Check browser console for errors
   - Verify Supabase credentials in `.env`
   - Ensure all required environment variables are set

2. **Database Connection Failed**
   - Confirm Supabase project URL and API key
   - Check network connectivity
   - Verify Supabase project region

3. **Admin Dashboard Not Loading**
   - Ensure you're logged in as an admin user
   - Check browser console for authentication errors
   - Verify user role in Supabase Auth dashboard

### Debugging Steps

1. Check browser developer tools console for errors
2. Verify all environment variables are correctly set
3. Confirm database migrations have been applied
4. Check network tab for failed API requests
5. Review Supabase logs for database errors

## Security Considerations

### Data Protection

- All database connections use SSL encryption
- Authentication tokens are securely stored
- Passwords are hashed using industry-standard algorithms
- CORS policies restrict unauthorized access

### Best Practices Implemented

- Input validation on both client and server sides
- SQL injection prevention through parameterized queries
- XSS protection through proper escaping
- CSRF protection for form submissions

### Supabase Security

- Row Level Security (RLS) policies implemented
- Service role keys restricted to backend operations
- Anonymous access limited to read-only operations
- Regular security audits and updates

## Maintenance Guidelines

### Regular Tasks

1. **Dependency Updates**
   ```bash
   npm outdated
   npm update
   ```

2. **Database Backups**
   - Enable Supabase automatic backups
   - Regular manual exports of critical data

3. **Performance Monitoring**
   - Monitor Core Web Vitals
   - Track database query performance
   - Review error logs regularly

### Content Updates

1. Use the admin dashboard for content changes
2. Test all translations after content updates
3. Review SEO metadata for new pages

### Code Quality

1. Run linting before commits:
   ```bash
   npm run lint
   ```

2. Check types regularly:
   ```bash
   npm run typecheck
   ```

3. Follow established coding standards

## Support

## Deployment

For detailed deployment instructions, see our comprehensive guides:

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md) - Fastest path to get your site live
- [CONTENT_MANAGEMENT_GUIDE.md](CONTENT_MANAGEMENT_GUIDE.md) - How to manage content and images

### Recommended Deployment Platforms

1. **Frontend**: Vercel (recommended) or Netlify
2. **Backend**: Supabase (already configured)

### Quick Deployment Steps

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

For issues, questions, or contributions:

1. Check the [Issues](https://github.com/your-username/mane-group/issues) section
2. Submit bug reports with detailed reproduction steps
3. Feature requests are welcome through pull requests
4. For urgent support, contact the development team

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

### License

This project is licensed under the MIT License - see the LICENSE file for details.
