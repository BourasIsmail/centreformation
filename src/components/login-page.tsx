"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { api } from "@/app/api";
import { setCookie } from "cookies-next";
import { useToast } from "@/hooks/use-toast";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log(response.data);
      setCookie("token", response.data, {
        maxAge: 60 * 60 * 24 ,
        path: "/",
      });
      window.location.href = "/";
      toast({
        description: "Connexion réussie",
        className: "bg-green-500 text-white",
        duration: 2000,
        title: "Succès",
      });
    } catch (e) {
      toast({
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
        duration: 3000,
        title: "Erreur",
      });
    }
    console.log("Login attempt with:", { email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full lg:w-[40%] flex-col px-8 py-12 justify-center">
        <div className="mb-12">
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="ENTRAIDE NATIONALE - Kingdom of Morocco National Mutual Aid"
              width={500}
              height={200}
              className="h-auto"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            GESTION DES CENTRES CFA/CEF
          </h1>
        </div>
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <Button
              className="w-full bg-[#00833e] hover:bg-[#006b33] text-white py-6"
              type="submit"
            >
              LOGIN
            </Button>
          </form>
        </div>
      </div>
      <div
          className="hidden lg:flex w-[70%] items-center justify-center bg-cover bg-center bg-no-repeat min-h-screen"
          style={{
            backgroundImage: "url('/back.jpeg')",
            backgroundSize: '100% 100%'
          }}
      >



      </div>
    </div>
  );
}
