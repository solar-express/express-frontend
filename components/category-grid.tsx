"use client" // Add this if using Next.js 13+ inside app/ folder

import { useEffect, useState } from "react"
import Link from "next/link"
import { Sun, Battery, Zap, Home, Wrench, ShieldCheck } from "lucide-react"
import { client } from "../lib/sanity" // Adjust path if needed

type HeadingData = {
  categoriesHeading: string
} 

const categories = [
  {
    name: "Solar Panels",
    icon: Sun,
    color: "bg-blue-100",
    iconColor: "text-[#1a5ca4]",
    link: "/store?category=solar-panels",
  },
  {
    name: "Batteries",
    icon: Battery,
    color: "bg-green-100",
    iconColor: "text-green-600",
    link: "/store?category=batteries",
  },
  {
    name: "Inverters",
    icon: Zap,
    color: "bg-amber-100",
    iconColor: "text-amber-600",
    link: "/store?category=inverters",
  },
  {
    name: "EV Bikes",
    icon: Battery,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    link: "/store?category=ev-bikes",
  },
  {
    name: "Installation",
    icon: Wrench,
    color: "bg-red-100",
    iconColor: "text-red-600",
    link: "/store?category=installation",
  },
  {
    name: "Accessories",
    icon: ShieldCheck,
    color: "bg-teal-100",
    iconColor: "text-teal-600",
    link: "/store?category=accessories",
  },
]

export default function CategoryGrid() {
  const [headingData, setHeadingData] = useState<HeadingData | null>(null)

  useEffect(() => {
    const fetchHeading = async () => {
      try {
        const data: HeadingData = await client.fetch(
          `*[_type == "homePageContent" && page == "Home Page Content"][0]`
        );
        setHeadingData(data);
      } catch (error) {
        console.error("Failed to fetch Sanity heading:", error);
      }
    };

    fetchHeading();
  }, [])

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold mb-4 text-[#1a5ca4]">
        {headingData?.categoriesHeading || "Categories"}
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.link}
            className="flex flex-col items-center p-3 md:p-4 rounded-lg border border-gray-200 hover:border-[#1a5ca4] hover:shadow-sm transition-all"
          >
            <div
              className={`w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden mb-2 relative flex items-center justify-center ${category.color}`}
            >
              <category.icon className={`h-6 w-6 ${category.iconColor}`} />
            </div>
            <span className="text-xs md:text-sm text-center font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
