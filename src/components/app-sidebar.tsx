"use client"

import * as React from "react"
import Image from "next/image"
import {
  AudioWaveform,
  BookOpen,
  Users,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  UserCog,
  Settings2,
  Building2,
  GraduationCap,
  Clipboard,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "user",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Entraide Nationale",
      logo: "/entraide.png",
      plan: "EN",
    },
  ],
  navMain: [
    {
      title: "Centres",
      url: "#",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: "Listes des centres",
          url: "#",
        },
        {
          title: "Ajouter un centre",
          url: "#",
        },
        {
          title: "Statistiques",
          url: "#",
        },
      ],
    },
    {
      title: "Beneficiaires",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Listes des beneficiaires",
          url: "#",
        },
        {
          title: "Ajouter un beneficiaire",
          url: "#",
        },
        {
          title: "Statistiques",
          url: "#",
        },
      ],
    },
    {
      title: "Activités",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Listes des activités",
          url: "#",
        },
        {
          title: "Ajouter une activité",
          url: "#",
        },
        {
          title: "Statistiques",
          url: "#",
        },
      ],
    },
    {
      title: "Personnels",
      url: "#",
      icon: UserCog,
      items: [
        {
          title: "Listes des personnels",
          url: "#",
        },
        {
          title: "Ajouter un personnel",
          url: "#",
        },
        {
          title: "Statistiques",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Filières",
      icon: GraduationCap,
      url: "#",
    },
    {
      name: "Ajouter un rapport de suivi de formation",
      icon: Clipboard,
      url: "#",
    },
    {
      name: "localisation des centres",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={data.teams.map(team => ({
            ...team,
            logo: () => (
              <Image
                src={team.logo}
                alt={`${team.name} logo`}
                width={32}
                height={32}
                className="rounded-md"
              />
            ),
          }))}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}