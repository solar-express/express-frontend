
import CategoryGrid from "@/components/category-grid"
import FlashDeals from "@/components/flash-deals"
import TopBrands from "@/components/top-brands"
import SolarBenefits from "@/components/solar-benefits"
import RecentlyViewed from "@/components/recently-viewed"
import BlogPreview from "@/components/blog-preview"
import FinancingOptions from "@/components/financing-options"
import FeaturedBrandProducts from "@/components/featured-brand-products"
import HomePromoGrid from "@/components/home-promo-grid"
import FeaturedPromoCards from "@/components/featured-promo-cards"
import BestSellers from "@/components/best-sellers"
import NewArrivals from "@/components/new-arrivals"
import FeaturedBrands from "@/components/featured-brands-card"
import SolarAd from "@/components/SolarAd"
import FeaturedQuickShop from "@/components/featured-quick-shop"

import MiniTopSolarAd from "@/components/miniTopSolarAd"
import MiniBottomSolarAd from "@/components/miniBottomSolarAd"

import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
      const siteBase = process.env.NEXT_PUBLIC_SITE_URL || ''
      const title = 'Solar Express — Solar panels, inverters, batteries and more'
      const description = 'Solar Express brings top solar brands to Pakistan. Explore panels, inverters, batteries, and system packages with fast delivery.'
      const canonical = siteBase ? `${siteBase.replace(/\/$/, '')}/` : undefined
      const image = siteBase ? `${siteBase.replace(/\/$/, '')}/solar-express-logo-07.png` : '/solar-express-logo-07.png'

      const metadata: Metadata = {
            title,
            description,
            openGraph: { title, description, url: canonical, images: [{ url: image }], type: 'website' },
            twitter: { title, description, card: 'summary_large_image', images: [image] },
            alternates: canonical ? { canonical } : undefined,
            robots: { index: true, follow: true }
      }

      return metadata
}

export default function Home() {
      return (
            <div className="container mx-auto px-2 md:px-14 lg:px-16 pb-12">
      {/* New Banner Grid with Solar Images */}
      <HomePromoGrid />
{/* <HomePromoGridV2/> */}
      <CategoryGrid />


<BestSellers/>


{/* Bottom Banner */}
      <MiniTopSolarAd />


      {/* Featured Promo Cards */}
      <FeaturedPromoCards />

      

      {/* Rest of the content */}
      <FeaturedBrandProducts />

      {/* Quick Shop Section */}
      <FeaturedQuickShop />
      
      {/* Secondary Promotional Grid */}
      {/* <PromotionalGrid /> */}
      {/* <FeaturedBrands /> */}

      {/* Solar Benefits Section */}
      <SolarBenefits />

      {/* Flash Deals Section */}
      <NewArrivals />

      

      {/* Top Brands Section */}
      <TopBrands />

      {/* Installation Services Section */}
      <SolarAd />  
      
      {/* Flash Deals Section */}
      <FlashDeals />
      
      {/* Solar Calculator Section */}
      {/* <SolarCalculator /> */}

      {/* Customer Reviews Section */}
      {/* <CustomerReviews /> */}

{/* Blog Preview Section */}
      <BlogPreview />

      {/* Financing Options Section */}
      <FinancingOptions />

      

      {/* Recently Viewed Products */}
      {/* <RecentlyViewed /> */}

      {/* Bottom Banner */}
      <MiniBottomSolarAd />
            </div>
      )
}

