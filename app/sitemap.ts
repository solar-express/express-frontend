import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.solarexpress.pk'

// Helper function to safely parse dates
function safeDate(dateString: any): Date {
  if (!dateString) return new Date()
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? new Date() : date
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/store`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  try {
    // Fetch all products
    const productsRes = await fetch(`${API_BASE}/api/products?limit=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        'Accept': 'application/json',
      },
    })
    
    let products: any[] = []
    if (productsRes.ok) {
      const contentType = productsRes.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const productsData = await productsRes.json()
        products = productsData.products || []
      }
    }

    const productPages: MetadataRoute.Sitemap = products.map((product: any) => ({
      url: `${SITE_URL}/product/${product.slug || product._id}`,
      lastModified: safeDate(product.updatedAt || product.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Fetch all blogs
    const blogsRes = await fetch(`${API_BASE}/api/blogs?limit=1000&status=published`, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      },
    })
    
    let blogs: any[] = []
    if (blogsRes.ok) {
      const contentType = blogsRes.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const blogsData = await blogsRes.json()
        blogs = blogsData.blogs || []
      }
    }

    const blogPages: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
      url: `${SITE_URL}/blog/${blog.slug}`,
      lastModified: safeDate(blog.updatedAt || blog.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Fetch all brands
    const brandsRes = await fetch(`${API_BASE}/api/brands?limit=1000`, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      },
    })
    
    let brands: any[] = []
    if (brandsRes.ok) {
      const contentType = brandsRes.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const brandsData = await brandsRes.json()
        brands = brandsData.brands || []
      }
    }

    const brandPages: MetadataRoute.Sitemap = brands.map((brand: any) => ({
      url: `${SITE_URL}/brands/${brand.slug}`,
      lastModified: safeDate(brand.updatedAt || brand.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Fetch all categories
    const categoriesRes = await fetch(`${API_BASE}/api/categories?limit=1000`, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      },
    })
    
    let categories: any[] = []
    if (categoriesRes.ok) {
      const contentType = categoriesRes.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const categoriesData = await categoriesRes.json()
        categories = categoriesData.categories || []
      }
    }

    const categoryPages: MetadataRoute.Sitemap = categories.map((category: any) => ({
      url: `${SITE_URL}/store?category=${category.slug}`,
      lastModified: safeDate(category.updatedAt || category.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...productPages, ...blogPages, ...brandPages, ...categoryPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static pages if API fails
    return staticPages
  }
}
