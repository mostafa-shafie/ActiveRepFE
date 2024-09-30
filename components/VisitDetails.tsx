'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Briefcase, User, MapPin, Phone, Mail, Calendar, Play, StopCircle, X, Plus, Minus, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

// Sample data for the doctor's details
const doctorDetails = {
  id: '1',
  name: "Dr. Jane Smith",
  specialty: "Cardiologist",
  hospital: "Heart Care Center",
  address: "123 Medical Lane, Healthville, HC 12345",
  phone: "+1 (555) 123-4567",
  email: "dr.smith@heartcare.com",
  lastVisit: "2023-05-15",
  potential: "A",
  frequencyAchieved: "3/4"
}

// Updated cycle plan data
const cyclePlan = {
  visitNumber: 1,
  products: [
    { 
      id: 1, 
      name: "P1: IT", 
      marketingMessage: [
        "Start with Chadi (P 27) newly diagnosed infant, discuss Mom-Dr need, recap and share the solution (p 22-23-24)",
        "Close on the same pt leveraging Novalac IT features & benefits (P 40)"
      ]
    },
    { 
      id: 2, 
      name: "P2: AD", 
      marketingMessage: ["Novalac AD features and benefits"]
    },
    { 
      id: 3, 
      name: "P3: Allernova", 
      marketingMessage: ["Novalac Allernova features and benefits"]
    }
  ]
}

// Sample data for additional visitors
const additionalVisitorOptions = [
  { id: 1, name: "Dani abi harab" },
  { id: 2, name: "Peggy nehme" },
  { id: 3, name: "John Doe" },
  { id: 4, name: "Jane Doe" }
]

// Sample data for product samples
const productSamples = [
  { id: 1, name: "Novalac IT" },
  { id: 2, name: "Novalac AD" },
  { id: 3, name: "Novalac Allernova" },
  { id: 4, name: "Novalac AR" },
]

// All products for the "All Detailers" popup
const allProducts = [
  { id: 1, name: "Novalac IT" },
  { id: 2, name: "Novalac AD" },
  { id: 3, name: "Novalac Allernova" },
  { id: 4, name: "Novalac AR" },
  { id: 5, name: "Novalac AC" },
  { id: 6, name: "Novalac HA" },
]

export default function VisitDetails({ visitId }: { visitId: string }) {
  const [selectedDetailers, setSelectedDetailers] = useState<{[key: string]: 'targeted' | 'full' | null}>({})
  const [isVisitStarted, setIsVisitStarted] = useState(false)
  const [isDoubleVisit, setIsDoubleVisit] = useState(false)
  const [additionalVisitors, setAdditionalVisitors] = useState<string[]>([])
  const [distributedSamples, setDistributedSamples] = useState(false)
  const [sampleQuantities, setSampleQuantities] = useState<{[key: string]: number}>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [savedSampleQuantities, setSavedSampleQuantities] = useState<{[key: string]: number}>({})
  const [isAllDetailersDialogOpen, setIsAllDetailersDialogOpen] = useState(false)

  const handleDetailerSelection = (productId: number, type: 'targeted' | 'full') => {
    setSelectedDetailers(prev => ({
      ...prev,
      [productId]: type
    }))
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Detailer Selected`,
      description: `You've selected the ${type} detailer for product ${allProducts.find(p => p.id === productId)?.name}.`,
    })
  }

  const handleStartVisit = () => {
    setIsVisitStarted(true)
    toast({
      title: "Visit Started",
      description: `You've started the visit with ${doctorDetails.name}.`,
    })
  }

  const handleEndVisit = () => {
    setIsVisitStarted(false)
    toast({
      title: "Visit Ended",
      description: `You've ended the visit with ${doctorDetails.name}.`,
    })
  }

  const handleAdditionalVisitorChange = (visitorName: string) => {
    setAdditionalVisitors(prev => 
      prev.includes(visitorName)
        ? prev.filter(v => v !== visitorName)
        : [...prev, visitorName]
    )
  }

  const removeAdditionalVisitor = (visitorName: string) => {
    setAdditionalVisitors(prev => prev.filter(v => v !== visitorName))
  }

  const handleSampleQuantityChange = (productId: number, change: number) => {
    setSampleQuantities(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) + change, 0)
    }))
  }

  const handleDistributedSamplesChange = (checked: boolean) => {
    setDistributedSamples(checked)
    if (checked && Object.keys(savedSampleQuantities).length === 0) {
      setIsDialogOpen(true)
    } else if (!checked) {
      setSampleQuantities({})
      setSavedSampleQuantities({})
    }
  }

  const handleSaveSamples = () => {
    setSavedSampleQuantities(sampleQuantities)
    setIsDialogOpen(false)
    toast({
      title: "Samples Saved",
      description: "The distributed samples have been saved.",
    })
  }

  const handleEditSamples = () => {
    setSampleQuantities(savedSampleQuantities)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF]">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-[#BDC3C7] bg-[#1F3A93] text-white">
        <Link href="/your-journey" className="font-bold text-lg flex items-center hover:text-[#3498DB]">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Journey
        </Link>
      </header>
      <main className="flex-1 py-6 px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Visit Details</h1>
          <Button onClick={handleStartVisit} disabled={isVisitStarted} className="bg-[#1F3A93] hover:bg-[#3498DB]">
            <Play className="h-4 w-4 mr-2" />
            Start Visit
          </Button>
        </div>
        
        <Card className="mb-6 bg-[#F2F1EF] border-[#BDC3C7]">
          <CardContent className="pt-6">
            <h2 className="text-3xl font-bold mb-1 text-center text-[#1F3A93]">{doctorDetails.name}</h2>
            <p className="text-xl text-center text-[#3498DB] mb-4">{doctorDetails.specialty}</p>
            <div className="flex justify-center space-x-4 mb-4">
              <Badge variant="secondary" className="text-lg py-1 px-3 bg-[#3498DB] text-white">
                Frequency Achieved: {doctorDetails.frequencyAchieved}
              </Badge>
              <Badge variant="secondary" className="text-lg py-1 px-3 bg-[#3498DB] text-white">
                Last Visited: {doctorDetails.lastVisit}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-[#2C3E50]">
              <div>
                <p className="flex items-center mt-2">
                  <Briefcase className="h-4 w-4 mr-2 text-[#3498DB]" />
                  {doctorDetails.hospital}
                </p>
                <p className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 mr-2 text-[#3498DB]" />
                  {doctorDetails.address}
                </p>
              </div>
              <div>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-[#3498DB]" />
                  {doctorDetails.phone}
                </p>
                <p className="flex items-center mt-2">
                  <Mail className="h-4 w-4 mr-2 text-[#3498DB]" />
                  {doctorDetails.email}
                </p>
                <p className="flex items-center mt-2">
                  <User className="h-4 w-4 mr-2 text-[#3498DB]" />
                  Potential: {doctorDetails.potential}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white border-[#BDC3C7]">
          <CardHeader>
            <CardTitle className="text-[#1F3A93]">Cycle Plan - Visit {cyclePlan.visitNumber}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F2F1EF]">
                  <TableHead className="text-[#2C3E50]">Product</TableHead>
                  <TableHead className="text-[#2C3E50]">Marketing Message</TableHead>
                  <TableHead className="text-[#2C3E50]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cyclePlan.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-[#2C3E50]">{product.name}</TableCell>
                    <TableCell className="text-[#2C3E50]">
                      <ul className="list-disc pl-5">
                        {product.marketingMessage.map((message, index) => (
                          <li key={index}>{message}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant={selectedDetailers[product.id] === 'targeted' ? 'default' : 'outline'}
                          onClick={() => handleDetailerSelection(product.id, 'targeted')}
                          className={selectedDetailers[product.id] === 'targeted' ? 'bg-[#1F3A93] text-white' : 'text-[#1F3A93] border-[#1F3A93]'}
                        >
                          Targeted Detailer
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedDetailers[product.id] === 'full' ? 'default' : 'outline'}
                          onClick={() => handleDetailerSelection(product.id, 'full')}
                          className={selectedDetailers[product.id] === 'full' ? 'bg-[#1F3A93] text-white' : 'text-[#1F3A93] border-[#1F3A93]'}
                        >
                          Full Detailer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsAllDetailersDialogOpen(true)} className="bg-[#1F3A93] hover:bg-[#3498DB] text-white">
                All Detailers
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dialog for All Detailers */}
        <Dialog open={isAllDetailersDialogOpen} onOpenChange={setIsAllDetailersDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#1F3A93]">All Detailers</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {allProducts.map((product) => (
                <div key={product.id} className="flex flex-col space-y-2">
                  <span className="text-[#2C3E50] font-semibold">{product.name}</span>
                  <Button 
                    size="sm" 
                    variant={selectedDetailers[product.id] === 'full' ? 'default' : 'outline'}
                    onClick={() => handleDetailerSelection(product.id, 'full')}
                    className={selectedDetailers[product.id] === 'full' ? 'bg-[#1F3A93] text-white' : 'text-[#1F3A93] border-[#1F3A93]'}
                  >
                    Full Detailer
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsAllDetailersDialogOpen(false)} className="bg-[#1F3A93] hover:bg-[#3498DB] text-white">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col items-start space-y-4 mt-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="double-visit"
              checked={isDoubleVisit}
              onCheckedChange={(checked) => setIsDoubleVisit(checked === true)}
              className="border-[#3498DB] text-[#3498DB]"
            />
            <Label htmlFor="double-visit" className="text-[#2C3E50]">Is this a double visit?</Label>
          </div>
          
          {isDoubleVisit && (
            <div className="space-y-2">
              <Label className="text-[#2C3E50]">Additional Visitors:</Label>
              <div className="flex items-center space-x-2">
                <Select
                  onValueChange={handleAdditionalVisitorChange}
                >
                  <SelectTrigger className="w-[200px] border-[#BDC3C7]">
                    <SelectValue placeholder="Select visitors" />
                  </SelectTrigger>
                  <SelectContent>
                    {additionalVisitorOptions.map((visitor) => (
                      <SelectItem key={visitor.id} value={visitor.name}>
                        {visitor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {additionalVisitors.map((visitor) => (
                  <Badge key={visitor} variant="secondary" className="flex items-center space-x-1 bg-[#3498DB] text-white">
                    <span>{visitor}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-auto p-0 text-white hover:text-[#1F3A93]"
                      onClick={() => removeAdditionalVisitor(visitor)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="distributed-samples"
              checked={distributedSamples}
              onCheckedChange={(checked) => handleDistributedSamplesChange(checked === true)}
              className="border-[#3498DB] text-[#3498DB]"
            />
            <Label htmlFor="distributed-samples" className="text-[#2C3E50]">Did you distribute samples?</Label>
          </div>

          {distributedSamples && Object.keys(savedSampleQuantities).length > 0 && (
            <div className="mt-2 p-4 bg-[#F2F1EF] rounded-md w-full">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[#1F3A93]">Distributed Samples Summary</h3>
                <Button variant="ghost" size="sm" onClick={handleEditSamples} className="text-[#3498DB] hover:text-[#1F3A93]">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              <ul className="text-[#2C3E50]">
                {Object.entries(savedSampleQuantities).map(([productId, quantity]) => {
                  if (quantity > 0) {
                    const product = productSamples.find(p => p.id === parseInt(productId))
                    return (
                      <li key={productId}>
                        {product?.name}: {quantity}
                      </li>
                    )
                  }
                  return null
                })}
              </ul>
            </div>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#1F3A93]">Distributed Samples</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {productSamples.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <span className="text-[#2C3E50]">{product.name}</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSampleQuantityChange(product.id, -1)}
                        className="border-[#3498DB] text-[#3498DB]"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={sampleQuantities[product.id] || 0}
                        onChange={(e) => handleSampleQuantityChange(product.id, parseInt(e.target.value) - (sampleQuantities[product.id] || 0))}
                        className="w-16 text-center border-[#BDC3C7]"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSampleQuantityChange(product.id, 1)}
                        className="border-[#3498DB] text-[#3498DB]"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={handleSaveSamples} className="bg-[#27AE60] hover:bg-[#2ECC71] text-white">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={handleEndVisit} disabled={!isVisitStarted} className="bg-[#E74C3C] hover:bg-[#C0392B] text-white">
            <StopCircle className="h-4 w-4 mr-2" />
            End Visit
          </Button>
        </div>
      </main>
    </div>
  )
}
