'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Define the structure of an activity
interface Activity {
  id: string
  name: string
  action: string
  course: string
  status: string
  avatarSrc: string
  avatarFallback: string
}

// Mock data array
const recentActivities: Activity[] = [
  {
    id: "1",
    name: "Bouras Ismail",
    action: "S'est inscrite au cours",
    course: "Informatique",
    status: "En cours",
    avatarSrc: "/avatars/01.png",
    avatarFallback: "IB"
  },
  {
    id: "2",
    name: "Aarab Majid",
    action: "A terminé le cours",
    course: "Électricité",
    status: "Diplômé",
    avatarSrc: "/avatars/02.png",
    avatarFallback: "AM"
  },
  {
    id: "3",
    name: "Ismail Moumen",
    action: "S'est inscrite au cours",
    course: "Gestion",
    status: "En cours",
    avatarSrc: "/avatars/03.png",
    avatarFallback: "IM"
  },
]
export function RecentActivities() {
  return (
    <div className="space-y-8">
      {recentActivities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.avatarSrc} alt={`Avatar de ${activity.name}`} />
            <AvatarFallback>{activity.avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.name}</p>
            <p className="text-sm text-muted-foreground">
              {activity.action} de {activity.course}
            </p>
          </div>
          <div className="ml-auto font-medium">{activity.status}</div>
        </div>
      ))}
    </div>
  )
}