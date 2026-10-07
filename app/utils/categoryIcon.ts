/**
 * Icon for a catalog category, looked up by slug.
 * Categories come from the API, so an unknown slug falls back to a neutral icon;
 * add new slugs here as the real catalog introduces them.
 */
const CATEGORY_ICONS: Record<string, string> = {
  beauty: 'lucide:sparkles',
  fragrances: 'lucide:spray-can',
  furniture: 'lucide:sofa',
  groceries: 'lucide:shopping-basket',
  'home-decoration': 'lucide:lamp',
  'kitchen-accessories': 'lucide:cooking-pot',
  laptops: 'lucide:laptop',
  'mens-shirts': 'lucide:shirt',
  'mens-shoes': 'lucide:footprints',
  'mens-watches': 'lucide:watch',
  'mobile-accessories': 'lucide:headphones',
  motorcycle: 'lucide:motorbike',
  'skin-care': 'lucide:droplets',
  smartphones: 'lucide:smartphone',
  'sports-accessories': 'lucide:dumbbell',
  sunglasses: 'lucide:glasses',
  tablets: 'lucide:tablet',
  tops: 'lucide:shirt',
  vehicle: 'lucide:car',
  'womens-bags': 'lucide:handbag',
  'womens-dresses': 'lucide:shirt',
  'womens-jewellery': 'lucide:gem',
  'womens-shoes': 'lucide:footprints',
  'womens-watches': 'lucide:watch',
}

export const DEFAULT_CATEGORY_ICON = 'lucide:tag'

export function categoryIcon(slug: string): string {
  return CATEGORY_ICONS[slug] ?? DEFAULT_CATEGORY_ICON
}
