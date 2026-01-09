# Image Optimization Guide

This guide outlines the best practices and steps to optimize images in the ManeGroup application to improve performance and reduce payload sizes.

## Issues Identified

Based on the Lighthouse audit, the following image optimization issues were detected:

- **Enormous Network Payloads**: Total image size was 2.42MB
- **Missing Next-Gen Formats**: Images not served in WebP or AVIF formats
- **Improperly Sized Images**: Images larger than their display dimensions
- **Serve Images in Next-Gen Formats**: Potential savings of 451KB
- **Properly Size Images**: Potential savings of 1.81MB

## Solution Steps

### 1. Convert Images to WebP Format

Convert all JPG and PNG images to WebP format for better compression:

```bash
# Install imagemin CLI tool
npm install -g imagemin-cli

# Convert images to WebP
imagemin input-folder/*.jpg --plugin=webp --out-dir=output-folder/

# Or use online tools like:
# - Squoosh (https://squoosh.app/)
# - Cloudinary (https://cloudinary.com/)
# - TinyPNG (https://tinypng.com/)
```

### 2. Resize Images to Appropriate Dimensions

Resize images to match their display dimensions:

- Hero images: Max 1200x600 pixels
- Service images: Max 800x600 pixels
- Logo images: Max 200x200 pixels
- Thumbnail images: Max 300x300 pixels

### 3. Implement Responsive Images

Use the `srcset` attribute to serve appropriately sized images:

```html
<!-- Example of responsive image implementation -->
<img 
  src="image-small.webp" 
  srcset="image-small.webp 480w, 
          image-medium.webp 800w, 
          image-large.webp 1200w"
  sizes="(max-width: 480px) 100vw, 
         (max-width: 800px) 50vw, 
         33vw"
  alt="Description"
  loading="lazy"
/>
```

### 4. Specific Image Optimization Targets

Based on the audit results, prioritize optimizing these images:

| File | Current Size | Potential Savings |
|------|-------------|-------------------|
| `/images/Mane.webp` | 389KB | 388KB |
| `/images/Linguistic/ling2.jpg` | 194KB | 169KB |
| `/images/Auto%20ecole/Auto2.jpg` | 161KB | 133KB |
| `/images/Design/des2.jpg` | 145KB | 126KB |
| `/images/immigration/immi1.jpg` | 140KB | 122KB |
| `/images/immigration/immi.jpg` | 139KB | 121KB |

### 5. Image Compression Recommendations

- **Quality setting**: Use 80-85% quality for photographs
- **Lossless compression**: For graphics, icons, and text-heavy images
- **Progressive JPEG**: For larger images to enable progressive loading

### 6. Implementing the ResponsiveImage Component

The application already includes a ResponsiveImage component that should be used throughout the application:

```tsx
import ResponsiveImage from './utils/ResponsiveImage';

// Usage
<ResponsiveImage
  src="/images/your-image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority="high" // for above-the-fold images
/>
```

### 7. Batch Optimization Process

1. **Backup original images** before optimization
2. **Optimize in batches** by folder:
   - `/public/images/hero/`
   - `/public/images/immigration/`
   - `/public/images/Design/`
   - `/public/images/Auto ecole/`
   - `/public/images/Linguistic/`
   - `/public/images/innovation/`
3. **Update references** in code to use new optimized images
4. **Test thoroughly** to ensure all images load correctly

### 8. Performance Monitoring

After optimization, monitor performance with:

```bash
# Run Lighthouse audit
npx lighthouse https://your-domain.com --view

# Or use Chrome DevTools Audit panel
```

Expected improvements after optimization:
- Reduce total image payload from 2.42MB to approximately 0.5MB
- Improve Largest Contentful Paint (LCP)
- Reduce Cumulative Layout Shift (CLS)
- Improve Core Web Vitals scores