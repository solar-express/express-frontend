import BlogClient from "./BlogClient"
import { Metadata } from "next"

// Enable ISR to cache blog pages and reduce edge requests for dynamic routes
export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE
    const siteBase = process.env.NEXT_PUBLIC_SITE_URL || ""
    if (!apiBase) return { title: "Blog" }

    const res = await fetch(`${apiBase}/api/blogs/${slug}`, { cache: "default" })
    const json = await res.json()
    if (json?.blog) {
      const b = json.blog
      const lang = b.primaryLanguage || b.availableLanguages?.[0] || 'en'
      const title = b.seo?.metaTitle?.[lang] || b.title?.[lang] || b.title?.en || 'Blog'
      const description = b.seo?.metaDescription?.[lang] || b.excerpt?.[lang] || b.excerpt?.en || ''
      const image = b.seo?.ogImage || b.featuredImage?.url || (Array.isArray(b.images) && b.images[0])
      const canonical = siteBase ? `${siteBase.replace(/\/$/, "")}/blog/${b.slug}` : undefined

      // Build hreflang alternates only when we have a siteBase to create absolute URLs.
      let languages: Record<string, string> | undefined = undefined
      if (siteBase && Array.isArray(b.availableLanguages) && b.availableLanguages.length > 0) {
        languages = b.availableLanguages.reduce((acc: Record<string, string>, code: string) => {
          const href = `${siteBase.replace(/\/$/, "")}/blog/${b.slug}${code === 'en' ? '' : `?lang=${code}`}`
          if (href) acc[code] = href
          return acc
        }, {})
      }

      // Do not inject x-default here to avoid passing non-standard keys into Next metadata languages map.

      const metadata: Metadata = {
        title,
        description,
        openGraph: {
          title,
          description,
          url: canonical,
          images: image ? [{ url: image }] : undefined,
          // Use a supported OpenGraph type
          type: "article",
        },
        twitter: {
          title,
          description,
          card: image ? "summary_large_image" : "summary",
          images: image ? [image] : undefined,
        },
        alternates: canonical ? { canonical, languages } : (languages ? { languages } : undefined),
        robots: { index: true, follow: true },
      }

      return metadata
    }
  } catch (err) {
    // non-fatal
    // eslint-disable-next-line no-console
    console.warn('generateMetadata(blog) error:', err)
  }

  return { title: 'Blog' }
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const slug = (await params).slug
  const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? ''

  let blog = null
  let relatedBlogs: any[] = []

  try {
    if (apiBase) {
      const res = await fetch(`${apiBase}/api/blogs/${slug}`, { cache: "default" })
      const json = await res.json()
      if (json?.blog) {
        blog = json.blog
        relatedBlogs = json.relatedBlogs || []
      }
    }
  } catch (e) {
    // ignore; client will handle
    // eslint-disable-next-line no-console
    console.warn('Server fetch blog failed:', e)
  }

  // Build JSON-LD Article schema
  let jsonLd: any = null
  if (blog) {
    const siteBase = process.env.NEXT_PUBLIC_SITE_URL || ''
    const url = siteBase ? `${siteBase.replace(/\/$/, '')}/blog/${blog.slug}` : undefined
    const image = blog.seo?.ogImage || blog.featuredImage?.url || undefined

    // Include language info and BreadcrumbList for better SEO
    const primaryLang = blog.primaryLanguage || blog.availableLanguages?.[0] || 'en'

    jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          '@id': url || undefined,
          headline: blog.seo?.metaTitle?.[primaryLang] || blog.title?.[primaryLang] || blog.title?.en || undefined,
          description: blog.seo?.metaDescription?.[primaryLang] || blog.excerpt?.[primaryLang] || blog.excerpt?.en || undefined,
          image: image ? [image] : undefined,
          datePublished: blog.publishedAt,
          dateModified: blog.updatedAt || blog.publishedAt,
          author: blog.author ? { '@type': 'Person', name: blog.author.name } : undefined,
          inLanguage: primaryLang,
          mainEntityOfPage: url ? { '@type': 'WebPage', '@id': url } : undefined,
        },
        // BreadcrumbList
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': siteBase ? `${siteBase.replace(/\/$/, '')}/` : undefined,
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Blog',
              'item': siteBase ? `${siteBase.replace(/\/$/, '')}/blog` : undefined,
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': blog.title?.[primaryLang] || blog.title?.en || undefined,
              'item': url || undefined,
            }
          ].filter(Boolean),
        }
      ]
    }
  }

  return (
    <div>
      {jsonLd && (
        <script key="ld-json" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <BlogClient initialBlog={blog} initialRelatedBlogs={relatedBlogs} />
    </div>
  )
}
