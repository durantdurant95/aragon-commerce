# Static Data Management

This directory contains all the static data for the e-commerce store. The application has been converted from using Shopify as a backend to using local JSON files.

## Files

### `products.json`

Contains all product data including:

- Product details (title, description, price, etc.)
- Variants (sizes, colors, etc.)
- Images (URLs to product images)
- SEO metadata

**To add a new product:**

1. Copy an existing product object
2. Update the `id`, `handle`, `title`, `description`, etc.
3. Update the `variants` array with available options
4. Add image URLs (you can use Unsplash or your own hosted images)
5. Add the product handle to the appropriate collection in `collections.json`

### `collections.json`

Defines product collections/categories. Each collection contains:

- Basic info (handle, title, description)
- `productHandles`: Array of product handles that belong to this collection
- SEO metadata

**Special collections:**

- Collections starting with `hidden-` won't appear in the navigation
- `hidden-homepage-featured-items`: Products shown in the 3-item grid on homepage
- `hidden-homepage-carousel`: Products shown in the carousel on homepage

### `menus.json`

Navigation menu items. Contains two menus:

- `main-menu`: Top navigation bar items
- `footer-menu`: Footer navigation items

### `pages.json`

Static pages content (About, Terms, Privacy Policy, etc.)

## How the Cart Works

The shopping cart now uses **localStorage** instead of a backend:

- Cart data is stored in the browser's localStorage
- Cart persists between page refreshes
- Cart is unique to each browser/device
- No checkout functionality (this is a demo/sample project)

## Modifying Data

All data is in JSON format. Simply edit the JSON files to:

- Add new products
- Update prices
- Change descriptions
- Add/remove collections
- Modify navigation menus

After editing JSON files, restart your development server to see changes.

## Image Guidelines

Product images should:

- Be square (1:1 aspect ratio) or close to it
- Have good quality (at least 800x800px)
- Use HTTPS URLs
- Be optimized for web (not too large in file size)

You can use free image sources like:

- [Unsplash](https://unsplash.com/)
- [Pexels](https://pexels.com/)
- Your own hosted images

## Example: Adding a New Product

```json
{
  "id": "6",
  "handle": "acme-hat",
  "availableForSale": true,
  "title": "Acme Hat",
  "description": "A stylish hat for any occasion.",
  "descriptionHtml": "<p>A stylish hat for any occasion.</p>",
  "options": [
    {
      "id": "option-6",
      "name": "Size",
      "values": ["S/M", "L/XL"]
    }
  ],
  "priceRange": {
    "maxVariantPrice": {
      "amount": "30.00",
      "currencyCode": "USD"
    },
    "minVariantPrice": {
      "amount": "30.00",
      "currencyCode": "USD"
    }
  },
  "variants": [
    {
      "id": "variant-6-1",
      "title": "S/M",
      "availableForSale": true,
      "selectedOptions": [
        {
          "name": "Size",
          "value": "S/M"
        }
      ],
      "price": {
        "amount": "30.00",
        "currencyCode": "USD"
      }
    }
  ],
  "featuredImage": {
    "url": "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80",
    "altText": "Acme Hat",
    "width": 800,
    "height": 800
  },
  "images": [
    {
      "url": "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80",
      "altText": "Acme Hat - Front",
      "width": 800,
      "height": 800
    }
  ],
  "seo": {
    "title": "Acme Hat - Stylish & Comfortable",
    "description": "A stylish hat for any occasion."
  },
  "tags": [],
  "updatedAt": "2024-01-20T10:00:00Z"
}
```

Then add `"acme-hat"` to the `productHandles` array in the collections you want it to appear in.
