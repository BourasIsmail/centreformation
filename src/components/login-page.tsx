'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import Image from "next/image"

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Login Form Section */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">Start your journey</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Sign Up to InsideBox</h1>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="example@email.com"
                className="h-11 bg-secondary px-4 sm:h-12"
              />
            </div>
            <div className="relative space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 bg-secondary px-4 pr-10 sm:h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="h-11 w-full bg-blue-500 text-white hover:bg-blue-600 sm:h-12">
              Sign Up
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="h-11 sm:h-12">
              <Image
                src="/placeholder.svg?height=24&width=24"
                alt="Facebook"
                className="h-5 w-5 sm:h-6 sm:w-6"
                height={24}
                width={24}
              />
            </Button>
            <Button variant="outline" className="h-11 sm:h-12">
              <Image
                src="/placeholder.svg?height=24&width=24"
                alt="Google"
                className="h-5 w-5 sm:h-6 sm:w-6"
                height={24}
                width={24}
              />
            </Button>
            <Button variant="outline" className="h-11 sm:h-12">
              <Image
                src="/placeholder.svg?height=24&width=24"
                alt="Apple"
                className="h-5 w-5 sm:h-6 sm:w-6"
                height={24}
                width={24}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Illustration Section */}
      <div className="bg-gray-50 p-6 lg:w-1/2">
        <div className="flex h-full items-center justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pu9uGLCM8ec2i50xagnr0h8I8MvpCG.png"
            alt="Illustration of person working at desk"
            width={600}
            height={600}
            className="max-h-[300px] w-auto object-contain sm:max-h-[400px] lg:max-h-full"
            priority
          />
        </div>
      </div>
    </div>
  )
}