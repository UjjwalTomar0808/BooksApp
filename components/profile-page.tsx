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
  websites?: string[]
  customFields?: Array<{
    field: string
    value: string
  }>
  capabilities?: Array<{
    name: string
    enabled: boolean
  }>
  availability?: {
    days: Array<{
      name: string
      enabled: boolean
    }>
    hours: Array<{
      name: string
      enabled: boolean
    }>
    notes?: string
  }
  documentLinks?: Array<{
    documentType: string
    url: string
    description: string
  }>
  serviceableAreas?: Array<{
    completeAddress: string
    city: string
    area: string
  }>
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
      console.log(" Making API call to fetch user profile...")

      const response = await fetch("https://api.thenotary.app/directory/getUserDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "nandhakumar1411",
        }),
      })

      console.log(" API Response status:", response.status)

      if (!response.ok) {
        throw new Error(`Failed to fetch profile data: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log(" API Response data:", data)

      const userDirectory = data.userDirectory
      const userId = userDirectory?.userId

      const mappedProfile: UserProfile = {
        name: userId?.fullName || "Unknown",
        firstName: userId?.fullName?.split(" ")[0] || "",
        lastName: userId?.fullName?.split(" ").slice(1).join(" ") || "",
        companyName: userId?.businessInfo?.businessName || "",
        businessSince: "01/17/2006", // Default value as shown in original
        profileImage: userId?.photoURL,
        introduction:
          userId?.bio ||
          "I am a qualified notary signing agent since 2006 and Fidelity approved subcontractor. I have the capability, knowledge and experience required to execute your documents with the highest level of expertise and care, and represent you to your clients with the utmost professionalism, leaving the client comfortable and satisfied with their experience. I have closed thousands of loans and real estate transactions. I specialize in refinances, purchases, equity lines of credit, seller transactions, construction & commercial loans, reverse mortgages, as well as estate planning and trust documents, serving San Francisco county, San Mateo county (1,000,000 thru Travelers Ins. Fees are negotiated at time of service request. Name office equipped with two HP state of the art dual tray laser printers and scanners. Experience the difference and thank you for calling on me! Email me at notary@signingagent.com",
        email: userId?.email,
        workEmail: userId?.email,
        phone: userId?.phoneNumber?.toString(),
        mobile: userId?.phoneNumber?.toString(),
        office: userId?.phoneNumber?.toString(),
        home: userId?.phoneNumber?.toString(),
        alternate: userId?.phoneNumber?.toString(),
        billingAddress: userDirectory?.billingAddress,
        shippingAddress: userDirectory?.shippingAddress,
        licenses: userDirectory?.commisionDetails
          ? [
              {
                state: userDirectory.commisionDetails.commissionedState || "CA",
                commissionNumber: userDirectory.commisionDetails.commissionNo,
                expiration: new Date(userDirectory.commisionDetails.expiryOn).toLocaleDateString(),
              },
            ]
          : [],
        insurances: userDirectory?.insuranceCheck
          ? [
              {
                carrier: userDirectory.insuranceCheck.insurerName,
                amount: `$${userDirectory.insuranceCheck.insuredAmount}`,
              },
            ]
          : [],
        backgroundChecks: userDirectory?.backgroundCheck
          ? [
              {
                provider: userDirectory.backgroundCheck.name,
                conducted: new Date(userDirectory.backgroundCheck.startDate).toLocaleDateString(),
                expiration: new Date(userDirectory.backgroundCheck.expiryOn).toLocaleDateString(),
                referenceNumber: "1790615",
              },
            ]
          : [],
        pricing:
          userDirectory?.fullServices?.map((service) => ({
            description: service.name,
            amount: Number.parseFloat(service.cost),
          })) || [],
        languages: userDirectory?.spokenLanguages || [],
        websites: userDirectory?.websites || [],
        customFields: userDirectory?.customFields
          ? Object.entries(userDirectory.customFields).map(([key, value]) => ({
              field: key,
              value: value as string,
            }))
          : [],
        capabilities: userDirectory?.capabilities
          ? Object.entries(userDirectory.capabilities).map(([key, value]) => ({
              name: key.toUpperCase(),
              enabled: value as boolean,
            }))
          : [],
        availability: {
          days: [
            { name: "Mon", enabled: userDirectory?.availability?.monday || false },
            { name: "Tue", enabled: userDirectory?.availability?.tuesday || false },
            { name: "Wed", enabled: userDirectory?.availability?.wednesday || false },
            { name: "Thu", enabled: userDirectory?.availability?.thursday || false },
            { name: "Fri", enabled: userDirectory?.availability?.friday || false },
            { name: "Sat", enabled: userDirectory?.availability?.saturday || false },
            { name: "Sun", enabled: userDirectory?.availability?.sunday || false },
          ],
          hours: [
            { name: "AM", enabled: userDirectory?.availability?.am || false },
            { name: "PM", enabled: userDirectory?.availability?.pm || false },
          ],
          notes: "Weekdays Mon-Fri 10 AM-6 PM",
        },
        documentLinks: userDirectory?.documentLinks || [],
        serviceableAreas: userDirectory?.serviceableAreas || [],
      }

      setProfile(mappedProfile)
      console.log(" Profile mapped successfully:", mappedProfile)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching profile data"
      console.error(" Error fetching profile:", err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = () => {
    console.log(" Sending email:", emailForm)
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
      {/* Header Section */}
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
                <p className="text-sm leading-relaxed text-white/90">{profile.introduction}</p>
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
                <p className="text-sm">{profile.businessSince}</p>
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
                { type: "Office", number: profile.office || "N/A" },
                { type: "Mobile", number: profile.mobile || "N/A" },
                { type: "Home", number: profile.home || "N/A" },
                { type: "Alternate", number: profile.alternate || "N/A" },
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
                <p className="text-xs text-gray-500">Text me @ {profile.mobile || "N/A"}</p>
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
                <p className="text-sm">{profile.billingAddress?.address1 || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Address 2:</label>
                <p className="text-sm">{profile.billingAddress?.address2 || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">City:</label>
                <p className="text-sm">{profile.billingAddress?.city || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">State:</label>
                <p className="text-sm">{profile.billingAddress?.state || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Zip:</label>
                <p className="text-sm">{profile.billingAddress?.zip || "N/A"}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Shipping Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Shipping</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="space-y-3 py-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Address 1:</label>
                <p className="text-sm">{profile.shippingAddress?.address1 || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Address 2:</label>
                <p className="text-sm">{profile.shippingAddress?.address2 || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">City:</label>
                <p className="text-sm">{profile.shippingAddress?.city || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">State:</label>
                <p className="text-sm">{profile.shippingAddress?.state || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Zip:</label>
                <p className="text-sm">{profile.shippingAddress?.zip || "N/A"}</p>
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
                <span className="text-sm">{profile.workEmail || "N/A"}</span>
                <Checkbox defaultChecked />
              </div>
            </div>
          </div>
        </Card>

        {/* Document Links Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <Link className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Document Links</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="py-4">
              {profile.documentLinks && profile.documentLinks.length > 0 ? (
                profile.documentLinks.map((doc, index) => (
                  <div key={index} className="space-y-2 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Document Type:</label>
                      <p className="text-sm">{doc.documentType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Description:</label>
                      <p className="text-sm">{doc.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500">No profile data available</p>
              )}
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
              {profile.licenses && profile.licenses.length > 0 ? (
                profile.licenses.map((license, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center">
                    <span className="text-sm font-medium">{license.state}</span>
                    <span className="text-sm">{license.commissionNumber || "N/A"}</span>
                    <span className="text-sm">{license.expiration}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500">No profile data available</p>
              )}
            </div>
          </div>
        </Card>

        {/* Insurances Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Insurances</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <span className="text-sm font-medium text-gray-600">Carrier and Amount</span>
                <span className="text-sm font-medium text-gray-600"></span>
              </div>
              {profile.insurances && profile.insurances.length > 0 ? (
                profile.insurances.map((insurance, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mb-2">
                    <span className="text-sm">
                      {insurance.carrier} - {insurance.amount}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500">No profile data available</p>
              )}
            </div>
          </div>
        </Card>

        {/* Background Checks Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Background Checks</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="py-4">
              <div className="grid grid-cols-4 gap-4 mb-2">
                <span className="text-sm font-medium text-gray-600">Provider</span>
                <span className="text-sm font-medium text-gray-600">Conducted</span>
                <span className="text-sm font-medium text-gray-600">Expiration</span>
                <span className="text-sm font-medium text-gray-600">Ref #</span>
              </div>
              {profile.backgroundChecks && profile.backgroundChecks.length > 0 ? (
                profile.backgroundChecks.map((check, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 mb-2">
                    <span className="text-sm">{check.provider}</span>
                    <span className="text-sm">{check.conducted}</span>
                    <span className="text-sm">{check.expiration}</span>
                    <span className="text-sm">{check.referenceNumber}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500">No profile data available</p>
              )}
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
              {profile.pricing && profile.pricing.length > 0 ? (
                profile.pricing.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 items-center">
                    <span className="text-sm">{item.description}</span>
                    <span className="text-sm font-medium">${item.amount.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500">No profile data available</p>
              )}
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

        {/* Spoken Languages Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Spoken Languages</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="py-4">
              {profile.languages && profile.languages.length > 0 ? (
                <div className="space-y-2">
                  {profile.languages.map((language, index) => (
                    <p key={index} className="text-sm">
                      {language}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-center text-gray-500">No profile data available</p>
              )}
            </div>
          </div>
        </Card>

        {/* Websites Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <Link className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Websites</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="py-4">
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-600">URL</span>
              </div>
              {profile.websites && profile.websites.length > 0 ? (
                profile.websites.map((website, index) => (
                  <div key={index} className="mb-2">
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {website}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500">No profile data available</p>
              )}
            </div>
          </div>
        </Card>

        {/* Custom Fields Section */}
        <Card>
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-teal-600" />
              <span className="font-semibold text-teal-600">Custom Fields</span>
            </div>
          </div>
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="py-4">
              {profile.customFields && profile.customFields.length > 0 ? (
                profile.customFields.map((field, index) => (
                  <div key={index} className="mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Custom Field {index + 1}:</label>
                      <p className="text-sm">{field.value}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500">No profile data available</p>
              )}
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
              {profile.capabilities && profile.capabilities.length > 0 ? (
                profile.capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox defaultChecked={capability.enabled} />
                    <span className="text-xs">{capability.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500 col-span-3">No profile data available</p>
              )}
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
                {profile.availability?.days.map((day, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox defaultChecked={day.enabled} />
                    <span className="text-sm">{day.name}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {profile.availability?.hours.map((hour, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox defaultChecked={hour.enabled} />
                    <span className="text-sm">{hour.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-600">Other Availability Information</p>
                <p className="text-xs text-gray-500">{profile.availability?.notes}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
