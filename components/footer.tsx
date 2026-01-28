import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-[#1a5ca4] text-white pt-10 md:pt-12 pb-6 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-8 mx-4 md:px-10 lg:px-12">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Image
                src="/logo-crop.PNG"
                alt="Solar Express Logo"
                width={200}
                height={50}
                priority
                unoptimized
                className="h-12 md:h-12 w-auto"
              />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 text-[#f26522] flex-shrink-0" />
                <span className="text-sm md:text-base">Safroon Plaza 1st floor, Street 6 United Housing Society Opposite HBK Hypermarket Achini Chowk Ring road Hayatabad, Peshawar, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#f26522] flex-shrink-0" />
                <span className="text-sm md:text-base">+92 3330505000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#f26522] flex-shrink-0" />
                <span className="text-sm md:text-base">info@solarexpress.pk</span>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm md:text-base hover:text-[#f26522] transition-colors" prefetch={false}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm md:text-base hover:text-[#f26522] transition-colors" prefetch={false}>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/brand-partnership" className="text-sm md:text-base hover:text-[#f26522] transition-colors" prefetch={false}>
                  Brand Partnership
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/payment-info" className="text-sm md:text-base hover:text-[#f26522] transition-colors" prefetch={false}>
                  Payment Information
                </Link>
              </li>
              <li>
                <Link href="/shipping-info" className="text-sm md:text-base hover:text-[#f26522] transition-colors" prefetch={false}>
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-sm md:text-base hover:text-[#f26522] transition-colors" prefetch={false}>
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm md:text-base hover:text-[#f26522] transition-colors" prefetch={false}>
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy Section */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Policy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm md:text-base hover:text-[#f26522] transition-colors" prefetch={false}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm md:text-base hover:text-[#f26522] transition-colors" prefetch={false}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm md:text-base hover:text-[#f26522] transition-colors" prefetch={false}>
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="text-sm md:text-base hover:text-[#f26522] transition-colors" prefetch={false}>
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/exchanges" className="text-sm md:text-base hover:text-[#f26522] transition-colors" prefetch={false}>
                  Exchange Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Socials */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Connect</h3>
            <p className="mb-4 text-sm md:text-base">Follow us on social media for updates</p>
            <div className="flex gap-4 mb-6">
              <a href="https://facebook.com/Solarexpressofficial" target="_blank" rel="noopener noreferrer" className="hover:text-[#f26522] transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://instagram.com/solarexpressofficial" target="_blank" rel="noopener noreferrer" className="hover:text-[#f26522] transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.youtube.com/@solarexpressofficial" target="_blank" rel="noopener noreferrer" className="hover:text-[#f26522] transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="https://tiktok.com/@solarexpressofficial" target="_blank" rel="noopener noreferrer" className="hover:text-[#f26522] transition-colors">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/solarexpressofficial" target="_blank" rel="noopener noreferrer" className="hover:text-[#f26522] transition-colors">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            <div className="space-y-2">
              <Input type="email" placeholder="Subscribe to Newsletter" className="text-white  text-sm" />
              <Button className="w-full bg-[#f26522] hover:bg-[#e55511] text-sm">Subscribe</Button>
            </div>
          </div>
        </div>

        <hr className="border-white/20 mb-6" />

        <div className="text-center text-white/70 text-xs md:text-sm">
          &copy; {new Date().getFullYear()} Solar Express. All rights reserved.
          <p>
        Designed & developed with <span className="text-[#39FF14]">♥</span> by <strong>Team <a href="https://skordl.com" className="text-[#39FF14] hover:text-[#e55511]">skordl</a></strong>
      </p>
        </div>
      </div>
    </footer>
  )
}
