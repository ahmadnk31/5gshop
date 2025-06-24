import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Scale, 
  AlertTriangle, 
  Clock,
  User,
  CreditCard,
  Shield,
  Phone,
  Mail,
  CheckCircle,
  XCircle
} from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  const lastUpdated = "June 22, 2025";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Scale className="h-12 w-12 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Terms of Service
            </h1>
          </div>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            These terms govern your use of our device repair services and website. Please read them carefully before using our services.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              EU Law Compliant
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Last Updated: {lastUpdated}
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Business Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-6 w-6 mr-2" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Legal Entity:</h4>
                  <p>5gphones (5gphones fix Leuven)<br />
                     Belgian Business Registration</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Business Address:</h4>
                  <p>84A Bondgenotenlaan<br />
                     3000 Leuven, Belgium</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Contact Information:</h4>
                  <p>Email: info@5gphones.be<br />
                     Phone: +32 (466) 13 41 81</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">VAT Number:</h4>
                  <p>BE [VAT Number]<br />
                     (Required for EU business)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table of Contents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Table of Contents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-2">
                <a href="#acceptance" className="text-purple-600 hover:underline">1. Acceptance of Terms</a>
                <a href="#services" className="text-purple-600 hover:underline">2. Our Services</a>
                <a href="#user-obligations" className="text-purple-600 hover:underline">3. User Obligations</a>
                <a href="#pricing-payment" className="text-purple-600 hover:underline">4. Pricing & Payment</a>
                <a href="#warranties" className="text-purple-600 hover:underline">5. Warranties & Guarantees</a>
                <a href="#liability" className="text-purple-600 hover:underline">6. Limitation of Liability</a>
                <a href="#privacy" className="text-purple-600 hover:underline">7. Privacy & Data Protection</a>
                <a href="#intellectual-property" className="text-purple-600 hover:underline">8. Intellectual Property</a>
                <a href="#termination" className="text-purple-600 hover:underline">9. Termination</a>
                <a href="#dispute-resolution" className="text-purple-600 hover:underline">10. Dispute Resolution</a>
                <a href="#consumer-rights" className="text-purple-600 hover:underline">11. EU Consumer Rights</a>
                <a href="#governing-law" className="text-purple-600 hover:underline">12. Governing Law</a>
              </div>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <Card className="mb-8" id="acceptance">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-2" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  By accessing our website, using our services, or bringing your device for repair, you agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">What constitutes acceptance:</h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Visiting our website and continuing to browse</li>
                    <li>Creating an account or requesting a quote</li>
                    <li>Bringing a device for repair or purchasing accessories</li>
                    <li>Using any of our online or offline services</li>
                  </ul>
                </div>
                
                <p className="text-gray-700">
                  If you do not agree with these terms, you must not use our services. We recommend printing or saving a copy of these terms for your records.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Our Services */}
          <Card className="mb-8" id="services">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-6 w-6 mr-2" />
                2. Our Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Repair Services:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Screen replacement and display repairs</li>
                    <li>Battery replacement and power issues</li>
                    <li>Water damage assessment and repair</li>
                    <li>Software troubleshooting and updates</li>
                    <li>Component replacement and hardware fixes</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Additional Services:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Device accessories sales</li>
                    <li>Free diagnostic services</li>
                    <li>Device consultation and advice</li>
                    <li>Emergency repair services</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Service Limitations:</h4>
                      <p className="text-yellow-700">Some devices may be beyond repair due to age, damage extent, or parts availability. We will provide honest assessments and alternative solutions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Obligations */}
          <Card className="mb-8" id="user-obligations">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-6 w-6 mr-2" />
                3. User Obligations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">You Must:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Provide accurate information about your device and issues</li>
                    <li>Back up your data before repair (we're not responsible for data loss)</li>
                    <li>Remove personal information and disable security features</li>
                    <li>Pay for services according to agreed terms</li>
                    <li>Collect your device within 30 days of completion</li>
                    <li>Treat our staff and premises with respect</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">You Must Not:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Bring stolen or illegally obtained devices</li>
                    <li>Provide false information about device ownership</li>
                    <li>Interfere with our business operations</li>
                    <li>Use our services for illegal purposes</li>
                    <li>Attempt to access restricted areas or systems</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Data Backup Requirement:</h4>
                  <p className="text-red-700">You are solely responsible for backing up your data. We strongly recommend backing up all important data before any repair service.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Payment */}
          <Card className="mb-8" id="pricing-payment">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-6 w-6 mr-2" />
                4. Pricing & Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Pricing Policy:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>All prices include Belgian VAT (21%)</li>
                    <li>Quotes are valid for 30 days unless otherwise stated</li>
                    <li>Final prices may vary if additional issues are discovered</li>
                    <li>Emergency service carries a surcharge</li>
                    <li>Free diagnostic service (no repair obligation)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Payment Terms:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-green-600 mb-1">Accepted Methods:</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                        <li>Cash (EUR)</li>
                        <li>Credit/Debit Cards</li>
                        <li>Bank Transfer</li>
                        <li>Digital Payments (Apple Pay, Google Pay)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-600 mb-1">Payment Schedule:</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                        <li>Diagnostic: Free of charge</li>
                        <li>Repair: Payment upon completion</li>
                        <li>Parts: 50% deposit for expensive parts</li>
                        <li>Accessories: Payment at purchase</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">No Hidden Fees:</h4>
                  <p className="text-green-700">Our quotes include all costs. Any additional charges will be discussed and approved before proceeding.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warranties */}
          <Card className="mb-8" id="warranties">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                5. Warranties & Guarantees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Our Warranty Coverage:</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <span className="font-medium">Repair Workmanship</span>
                        <p className="text-sm text-gray-600">Defects in our repair work</p>
                      </div>
                      <Badge variant="outline">90 Days</Badge>
                    </div>
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <span className="font-medium">Replacement Parts</span>
                        <p className="text-sm text-gray-600">Manufacturing defects in new parts</p>
                      </div>
                      <Badge variant="outline">90 Days</Badge>
                    </div>
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <span className="font-medium">Accessories</span>
                        <p className="text-sm text-gray-600">Manufacturing defects in sold accessories</p>
                      </div>
                      <Badge variant="outline">1 Year</Badge>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">Diagnostic Service</span>
                        <p className="text-sm text-gray-600">Accuracy of diagnosis</p>
                      </div>
                      <Badge variant="outline">30 Days</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Warranty Exclusions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Physical damage after repair (drops, water damage, etc.)</li>
                    <li>Normal wear and tear</li>
                    <li>Damage from unauthorized repairs or modifications</li>
                    <li>Software issues not related to our repair</li>
                    <li>Pre-existing conditions not addressed in original repair</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Warranty Claims:</h4>
                  <p className="text-blue-700">Contact us within the warranty period with your receipt. We will repair or replace defective work/parts at no charge.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="mb-8" id="liability">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2" />
                6. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Our Liability is Limited to:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>The cost of the repair service provided</li>
                    <li>The value of replacement parts used</li>
                    <li>The purchase price of accessories sold</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">We Are Not Liable For:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Data loss or corruption (always back up your data)</li>
                    <li>Loss of use or business interruption</li>
                    <li>Consequential or indirect damages</li>
                    <li>Damage to third-party software or applications</li>
                    <li>Issues arising from device age or obsolescence</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800">EU Consumer Rights</h4>
                      <p className="text-orange-700">These limitations do not affect your statutory consumer rights under EU and Belgian law, including rights to refund, repair, or replacement for defective services.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="mb-8" id="privacy">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                7. Privacy & Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Your privacy is important to us. Our collection and use of personal data is governed by our 
                  <Link href="/privacy" className="text-blue-600 hover:underline ml-1">Privacy Policy</Link>, 
                  which complies with EU GDPR requirements.
                </p>
                
                <div>
                  <h4 className="font-semibold mb-2">Data We May Access During Repair:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Device information and settings (to perform repairs)</li>
                    <li>Basic functionality testing data</li>
                    <li>Software version and update status</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Our Privacy Commitments:</h4>
                  <ul className="list-disc list-inside space-y-1 text-green-700">
                    <li>We do not access personal files, photos, or messages</li>
                    <li>We do not install monitoring software</li>
                    <li>We delete any temporary files created during repair</li>
                    <li>We respect your privacy and confidentiality</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="mb-8" id="intellectual-property">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                8. Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Our Rights:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>All content on our website is protected by copyright</li>
                    <li>Our business name, logos, and branding are trademarks</li>
                    <li>Repair techniques and processes are our trade secrets</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Your Rights:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>You retain ownership of your device and data</li>
                    <li>We do not claim rights to your personal content</li>
                    <li>You may use our website for personal, non-commercial purposes</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Third-Party Rights:</h4>
                  <p className="text-gray-700">
                    We respect third-party intellectual property rights. Device manufacturers' trademarks 
                    are used for identification purposes only and do not imply endorsement or affiliation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EU Consumer Rights */}
          <Card className="mb-8" id="consumer-rights">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-6 w-6 mr-2" />
                11. EU Consumer Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Your Consumer Rights Under EU Law:</h4>
                  <p className="text-blue-700">
                    As a consumer in the EU, you have specific rights that cannot be limited by these terms. 
                    These include rights under the Consumer Sales and Guarantees Directive and national consumer protection laws.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Right of Withdrawal (Distance Sales):</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>14-day withdrawal period for online purchases</li>
                    <li>Right to cancel service contracts before work begins</li>
                    <li>Full refund if withdrawal right is exercised</li>
                    <li>Exceptions apply for customized or started services</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Legal Guarantee Rights:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>2-year legal guarantee on goods sold</li>
                    <li>Right to repair, replacement, or refund for defective services</li>
                    <li>Right to price reduction for partially defective services</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Alternative Dispute Resolution:</h4>
                  <p className="text-gray-700">
                    You have the right to use alternative dispute resolution procedures. For online purchases, 
                    you can access the EU Online Dispute Resolution platform at 
                    <a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 hover:underline ml-1">ec.europa.eu/consumers/odr</a>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dispute Resolution */}
          <Card className="mb-8" id="dispute-resolution">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-6 w-6 mr-2" />
                10. Dispute Resolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Step 1: Direct Communication</h4>
                  <p className="text-gray-700">
                    We encourage resolving any disputes through direct communication. Contact us at 
                    <a href="mailto:info@5gphones.be" className="text-blue-600 hover:underline ml-1">info@5gphones.be</a> 
                    or +32 (466) 13 41 81.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Step 2: Formal Complaint</h4>
                  <p className="text-gray-700">
                    If direct communication doesn't resolve the issue, submit a formal written complaint 
                    to our business address. We will respond within 30 days.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Step 3: Mediation</h4>
                  <p className="text-gray-700">
                    For unresolved disputes, we support mediation through Belgian consumer mediation services 
                    or EU alternative dispute resolution mechanisms.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Step 4: Legal Action</h4>
                  <p className="text-gray-700">
                    Legal disputes will be resolved in Belgian courts under Belgian law, with EU consumer 
                    protection laws taking precedence where applicable.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="mb-8" id="governing-law">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-6 w-6 mr-2" />
                12. Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  These Terms of Service are governed by Belgian law and EU regulations. Any disputes 
                  will be subject to the jurisdiction of Belgian courts.
                </p>
                
                <div>
                  <h4 className="font-semibold mb-2">Applicable Laws Include:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Belgian Civil Code and Commercial Law</li>
                    <li>EU Consumer Rights Directive</li>
                    <li>EU General Data Protection Regulation (GDPR)</li>
                    <li>Belgian Data Protection Law</li>
                    <li>EU Electronic Commerce Directive</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Language:</h4>
                  <p className="text-gray-600">
                    This agreement is written in English. In case of translation discrepancies, 
                    the English version will prevail, except where local law requires otherwise.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-6 w-6 mr-2" />
                Questions About These Terms?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Contact Information:</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> legal@5gphones.be</p>
                    <p><strong>Phone:</strong> +32 (466) 13 41 81</p>
                    <p><strong>Address:</strong><br />
                       84A Bondgenotenlaan<br />
                       3000 Leuven, Belgium</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Business Hours:</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Monday-Friday:</strong> 10:00 AM - 6:00 PM</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 6:30 PM</p>
                    <p><strong>Sunday:</strong> Closed</p>
                    <p><strong>Response Time:</strong> Within 2 business days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Severability */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Severability & Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Severability:</h4>
                  <p className="text-gray-700">
                    If any provision of these terms is found to be unenforceable, the remaining provisions 
                    will continue in full force and effect.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Updates to Terms:</h4>
                  <p className="text-gray-700">
                    We may update these terms from time to time. Significant changes will be communicated 
                    via email or website notice. Continued use of our services constitutes acceptance of updated terms.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Entire Agreement:</h4>
                  <p className="text-gray-700">
                    These terms, together with our Privacy Policy, constitute the entire agreement between 
                    you and 5gphones regarding the use of our services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
