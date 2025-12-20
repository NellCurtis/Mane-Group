# MANÉ GROUP Content Management Guide

This guide explains how to manage content, images, and logos in your MANÉ GROUP website through the admin panel.

## Table of Contents
1. [Accessing the Admin Panel](#accessing-the-admin-panel)
2. [Managing Images and Logos](#managing-images-and-logos)
3. [Updating Text Content](#updating-text-content)
4. [Managing the Google Maps Location](#managing-the-google-maps-location)
5. [Adding New Content Sections](#adding-new-content-sections)
6. [Best Practices](#best-practices)

## Accessing the Admin Panel

1. Navigate to your website's admin panel:
   - Production: `https://yourdomain.com/admin`
   - Development: `http://localhost:5173/admin`

2. Log in with your admin credentials:
   - Username: Your admin email
   - Password: Your admin password

3. Upon successful login, you'll see the admin dashboard with several sections:
   - Registrations
   - Messages
   - Content Management
   - Users
   - Profile

## Managing Images and Logos

### Uploading New Images

1. In the admin panel, go to "Content Management"
2. Find the content item you want to update (e.g., "home-hero" section)
3. Click the "Edit" button next to the item
4. In the edit form:
   - You can modify the English and French text
   - To upload an image:
     a. Click "Choose File" next to the Image URL field
     b. Select an image from your computer
     c. Click "Upload Image"
     d. Wait for the upload to complete
5. Click "Save Changes"

### Supported Image Types
- JPEG/JPG
- PNG
- GIF
- WEBP

### Recommended Image Sizes
Different sections require different image sizes for optimal display:

| Section | Purpose | Recommended Size |
|---------|---------|------------------|
| Home Hero | Main banner | 1920×1080 pixels |
| Service Pages | Service images | 800×600 pixels |
| About Page | Team photos | 600×400 pixels |
| Logo | Company logo | 200×200 pixels |

### Image Optimization Tips
1. Compress images before uploading to reduce load times
2. Use descriptive filenames (e.g., "mane-group-driving-school.jpg")
3. Maintain consistent styling across all images
4. Keep file sizes under 2MB for best performance

## Updating Text Content

### Modifying Existing Content

1. In the admin panel, go to "Content Management"
2. Locate the content item you wish to modify
3. Click "Edit" next to the item
4. Update the English and/or French text in the respective fields
5. Click "Save Changes"

### Content Structure
Content is organized by sections and keys:
- **Section**: The page or area (e.g., "home-hero", "about-mission")
- **Key**: The specific element (e.g., "title", "description", "cta-button")

### Example Content Items
| Section | Key | Purpose |
|---------|-----|---------|
| home-hero | title | Main headline on homepage |
| home-hero | subtitle | Supporting text on homepage |
| about-hero | title | About page headline |
| services-driving | title | Driving school service title |
| contact-hero | title | Contact page headline |

## Managing the Google Maps Location

### Updating the Map Location

1. In the admin panel, go to "Content Management"
2. Look for the item with:
   - Section: "contact"
   - Key: "map"
3. Click "Edit" next to this item
4. In the Image URL field, enter your Google Maps embed URL:
   - Go to Google Maps
   - Search for your location
   - Click "Share"
   - Click "Embed a map"
   - Copy the provided iframe code
   - Extract the src attribute value
5. Paste the URL into the Image URL field
6. Click "Save Changes"

### Getting a Google Maps Embed URL

1. Go to [Google Maps](https://maps.google.com)
2. Search for your business location
3. Click the "Share" button
4. Click the "Embed a map" tab
5. Copy the iframe code
6. Extract the URL from the src attribute

Example iframe code:
```html
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.409844444444!2d11.516666666666666!3d3.8666666666666667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcff6a5adac47%3A0xb2b17b8a17792c8a!2sBonas%20devant%20Auto%20Ecole%20Mane%20D%27afrik%2C%20Yaound%C3%A9!5e0!3m2!1sen!2scm!4v1234567890123!5m2!1sen!2scm" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
```

The URL you need is everything inside the src="..." attribute.

## Adding New Content Sections

### Creating New Content Items

1. In the admin panel, go to "Content Management"
2. Click "Add New Content Item"
3. Fill in the form:
   - Section: Choose an existing section or create a new one
   - Key: A unique identifier for this content piece
   - English Text: The English version of your content
   - French Text: The French version of your content
   - Image URL (optional): URL to an image if needed
4. Click "Save"

### Using New Content in Pages

To display new content in your website pages, a developer would need to:
1. Update the page component to fetch the new content
2. Add the content display logic in the JSX

## Best Practices

### Content Management
1. **Regular Updates**: Update content regularly to keep information current
2. **Consistent Voice**: Maintain a consistent tone and style across all content
3. **Mobile Preview**: Always check how content looks on mobile devices
4. **Translation Accuracy**: Ensure French translations accurately convey the same meaning as English text

### Image Management
1. **Alt Text**: While not directly manageable through the admin panel, ensure images have descriptive alt text in the code
2. **Naming Convention**: Use consistent naming conventions for images
3. **Backup**: Keep backups of important images
4. **Compression**: Compress images to optimize loading times

### Security
1. **Strong Passwords**: Use strong, unique passwords for admin access
2. **Regular Logout**: Always log out of the admin panel when finished
3. **Access Control**: Limit admin access to authorized personnel only
4. **Updates**: Keep the website platform updated

### Monitoring
1. **Analytics**: Monitor website analytics to understand user behavior
2. **Feedback**: Pay attention to user feedback about content and usability
3. **Performance**: Regularly check website performance and loading times
4. **Broken Links**: Periodically check for broken links or missing images

---

For technical support or to request new features, contact your development team.