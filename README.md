# Next.js Commerce - Static Data Version

A high-performance, server-rendered Next.js App Router ecommerce application **modified to use static JSON data** instead of a backend service.

This is a **demo/sample project** that uses local JSON files for product data and localStorage for cart management - perfect for learning, prototyping, or showcasing frontend skills without needing a backend.

## 🎯 What's Different?

This version has been converted from the original Shopify-integrated template to work entirely with static data:

- ✅ **No backend required** - All product data is stored in JSON files
- ✅ **No database needed** - Cart uses browser localStorage
- ✅ **Easy to customize** - Just edit JSON files to change products
- ✅ **Same beautiful UI** - All the original frontend components and design
- ✅ **Perfect for demos** - Great for portfolios and learning projects

## 📁 Data Management

All data is stored in `/lib/data/`:

- `products.json` - Product catalog
- `collections.json` - Product categories/collections
- `menus.json` - Navigation menus
- `pages.json` - Static pages (About, Terms, etc.)

See [`/lib/data/README.md`](./lib/data/README.md) for detailed instructions on managing your data.

## 🚀 Running Locally

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Your app will be running on [localhost:3000](http://localhost:3000/).

**No environment variables or backend configuration needed!**

## 🛒 How the Cart Works

The shopping cart uses **browser localStorage**:

- Cart data persists between page refreshes
- Cart is unique to each browser/device
- No checkout functionality (demo only)
- Can be easily extended to integrate with a backend when needed

## ✏️ Customizing Your Store

### Adding Products

1. Edit `/lib/data/products.json`
2. Add your product object (copy an existing one as a template)
3. Update product details, variants, images, and pricing
4. Add the product handle to collections in `/lib/data/collections.json`

### Changing Navigation

1. Edit `/lib/data/menus.json`
2. Modify `main-menu` for top navigation
3. Modify `footer-menu` for footer links

### Updating Pages

1. Edit `/lib/data/pages.json`
2. Update content for About, Terms, Privacy Policy, etc.

## 🎨 Features

This template uses modern Next.js features:

- React Server Components
- Server Actions
- Suspense for loading states
- Optimistic UI updates
- TypeScript throughout

## 📝 Original Template

This project is based on [Vercel's Next.js Commerce](https://github.com/vercel/commerce) template but modified to work without any backend integration.

## 🔄 Converting Back to Use a Backend

If you want to integrate this with a real backend later:

1. Replace `/lib/data/index.ts` with API calls to your backend
2. Update cart management to use server-side cart operations
3. Add checkout functionality
4. Set up environment variables for your backend

The frontend components are already designed to work with dynamic data, so the conversion is straightforward!

## 📦 Deployment

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/aragon-commerce)

Since this uses static data, no environment variables are required for deployment!

## 🤝 Contributing

Feel free to customize this project for your needs. If you make improvements, consider sharing them!

## 📄 License

MIT
