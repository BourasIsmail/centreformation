import { AppSidebar } from "@/components/app-sidebar";
import { Dashboard } from "@/components/dashboard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Dashboard />
    </>

  );
}
