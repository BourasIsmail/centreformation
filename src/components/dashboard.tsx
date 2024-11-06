"use client"

import { Bar, BarChart, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { PieChart, Pie, Cell } from "recharts"

const subscriptionData = [
  { month: "Jan", total: 1500 },
  { month: "Feb", total: 2300 },
  { month: "Mar", total: 1800 },
  { month: "Apr", total: 2400 },
  { month: "May", total: 2100 },
  { month: "Jun", total: 2800 },
  { month: "Jul", total: 3200 },
  { month: "Aug", total: 2700 },
]

const pieData1 = [
  { name: "Centres", value: 45 },
  { name: "En cours", value: 55 },
]

const pieData2 = [
  { name: "Formateurs", value: 60 },
  { name: "Disponible", value: 40 },
]

const pieData3 = [
  { name: "Formations", value: 75 },
  { name: "Complétées", value: 25 },
]

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))']

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Platform Definition Section */}
      <Card>
        <CardHeader>
          <CardTitle>Plateforme de Gestion des Centres de Formation</CardTitle>
          <CardDescription>
            Une solution complète pour la gestion et le suivi des centres de formation, des bénéficiaires,
            et des activités de formation. Notre plateforme facilite la coordination entre les différents
            acteurs et permet un suivi efficace des programmes de formation.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Pie Charts Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Centres</CardTitle>
            <CardDescription>Distribution des centres actifs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData1}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData1.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personnels</CardTitle>
            <CardDescription>Statistiques des Personnels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData2}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData2.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formations</CardTitle>
            <CardDescription>État des formations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData3}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData3.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Inscriptions</CardTitle>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">+240</div>
            <div className="text-xs text-muted-foreground">
              +25% par rapport au mois dernier
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subscriptionData}>
                <Bar
                  dataKey="total"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}