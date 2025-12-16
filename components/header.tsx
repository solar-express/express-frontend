"use client"

import type React from "react"

import { useEffect, useState, useRef, Suspense } from "react"
import Link from "next/link"
import { Search, ShoppingCart, User, Menu, X, ChevronDown, ChevronRight, MapPin } from "lucide-react"
import { Sun, Battery, Zap, Home, Wrench, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PriceTicker from "./price-ticker"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { MiniCart } from "./mini-cart"

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || ''
const API_BASE = RAW_API_BASE ? RAW_API_BASE.replace(/\/$/, '') : ''
const buildUrl = (path: string) => API_BASE ? `${API_BASE}${path.startsWith('/') ? path : `/${path}`}` : (path.startsWith('/') ? path : `/${path}`)

interface Product {
	_id: string;
	name: string;
	slug: string;
	images: { url: string }[];
	price: number;
}

interface Brand {
    name: string;
    slug: string;
    logo: string;
    url?: string; 
	products?: Product[];
}

interface Category {
  name: string;
  slug: string;
  icon: any;
  color: string;
  iconColor: string;
  route: string;
  brands: Brand[];
}

const iconMapping = {
  "solar-panels": Sun,
  "inverters": Zap,
  "batteries": Battery,
  "tools": Wrench,
  "accessories": ShieldCheck,
}

const getDefaultIcon = (categorySlug: string) => {
  return iconMapping[categorySlug as keyof typeof iconMapping] || Sun
}

const generateNavItems = (categories: Category[]) => {
	const baseItems = [{ name: "Home", href: "/" }]
	const categoryItems = categories.slice(0, 5).map(cat => ({
		name: cat.name,
		href: cat.route
	}))
	const additionalItems = [
		{ name: "Installment Plans", href: "/installments" },
		{ name: "Blogs", href: "/blog" },
		{ name: "Contact", href: "/contact" },
	]
	return [...baseItems, ...categoryItems, ...additionalItems]
}

const departmentNavItems = [
	{ name: "Installment Plans", href: "/installments" },
	{ name: "Blogs", href: "/blog" },
	{ name: "Contact", href: "/contact" },
]

interface HeaderProps {
	user?: {
		name?: string
	}
}

// Component that handles search params
function SearchHandler({ searchTerm, setSearchTerm, pathname }: { searchTerm: string, setSearchTerm: (term: string) => void, pathname: string }) {
	const searchParams = useSearchParams()
	useEffect(() => {
		const searchParam = searchParams.get('search')
		if (searchParam) {
			// If URL contains a search param, sync it to the header input
			setSearchTerm(searchParam)
		} else if (pathname !== '/store') {
			// Clear search term only when navigating away from the store page
			setSearchTerm('')
		}
	// Intentionally omit `searchTerm` from deps so typing in the input doesn't re-run this effect
	}, [searchParams, pathname, setSearchTerm])
	
	return null
}

export default function Header({ user }: HeaderProps) {
	const { user: authUser, logout } = useAuth()
	const { cart } = useCart()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [activeCategory, setActiveCategory] = useState<number | null>(null)
	const [activeBrand, setActiveBrand] = useState<number | null>(null)
	const [activeProducts, setActiveProducts] = useState<Product[]>([]);
	const [expandedMobileCategory, setExpandedMobileCategory] = useState<number | null>(null)
	const [productsCache, setProductsCache] = useState<Record<string, Product[]>>({})
	const [loadingProducts, setLoadingProducts] = useState<Record<string, boolean>>({})
	const [searchTerm, setSearchTerm] = useState("")
	const [categoryData, setCategoryData] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const menuRef = useRef<HTMLDivElement | null>(null)
	const mobileSidebarRef = useRef<HTMLDivElement | null>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const pathname = usePathname()
	const [dropdownOpen, setDropdownOpen] = useState(false)

	useEffect(() => {
		async function fetchNavigationData() {
			try {
				// console.log("Fetching navigation data from API_BASE:", API_BASE);
				const response = await fetch(`${API_BASE}/api/category`);

				// console.log("Navigation API Response Status:", response.status);

				if (response.ok) {
					const categories = await response.json();
					// console.log("Fetched Categories Data:", JSON.stringify(categories, null, 2));

					if (!categories || !Array.isArray(categories) || categories.length === 0) {
						console.error("Invalid categories data received");
						setCategoryData([]);
						setLoading(false);
						return;
					}

					// Process categories sequentially to avoid race conditions
					const categoriesWithBrands = [];
					
					for (const category of categories) {
						// console.log(`Fetching brands for category: ${category.slug}`);
						try {
							const brandsResponse = await fetch(`${API_BASE}/api/category/${category.slug}/brands`);
							// console.log(`Brands API Response Status for ${category.slug}:`, brandsResponse.status);
							
							if (brandsResponse.ok) {
								const brandsData = await brandsResponse.json();
								// console.log(`Fetched Brands for ${category.slug}:`, JSON.stringify(brandsData, null, 2));
								
								// Extract brands array from the response object
								const brands = brandsData.brands || [];
								
								categoriesWithBrands.push({
									name: category.name,
									slug: category.slug,
									icon: getDefaultIcon(category.slug),
									color: "bg-blue-100",
									iconColor: "text-[#1a5ca4]",
									route: `/category/${category.slug}`,
									brands: brands.map((brand: any) => ({
										name: brand.name,
										slug: brand.slug,
										logo: brand.logo,
										url: `/brand/${brand.slug}`,
										products: [],
									})),
								});
							} else {
								console.error(`Failed to fetch brands for category ${category.slug}. Status:`, brandsResponse.status);
								categoriesWithBrands.push({
									name: category.name,
									slug: category.slug,
									icon: getDefaultIcon(category.slug),
									color: "bg-blue-100",
									iconColor: "text-[#1a5ca4]",
									route: `/category/${category.slug}`,
									brands: [],
								});
							}
						} catch (error) {
							console.error(`Error fetching brands for category ${category.slug}:`, error);
							categoriesWithBrands.push({
								name: category.name,
								slug: category.slug,
								icon: getDefaultIcon(category.slug),
								color: "bg-blue-100",
								iconColor: "text-[#1a5ca4]",
								route: `/category/${category.slug}`,
								brands: [],
							});
						}
					}

					// console.log("Final Processed Data:", JSON.stringify(categoriesWithBrands, null, 2));
					setCategoryData(categoriesWithBrands);
				} else {
					console.error("Failed to fetch categories. Status:", response.status);
					setCategoryData([]);
				}
			} catch (error) {
				console.error("Error fetching navigation data:", error);
				setCategoryData([]);
			} finally {
				setLoading(false);
			}
		}

		fetchNavigationData();
	}, [])

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false)
				setActiveCategory(null)
				setActiveBrand(null)
				// Clear cache when menu closes to free memory
				setProductsCache({})
				setLoadingProducts({})
			}
			if (mobileSidebarRef.current && !mobileSidebarRef.current.contains(event.target as Node) && isMobileMenuOpen) {
				setIsMobileMenuOpen(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isMobileMenuOpen])

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setDropdownOpen(false)
			}
		}
		if (dropdownOpen) document.addEventListener("mousedown", handleClick)
		return () => document.removeEventListener("mousedown", handleClick)
	}, [dropdownOpen])

	const handleCategoryHover = async (index: number) => {
		setActiveCategory(index)
		setActiveBrand(null)
		// Don't clear activeProducts here - let it be handled by brand hover
		// setActiveProducts([])
		
		// Prefetch products for all brands in this category
		const category = categoryData[index];
		if (category && category.brands) {
			category.brands.forEach(async (brand, brandIndex) => {
				const cacheKey = `${brand.slug}-${category.slug}`;
				
				// Skip if already cached or currently loading
				if (productsCache[cacheKey] || loadingProducts[cacheKey]) {
					return;
				}
				
				// Mark as loading
				setLoadingProducts(prev => ({ ...prev, [cacheKey]: true }));
				
				try {
					const url = `${API_BASE}/api/brands/${brand.slug}/${category.slug}`;
					const response = await fetch(url);
					
					if (response.ok) {
						const products = await response.json();
						let productList: Product[] = [];
						
						if (Array.isArray(products)) {
							productList = products;
						} else if (products.products && Array.isArray(products.products)) {
							productList = products.products;
						}
						
						// Cache the products
						setProductsCache(prev => ({ ...prev, [cacheKey]: productList }));
					}
				} catch (error) {
					console.error(`Failed to prefetch products for ${brand.name}:`, error);
				} finally {
					// Mark as not loading
					setLoadingProducts(prev => ({ ...prev, [cacheKey]: false }));
				}
			});
		}
	}

	const handleBrandHover = async (brandIndex: number) => {
		setActiveBrand(brandIndex);
		if (activeCategory !== null) {
			const category = categoryData[activeCategory];
			const brand = category.brands[brandIndex];
			const cacheKey = `${brand.slug}-${category.slug}`;
			
			// Check if products are cached
			if (productsCache[cacheKey]) {
				setActiveProducts(productsCache[cacheKey]);
				return;
			}
			
			// Check if currently loading - don't clear products, just return
			if (loadingProducts[cacheKey]) {
				return; // Keep showing loading state
			}
			
			console.log("Hovering over brand:", brand);
			console.log("In category:", category);
			
			if (brand && category && brand.slug && category.slug) {
				// Mark as loading and set products to special loading state
				setLoadingProducts(prev => ({ ...prev, [cacheKey]: true }));
				setActiveProducts([]); // This will trigger loading state in UI
				
				try {
					const url = `${API_BASE}/api/brands/${brand.slug}/${category.slug}`;
					console.log("Fetching products from:", url);
					
					const response = await fetch(url);
					console.log("Products API response status:", response.status);
					
					if (response.ok) {
						const products = await response.json();
						console.log("Fetched products:", products);
						
						let productList: Product[] = [];
						if (Array.isArray(products)) {
							productList = products;
						} else if (products.products && Array.isArray(products.products)) {
							productList = products.products;
						}
						
						// Cache and set products
						setProductsCache(prev => ({ ...prev, [cacheKey]: productList }));
						setActiveProducts(productList);
						console.log(`Found ${productList.length} products`);
					} else {
						console.error("Failed to fetch products. Status:", response.status);
						setActiveProducts([]);
					}
				} catch (error) {
					console.error("Failed to fetch products", error);
					setActiveProducts([]);
				} finally {
					setLoadingProducts(prev => ({ ...prev, [cacheKey]: false }));
				}
			} else {
				console.error("Brand or category slug missing", { brand, category });
				setActiveProducts([]);
			}
		}
	}

	const toggleExpandedMobileCategory = (index: number) => {
		setExpandedMobileCategory(expandedMobileCategory === index ? null : index)
	}

	const navigateToBrand = (url: string | undefined) => {
		if (url) {
			router.push(url);
		} else {
			console.error("Brand URL is undefined.");
		}
	}

	const handleMobileNavClick = () => {
		setTimeout(() => {
			setIsMobileMenuOpen(false)
			setExpandedMobileCategory(null)
		}, 100)
	}

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchTerm.trim()) {
			router.push(`/store?search=${encodeURIComponent(searchTerm.trim())}`)
			setIsMobileMenuOpen(false)
			setActiveCategory(null)
			setActiveBrand(null)
			// Don't clear search term here - let URL sync handle it
		}
	}

	const handleLogout = (e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault()
			e.stopPropagation()
		}
		logout()
		setDropdownOpen(false)
		router.push("/auth")
	}
	
	return (
		<header className="sticky top-0 z-50 bg-white">
			<Suspense fallback={null}>
				<SearchHandler searchTerm={searchTerm} setSearchTerm={setSearchTerm} pathname={pathname} />
			</Suspense>
			<div className="overflow-hidden">
				<PriceTicker />
			</div>

			<div className="bg-[#1a5ca4] py-3 px-3 md:px-14 lg:px-24">
				<div className="mx-auto w-full max-w-screen-xl px-0 md:px-4 flex items-center justify-between">
					<div className="flex items-center gap-4 ">
						<Link href="/" className="flex items-center">
							<div className="w-16 h-8 md:w-22 md:h-11 ml-2 rounded-full flex items-center justify-center">
								{/* Mobile: show existing logo-new.png; md and up: show /logo-crop.PNG */}
								<img
									src="/logo-new.png"
									alt="Solar Express Logo"
									className="w-auto h-auto object-cover block md:hidden"
								/>
								<img
									src="/logo-crop.PNG"
									alt="Solar Express Logo"
									className="w-auto h-auto object-cover hidden md:block"
								/>
							</div>
						</Link>

						<div className="hidden md:flex items-center gap-2 bg-[#0e4a8a] rounded-full px-4 py-1">
							<MapPin className="h-5 w-5 text-white" />
							<div className="flex flex-col">
								<span className="text-xs text-white/80">I'm here in</span>
								<span className="text-sm font-medium text-white">Pakistan</span>
							</div>
						</div>
					</div>

					<div className="flex-1 max-w-lg mx-4">
						<form onSubmit={handleSearch}>
							<div className="relative">
								<Input
									type="text"
									placeholder="Search here"
									className="w-full py-2 pl-4 pr-10 rounded-full border-0 shadow-sm"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
								<Button
									type="submit"
									className="absolute right-0 top-0 h-full bg-white hover:bg-[#f26522] rounded-l-none rounded-r-full"
									size="icon"
								>
									<Search className="h-4 w-4 text-[#1a5ca4]" />
								</Button>
							</div>
						</form>
					</div>

					<div className="flex items-center gap-1 md:gap-4">
						<div className="relative" ref={dropdownRef}>
							{authUser ? (
								<button
									type="button"
									className="hidden md:flex flex-col items-end cursor-pointer bg-transparent border-none outline-none"
									onClick={() => setDropdownOpen((v) => !v)}
								>
									<span className="text-xs text-white/80">Hi, {(authUser as any)?.name?.split(" ")[0]}</span>
									<div className="flex items-center">
										<span className="text-sm font-medium text-white">Account</span>
										<ChevronDown className="h-4 w-4 text-white/80 ml-1" />
									</div>
								</button>
							) : (
								<Link href={`/auth?redirect=${encodeURIComponent(pathname)}`} className="hidden md:flex flex-col items-end cursor-pointer">
									<span className="text-xs text-white/80">Sign In</span>
									<div className="flex items-center">
										<span className="text-sm font-medium text-white">Account</span>
										<ChevronDown className="h-4 w-4 text-white/80 ml-1" />
									</div>
								</Link>
							)}

							{dropdownOpen && authUser && (
								<div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50">
									<Link
										href="/account"
										className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
										onClick={() => setDropdownOpen(false)}
									>
										Account
									</Link>
									<button
										className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
										onClick={handleLogout}
									>
										Logout
									</button>
								</div>
							)}
						</div>

						<div className="relative">
							<MiniCart />
						</div>

						<Button
							variant="ghost"
							size="mobileMenu"
							className="md:hidden text-white"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? <X /> : <Menu />}
						</Button>
					</div>
				</div>
			</div>

			<div className="bg-[#0e4a8a] text-white py-1 px-4 hidden md:block border-t border-[#1a5ca4]/30">
				<div className="container md:px-14 lg:px-14 flex items-center">
					<div className="relative" ref={menuRef}>
						<Button
							variant="ghost"
							className="flex items-center gap-2 font-medium text-white"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<Menu className="h-8 w-8" />
							<span>Categories</span>
							<ChevronDown className="h-4 w-4" />
						</Button>

						{isMenuOpen && (
							<div
								className="absolute left-0 top-full z-50 flex bg-white shadow-xl rounded-b-lg overflow-hidden"
								style={{ width: "800px", maxWidth: "calc(100vw - 40px)" }}
							>
								{loading ? (
									<div className="w-full p-8 text-center text-gray-500">
										Loading categories...
									</div>
								) : categoryData.length === 0 ? (
									<div className="w-full p-8 text-center text-gray-500">
										<div className="mb-2">Categories temporarily unavailable</div>
										<div className="text-sm">Check that your backend server is running on {API_BASE}</div>
									</div>
								) : (
									<>
										<div className="w-1/4 bg-gray-50 border-r border-gray-200 overflow-y-auto" style={{ maxHeight: '500px' }}>
											{categoryData.map((category, index) => (
												<div
													key={index}
													className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${
														activeCategory === index ? "bg-gray-100 font-medium text-[#1a5ca4]" : "text-gray-800"
													}`}
													onMouseEnter={() => handleCategoryHover(index)}
												>
													<div className="flex items-center justify-between">
														<span className="text-sm">{category.name}</span>
														<ChevronRight className="h-4 w-4" />
													</div>
												</div>
											))}
										</div>

										{activeCategory !== null && categoryData[activeCategory] && (
											<div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto" style={{ maxHeight: '500px' }}>
												{categoryData[activeCategory].brands.length === 0 ? (
													<div className="px-4 py-3 text-gray-500 text-sm">No brands available</div>
												) : (
													categoryData[activeCategory].brands.map((brand: Brand, index: number) => (
														<div
															key={index}
															className={`px-4 py-2.5 cursor-pointer hover:bg-gray-50 ${
																activeBrand === index ? "bg-gray-50 font-medium text-[#1a5ca4]" : "text-gray-800"
															}`}
															onMouseEnter={() => handleBrandHover(index)}
															onClick={() => navigateToBrand(brand.url)}
														>
															<div className="flex items-center justify-between">
																<span className="text-sm">{brand.name}</span>
																<ChevronRight className="h-4 w-4" />
															</div>
														</div>
													))
												)}
											</div>
										)}

										{activeCategory !== null && activeBrand !== null && (
											<div className="w-2/4 bg-white p-4">
												{/* Brand Name as Clickable Link */}
												<Link 
													href={categoryData[activeCategory]?.brands[activeBrand]?.url || '#'}
													className="font-bold text-[#1a5ca4] text-lg mb-1 hover:text-[#f26522] transition-colors block"
												>
													{categoryData[activeCategory]?.brands[activeBrand]?.name}
												</Link>
												
												{/* Click to view brand page text */}
												<p className="text-xs text-gray-500 mb-3">Click to view brand page</p>
												
												{/* Products Grid - Limited to 4 items with loading state */}
												<div className="grid grid-cols-2 gap-2 mb-4">
														{(() => {
															const category = categoryData[activeCategory];
															const brand = category?.brands[activeBrand];
															
															if (!brand) {
																return null; // Don't show anything if no brand is selected
															}
															
															const cacheKey = `${brand.slug}-${category.slug}`;
															const isLoading = loadingProducts[cacheKey];
															
															if (isLoading) {
																return (
																	<div className="col-span-2 flex items-center justify-center py-4">
																		<div className="flex items-center gap-2 text-gray-500">
																			<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1a5ca4]"></div>
																			<span className="text-sm">Loading products...</span>
																		</div>
																	</div>
																);
															}
															
															if (activeProducts.length > 0) {
																return activeProducts.slice(0, 4).map((product, index) => (
																	<Link
																		key={index}
																		href={`/product/${product.slug}`}
																		className="px-3 py-2 rounded hover:bg-gray-50 text-gray-700 hover:text-[#1a5ca4] text-sm"
																	>
																		{product.name}
																	</Link>
																));
															}
															
															return (
																<div className="text-gray-500 text-sm col-span-2">No products found.</div>
															);
														})()}
												</div>
												
												{/* View all products link */}
												{categoryData[activeCategory]?.brands[activeBrand]?.url && (
													<div className="pt-3 border-t border-gray-200">
														<Link
															href={categoryData[activeCategory].brands[activeBrand].url}
															className="text-[#f26522] font-medium hover:underline text-sm"
														>
															View all {categoryData[activeCategory].brands[activeBrand].name} products
														</Link>
													</div>
												)}
											</div>
										)}
									</>
								)}
							</div>
						)}
					</div>

					<nav className="flex ml-4 overflow-x-auto hide-scrollbar">
						{generateNavItems(categoryData).map((item, index) => (
							<Link key={index} href={item.href} className="px-3 py-2 text-sm hover:text-[#f26522] whitespace-nowrap">
								{item.name}
							</Link>
						))}
					</nav>
				</div>
			</div>

			<div
				ref={mobileSidebarRef}
				className={`md:hidden fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-all duration-300 ease-in-out overflow-y-auto w-4/5 ${
					isMobileMenuOpen ? "transform translate-x-0" : "transform -translate-x-full"
				}`}
				style={{ maxWidth: "320px" }}
			>
				<div className="flex items-center justify-between p-4 bg-[#1a5ca4] text-white">
					<div className="flex items-center gap-2">
						<div className="w-12 h-6 rounded-full flex items-center justify-center">
							{/* Use mobile logo here (mobile menu only) */}
							<img
								src="/logo-new.png"
								alt="Solar Express Logo"
								className="w-full h-full object-cover"
							/>
						</div>
						<span className="text-xl font-bold ml-6"></span>
					</div>
					<Button variant="ghost" size="icon" className="text-white" onClick={() => setIsMobileMenuOpen(false)}>
						<X className="h-6 w-6" />
					</Button>
				</div>

				<div className="p-4 border-b border-gray-200 bg-[#0e4a8a] text-white">
					<div className="flex items-center gap-3">
						<div className="bg-[#f26522] rounded-full w-10 h-10 flex items-center justify-center">
							<User className="h-5 w-5 text-white" />
						</div>
						<div className="flex-1">
							{authUser ? (
								<div>
									<span className="text-sm font-medium block">Hello, {(authUser as any)?.name?.split(" ")[0] || "User"}</span>
									<Link className="text-xs text-white/80 block" href="/account">Manage your account</Link>
									<button
										className="text-xs text-red-300 hover:text-red-200 mt-1 underline"
										onClick={(e) => {
											handleLogout(e)
											handleMobileNavClick()
										}}
									>
										Sign Out
									</button>
								</div>
							) : (
								<Link href={`/auth?redirect=${encodeURIComponent(pathname)}`} onClick={handleMobileNavClick}>
									<span className="text-sm font-medium block">Sign In / Register</span>
								</Link>
							)}
						</div>
					</div>
				</div>

				<div className="py-3 px-2 border-b border-gray-200 bg-gray-50">
					<h3 className="text-lg font-medium px-2 mb-2 text-[#1a5ca4]">Categories</h3>
					<div className="flex overflow-x-auto pb-2 hide-scrollbar">
						{categoryData.map((category, index) => (
							<Link
								key={index}
								href={category.route}
								className="flex-shrink-0 mr-2 w-24"
								onClick={handleMobileNavClick}
							>
								<div className="rounded-lg bg-white border border-gray-200 p-2 flex flex-col items-center justify-center h-24 shadow-sm hover:border-[#f26522] hover:shadow-md transition-all">
									<div className="h-12 w-12 rounded-full bg-[#1a5ca4]/10 flex items-center justify-center mb-1">
										<category.icon className={`h-8 w-8 ${category.iconColor}`} />
									</div>
									<span className="text-xs text-center font-medium">{category.name}</span>
								</div>
							</Link>
						))}
					</div>
				</div>

				{/* --- Fixing Brands Mobile Navigation JSX --- */}
				<nav className="p-4">
					<h3 className="text-lg font-medium mb-3 text-[#1a5ca4]">Brands</h3>
					{categoryData.map((category, index) => (
						<div key={index} className="mb-2">
							<div
								className="flex items-center justify-between p-3 border-b border-gray-100 cursor-pointer"
								onClick={() => toggleExpandedMobileCategory(index)}
							>
								<div className="flex items-center gap-3">
									<div className="h-8 w-8 rounded-full bg-[#1a5ca4]/10 flex items-center justify-center">
										<category.icon className={`h-5 w-5 ${category.iconColor}`} />
									</div>
									<span className="text-[#1a5ca4] font-medium">{category.name}</span>
								</div>
								<ChevronDown
									className={`h-4 w-4 text-gray-400 transition-transform ${expandedMobileCategory === index ? "rotate-180" : ""}`}
								/>
							</div>

							{expandedMobileCategory === index && (
								<div className="pl-11 py-2 space-y-2">
									<Link
										href={category.route}
										className="block p-2 text-sm text-[#f26522] font-medium hover:bg-gray-50 rounded"
										onClick={handleMobileNavClick}
									>
										View All {category.name}
									</Link>

									{category.brands && category.brands.map((brand: Brand, brandIndex: number) => (
										<Link
											key={brandIndex}
											href={brand.url || '#'}
											className="block p-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1a5ca4] rounded"
											onClick={handleMobileNavClick}
										>
											{brand.name}
										</Link>
									))}
								</div>
							)}
						</div>
					))}
				</nav>

				<div className="p-4 border-t border-gray-200">
					<h3 className="text-lg font-medium mb-3 text-[#1a5ca4]">Services</h3>
					{departmentNavItems.map((item, index) => (
						<Link
							key={index}
							href={item.href}
							className="flex items-center justify-between p-3 border-b border-gray-100"
							onClick={handleMobileNavClick}
						>
							<span className="text-[#1a5ca4]">{item.name}</span>
							<ChevronRight className="h-4 w-4 text-gray-400" />
						</Link>
					))}
				</div>
			</div>

			{isMobileMenuOpen && (
				<div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
			)}

			<style jsx global>{`
				.hide-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
				.hide-scrollbar::-webkit-scrollbar {
					display: none;
				}
				
				/* Custom scrollbar for dropdown menus */
				.overflow-y-auto::-webkit-scrollbar {
					width: 6px;
				}
				.overflow-y-auto::-webkit-scrollbar-track {
					background: #f1f1f1;
					border-radius: 3px;
				}
				.overflow-y-auto::-webkit-scrollbar-thumb {
					background: #1a5ca4;
					border-radius: 3px;
				}
				.overflow-y-auto::-webkit-scrollbar-thumb:hover {
					background: #0e4a8a;
				}
			`}</style>
		</header>
	)
}
