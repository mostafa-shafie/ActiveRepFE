import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CoachingReport() {
  const totalScore = 33

  const handleAccept = () => {
    toast({
      title: "Coaching Report Accepted",
      description: "The coaching report has been successfully submitted.",
    })
  }

  const SkillTable = ({ title, skills }: { title: string, skills: { name: string, rating: string, comment: string }[] }) => (
    <Card className="mb-6 border-[#BDC3C7]">
      <CardHeader className="bg-[#1F3A93] text-white">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F2F1EF]">
              <TableHead className="w-[40%] text-[#2C3E50]">Skill</TableHead>
              <TableHead className="w-[20%] text-[#2C3E50]">Rating</TableHead>
              <TableHead className="w-[40%] text-[#2C3E50]">Justification / Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill, index) => (
              <TableRow key={index} className="border-b border-[#BDC3C7]">
                <TableCell className="text-[#2C3E50]">{skill.name}</TableCell>
                <TableCell className="text-[#2C3E50]">{skill.rating}</TableCell>
                <TableCell className="text-[#2C3E50]">{skill.comment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  const sellingSkills = [
    { name: "Opening: State the purpose, value to customer & check the acceptance", rating: "3", comment: "Excellent opening, clearly stated purpose and value" },
    { name: "Probing: Use an open and close probes", rating: "2", comment: "Good use of probes, but could improve on follow-up questions" },
    { name: "Supporting: Acknowledge the needs, elaborate benefits & check for acceptance", rating: "3", comment: "Very well done, thoroughly addressed customer needs" },
    { name: "Handling objections: Use the 4 A steps: Acknowledge, Assess, Address, Advance", rating: "2", comment: "Handled objections well, but missed some opportunities to advance" },
    { name: "Closing: Summarize & ask for commitment", rating: "3", comment: "Strong closing, effectively summarized and secured commitment" }
  ]

  const pciSkills = [
    { name: "Open the Call with patient profile", rating: "3", comment: "Excellent use of patient profile to open the call" },
    { name: "Establish Patient's needs", rating: "2", comment: "Good identification of needs, but could dig deeper" },
    { name: "Establish Doctor's needs", rating: "3", comment: "Very thorough in establishing doctor's needs" },
    { name: "Deliver a Tailored Solution", rating: "2", comment: "Solution was tailored, but could be more specific" },
    { name: "Repeat the product name at least 10 times", rating: "3", comment: "Effectively repeated product name throughout the call" }
  ]

  const communicationSkills = [
    { name: "Listening skill", rating: "3", comment: "Excellent active listening demonstrated" },
    { name: "Tone of voice", rating: "2", comment: "Good tone, but could vary for emphasis" },
    { name: "Body language: posture, hands use", rating: "3", comment: "Very good body language, open and engaging" },
    { name: "Eye contact", rating: "3", comment: "Maintained strong eye contact throughout" }
  ]

  const marketingSkills = [
    { name: "Effective use of promotional materials", rating: "2", comment: "Good use of materials, but could be more strategic" },
    { name: "Delivery of marketing messages", rating: "3", comment: "Excellent delivery of key marketing messages" }
  ]

  return (
    <div className="min-h-screen bg-[#F2F1EF]">
      <header className="bg-[#1F3A93] text-white p-4">
        <Link href="/" className="inline-flex items-center text-white hover:text-[#3498DB] transition-colors">
          <ArrowLeft className="mr-2" />
          Back to Active Rep
        </Link>
      </header>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-[#1F3A93]">Coaching Report</h1>
        <h2 className="text-xl mb-6 text-center text-[#2C3E50]">Manager: Dani abi Harab</h2>

        <SkillTable title="Selling Skills" skills={sellingSkills} />
        <SkillTable title="PCI Skills" skills={pciSkills} />
        <SkillTable title="Communication Skills" skills={communicationSkills} />

        <Card className="mb-6 border-[#BDC3C7]">
          <CardHeader className="bg-[#1F3A93] text-white">
            <CardTitle>Marketing/Product Message</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F2F1EF]">
                  <TableHead className="w-[40%] text-[#2C3E50]">Skill</TableHead>
                  <TableHead className="w-[20%] text-[#2C3E50]">Rating</TableHead>
                  <TableHead className="w-[40%] text-[#2C3E50]">Justification / Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketingSkills.map((skill, index) => (
                  <TableRow key={index} className="border-b border-[#BDC3C7]">
                    <TableCell className="text-[#2C3E50]">{skill.name}</TableCell>
                    <TableCell className="text-[#2C3E50]">{skill.rating}</TableCell>
                    <TableCell className="text-[#2C3E50]">{skill.comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mb-6 border-[#BDC3C7]">
          <CardContent className="flex justify-between items-center py-4">
            <CardTitle className="text-[#1F3A93]">Total Score</CardTitle>
            <div className="text-2xl font-bold text-[#27AE60]">{totalScore}</div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={handleAccept} className="bg-[#27AE60] hover:bg-[#2ECC71] text-white font-bold py-2 px-4 rounded">
            Accept Coaching Report
          </Button>
        </div>
      </div>
    </div>
  )
}