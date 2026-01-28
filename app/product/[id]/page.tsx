import ProductClientSection from "./ProductClientSection";
import { Metadata } from "next";

// Enable ISR for product pages
export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // `params` can be a resolver; await it before accessing properties per Next.js guidance
  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE;
    const siteBase = process.env.NEXT_PUBLIC_SITE_URL || "";
    if (!apiBase) return { title: "Product" };

    const res = await fetch(`${apiBase}/api/products/${id}`, { cache: "force-cache" });
    const json = await res.json();
    if (json?.success && json.product) {
      const p = json.product;
      const title = p.seo?.metaTitle || p.name || "Product";
      const description = p.seo?.metaDescription || (p.description ? String(p.description).slice(0, 320) : "");
      const image = p.seo?.ogImage || (Array.isArray(p.images) && p.images[0]) || undefined;
      const images = Array.isArray(p.images) ? p.images.filter(Boolean) : image ? [image] : [];
      const url = siteBase ? `${siteBase.replace(/\/$/, "")}/product/${p.slug || id}` : undefined;
      const keywords = Array.isArray(p.seo?.keywords) && p.seo.keywords.length > 0 ? p.seo.keywords : undefined;

      const metadata: Metadata = {
        title,
        description,
        keywords,
        openGraph: {
          title,
          description,
          url,
          images: images.length ? images.map((img: string) => ({ url: img })) : undefined,
          // Use a supported OpenGraph type to avoid runtime errors in Next.js
          type: "website",
          siteName: siteBase || undefined,
        },
        twitter: {
          title,
          description,
          card: images.length ? "summary_large_image" : "summary",
          images: images.length ? images : undefined,
        },
        alternates: url ? { canonical: url } : undefined,
        // Robots defaults (allow indexing)
        robots: { index: true, follow: true },
      };

      return metadata;
    }
  } catch (err) {
    // Non-fatal: if metadata generation fails, fall back to defaults
    // Keep UI behavior unchanged by not throwing here
    // eslint-disable-next-line no-console
    console.warn("generateMetadata error:", err);
  }

  return { title: "Product" };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  // Fetch product server-side to render JSON-LD schema without changing the client UI
  let product: any = null;
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE;
    if (apiBase) {
      const res = await fetch(`${apiBase}/api/products/${id}`, { cache: "force-cache" });
      const json = await res.json();
      if (json?.success && json.product) product = json.product;
    }
  } catch (e) {
    // ignore; keep UI working
    // eslint-disable-next-line no-console
    console.warn('Product schema fetch failed:', e);
  }

  // Build JSON-LD product schema if we have product data
  let jsonLd: any = null;
  if (product) {
    const siteBase = process.env.NEXT_PUBLIC_SITE_URL || "";
    const url = siteBase ? `${siteBase.replace(/\/$/, "")}/product/${product.slug || id}` : undefined;
    const images = Array.isArray(product.images) ? product.images.filter(Boolean) : product.seo?.ogImage ? [product.seo.ogImage] : [];

    jsonLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.seo?.metaTitle || product.name,
      image: images,
      description: product.seo?.metaDescription || product.description || undefined,
      sku: product.sku || product._id,
      brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
      offers: {
        "@type": "Offer",
        url: url,
        priceCurrency: product.currency || "PKR",
        price: product.price != null ? String(product.price) : undefined,
        availability: product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    };

    if (product.reviews && product.reviews.avgRating) {
      jsonLd.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: product.reviews.avgRating,
        reviewCount: product.reviews.totalCount || 0,
      };
    }
  }

  return (
    <div>
      {jsonLd && (
        <script
          key="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductClientSection id={id} />
    </div>
  );
}