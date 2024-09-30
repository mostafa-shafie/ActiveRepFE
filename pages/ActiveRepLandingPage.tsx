"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  Calendar,
  Users,
  BarChart,
  PlaneLanding,
  Bell,
  LayoutDashboard,
  Star,
} from "lucide-react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";

export default function Component() {
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);

  const novaScoreData = {
    title: "NOVA-Score",
    icon: <Star className="h-6 w-6 text-[#F1C40F]" />,
    value: 85,
    target: 90,
    change: "+5% from last month",
    changeColor: "#27AE60",
    insights:
      "Your NOVA-Score is improving! Keep focusing on key behaviors to reach the target.",
    highlighted: true,
  };

  const cardData = [
    {
      title: "Daily Call Rate",
      icon: <Phone className="h-4 w-4 text-[#3498DB]" />,
      value: 12,
      target: 15,
      change: "+2 from last month",
      changeColor: "#27AE60",
      insights: "Your daily call rate has improved. Keep up the good work!",
    },
    {
      title: "Frequency Achieved %",
      icon: <Calendar className="h-4 w-4 text-[#3498DB]" />,
      value: 80,
      target: 100,
      change: "-5% from last month",
      changeColor: "#E74C3C",
      insights:
        "Your frequency achievement has decreased. Focus on meeting your planned visit frequency.",
    },
    {
      title: "Coverage",
      icon: <Users className="h-4 w-4 text-[#3498DB]" />,
      value: 81,
      target: 90,
      change: "+3% from last month",
      changeColor: "#27AE60",
      insights:
        "Great job improving your coverage! You're reaching more customers effectively.",
    },
    {
      title: "Planned vs Actual Calls",
      icon: <BarChart className="h-4 w-4 text-[#3498DB]" />,
      value: 92,
      target: 100,
      change: "-3% from last month",
      changeColor: "#E74C3C",
      insights:
        "Your actual calls are slightly below planned. Try to stick closer to your schedule for better results.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-white relative"
      style={{
        backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-[#1F3A93] text-white relative z-10">
        <Link className="flex items-center justify-center" href="/">
          <Phone className="h-6 w-6" />
          <span className="ml-2 text-2xl font-bold">ACTIVE REP</span>
        </Link>
        <Popover
          open={isNotificationOpen}
          onOpenChange={setIsNotificationOpen}
        >
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-6 w-6" />
              <span className="sr-only">Notifications</span>
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#E74C3C] text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="text-sm font-medium text-[#2C3E50]">
              Coaching report submitted
            </div>
            <Link href="/coaching-report">
              <Button className="mt-2">View Coaching Report</Button>
            </Link>
          </PopoverContent>
        </Popover>
      </header>
      <main className="flex-1 relative z-10">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-[#1F3A93]">
                  Welcome, Mostafa El Shafie
                </h1>
                <p className="mx-auto max-w-[700px] text-[#2C3E50] md:text-xl">
                  Monitor your key performance indicators and plan your customer
                  interactions effectively.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 space-y-6"
            >
              <Card className="bg-white/90 border-[#BDC3C7] backdrop-blur-sm ring-2 ring-[#F1C40F] shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold text-[#2C3E50]">
                    {novaScoreData.title}
                  </CardTitle>
                  {novaScoreData.icon}
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <div className="text-4xl font-bold text-[#1F3A93]">
                      {novaScoreData.value}%
                    </div>
                    <div
                      className="ml-2 text-sm font-medium"
                      style={{ color: novaScoreData.changeColor }}
                    >
                      {novaScoreData.change}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-[#2C3E50] mb-1">
                      <span>Progress</span>
                      <span>
                        {Math.round(
                          (novaScoreData.value / novaScoreData.target) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-[#BDC3C7] rounded-full h-3">
                      <div
                        className="bg-[#F1C40F] h-3 rounded-full"
                        style={{
                          width: `${
                            (novaScoreData.value / novaScoreData.target) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-[#2C3E50] mt-2">
                      Target: {novaScoreData.target}%
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-[#2C3E50]">
                    {novaScoreData.insights}
                  </p>
                </CardContent>
              </Card>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {cardData.map((card, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 border-[#BDC3C7] backdrop-blur-sm"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-[#2C3E50]">
                        {card.title}
                      </CardTitle>
                      {card.icon}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#1F3A93]">
                        {card.value}
                        {card.title.includes("%") ? "%" : ""}
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: card.changeColor }}
                      >
                        {card.change}
                      </p>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-[#2C3E50] mb-1">
                          <span>Progress</span>
                          <span>
                            {Math.round((card.value / card.target) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-[#BDC3C7] rounded-full h-2.5">
                          <div
                            className="bg-[#3498DB] h-2.5 rounded-full"
                            style={{
                              width: `${(card.value / card.target) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-[#2C3E50] mt-1">
                          Target: {card.target}
                          {card.title.includes("%") ? "%" : ""}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex justify-center mt-12 space-x-4"
            >
              <Button asChild className="bg-[#1F3A93] hover:bg-[#3498DB] text-white">
                <Link href="/planner">Go to Planner</Link>
              </Button>
              <Button asChild className="bg-[#27AE60] hover:bg-[#2ECC71] text-white">
                <Link href="/your-journey">
                  <PlaneLanding className="mr-2 h-4 w-4" />
                  Start Journey
                </Link>
              </Button>
              <Button asChild className="bg-[#3498DB] hover:bg-[#2980B9] text-white">
                <Link href="/dashboards">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
