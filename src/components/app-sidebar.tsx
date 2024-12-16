"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Users,
  Map,
  UserCog,
  Building2,
  GraduationCap,
  Clipboard,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

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
      items: [
        {
          title: "Listes des centres",
          url: "/centres",
        },
        {
          title: "Ajouter un centre",
          url: "/centres/ajouter",
        },
        {
          title: "Statistiques",
          url: "/centres/statistiques",
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
          url: "/beneficiaire",
        },
        {
          title: "Ajouter un beneficiaire",
          url: "/beneficiaire/ajouter",
        },
        {
          title: "Statistiques",
          url: "/beneficiaire/statistiques",
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
          url: "/activites",
        },
        {
          title: "Ajouter une activité",
          url: "/activites/ajouter",
        },
        {
          title: "Statistiques",
          url: "/activites/statistiques",
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
          url: "/personnels",
        },
        {
          title: "Ajouter un personnel",
          url: "/personnels/ajouter",
        },
        {
          title: "Statistiques",
          url: "/personnels/statistiques",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Filières",
      icon: GraduationCap,
      url: "/filieres",
    },
    {
      name: "Ajouter un rapport de suivi de formation",
      icon: Clipboard,
      url: "/rapports/ajouter",
    },
    {
      name: "localisation des centres",
      url: "/centres/localisation",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const navMainWithActiveState = React.useMemo(() => {
    return data.navMain.map((item) => ({
      ...item,
      isActive: item.items.some((subItem) => pathname.startsWith(subItem.url)),
    }));
  }, [pathname]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={data.teams.map((team) => ({
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
        <NavMain items={navMainWithActiveState} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
