# Migration Summary: Shopify → Static Data

This document summarizes all the changes made to convert the Next.js Commerce template from using Shopify as a backend to using static JSON data stored in the repository.

## 🎯 What Was Changed

### ✅ New Files Created

1. **`/lib/data/` directory** - Contains all static data

   - `products.json` - 5 sample products
   - `collections.json` - 5 collections (including hidden ones for homepage)
   - `menus.json` - Main and footer navigation menus
   - `pages.json` - 5 static pages (About, Terms, Privacy, FAQ, Shipping)
   - `index.ts` - Data service layer (mimics Shopify API)
   - `README.md` - Complete guide for managing data

2. **`/lib/cart-utils.ts`** - Client-side cart management using localStorage

   - `getLocalCart()` - Retrieve cart from localStorage
   - `addToLocalCart()` - Add items to cart
   - `removeFromLocalCart()` - Remove items from cart
   - `updateLocalCartItem()` - Update item quantities
   - `clearLocalCart()` - Clear the cart

3. **`/lib/types.ts`** - TypeScript type definitions
   - Moved from `/lib/shopify/types.ts` to be framework-agnostic
   - All original types preserved

### 🔄 Modified Files

1. **`/lib/data/index.ts`**

   - Replaced Shopify GraphQL queries with JSON file reads
   - Implements same API surface as Shopify functions
   - All functions are async to maintain compatibility
   - Added sorting, filtering, and search functionality

2. **`/components/cart/cart-context.tsx`**

   - Removed dependency on server-side cart promise
   - Uses `useState` and `useEffect` for client-side state
   - Loads cart from localStorage on mount
   - Auto-saves to localStorage on every change

3. **`/components/cart/actions.ts`**

   - Server actions are now placeholders
   - Actual cart operations happen client-side in cart-context

4. **`/app/layout.tsx`**

   - Removed `getCart()` call
   - CartProvider no longer needs `cartPromise` prop

5. **All import statements updated**

   - Changed from `'lib/shopify'` to `'lib/data'`
   - Changed from `'lib/shopify/types'` to `'lib/types'`
   - Updated in 14+ files across the application

6. **`/README.md`**
   - Completely rewritten for static data version
   - Clear instructions for running without backend
   - Documentation on data management
   - Removed Shopify-specific setup instructions

### 🗑️ Removed/Deleted

1. **`/lib/shopify/` directory** - Entire Shopify integration removed

   - `index.ts` - Shopify API client
   - `types.ts` - Moved to `/lib/types.ts`
   - `queries/` - GraphQL queries
   - `mutations/` - GraphQL mutations
   - `fragments/` - GraphQL fragments

2. **Environment variables** - No longer needed

   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - `SHOPIFY_REVALIDATION_SECRET`

3. **Revalidation webhook** - `/app/api/revalidate/route.ts` still exists but is now a no-op

## 🏗️ Architecture Changes

### Before (Shopify Integration)

```
User Request → Next.js Server → Shopify GraphQL API → Response
                ↓
         Server-side Cart → Shopify Cart API
```

### After (Static Data)

```
User Request → Next.js Server → Local JSON Files → Response
                ↓
         Client-side Cart → Browser localStorage
```

## 📊 Data Structure

### Products

- 5 sample products included
- Each product has variants, images, pricing, SEO metadata
- Products use Unsplash images (free, no attribution required for demo)

### Collections

- 3 visible collections: All, Apparel, Accessories
- 2 hidden collections for homepage: Featured Items, Carousel

### Cart Storage

```javascript
localStorage['aragon-commerce-cart'] = {
  id: 'local-cart',
  lines: [...], // Cart items
  cost: {...},  // Totals
  totalQuantity: number
}
```

## 🔌 Integration Points

If you want to add a backend later, you only need to:

1. **Replace `/lib/data/index.ts`**

   - Swap JSON reads with API calls
   - Keep the same function signatures
   - Return the same data structure

2. **Update cart management**

   - Replace localStorage with API calls
   - Update `/lib/cart-utils.ts` or remove it
   - Add authentication if needed

3. **Add checkout functionality**
   - Implement payment processing
   - Add order confirmation
   - Email notifications

The frontend components don't need any changes!

## 🎨 Features Preserved

✅ All UI components working
✅ Product browsing and search
✅ Collections and filtering
✅ Shopping cart
✅ Product pages with image gallery
✅ Variant selection
✅ Responsive design
✅ Dark mode
✅ SEO optimization
✅ Server components and caching

## ❌ Features Removed/Not Working

❌ Checkout (placeholder only)
❌ Order history
❌ User accounts
❌ Real payment processing
❌ Inventory management
❌ Analytics/tracking
❌ Cart sync across devices

## 🚀 Running the Application

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
http://localhost:3000
```

**No environment variables needed!**
**No backend setup required!**

## 📝 Next Steps

1. **Customize your products**

   - Edit `/lib/data/products.json`
   - Add your own images
   - Set your prices

2. **Organize collections**

   - Edit `/lib/data/collections.json`
   - Group products by category

3. **Update content**

   - Edit `/lib/data/pages.json`
   - Update About, Terms, Privacy pages

4. **Deploy**
   - Deploy to Vercel, Netlify, or any static host
   - No environment variables needed

## 💡 Tips for Managing Data

- Use VSCode or any JSON editor
- Validate JSON before committing (use jsonlint.com)
- Keep product IDs and handles unique
- Use consistent image sizes (800x800px recommended)
- Test changes locally before deploying

## 🐛 Common Issues

**Cart not persisting?**

- Check browser's localStorage is enabled
- Clear localStorage: `localStorage.clear()` in console

**Product images not loading?**

- Verify image URLs are accessible
- Check for HTTPS (not HTTP)
- Try using Unsplash URLs

**Changes not appearing?**

- Restart dev server after editing JSON
- Clear browser cache
- Check JSON is valid (no syntax errors)

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Unsplash](https://unsplash.com/) - Free images
- [JSON Validator](https://jsonlint.com/)
- [Original Shopify Template](https://github.com/vercel/commerce)

---

**Questions or Issues?**
Check the data management guide at `/lib/data/README.md` or the main README.md for more information.
