'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, UserPlus, Calendar, Users, Building, Award, Clock, CheckCircle, PieChart, AlertCircle, Search, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const marketingPlanData = [
  // (Content unchanged)
]

const initialPlannedVisits = [
  // (Content unchanged)
]

const initialAccounts = [
  // (Content unchanged)
]

export default function YourJourney() {
  const [journeyDate, setJourneyDate] = useState(new Date().toLocaleDateString())
  const [searchTerm, setSearchTerm] = useState('')
  const [plannedVisits, setPlannedVisits] = useState(initialPlannedVisits)
  const [isJourneyStarted, setIsJourneyStarted] = useState(false)
  const [showEndJourneyDialog, setShowEndJourneyDialog] = useState(false)
  const [showMarketingPlan, setShowMarketingPlan] = useState(false)
  const [accounts, setAccounts] = useState(initialAccounts)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [showNewAccountDialog, setShowNewAccountDialog] = useState(false)
  const [newAccount, setNewAccount] = useState({ name: '', type: '', location: '', region: '' })
  const [showAddContactDialog, setShowAddContactDialog] = useState(false)

  const handleVisitToggle = (id: number) => {
    setPlannedVisits(prevVisits =>
      prevVisits.map(visit =>
        visit.id === id ? { ...visit, visitStarted: !visit.visitStarted } : visit
      )
    )
  }

  const handleStartJourney = () => {
    setIsJourneyStarted(true)
  }

  const handleEndJourney = () => {
    setShowEndJourneyDialog(true)
  }

  const confirmEndJourney = () => {
    setIsJourneyStarted(false)
    setShowEndJourneyDialog(false)
  }

  const cancelEndJourney = () => {
    setShowEndJourneyDialog(false)
  }

  const handleAccountSelect = (accountName: string) => {
    if (accountName === 'create-new') {
      setShowNewAccountDialog(true)
    } else {
      setSelectedAccount(accountName)
    }
  }

  const handleCreateNewAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (newAccount.name && newAccount.type && newAccount.location && newAccount.region) {
      const newAccountWithId = { ...newAccount, id: accounts.length + 1 }
      setAccounts(prevAccounts => [...prevAccounts, newAccountWithId])
      setSelectedAccount(newAccount.name)
      setShowNewAccountDialog(false)
      setNewAccount({ name: '', type: '', location: '', region: '' })
    }
  }

  const handleNewAccountChange = (field: string, value: string) => {
    setNewAccount(prev => ({ ...prev, [field]: value }))
  }

  const getMarketingMessage = (potential: string, visitNumber: number) => {
    const potentialData = marketingPlanData.find(p => p.potential === potential)
    if (!potentialData || !potentialData.visits) return 'No marketing message available'

    const visit = potentialData.visits[visitNumber - 1]
    if (!visit || !visit.products) return 'No marketing message available'

    return visit.products.map(p => `${p.name}: ${p.message}`).join('\n')
  }

  const isFrequencyAchieved = (frequencyAchieved: string) => {
    if (!frequencyAchieved) return false
    const [achieved, total] = frequencyAchieved.split('/').map(Number)
    return !isNaN(achieved) && !isNaN(total) && achieved === total
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF]">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b border-[#BDC3C7] bg-[#1F3A93] text-white">
        <Link href="/" className="font-bold text-lg flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          ACTIVE REP
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Journey Date: {journeyDate}</span>
          <Button
            variant="outline"
            className="flex items-center bg-[#3498DB] text-white hover:bg-[#2980B9]"
            onClick={() => setShowAddContactDialog(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center bg-[#3498DB] text-white hover:bg-[#2980B9]">
                <Calendar className="h-4 w-4 mr-2" />
                Add Visit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#FFFFFF]">
              <DialogHeader>
                <DialogTitle className="text-[#1F3A93]">Add New Visit</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="search" className="text-[#2C3E50]">Search Contact</Label>
                  <Input
                    id="search"
                    placeholder="Search by name or account"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-[#BDC3C7]"
                  />
                </div>
                <div>
                  <Label className="text-[#2C3E50]">Visit Date</Label>
                  <Input type="text" value={new Date().toLocaleDateString()} disabled className="border-[#BDC3C7]" />
                </div>
                <Button type="submit" className="bg-[#3498DB] text-white hover:bg-[#2980B9]">Add Visit</Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={showMarketingPlan} onOpenChange={setShowMarketingPlan}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center bg-[#3498DB] text-white hover:bg-[#2980B9]">
                <PieChart className="h-4 w-4 mr-2" />
                Marketing Cycle Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#FFFFFF]">
              <DialogHeader>
                <DialogTitle className="text-[#1F3A93]">Marketing Cycle Plan</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {marketingPlanData.map((potential) => (
                  <div key={potential.potential} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-[#1F3A93]">Dr Potential: {potential.potential}</h3>
                    {potential.visits && potential.visits.map((visit) => (
                      <div key={visit.visit} className="mb-4">
                        <h4 className="text-md font-medium mb-2 text-[#2C3E50]">{visit.visit}</h4>
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-[#F2F1EF]">
                              <TableHead className="text-[#1F3A93]">Product</TableHead>
                              <TableHead className="text-[#1F3A93]">Marketing Message</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {visit.products && visit.products.map((product) => (
                              <TableRow key={product.name}>
                                <TableCell className="text-[#2C3E50]">{product.name}</TableCell>
                                <TableCell className="whitespace-pre-line text-[#2C3E50]">{product.message}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className="flex-1 py-6 px-4 md:px-6 bg-[#FFFFFF]">
        <h1 className="text-2xl font-bold mb-4 text-[#1F3A93]">Your Journey</h1>
        <Card className="bg-[#FFFFFF] border-[#BDC3C7]">
          <CardHeader className="border-b border-[#BDC3C7]">
            <CardTitle className="text-[#1F3A93]">Planned Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F2F1EF]">
                  <TableHead className="text-[#1F3A93]"><Users className="h-4 w-4 mr-2" />Name</TableHead>
                  <TableHead className="text-[#1F3A93]"><Building className="h-4 w-4 mr-2" />Account</TableHead>
                  <TableHead className="text-[#1F3A93]"><Award className="h-4 w-4 mr-2" />Class</TableHead>
                  <TableHead className="text-[#1F3A93]"><CheckCircle className="h-4 w-4 mr-2" />Frequency Achieved</TableHead>
                  <TableHead className="text-[#1F3A93]"><Clock className="h-4 w-4 mr-2" />Last Visited</TableHead>
                  <TableHead className="text-[#1F3A93]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plannedVisits.map((visit) => (
                  <React.Fragment key={visit.id}>
                    <TableRow>
                      <TableCell className="text-[#2C3E50]">{visit.name}</TableCell>
                      <TableCell className="text-[#2C3E50]">{visit.account}</TableCell>
                      <TableCell className="text-[#2C3E50]">{visit.class}</TableCell>
                      <TableCell className="text-[#2C3E50]">
                        {visit.frequencyAchieved}
                        {visit.inCall && isFrequencyAchieved(visit.frequencyAchieved) && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertCircle className="h-4 w-4 ml-2 text-[#E74C3C]" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>This visit will not contribute to your KPIs</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                      <TableCell className="text-[#2C3E50]">{visit.lastVisited}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVisitToggle(visit.id)}
                          className={`${visit.visitStarted ? 'bg-[#27AE60] text-white' : 'bg-[#3498DB] text-white'} hover:bg-[#2980B9]`}
                        >
                          {visit.visitStarted ? 'End Visit' : 'Start Visit'}
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} className="bg-[#F2F1EF]">
                        <div className="text-sm font-medium text-[#1F3A93]">Marketing Message:</div>
                        <div className="whitespace-pre-line text-sm mt-1 text-[#2C3E50]">
                          {getMarketingMessage(visit.potential, visit.visitNumber)}
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t border-[#BDC3C7]">
            <div className="flex items-center space-x-4">
              {isJourneyStarted && (
                <span className="text-sm font-medium text-[#27AE60]">Journey Started</span>
              )}
            </div>
            <div className="flex space-x-2">
              {!isJourneyStarted ? (
                <Button onClick={handleStartJourney} className="bg-[#27AE60] text-white hover:bg-[#219653]">Start Journey</Button>
              ) : (
                <Button onClick={handleEndJourney} className="bg-[#E74C3C] text-white hover:bg-[#C0392B]">End Journey</Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </main>
      <Dialog open={showNewAccountDialog} onOpenChange={setShowNewAccountDialog}>
        <DialogContent className="bg-[#FFFFFF]">
          <DialogHeader>
            <DialogTitle className="text-[#1F3A93]">Create New Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateNewAccount} className="space-y-4">
            <div>
              <Label htmlFor="accountName" className="text-[#2C3E50]">Account Name</Label>
              <Input
                id="accountName"
                value={newAccount.name}
                onChange={(e) => handleNewAccountChange('name', e.target.value)}
                placeholder="Enter account name"
                className="border-[#BDC3C7]"
              />
            </div>
            <div>
              <Label htmlFor="accountType" className="text-[#2C3E50]">Account Type</Label>
              <Input
                id="accountType"
                value={newAccount.type}
                onChange={(e) => handleNewAccountChange('type', e.target.value)}
                placeholder="Enter account type"
                className="border-[#BDC3C7]"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-[#2C3E50]">Location</Label>
              <Input
                id="location"
                value={newAccount.location}
                onChange={(e) => handleNewAccountChange('location', e.target.value)}
                placeholder="Enter location"
                className="border-[#BDC3C7]"
              />
            </div>
            <div>
              <Label htmlFor="region" className="text-[#2C3E50]">Region</Label>
              <Input
                id="region"
                value={newAccount.region}
                onChange={(e) => handleNewAccountChange('region', e.target.value)}
                placeholder="Enter region"
                className="border-[#BDC3C7]"
              />
            </div>
            <Button type="submit" className="bg-[#3498DB] text-white hover:bg-[#2980B9]">
              Create Account
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showAddContactDialog} onOpenChange={setShowAddContactDialog}>
        <DialogContent className="bg-[#FFFFFF]">
          <DialogHeader>
            <DialogTitle className="text-[#1F3A93]">Add New Contact</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-[#2C3E50]">Name</Label>
              <Input id="name" placeholder="Enter name" className="border-[#BDC3C7]" />
            </div>
            <div>
              <Label htmlFor="account" className="text-[#2C3E50]">Account</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-[#BDC3C7]">
                    {selectedAccount ?? "Select account"}
                    <Search className="ml-2 h-4 w-4 text-[#2C3E50]" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search accounts..." />
                    <CommandList>
                      <CommandEmpty>No account found.</CommandEmpty>
                      <CommandGroup>
                        {accounts.map((account) => (
                          <CommandItem
                            key={account.id}
                            onSelect={() => handleAccountSelect(account.name)}
                          >
                            {account.name}
                          </CommandItem>
                        ))}
                        <CommandItem onSelect={() => handleAccountSelect('create-new')}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create new account
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="class" className="text-[#2C3E50]">Class</Label>
              <Select>
                <SelectTrigger className="border-[#BDC3C7]">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="frequency" className="text-[#2C3E50]">Frequency</Label>
              <Input id="frequency" placeholder="Enter frequency" className="border-[#BDC3C7]" />
            </div>
            <div>
              <Label htmlFor="email" className="text-[#2C3E50]">Email</Label>
              <Input id="email" type="email" placeholder="Enter email" className="border-[#BDC3C7]" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-[#2C3E50]">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Enter phone number" className="border-[#BDC3C7]" />
            </div>
            <div>
              <Label htmlFor="area" className="text-[#2C3E50]">Area</Label>
              <Input id="area" placeholder="Enter area" className="border-[#BDC3C7]" />
            </div>
            <Button type="submit" className="bg-[#3498DB] text-white hover:bg-[#2980B9]">Add Contact</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showEndJourneyDialog} onOpenChange={setShowEndJourneyDialog}>
        <DialogContent className="bg-[#FFFFFF]">
          <DialogHeader>
            <DialogTitle className="text-[#1F3A93]">End Journey</DialogTitle>
          </DialogHeader>
          <p className="text-[#2C3E50]">Are you sure you want to end the journey?</p>
          <DialogFooter>
            <Button variant="outline" onClick={cancelEndJourney} className="bg-[#BDC3C7] text-[#2C3E50] hover:bg-[#95A5A6]">Cancel</Button>
            <Button variant="destructive" onClick={confirmEndJourney} className="bg-[#E74C3C] text-white hover:bg-[#C0392B]">End Journey</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
