# Image Optimization Guidelines

## Best Practices for Image Handling

1. **Image Formats**:
   - Use WebP format for modern browsers (best compression)
   - Use JPEG for photographs
   - Use PNG for graphics with transparency
   - Use SVG for logos and icons

2. **Compression**:
   - Compress images before uploading
   - Target file sizes:
     - Hero images: 100-300KB
     - Gallery images: 50-150KB
     - Thumbnails: 20-50KB

3. **Responsive Images**:
   - Provide multiple sizes using srcset attribute
   - Use appropriate dimensions for each breakpoint

4. **Tools for Optimization**:
   - [Squoosh](https://squoosh.app/) - Online image compressor
   - [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
   - [ImageOptim](https://imageoptim.com/) - Desktop app for Mac
   - [ImageMagick](https://imagemagick.org/) - Command-line tool

## Implementation Tips

When adding images to the slider or other components:

1. Place images in this directory (`public/images/`)
2. Reference them in components using `/images/filename.ext`
3. For external images, use a CDN or image optimization service
4. Always add meaningful alt text for accessibility

## Example Usage

```jsx
// For local images
<img src="/images/my-image.webp" alt="Description of image" />

// For the ImageSlider component
const images = [
  '/images/slide1.webp',
  '/images/slide2.webp',
  '/images/slide3.webp'
];
```

## Fallback Handling

A placeholder image (`placeholder.jpg`) is used as a fallback when images fail to load. Always ensure this file exists in the images directory.