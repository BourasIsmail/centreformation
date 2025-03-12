"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { useQuery } from "react-query"
import axios from "axios"
import { Activity, Building, UserCheck, Users } from "lucide-react"
import { api } from "@/app/api"


export function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await api.get("/api/dashboard/stats");
      return res.data;
    },
  });

  // Fetch trend data
  const { data: trends } = useQuery({
    queryKey: ["activitesTrend"],
    queryFn: async () => {
      const res = await api.get("/api/dashboard/activites-trend");
      return res.data;
    },
  });

  const statItems = [
    { key: "centres", label: "Centres", icon: <Building className="w-8 h-8 text-blue-500" /> },
    { key: "beneficiaires", label: "Bénéficiaires", icon: <Users className="w-8 h-8 text-green-500" /> },
    { key: "activites", label: "Activités", icon: <Activity className="w-8 h-8 text-orange-500" /> },
    { key: "personnels", label: "Personnels", icon: <UserCheck className="w-8 h-8 text-purple-500" /> },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800">Gestion des Centres</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? "Chargement..."
          : statItems.map((stat) => (
              <Card key={stat.key} className="p-4 flex items-center justify-between shadow-lg">
                <div>
                  <CardTitle className="text-lg font-semibold">{stat.label}</CardTitle>
                  <p className="text-2xl font-bold">{stats?.[stat.key] || 0}</p>
                </div>
                {stat.icon}
              </Card>
            ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Évolution des Activités par Mois</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trends}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" name="Activités" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}