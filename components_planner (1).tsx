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

// Helper function to generate random contacts for a day
const generateRandomContacts = (date: Date) => {
  const numberOfContacts = Math.floor(Math.random() * 4) // 0 to 3 contacts per day
  return Array.from({ length: numberOfContacts }, () => {
    const randomContact = initialData[Math.floor(Math.random() * initialData.length)]
    const randomHour = Math.floor(Math.random() * 8) + 9 // Random hour between 9 and 17
    return {
      id: `${randomContact.id}-${Date.now()}-${Math.random()}`,
      name: randomContact.name,
      account: randomContact.account,
      time: set(date, { hours: randomHour, minutes: 0 })
    }
  })
}

export default function Component() {
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
  const [isTOTOpen, setIsTOTOpen] = useState(false)
  const [totName, setTotName] = useState('')
  const [totType, setTotType] = useState('')
  const [totStartDate, setTotStartDate] = useState<Date | undefined>(new Date())
  const [totEndDate, setTotEndDate] = useState<Date | undefined>(new Date())
  const [totStartTime, setTotStartTime] = useState('09:00')
  const [totEndTime, setTotEndTime] = useState('17:00')
  const [isMultiDay, setIsMultiDay] = useState(false)

  const [weeklyPlanData, setWeeklyPlanData] = useState(() => {
    const weekDates = generateWeekDates(weekStartDate)
    const data = weekDates.map(date => ({
      date,
      contacts: generateRandomContacts(date),
      tot: []
    }))

    // Add sample "Group meeting" TOT
    const today = new Date()
    const todayData = data.find(day => isSameDay(day.date, today))
    if (todayData) {
      todayData.tot.push({
        id: 'tot-1',
        name: 'Team Sync',
        type: 'Group meeting',
        startTime: set(today, { hours: 10, minutes: 0 }),
        endTime: set(today, { hours: 11, minutes: 30 }),
      })
    }

    // Add sample "Office meeting" TOT
    const tomorrow = addDays(today, 1)
    const tomorrowData = data.find(day => isSameDay(day.date, tomorrow))
    if (tomorrowData) {
      tomorrowData.tot.push({
        id: 'tot-2',
        name: 'Quarterly Review',
        type: 'Office meeting',
        startTime: set(tomorrow, { hours: 14, minutes: 0 }),
        endTime: set(tomorrow, { hours: 16, minutes: 0 }),
      })
    }

    return data
  })

  const [monthlyPlanData, setMonthlyPlanData] = useState(() => {
    const monthStart = startOfMonth(monthViewDate)
    const monthEnd = endOfMonth(monthViewDate)
    const monthDates = eachDayOfInterval({ start: monthStart, end: monthEnd })
    return monthDates.map(date => ({
      date,
      contacts: generateRandomContacts(date),
      tot: []
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

  const getTOTIcon = (type: string) => {
    switch (type) {
      case 'Group meeting':
        return <Users2 className="h-3 w-3 mr-1" />
      case 'Round table discussion':
        return <Users className="h-3 w-3 mr-1" />
      case 'Office meeting':
        return <Building2 className="h-3 w-3 mr-1" />
      case 'Conference':
        return <Presentation className="h-3 w-3 mr-1" />
      case 'Sick leave':
        return <Stethoscope className="h-3 w-3 mr-1" />
      case 'Annual leave':
        return <PalmtreeIcon className="h-3 w-3 mr-1" />
      case 'Maternity leave':
        return <BabyIcon className="h-3 w-3 mr-1" />
      default:
        return <Briefcase className="h-3 w-3 mr-1" />
    }
  }

  const getTOTColor = (type: string) => {
    switch (type) {
      case 'Group meeting':
        return 'bg-purple-500'
      case 'Round table discussion':
        return 'bg-blue-500'
      case 'Office meeting':
        return 'bg-orange-500'
      case 'Conference':
        return 'bg-green-500'
      case 'Sick leave':
        return 'bg-red-500'
      case 'Annual leave':
        return 'bg-yellow-500'
      case 'Maternity leave':
        return 'bg-pink-500'
      default:
        return 'bg-gray-500'
    }
  }

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

  const removeTOT = (totId: string, date: Date) => {
    setWeeklyPlanData(prevData => {
      return prevData.map(day => {
        if (isSameDay(day.date, date)) {
          return { ...day, tot: day.tot.filter(tot => tot.id !== totId) }
        }
        return day
      })
    })

    setMonthlyPlanData(prevData => {
      return prevData.map(day => {
        if (isSameDay(day.date, date)) {
          return { ...day, tot: day.tot.filter(tot => tot.id !== totId) }
        }
        return day
      })
    })

    toast({
      title: "TOT Entry Removed",
      description: `The TOT entry has been removed from your plan on ${format(date, 'MMMM do, yyyy')}.`,
    })
  }

  const handleTOTSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTOT = {
      id: `tot-${Date.now()}`,
      name: totName,
      type: totType,
      startTime: new Date(`${format(totStartDate!, 'yyyy-MM-dd')}T${totStartTime}:00`),
      endTime: new Date(`${format(isMultiDay ? totEndDate! : totStartDate!, 'yyyy-MM-dd')}T${totEndTime}:00`),
    }

    setWeeklyPlanData(prevData => {
      return prevData.map(day => {
        if (isWithinInterval(day.date, { start: totStartDate!, end: isMultiDay ? totEndDate! : totStartDate! })) {
          return { ...day, tot: [...day.tot, newTOT] }
        }
        return day
      })
    })

    setMonthlyPlanData(prevData => {
      return prevData.map(day => {
        if (isWithinInterval(day.date, { start: totStartDate!, end: isMultiDay ? totEndDate! : totStartDate! })) {
          return { ...day, tot: [...day.tot, newTOT] }
        }
        return day
      })
    })

    toast({
      title: "TOT Entry Added",
      description: `${totName} (${totType}) from ${format(totStartDate!, 'MMMM do, yyyy')} at ${totStartTime} to ${isMultiDay ? format(totEndDate!, 'MMMM do, yyyy') : format(totStartDate!, 'MMMM do, yyyy')} at ${totEndTime}.`,
    })
    setIsTOTOpen(false)
  }

  const isInCurrentWeekPlan = (hcpId: number) => {
    return weeklyPlanData.some(day => 
      day.contacts.some(contact => contact.id.startsWith(hcpId.toString()))
    )
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const [sourceDate, sourceTime] = result.source.droppableId.split('|')
    const [destDate, destTime] = result.destination.droppableId.split('|')

    const updatePlanData = (prevData: any[]) => {
      const newData = [...prevData]
      const sourceDay = newData.find(day => format(day.date, 'yyyy-MM-dd') === sourceDate)
      const destDay = newData.find(day => format(day.date, 'yyyy-MM-dd') === destDate)

      if (sourceDay && destDay) {
        const [movedContact] = sourceDay.contacts.splice(result.source.index, 1)
        movedContact.time = new Date(`${destDate}T${destTime}:00`)
        destDay.contacts.push(movedContact)
      }

      return newData
    }

    setWeeklyPlanData(updatePlanData)
    setMonthlyPlanData(updatePlanData)
  }

  const navigateWeek = (direction: number) => {
    setWeekStartDate(prevDate => {
      const newStartDate = addDays(prevDate, direction * 7)
      setWeeklyPlanData(generateWeekDates(newStartDate).map(date => ({
        date,
        contacts: generateRandomContacts(date),
        tot: []
      })))
      return newStartDate
    })
  }

  const navigateDay = (direction: number) => {
    setDailyViewDate(prevDate => addDays(prevDate, direction))
  }

  const navigateMonth = (direction: number) => {
    setMonthViewDate(prevDate => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + direction, 1)
      const monthStart = startOfMonth(newDate)
      const monthEnd = endOfMonth(newDate)
      const monthDates = eachDayOfInterval({ start: monthStart, end: monthEnd })
      setMonthlyPlanData(monthDates.map(date => ({
        date,
        contacts: generateRandomContacts(date),
        tot: []
      })))
      return newDate
    })
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
                          {isInCurrentWeekPlan(hcp.id) && (
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          )}
                          <h3 className="font-bold text-sm text-[#1F3A93]">{hcp.name}</h3>
                        </div>
                        <p className="text-xs text-[#2C3E50]">{hcp.account}</p>
                        <div className="text-xs text-[#7F8C8D] mt-1">
                          {hcp.class} | {hcp.area} | Last: {hcp.lastVisited}
                        </div>
                        <div className="text-xs font-semibold mt-1">
                          {hcp.frequencyAchieved === hcp.frequencyAchieved.split('/')[1] + '/' + hcp.frequencyAchieved.split('/')[1] ? (
                            <span className="text-[#3498DB] bg-blue-100 px-2 py-1 rounded-full">Frequency achieved: {hcp.frequencyAchieved}</span>
                          ) : (
                            <span>Frequency: {hcp.frequencyAchieved}</span>
                          )}
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
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setIsTOTOpen(true)}
                      className="bg-[#3498DB] hover:bg-[#2980B9] text-white"
                    >
                      TOT
                    </Button>
                    <Tabs value={planView} onValueChange={setPlanView}>
                      <TabsList className="bg-[#BDC3C7]">
                        <TabsTrigger value="monthly" className="data-[state=active]:bg-[#3498DB] data-[state=active]:text-white">Monthly</TabsTrigger>
                        <TabsTrigger value="weekly" className="data-[state=active]:bg-[#3498DB] data-[state=active]:text-white">Weekly</TabsTrigger>
                        <TabsTrigger value="daily" className="data-[state=active]:bg-[#3498DB] data-[state=active]:text-white">Daily</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {planView === 'weekly' && (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex justify-between mb-4">
                      <Button onClick={() => navigateWeek(-1)} className="bg-[#3498DB] hover:bg-[#2980B9]">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous Week
                      </Button>
                      <Button onClick={() => navigateWeek(1)} className="bg-[#3498DB] hover:bg-[#2980B9]">
                        Next Week
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-8 gap-1">
                      <div className="col-span-1"></div>
                      {weeklyPlanData.map((day) => (
                        <div key={day.date.toISOString()} className="col-span-1 text-center font-semibold">
                          {format(day.date, 'EEE')}
                          <br />
                          {format(day.date, 'MMM d')}
                        </div>
                      ))}
                      {generateWorkingHours(new Date()).map((hour) => (
                        <React.Fragment key={hour.toISOString()}>
                          <div className="col-span-1 text-right pr-2 font-medium">
                            {format(hour, 'h a')}
                          </div>
                          {weeklyPlanData.map((day) => {
                            const timeSlot = `${format(day.date, 'yyyy-MM-dd')}|${format(hour, 'HH:mm')}`
                            return (
                              <Droppable key={timeSlot} droppableId={timeSlot}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn(
                                      "col-span-1 border border-gray-200 min-h-[60px] p-1",
                                      snapshot.isDraggingOver && "bg-blue-100"
                                    )}
                                  >
                                    {day.contacts
                                      .filter(contact => format(contact.time, 'HH') === format(hour, 'HH'))
                                      .map((contact, index) => (
                                        <Draggable key={contact.id} draggableId={contact.id} index={index}>
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              className={cn(
                                                "bg-[#3498DB] text-white p-1 mb-1 rounded text-xs flex justify-between items-center",
                                                snapshot.isDragging && "opacity-50"
                                              )}
                                            >
                                              <span>{contact.name}</span>
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                    {day.tot
                                      .filter(tot => format(tot.startTime, 'HH') === format(hour, 'HH'))
                                      .map((tot) => (
                                        <div
                                          key={tot.id}
                                          className={cn(
                                            "text-white p-1 mb-1 rounded text-xs flex justify-between items-center",
                                            getTOTColor(tot.type)
                                          )}
                                        >
                                          <span className="flex items-center">
                                            {getTOTIcon(tot.type)}
                                            {tot.name}
                                          </span>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-4 w-4 text-white hover:bg-red-500 hover:text-white"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              removeTOT(tot.id, day.date)
                                            }}
                                          >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove</span>
                                          </Button>
                                        </div>
                                      ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            )
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </DragDropContext>
                )}
                {planView === 'monthly' && (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex justify-between mb-4">
                      <Button onClick={() => navigateMonth(-1)} className="bg-[#3498DB] hover:bg-[#2980B9]">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous Month
                      </Button>
                      <h3 className="text-lg font-bold text-[#1F3A93]">
                        {format(monthViewDate, 'MMMM yyyy')}
                      </h3>
                      <Button onClick={() => navigateMonth(1)} className="bg-[#3498DB] hover:bg-[#2980B9]">
                        Next Month
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-semibold p-2">{day}</div>
                      ))}
                      {monthlyPlanData.map((day) => (
                        <Droppable key={day.date.toISOString()} droppableId={format(day.date, 'yyyy-MM-dd|HH:mm')}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={cn(
                                "border rounded-lg p-1 min-h-[100px]",
                                isSameMonth(day.date, monthViewDate) ? "bg-white" : "bg-gray-100",
                                snapshot.isDraggingOver && "bg-blue-100"
                              )}
                            >
                              <div className="text-right text-sm">{format(day.date, 'd')}</div>
                              {day.contacts.map((contact, index) => (
                                <Draggable key={contact.id} draggableId={contact.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={cn(
                                        "bg-[#3498DB] text-white p-1 mb-1 rounded text-xs flex justify-between items-center",
                                        snapshot.isDragging && "opacity-50"
                                      )}
                                    >
                                      <span>{contact.name}</span>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ))}
                    </div>
                  </DragDropContext>
                )}
                {planView === 'daily' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <Button onClick={() => navigateDay(-1)} className="bg-[#3498DB] hover:bg-[#2980B9]">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous Day
                      </Button>
                      <h3 className="text-lg font-bold text-[#1F3A93]">
                        {format(dailyViewDate, 'EEEE, MMMM d, yyyy')}
                      </h3>
                      <Button onClick={() => navigateDay(1)} className="bg-[#3498DB] hover:bg-[#2980B9]">
                        Next Day
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
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

      <Dialog open={isTOTOpen} onOpenChange={setIsTOTOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#1F3A93]">Time on Territory (TOT)</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTOTSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tot-name" className="text-[#2C3E50]">Name</Label>
              <Input
                id="tot-name"
                value={totName}
                onChange={(e) => setTotName(e.target.value)}
                className="w-full bg-[#F2F1EF] border-[#BDC3C7]"
                placeholder="Enter TOT name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tot-type" className="text-[#2C3E50]">Type</Label>
              <Select value={totType} onValueChange={setTotType}>
                <SelectTrigger id="tot-type" className="w-full bg-[#F2F1EF] border-[#BDC3C7]">
                  <SelectValue placeholder="Select TOT type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Group meeting">Group meeting</SelectItem>
                  <SelectItem value="Round table discussion">Round table discussion</SelectItem>
                  <SelectItem value="Office meeting">Office meeting</SelectItem>
                  <SelectItem value="Conference">Conference</SelectItem>
                  <SelectItem value="Sick leave">Sick leave</SelectItem>
                  <SelectItem value="Annual leave">Annual leave</SelectItem>
                  <SelectItem value="Maternity leave">Maternity leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tot-start-date" className="text-[#2C3E50]">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="tot-start-date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-[#F2F1EF] border-[#BDC3C7]",
                      !totStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-[#3498DB]" />
                    {totStartDate ? format(totStartDate, "PPP") : <span>Pick a start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={totStartDate}
                    onSelect={setTotStartDate}
                    initialFocus
                    className="rounded-md border border-[#BDC3C7]"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tot-start-time" className="text-[#2C3E50]">Start Time</Label>
              <Select value={totStartTime} onValueChange={setTotStartTime}>
                <SelectTrigger id="tot-start-time" className="w-full bg-[#F2F1EF] border-[#BDC3C7]">
                  <SelectValue placeholder="Select a start time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {`${hour.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-multi-day"
                checked={isMultiDay}
                onCheckedChange={(checked) => setIsMultiDay(checked as boolean)}
              />
              <Label htmlFor="is-multi-day" className="text-[#2C3E50]">
                This is a multi-day event
              </Label>
            </div>
            {isMultiDay && (
              <div className="space-y-2">
                <Label htmlFor="tot-end-date" className="text-[#2C3E50]">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="tot-end-date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-[#F2F1EF] border-[#BDC3C7]",
                        !totEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#3498DB]" />
                      {totEndDate ? format(totEndDate, "PPP") : <span>Pick an end date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={totEndDate}
                      onSelect={setTotEndDate}
                      initialFocus
                      className="rounded-md border border-[#BDC3C7]"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="tot-end-time" className="text-[#2C3E50]">End Time</Label>
              <Select value={totEndTime} onValueChange={setTotEndTime}>
                <SelectTrigger id="tot-end-time" className="w-full bg-[#F2F1EF] border-[#BDC3C7]">
                  <SelectValue placeholder="Select an end time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {`${hour.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#27AE60] hover:bg-[#2ECC71] text-white">Add TOT Entry</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}