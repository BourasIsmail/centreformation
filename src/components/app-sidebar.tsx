"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
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
      plan: "Enterprise",
    },

  ],
  navMain: [
    {
      title: "Centres",
      url: "#",
      icon: SquareTerminal,
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
      icon: Bot,
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
      icon: Settings2,
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
      url: "#",
      icon: Frame,
    },
    {
      name: "Ajouter un rapport de suivi de formation",
      url: "#",
      icon: PieChart,
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
        <TeamSwitcher teams={data.teams.map(team => ({
          ...team,
          logo: typeof team.logo === 'string' ? () => <img src={team.logo} alt={`${team.name} logo`} /> : team.logo
        }))} />
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
