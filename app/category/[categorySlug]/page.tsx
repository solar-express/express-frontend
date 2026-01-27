import CategoryClient from "../CategoryClient"
import { Metadata } from "next"

// Enable ISR to cache category pages and reduce edge requests for dynamic routes
export const revalidate = 3600; // Revalidate every hour

// Server wrapper: provide SEO metadata on the server while rendering the
// existing client UI inside `CategoryClient`. Also embed JSON-LD structured
// data (BreadcrumbList, Organization and a small ItemList of products) so
// search engines can pick up category context while preserving the client UI.
export async function generateMetadata({ params }: { params: { categorySlug: string } }): Promise<Metadata> {
  // `params` can be a promise for dynamic routes; await it before accessing props.
  const { categorySlug: slug } = (await params) as { categorySlug: string }
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || ''
  const siteBase = process.env.NEXT_PUBLIC_SITE_URL || ''

  try {
    if (!apiBase) return { title: `Category - ${slug}` }
    const res = await fetch(`${apiBase}/api/category/${slug}`, { cache: 'default' })
    if (!res.ok) return { title: `Category - ${slug}` }
    const cat = await res.json()
    const title = cat.name || `Category - ${slug}`
    const description = cat.description || `Browse ${title} products`
    const canonical = siteBase ? `${siteBase.replace(/\/$/, '')}/category/${cat.slug || slug}` : undefined
    const image = siteBase ? `${siteBase.replace(/\/$/, '')}/solar-express-logo-07.png` : undefined

    const metadata: Metadata = {
      title,
      description,
      openGraph: { title, description, url: canonical, images: image ? [{ url: image }] : undefined },
      alternates: canonical ? { canonical } : undefined,
      robots: { index: true, follow: true }
    }

    return metadata
  } catch (err) {
    return { title: `Category - ${slug}` }
  }
}

export default async function CategoryPage({ params }: { params: { categorySlug: string } }) {
  // Resolve params and fetch minimal data for structured data injection. We
  // intentionally keep the client UI unchanged and pass only params to the
  // client — the JSON-LD is rendered server-side so crawlers receive it.
  const { categorySlug: slug } = (await params) as { categorySlug: string }
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || ''
  const siteBase = process.env.NEXT_PUBLIC_SITE_URL || ''

  // Prepare JSON-LD pieces
  const jsonLd: any[] = []

  // BreadcrumbList
  const siteRoot = siteBase ? siteBase.replace(/\/$/, '') : ''
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': siteRoot || 'http://localhost:3000' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Store', 'item': siteRoot ? `${siteRoot}/store` : 'http://localhost:3000/store' },
      { '@type': 'ListItem', 'position': 3, 'name': slug, 'item': siteRoot ? `${siteRoot}/category/${slug}` : `http://localhost:3000/category/${slug}` }
    ]
  })

  // Organization (basic)
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Solar Express',
    'url': siteRoot || 'http://localhost:3000',
    'logo': siteRoot ? `${siteRoot}/solar-express-logo-07.png` : undefined
  })

  // Small product item list (fetch a small sample to include name + url)
  if (apiBase) {
    try {
      const productsRes = await fetch(`${apiBase}/api/products?category=${encodeURIComponent(slug)}&limit=10`, { cache: 'default' })
      if (productsRes.ok) {
        const productsJson = await productsRes.json()
        const sampleProducts = productsJson.products || []
        if (Array.isArray(sampleProducts) && sampleProducts.length > 0) {
          const itemList = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'itemListElement': sampleProducts.map((p: any, i: number) => ({
              '@type': 'ListItem',
              'position': i + 1,
              'url': siteRoot ? `${siteRoot}/product/${p.slug || p._id}` : `http://localhost:3000/product/${p.slug || p._id}`,
              'name': p.name
            }))
          }
          jsonLd.push(itemList)
        }
      }
    } catch (err) {
      // fail silently — structured data is an enhancement, not required
      console.warn('Failed to fetch sample products for JSON-LD', err)
    }
  }

  // Render JSON-LD server-side and keep the client UI as-is
  return (
    <>
      {jsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CategoryClient params={{ categorySlug: slug }} />
    </>
  )
}

