"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Phone, MapPin, Shield, User, CreditCard, Link, Settings, Calendar, Send } from "lucide-react"

interface UserProfile {
  name?: string
  firstName?: string
  lastName?: string
  companyName?: string
  businessSince?: string
  profileImage?: string
  introduction?: string
  bio?: string
  email?: string
  workEmail?: string
  phone?: string
  mobile?: string
  office?: string
  home?: string
  alternate?: string
  billingAddress?: {
    address1?: string
    address2?: string
    city?: string
    state?: string
    zip?: string
  }
  shippingAddress?: {
    address1?: string
    address2?: string
    city?: string
    state?: string
    zip?: string
  }
  licenses?: Array<{
    state: string
    commissionNumber?: string
    expiration: string
  }>
  insurances?: Array<{
    carrier: string
    amount: string
  }>
  backgroundChecks?: Array<{
    provider: string
    conducted: string
    expiration: string
    referenceNumber: string
  }>
  pricing?: Array<{
    description: string
    amount: number
  }>
  languages?: string[]
  websites?: Array<{
    url: string
  }>
  customFields?: Array<{
    field: string
    value: string
  }>
  capabilities?: string[]
  availability?: {
    days: string[]
    hours: string
    notes?: string
  }
}

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [emailForm, setEmailForm] = useState({ name: "", email: "", message: "" })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://api.thenotary.app/directory/getUserDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "nandhakumar1411",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile data")
      }

      const data = await response.json()
      console.log("[v0] API Response:", data)
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching profile:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = () => {
    console.log("[v0] Sending email:", emailForm)
    // Email sending logic would go here
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading profile: {error}</p>
              <Button onClick={fetchUserProfile}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No profile data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const fullName = profile.name || `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "Unknown"

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-32 w-32 mx-auto md:mx-0 border-4 border-white/20">
                <AvatarImage src={profile.profileImage || "/placeholder.svg?height=128&width=128"} alt={fullName} />
                <AvatarFallback className="text-2xl bg-teal-700 text-white">
                  {fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-3xl font-bold">{fullName}</h1>
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-2 py-1">HOT</Badge>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Professional Introduction & Experience</h3>
                <p className="text-sm leading-relaxed text-white/90">
                  {profile.introduction ||
                    profile.bio ||
                    "I am a qualified notary signing agent since 2006 and Fidelity approved subcontractor. I have the capability, knowledge and experience required to execute your documents with the highest level of expertise and care, and represent you to your clients with the utmost professionalism, leaving the client comfortable and satisfied with their experience. I have closed thousands of loans and real estate transactions. I specialize in refinances, purchases, equity lines of credit, seller transactions, construction & commercial loans, reverse mortgages, as well as estate planning and trust documents, serving San Francisco county, San Mateo county (1,000,000 thru Travelers Ins. Fees are negotiated at time of service request. Name office equipped with two HP state of the art dual tray laser printers and scanners. Experience the difference and thank you for calling on me! Email me at notary@signingagent.com"}
                </p>
              </div>

              <div className="bg-teal-700/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Send className="h-5 w-5" />
                  <span className="font-semibold">Send an E-mail</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Name"
                      value={emailForm.name}
                      onChange={(e) => setEmailForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="E-mail (Yours)"
                      type="email"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Textarea
                      placeholder="Your Message"
                      value={emailForm.message}
                      onChange={(e) => setEmailForm((prev) => ({ ...prev, message: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/70 min-h-[80px]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button onClick={handleSendEmail} className="bg-teal-800 hover:bg-teal-900 text-white px-8">
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Name & Company Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Name & Company</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name:</label>
                <p className="text-sm">{fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Company Name:</label>
                <p className="text-sm">{profile.companyName || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">In Business Since:</label>
                <p className="text-sm">{profile.businessSince || "01/17/2006"}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Phone Numbers Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Phone Numbers</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="space-y-3 py-4">
              <div className="grid grid-cols-4 gap-4 mb-2">
                <span className="text-sm font-medium text-gray-600">Type</span>
                <span className="text-sm font-medium text-gray-600">Number</span>
                <span className="text-sm font-medium text-gray-600">Ext.</span>
                <span className="text-sm font-medium text-gray-600">Pref./Text</span>
              </div>
              {[
                { type: "Office", number: profile.office || "415 730-8955" },
                { type: "Mobile", number: profile.mobile || "415 730-8955" },
                { type: "Home", number: profile.home || "415 730-8955" },
                { type: "Alternate", number: profile.alternate || "415 730-8955" },
              ].map((phone, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-center">
                  <span className="text-sm font-medium">{phone.type}</span>
                  <span className="text-sm">{phone.number}</span>
                  <Checkbox />
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <Checkbox />
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-600">Other Contact Info</p>
                <p className="text-xs text-gray-500">Text me @ 415 730-8955</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Billing Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Billing</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="space-y-3 py-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Address 1:</label>
                <p className="text-sm">{profile.billingAddress?.address1 || "480 Fillmore St., #2"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Address 2:</label>
                <p className="text-sm">{profile.billingAddress?.address2 || ""}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">City:</label>
                <p className="text-sm">{profile.billingAddress?.city || "San Francisco"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">State:</label>
                <p className="text-sm">{profile.billingAddress?.state || "CA"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Zip:</label>
                <p className="text-sm">{profile.billingAddress?.zip || "94117"}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Email Addresses Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Email Addresses</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="py-4">
              <div className="grid grid-cols-3 gap-4 mb-2">
                <span className="text-sm font-medium text-gray-600">Type</span>
                <span className="text-sm font-medium text-gray-600">Address</span>
                <span className="text-sm font-medium text-gray-600">Preferred</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="text-sm font-medium">Work</span>
                <span className="text-sm">{profile.workEmail || profile.email || "notary@signingagent.com"}</span>
                <Checkbox defaultChecked />
              </div>
            </div>
          </div>
        </Card>

        {/* State Licenses Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">State Licenses</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="py-4">
              <div className="grid grid-cols-3 gap-4 mb-2">
                <span className="text-sm font-medium text-gray-600">State</span>
                <span className="text-sm font-medium text-gray-600">Comm.#</span>
                <span className="text-sm font-medium text-gray-600">Expiration</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="text-sm font-medium">CA</span>
                <span className="text-sm">2188826</span>
                <span className="text-sm">02/04/2026</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Pricing Information Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Pricing Information</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="py-4 space-y-2">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <span className="text-sm font-medium text-gray-600">Description</span>
                <span className="text-sm font-medium text-gray-600">Amount</span>
              </div>
              {[
                { description: "1. Single loan refi w/edocs", amount: "$125.00" },
                { description: "2. Single loan refi w/overnight docs", amount: "$100.00" },
                { description: "3. Seller edocs", amount: "$100.00" },
                { description: "4. Reverse Mortgage", amount: "$150.00" },
                { description: "5. Scan-backs +$25.00", amount: "$25.00" },
                { description: "6. Reverse Mortgage w/edocs", amount: "$125.00" },
                { description: "7. HELOC w/edocs", amount: "$100.00" },
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 items-center">
                  <span className="text-sm">{item.description}</span>
                  <span className="text-sm font-medium">{item.amount}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-600">Other Pricing Notes</p>
                <p className="text-xs text-gray-500">
                  Rates are flexible and vary depending on distance and time of day. Rates may be renegotiated at time
                  of hiring.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Capabilities Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Capabilities</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="py-4 grid grid-cols-3 gap-4">
              {[
                "CSA",
                "Attorney",
                "Fax",
                "Email",
                "Internet",
                "Laser Printer",
                "Notarizer",
                "Mobile Hotspot",
                "E-sign",
                "24 Hour Service",
                "Fingerprinting",
                "Weddings",
                "Hospital Signing",
                "Jail Signings",
                "Escrow/Fax (FPN)",
                "RON Capable",
              ].map((capability, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox
                    defaultChecked={[
                      "CSA",
                      "Email",
                      "Internet",
                      "Laser Printer",
                      "Fingerprinting",
                      "Weddings",
                    ].includes(capability)}
                  />
                  <span className="text-xs">{capability}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="text-xs text-gray-600">Other Capability Information</p>
              <p className="text-xs text-gray-500">Two HP Dual tray laser printers and scanners</p>
            </div>
          </div>
        </Card>

        {/* Availability Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Availability</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {["Mon", "Tue", "Wed", "Thu"].map((day, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox defaultChecked />
                    <span className="text-sm">{day}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {["Fri", "Sat", "Sun"].map((day, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox defaultChecked={day !== "Sun"} />
                    <span className="text-sm">{day}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked />
                  <span className="text-sm">AM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked />
                  <span className="text-sm">PM</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-600">Other Availability Information</p>
                <p className="text-xs text-gray-500">Weekdays Mon-Fri 10 AM-6 PM</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional sections with "No profile data available" */}
        {["Document Links", "Insurances", "Background Checks", "Spoken Languages", "Websites", "Custom Fields"].map(
          (sectionName, index) => (
            <Card key={index}>
              <div className="flex items-center justify-between p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <Link className="h-5 w-5 text-teal-600" />
                  <span className="font-semibold text-teal-600">{sectionName}</span>
                </div>
              </div>
              <div className="px-4 pb-4 border-t bg-gray-50">
                <div className="py-4">
                  <p className="text-sm text-center text-gray-500">No profile data available</p>
                </div>
              </div>
            </Card>
          ),
        )}
      </div>
    </div>
  )
}
