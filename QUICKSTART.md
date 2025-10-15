# Quick Start Guide 🚀

Get your static e-commerce store running in 2 minutes!

## Prerequisites

- Node.js 18+ installed
- pnpm installed (or npm/yarn)

## Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server
pnpm dev

# 3. Open your browser
# Visit http://localhost:3000
```

**That's it! No environment variables, no backend setup, no database configuration needed.**

## First Steps

### 1. Browse the Store

- Homepage shows featured products
- Click products to see details
- Try adding items to cart
- Browse different collections in the menu

### 2. Customize Your Products

Edit `/lib/data/products.json`:

```json
{
  "id": "1",
  "handle": "my-product",
  "title": "My Awesome Product",
  "description": "Product description here",
  "priceRange": {
    "minVariantPrice": { "amount": "29.99", "currencyCode": "USD" }
  },
  "featuredImage": {
    "url": "https://images.unsplash.com/photo-example?w=800&q=80"
  }
}
```

### 3. Update Collections

Edit `/lib/data/collections.json`:

```json
{
  "handle": "my-collection",
  "title": "My Collection",
  "productHandles": ["my-product", "another-product"]
}
```

### 4. Change Navigation

Edit `/lib/data/menus.json`:

```json
{
  "main-menu": [
    { "title": "Shop All", "path": "/search" },
    { "title": "About", "path": "/about" }
  ]
}
```

## What You Can Do

✅ Add/edit/remove products
✅ Create collections
✅ Customize menus
✅ Update page content
✅ Change images and prices
✅ Test the shopping cart
✅ Deploy to production

## What's NOT Included

❌ Real checkout/payment processing
❌ User accounts
❌ Order management
❌ Backend database
❌ Cart sync across devices

This is a **frontend demo/sample project** perfect for:

- Learning Next.js
- Portfolio projects
- Frontend demonstrations
- Prototyping designs
- Testing UI/UX ideas

## Need More Help?

- 📖 **Data Management**: See `/lib/data/README.md`
- 🔄 **Migration Details**: See `MIGRATION_SUMMARY.md`
- 📝 **Project Overview**: See `README.md`

## Deployment

Deploy to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or deploy to:

- Netlify
- GitHub Pages
- Any static hosting service

**No environment variables required!**

## Common Commands

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Tips

💡 **Finding Images**: Use [Unsplash](https://unsplash.com/) for free product photos

💡 **Editing JSON**: Use VSCode with JSON validation enabled

💡 **Testing Cart**: Open browser DevTools → Application → Local Storage to see cart data

💡 **Resetting Cart**: Run `localStorage.clear()` in browser console

---

Happy coding! 🎉
