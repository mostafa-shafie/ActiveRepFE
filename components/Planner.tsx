'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, CalendarIcon, ArrowLeft, ArrowRight, Users, Briefcase, MapPin, BarChart, ClipboardList, CheckCircle, X, Users2, Building2, Presentation, Stethoscope, PalmtreeIcon, BabyIcon } from "lucide-react"
import { format, addDays, startOfWeek, eachDayOfInterval, eachHourOfInterval, set, isSameDay, parseISO, startOfMonth, endOfMonth, isSameMonth, isWithinInterval } from "date-fns"
import Link from 'next/link'
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

// Extended sample data for the contacts table
const initialData = [
  { id: 1, name: "John Doe", account: "Acme Inc", class: "A", area: "North", frequencyAchieved: "3/3", lastVisited: "2023-06-15" },
  { id: 2, name: "Jane Smith", account: "TechCorp", class: "B", area: "South", frequencyAchieved: "3/3", lastVisited: "2023-06-10" },
  { id: 3, name: "Bob Johnson", account: "GlobalTech", class: "A", area: "East", frequencyAchieved: "1/4", lastVisited: "2023-05-28" },
  { id: 4, name: "Alice Brown", account: "InnoSys", class: "C", area: "West", frequencyAchieved: "1/3", lastVisited: "2023-06-20" },
  { id: 5, name: "Charlie Davis", account: "FutureTech", class: "B", area: "North", frequencyAchieved: "2/3", lastVisited: "2023-06-18" },
]

// Helper function to generate a week of dates
const generateWeekDates = (startDate: Date) => {
  return eachDayOfInterval({ start: startDate, end: addDays(startDate, 6) })
}

// Helper function to generate working hours
const generateWorkingHours = (date: Date) => {
  const startTime = set(date, { hours: 9, minutes: 0 })
  const endTime = set(date, { hours: 17, minutes: 0 })
  return eachHourOfInterval({ start: startTime, end: endTime })
}

export default function Planner() {
  const [data, setData] = useState(initialData)
  const [filters, setFilters] = useState({
    class: '',
    account: '',
    area: '',
    frequencyAchieved: ''
  })
  const [search, setSearch] = useState('')
  const [planView, setPlanView] = useState('weekly')
  const [isAddToPlanOpen, setIsAddToPlanOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [weekStartDate, setWeekStartDate] = useState(startOfWeek(new Date()))
  const [dailyViewDate, setDailyViewDate] = useState(new Date())
  const [monthViewDate, setMonthViewDate] = useState(new Date())
  const [listHeight, setListHeight] = useState(0)
  const headerRef = useRef<HTMLElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  const [weeklyPlanData, setWeeklyPlanData] = useState(() => {
    const weekDates = generateWeekDates(weekStartDate)
    return weekDates.map(date => ({
      date,
      contacts: generateRandomContacts(date),
    }))
  })

  const [monthlyPlanData, setMonthlyPlanData] = useState(() => {
    const monthStart = startOfMonth(monthViewDate)
    const monthEnd = endOfMonth(monthViewDate)
    const monthDates = eachDayOfInterval({ start: monthStart, end: monthEnd })
    return monthDates.map(date => ({
      date,
      contacts: generateRandomContacts(date),
    }))
  })

  useEffect(() => {
    const updateListHeight = () => {
      if (headerRef.current && filtersRef.current) {
        const windowHeight = window.innerHeight
        const headerHeight = headerRef.current.offsetHeight
        const filtersHeight = filtersRef.current.offsetHeight
        const newListHeight = windowHeight - headerHeight - filtersHeight - 40 // 40px for padding
        setListHeight(newListHeight)
      }
    }

    updateListHeight()
    window.addEventListener('resize', updateListHeight)

    return () => window.removeEventListener('resize', updateListHeight)
  }, [])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const openAddToPlanModal = (contact: any) => {
    setSelectedContact(contact)
    setIsAddToPlanOpen(true)
  }

  const addToPlan = () => {
    if (selectedContact && selectedDate) {
      const newContact = {
        id: `${selectedContact.id}-${Date.now()}`,
        name: selectedContact.name,
        account: selectedContact.account,
        time: new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`)
      }

      setWeeklyPlanData(prevData => {
        return prevData.map(day => {
          if (isSameDay(day.date, selectedDate)) {
            return { ...day, contacts: [...day.contacts, newContact] }
          }
          return day
        })
      })

      setMonthlyPlanData(prevData => {
        return prevData.map(day => {
          if (isSameDay(day.date, selectedDate)) {
            return { ...day, contacts: [...day.contacts, newContact] }
          }
          return day
        })
      })

      toast({
        title: "Contact Added to Plan",
        description: `${selectedContact.name} from ${selectedContact.account} has been added to your plan on ${format(selectedDate, 'MMMM do, yyyy')} at ${selectedTime}.`,
      })
      setIsAddToPlanOpen(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F2F1EF]">
      <header ref={headerRef} className="px-4 lg:px-6 h-14 flex items-center justify-between border-b bg-[#1F3A93] text-white">
        <Link href="/" className="font-bold text-lg flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          ACTIVE REP
        </Link>
        <div className="flex items-center">
          <ClipboardList className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Planner</h1>
        </div>
        <div className="w-24"></div>
      </header>
      <main className="flex-1 py-6 px-4 md:px-6 overflow-hidden">
        <div className="flex gap-6">
          {/* Left side: Filters and Contact List */}
          <div className="w-1/4 flex flex-col">
            <div ref={filtersRef} className="flex flex-col gap-4 mb-6">
              {/* Filters */}
              <Select onValueChange={(value) => handleFilterChange('class', value)}>
                <SelectTrigger className="w-full bg-white border-[#BDC3C7]">
                  <Users className="h-4 w-4 mr-2 text-[#3498DB]" />
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Class A</SelectItem>
                  <SelectItem value="B">Class B</SelectItem>
                  <SelectItem value="C">Class C</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => handleFilterChange('account', value)}>
                <SelectTrigger className="w-full bg-white border-[#BDC3C7]">
                  <Briefcase className="h-4 w-4 mr-2 text-[#3498DB]" />
                  <SelectValue placeholder="Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acme Inc">Acme Inc</SelectItem>
                  <SelectItem value="TechCorp">TechCorp</SelectItem>
                  <SelectItem value="GlobalTech">GlobalTech</SelectItem>
                  <SelectItem value="InnoSys">InnoSys</SelectItem>
                  <SelectItem value="FutureTech">FutureTech</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => handleFilterChange('area', value)}>
                <SelectTrigger className="w-full bg-white border-[#BDC3C7]">
                  <MapPin className="h-4 w-4 mr-2 text-[#3498DB]" />
                  <SelectValue placeholder="Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North">North</SelectItem>
                  <SelectItem value="South">South</SelectItem>
                  <SelectItem value="East">East</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => handleFilterChange('frequencyAchieved', value)}>
                <SelectTrigger className="w-full bg-white border-[#BDC3C7]">
                  <BarChart className="h-4 w-4 mr-2 text-[#3498DB]" />
                  <SelectValue placeholder="Frequency Achieved" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1/3">1/3</SelectItem>
                  <SelectItem value="2/3">2/3</SelectItem>
                  <SelectItem value="3/3">3/3</SelectItem>
                  <SelectItem value="1/4">1/4</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex w-full items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-white border-[#BDC3C7]"
                />
                <Button type="submit" size="icon" className="bg-[#3498DB] hover:bg-[#2980B9]">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </div>
            {/* Contact List */}
            <div className="overflow-auto flex-grow space-y-2" style={{ maxHeight: `${listHeight}px` }}>
              {data.filter(item => {
                return (
                  (filters.class === '' || item.class === filters.class) &&
                  (filters.account === '' || item.account === filters.account) &&
                  (filters.area === '' || item.area === filters.area) &&
                  (filters.frequencyAchieved === '' || item.frequencyAchieved === filters.frequencyAchieved) &&
                  (search === '' || 
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.account.toLowerCase().includes(search.toLowerCase()))
                )
              }).sort((a, b) => {
                // Sort by frequency achieved (descending)
                const aFreq = parseInt(a.frequencyAchieved.split('/')[0])
                const bFreq = parseInt(b.frequencyAchieved.split('/')[0])
                return bFreq - aFreq
              }).map((hcp) => (
                <Card key={hcp.id} className="bg-white border-[#BDC3C7]">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <h3 className="font-bold text-sm text-[#1F3A93]">{hcp.name}</h3>
                        </div>
                        <p className="text-xs text-[#2C3E50]">{hcp.account}</p>
                        <div className="text-xs text-[#7F8C8D] mt-1">
                          {hcp.class} | {hcp.area} | Last: {hcp.lastVisited}
                        </div>
                        <div className="text-xs font-semibold mt-1">
                          <span>Frequency: {hcp.frequencyAchieved}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => openAddToPlanModal(hcp)}
                        size="icon"
                        variant="ghost"
                        className="text-[#3498DB] hover:bg-[#3498DB] hover:text-white ml-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add to Plan</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right side: Current Plan */}
          <div className="w-3/4">
            <Card className="bg-white border-[#BDC3C7]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-[#2C3E50]">
                  <span className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-[#3498DB]" />
                    Current Plan
                  </span>
                  <Tabs value={planView} onValueChange={setPlanView}>
                    <TabsList className="bg-[#BDC3C7]">
                      <TabsTrigger value="monthly" className="data-[state=active]:bg-[#3498DB] data-[state=active]:text-white">Monthly</TabsTrigger>
                      <TabsTrigger value="weekly" className="data-[state=active]:bg-[#3498DB] data-[state=active]:text-white">Weekly</TabsTrigger>
                      <TabsTrigger value="daily" className="data-[state=active]:bg-[#3498DB] data-[state=active]:text-white">Daily</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {planView === 'weekly' && (
                  <div className="grid grid-cols-7 gap-2">
                    {weeklyPlanData.map((day) => (
                      <div key={day.date.toISOString()} className="p-2 border rounded-md bg-white">
                        <h3 className="font-bold text-center">{format(day.date, 'EEE, MMM d')}</h3>
                        <ul className="mt-2 space-y-1">
                          {day.contacts.map((contact) => (
                            <li key={contact.id} className="text-sm">
                              {contact.name} ({contact.account})
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                {planView === 'monthly' && (
                  <div className="grid grid-cols-7 gap-2">
                    {monthlyPlanData.map((day) => (
                      <div key={day.date.toISOString()} className={cn("p-2 border rounded-md", isSameMonth(day.date, monthViewDate) ? "bg-white" : "bg-gray-100")}>
                        <h3 className="font-bold text-right">{format(day.date, 'd')}</h3>
                        <ul className="mt-2 space-y-1">
                          {day.contacts.map((contact) => (
                            <li key={contact.id} className="text-sm">
                              {contact.name} ({contact.account})
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                {planView === 'daily' && (
                  <div className="space-y-2">
                    {weeklyPlanData
                      .find(day => isSameDay(day.date, dailyViewDate))
                      ?.contacts.map((contact) => (
                        <Card key={contact.id} className="bg-white border-[#BDC3C7]">
                          <CardContent className="p-4 flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-[#1F3A93]">{format(contact.time, 'h:mm a')}</p>
                              <p className="text-[#2C3E50]">{contact.name}</p>
                              <p className="text-sm text-[#BDC3C7]">{contact.account}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={isAddToPlanOpen} onOpenChange={setIsAddToPlanOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#1F3A93]">Add to Plan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-[#2C3E50]">
                Name
              </Label>
              <Input id="name" value={selectedContact?.name || ''} className="col-span-3 bg-[#F2F1EF] border-[#BDC3C7]" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account" className="text-right text-[#2C3E50]">
                Account
              </Label>
              <Input id="account" value={selectedContact?.account || ''} className="col-span-3 bg-[#F2F1EF] border-[#BDC3C7]" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right text-[#2C3E50]">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal bg-[#F2F1EF] border-[#BDC3C7]",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-[#3498DB]" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="rounded-md border border-[#BDC3C7]"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right text-[#2C3E50]">
                Time
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="w-[280px] bg-[#F2F1EF] border-[#BDC3C7]">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {Array.from({ length: 9 }, (_, i) => i + 9).map((hour) => (
                    <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {`${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addToPlan} className="bg-[#27AE60] hover:bg-[#2ECC71] text-white">Add to Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
