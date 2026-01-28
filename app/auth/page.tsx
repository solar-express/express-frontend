"use client"

export const runtime = 'nodejs'

import type React from "react"

import { useState, Suspense } from "react"
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"


interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

type FormField = keyof FormData

export default function AuthPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPage />
    </Suspense>
  )
}

// Move your current AuthPage code to a new component:
function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  })
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirect = searchParams.get("redirect") || "/"
  const { login, register } = useAuth()

  const handleInputChange = (field: FormField, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields.")
      setLoading(false)
      return
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address.")
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        // Use AuthContext login function
        await login({
          email: formData.email,
          password: formData.password,
        })
        
        // Only redirect on successful login
        console.log("✅ Login successful, redirecting to:", redirect)
        toast.success("Successfully signed in!")
        
        // Wait a moment for auth state to update
        setTimeout(() => {
          router.push(redirect)
        }, 100)
      } else {
        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match.")
          setLoading(false)
          return
        }

        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters long.")
          setLoading(false)
          return
        }

        if (!formData.firstName || !formData.lastName) {
          toast.error("Please enter your first and last name.")
          setLoading(false)
          return
        }

        // Use AuthContext register function
        await register({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          mobile: formData.phone, // Add mobile field
        })
        
        // Only redirect on successful registration
        console.log("✅ Registration successful, redirecting to:", redirect)
        
        // Wait a moment for auth state to update
        setTimeout(() => {
          router.push(redirect)
        }, 100)
      }
    } catch (err: any) {
      // Error handling - authentication failed
      console.log("❌ Authentication failed:", err)
      // Error toast is already handled by AuthContext
      // Do not redirect on failure
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-14 bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-3">
      <div className="w-full max-w-md mx-auto">
        {/* Compact Auth card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-[#1a5ca4] to-[#f26522] p-4 text-white text-center">
            <h1 className="text-xl font-bold">Solar Express</h1>
            <p className="text-sm opacity-90">Your trusted solar energy partner</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-50">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                isLogin
                  ? "bg-white text-[#1a5ca4] border-b-2 border-[#f26522]"
                  : "text-gray-600 hover:text-[#1a5ca4]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-sm font-medium transition-all ${
                !isLogin
                  ? "bg-white text-[#1a5ca4] border-b-2 border-[#f26522]"
                  : "text-gray-600 hover:text-[#1a5ca4]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form content */}
          <div className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name fields for signup - side by side to save space */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="pl-9 h-10 text-sm border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                      required={!isLogin}
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="pl-9 h-10 text-sm border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-9 h-10 text-sm border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                  required
                />
              </div>

              {/* Phone field for signup */}
              {!isLogin && (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="pl-9 h-10 text-sm border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                    required={!isLogin}
                  />
                </div>
              )}

              {/* Password fields - side by side for signup to save space */}
              {!isLogin ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-9 pr-9 h-10 text-sm border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-9 pr-9 h-10 text-sm border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-9 pr-9 h-10 text-sm border-gray-300 focus:border-[#1a5ca4] focus:ring-[#1a5ca4]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              )}

              {/* Remember me / Forgot password for login */}
              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      className="h-4 w-4 border-gray-300 data-[state=checked]:bg-[#1a5ca4] data-[state=checked]:border-[#1a5ca4]"
                    />
                    <label htmlFor="remember" className="text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-[#f26522] hover:text-[#e55511] font-medium">
                    Forgot Password?
                  </Link>
                </div>
              )}

              {/* Compact terms and newsletter for signup */}
              {!isLogin && (
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                      className="h-4 w-4 border-gray-300 data-[state=checked]:bg-[#1a5ca4] data-[state=checked]:border-[#1a5ca4] mt-0.5"
                      required={!isLogin}
                    />
                    <label htmlFor="terms" className="text-xs text-gray-600">
                      I agree to the{" "}
                      <Link href="/terms" className="text-[#f26522] hover:text-[#e55511] font-medium">
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-[#f26522] hover:text-[#e55511] font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.subscribeNewsletter}
                      onCheckedChange={(checked) => handleInputChange("subscribeNewsletter", checked as boolean)}
                      className="h-4 w-4 border-gray-300 data-[state=checked]:bg-[#1a5ca4] data-[state=checked]:border-[#1a5ca4]"
                    />
                    <label htmlFor="newsletter" className="text-xs text-gray-600">
                      Subscribe to newsletter for deals & updates
                    </label>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-10 bg-[#f26522] hover:bg-[#e55511] text-white font-medium text-sm rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? (isLogin ? "Signing In..." : "Creating Account...") : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {/* Switch mode link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                {isLogin ? "New to Solar Express?" : "Already have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#f26522] hover:text-[#e55511] font-medium"
                >
                  {isLogin ? "Create account" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          {/* Compact trust indicators */}
          <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4 text-gray-600 text-xs">
              <div className="flex items-center gap-1">
                <div className="bg-[#f26522] rounded-full p-1">
                  <MapPin className="h-2.5 w-2.5 text-white" />
                </div>
                <span>Pakistan Wide</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="bg-[#1a5ca4] rounded-full p-1">
                  <Lock className="h-2.5 w-2.5 text-white" />
                </div>
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}