"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { client } from "../lib/sanity" // Adjust path if needed

type HeadingData = {
  topRatedHeading: string
} 

export default function FeaturedPromoCards() {

  const [headingData, setHeadingData] = useState<HeadingData | null>(null)

  useEffect(() => {
    const fetchHeading = async () => {
      try {
        const data: HeadingData = await client.fetch(
          `*[_type == "homePageContent"][0]{ topRatedHeading }`
        );
        setHeadingData(data);
      } catch (error) {
        console.error("Failed to fetch Sanity heading:", error);
      }
    };

    fetchHeading();
  }, [])

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-[#1a5ca4] mb-6">{headingData?.topRatedHeading || "Browse Top Rated Productsss"}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Solar Panels Card */}
        <Link href="/store?category=solar-panels" className="group">
          <div className="bg-blue-50 rounded-lg overflow-hidden relative h-[280px] md:h-[350px] hover:shadow-lg transition-all">
            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
              <div>
                <div className="bg-[#1a5ca4] text-white text-xs font-bold px-2 py-1 rounded inline-block mb-2">
                  BESTSELLER
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-[#1a5ca4] mb-1 md:mb-2">Solar Panels</h3>
                <p className="text-gray-700 text-xs md:text-sm">High-efficiency panels for maximum energy production</p>
              </div>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] w-fit text-xs md:text-sm">Shop Now</Button>
            </div>
            <Image
              src="eighteen.jpg"
              alt="Solar Panels"
              fill
              className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Inverters Card */}
        <Link href="/store?category=inverters" className="group">
          <div className="bg-green-50 rounded-lg overflow-hidden relative h-[280px] md:h-[350px] hover:shadow-lg transition-all">
            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
              <div>
                <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded inline-block mb-2">
                  NEW ARRIVAL
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-[#1a5ca4] mb-1 md:mb-2">Smart Inverters</h3>
                <p className="text-gray-700 text-xs md:text-sm">Convert DC to AC with maximum efficiency</p>
              </div>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] w-fit text-xs md:text-sm">Shop Now</Button>
            </div>
            <Image
              src="q5.jpeg"
              alt="Solar Inverter"
              fill
              className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Batteries Card */}
        <Link href="/store?category=batteries" className="group">
          <div className="bg-amber-50 rounded-lg overflow-hidden relative h-[280px] md:h-[350px] hover:shadow-lg transition-all">
            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
              <div>
                <div className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded inline-block mb-2">
                  SALE
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-[#1a5ca4] mb-1 md:mb-2">Energy Storage</h3>
                <p className="text-gray-700 text-xs md:text-sm">Store excess energy for when you need it most</p>
              </div>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] w-fit text-xs md:text-sm">Shop Now</Button>
            </div>
            <Image
              src="q4.jpeg"
              alt="Solar Batteries"
              fill
              className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        <Link href="/store?category=accessories" className="group">
          <div className="bg-blue-50 rounded-lg overflow-hidden relative h-[280px] md:h-[350px] hover:shadow-lg transition-all">
            <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10">
              <div>
                <div className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded inline-block mb-2">
                  SALE
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-[#1a5ca4] mb-1 md:mb-2">Accessories</h3>
                <p className="text-gray-700 text-xs md:text-sm">what you need for your setup.</p>
              </div>
              <Button className="bg-[#1a5ca4] hover:bg-[#0e4a8a] w-fit text-xs md:text-sm">Shop Now</Button>
            </div>
            <Image
              src="q11.jpeg"
              alt="Solar Batteries"
              fill
              className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      </div>
    </div>
  )
}
