'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function Dashboards() {
  // Placeholder data
  const coverageData = {
    totalCoverage: 85,
    totalHCPs: 1000,
    callRate: 8.5,
    classAVisitedOnce: 92,
    classAVisitedAsPerPlan: 78
  }

  const frequencyData = [
    { name: 'Class A', value: 95 },
    { name: 'Class B', value: 80 },
    { name: 'Class C', value: 60 },
  ]

  const frequencyAchievedData = [
    { name: 'Class A', frequency: 95 },
    { name: 'Class B', frequency: 80 },
    { name: 'Class C', frequency: 60 },
  ]

  const planVsActualData = [
    { name: 'Planned', visits: 100 },
    { name: 'Actual', visits: 85 },
  ]

  const samplingData = [
    { name: 'Product A', allocated: 1000, distributed: 850 },
    { name: 'Product B', allocated: 800, distributed: 720 },
    { name: 'Product C', allocated: 1200, distributed: 1100 },
    { name: 'Product D', allocated: 600, distributed: 580 },
  ]

  const detailerUsageData = {
    callsUsingDetailer: 75,
    callsUsingTargetDetailer: 60
  }

  return (
    <div className="min-h-screen bg-[#F2F1EF]">
      <header className="bg-[#1F3A93] text-white p-4">
        <Link href="/" className="inline-flex items-center text-white hover:text-[#3498DB] transition-colors">
          <ArrowLeft className="mr-2" />
          Back to Active Rep
        </Link>
      </header>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#1F3A93]">Dashboards</h1>

        <Tabs defaultValue="coverage" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="coverage">Coverage & Productivity</TabsTrigger>
            <TabsTrigger value="consistency">Visit Consistency & Planning</TabsTrigger>
            <TabsTrigger value="sampling">Sampling</TabsTrigger>
          </TabsList>

          <TabsContent value="coverage">
            <Card>
              <CardHeader>
                <CardTitle>Coverage & Productivity Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total HCP Coverage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-[#27AE60]">{coverageData.totalCoverage}%</div>
                      <div className="text-lg text-[#2C3E50]">{coverageData.totalHCPs} HCPs</div>
                      <Progress value={coverageData.totalCoverage} className="mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Call Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-[#3498DB]">{coverageData.callRate}</div>
                      <p className="text-[#2C3E50]">Average calls per day</p>
                      <p className="text-[#E74C3C]">Target: 12</p>
                      <Progress value={(coverageData.callRate / 12) * 100} className="mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Class A Doctors Visited Once</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-[#27AE60]">{coverageData.classAVisitedOnce}%</div>
                      <Progress value={coverageData.classAVisitedOnce} className="mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Class A Doctors Visited as per Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-[#E74C3C]">{coverageData.classAVisitedAsPerPlan}%</div>
                      <Progress value={coverageData.classAVisitedAsPerPlan} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Frequency Achieved by Class</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={frequencyAchievedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="frequency" fill="#3498DB">
                          <LabelList dataKey="frequency" position="top" formatter={(value) => `${value}%`} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consistency">
            <Card>
              <CardHeader>
                <CardTitle>Visit Consistency & Planning Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Calls Using Detailer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-[#27AE60]">{detailerUsageData.callsUsingDetailer}%</div>
                      <Progress value={detailerUsageData.callsUsingDetailer} className="mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Calls Using Target Detailer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-[#3498DB]">{detailerUsageData.callsUsingTargetDetailer}%</div>
                      <Progress value={detailerUsageData.callsUsingTargetDetailer} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Frequency Percentage for Total HCPs</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={frequencyData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {frequencyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Planned vs. Actual Visits</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={planVsActualData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="visits" fill="#3498DB">
                          <LabelList dataKey="visits" position="top" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sampling">
            <Card>
              <CardHeader>
                <CardTitle>Sampling Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Allocation vs. Distribution Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={samplingData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="allocated" fill="#3498DB" name="Allocated">
                          <LabelList dataKey="allocated" position="top" />
                        </Bar>
                        <Bar dataKey="distributed" fill="#27AE60" name="Distributed">
                          <LabelList dataKey="distributed" position="top" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}