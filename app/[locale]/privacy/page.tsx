'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  Eye, 
  Mail, 
  Phone, 
  Clock,
  User,
  Database,
  Globe,
  FileText,
  AlertTriangle,
  Cookie,
  Settings
} from "lucide-react";
import Link from "next/link";
import { useCookieConsent } from "@/components/cookie-consent-context";
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 22, 2025";
  const { consent, openSettings } = useCookieConsent();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-1/2 h-10 mb-6" />
        <Skeleton className="w-1/3 h-8 mb-4" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full mb-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal data in compliance with EU GDPR regulations.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              GDPR Compliant
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
          
          {/* Cookie Consent Status */}
          {consent && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Cookie className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800">Your Cookie Preferences</h3>
                      <p className="text-sm text-green-700">
                        Necessary: ✅ | 
                        Analytics: {consent.analytics ? '✅' : '❌'} | 
                        Preferences: {consent.preferences ? '✅' : '❌'} | 
                        Marketing: {consent.marketing ? '✅' : '❌'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={openSettings}
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Cookies
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-6 w-6 mr-2" />
                Data Controller Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Business Name:</h4>
                  <p>5gphones (TechFix Pro)</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Address:</h4>
                  <p>84A Bondgenotenlaan<br />3000 Leuven, Belgium</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Contact:</h4>
                  <p>Email: privacy@5gphones.be<br />Phone: +32 (466) 13 41 81</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">EU Representative:</h4>
                  <p>5gphones Belgium<br />84A Bondgenotenlaan<br />3000 Leuven, Belgium</p>
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
                <a href="#data-collection" className="text-blue-600 hover:underline">1. Data We Collect</a>
                <a href="#legal-basis" className="text-blue-600 hover:underline">2. Legal Basis for Processing</a>
                <a href="#data-use" className="text-blue-600 hover:underline">3. How We Use Your Data</a>
                <a href="#data-sharing" className="text-blue-600 hover:underline">4. Data Sharing</a>
                <a href="#data-retention" className="text-blue-600 hover:underline">5. Data Retention</a>
                <a href="#your-rights" className="text-blue-600 hover:underline">6. Your Rights</a>
                <a href="#security" className="text-blue-600 hover:underline">7. Data Security</a>
                <a href="#cookies" className="text-blue-600 hover:underline">8. Cookies & Tracking</a>
                <a href="#international-transfers" className="text-blue-600 hover:underline">9. International Transfers</a>
                <a href="#contact" className="text-blue-600 hover:underline">10. Contact Us</a>
              </div>
            </CardContent>
          </Card>

          {/* Data Collection */}
          <Card className="mb-8" id="data-collection">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-6 w-6 mr-2" />
                1. Data We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information You Provide:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Name, email address, phone number</li>
                  <li>Device information (brand, model, issue description)</li>
                  <li>Repair service requests and quotes</li>
                  <li>Communication preferences</li>
                  <li>Purchase history and transactions</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Information Automatically Collected:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>IP address and location data</li>
                  <li>Browser type and device information</li>
                  <li>Website usage analytics</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Special Categories of Data:</h4>
                <p className="text-gray-700">We do not intentionally collect sensitive personal data such as health information, political opinions, or biometric data.</p>
              </div>
            </CardContent>
          </Card>

          {/* Legal Basis */}
          <Card className="mb-8" id="legal-basis">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                2. Legal Basis for Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <strong>Contract Performance:</strong> Processing your repair requests, providing services, and managing your account.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <strong>Legitimate Interest:</strong> Improving our services, marketing communications, and fraud prevention.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <strong>Consent:</strong> Marketing emails, cookies, and optional services (you can withdraw consent anytime).
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <strong>Legal Obligation:</strong> Tax records, warranty obligations, and regulatory compliance.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Use */}
          <Card className="mb-8" id="data-use">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-6 w-6 mr-2" />
                3. How We Use Your Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Service Provision:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Process repair requests and quotes</li>
                    <li>Communicate about your device status</li>
                    <li>Provide customer support</li>
                    <li>Process payments and invoicing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Business Operations:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Improve our services and website</li>
                    <li>Send service updates and notifications</li>
                    <li>Prevent fraud and ensure security</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="mb-8" id="data-sharing">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-6 w-6 mr-2" />
                4. Data Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">We may share your data with:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><strong>Service Providers:</strong> Payment processors, email services, cloud storage (AWS, Google)</li>
                    <li><strong>Parts Suppliers:</strong> Only device model/issue information for sourcing parts</li>
                    <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of business</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800">We do NOT:</h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Sell your personal data to third parties</li>
                    <li>Share data for advertising purposes</li>
                    <li>Use your data for purposes other than stated</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="mb-8" id="data-retention">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-6 w-6 mr-2" />
                5. Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Customer Data</span>
                  <span className="text-gray-600">3 years after last service</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Transaction Records</span>
                  <span className="text-gray-600">7 years (tax requirements)</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Marketing Consent</span>
                  <span className="text-gray-600">Until withdrawn</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Website Analytics</span>
                  <span className="text-gray-600">26 months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Email Communications</span>
                  <span className="text-gray-600">2 years after last contact</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-8" id="your-rights">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                6. Your Rights Under GDPR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-blue-600">Right of Access</h4>
                    <p className="text-sm text-gray-600">Request a copy of your personal data</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600">Right to Rectification</h4>
                    <p className="text-sm text-gray-600">Correct inaccurate information</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600">Right to Erasure</h4>
                    <p className="text-sm text-gray-600">Delete your data ("right to be forgotten")</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600">Right to Restrict Processing</h4>
                    <p className="text-sm text-gray-600">Limit how we use your data</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-blue-600">Right to Data Portability</h4>
                    <p className="text-sm text-gray-600">Transfer your data to another provider</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600">Right to Object</h4>
                    <p className="text-sm text-gray-600">Stop processing for specific purposes</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600">Right to Withdraw Consent</h4>
                    <p className="text-sm text-gray-600">Remove consent for specific processing</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600">Right to Complain</h4>
                    <p className="text-sm text-gray-600">File a complaint with supervisory authority</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">How to Exercise Your Rights:</h4>
                <p className="text-green-700">Email us at <a href="mailto:privacy@5gphones.be" className="underline">privacy@5gphones.be</a> or visit our store. We will respond within 30 days.</p>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="mb-8" id="security">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-6 w-6 mr-2" />
                7. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Technical Measures:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Encrypted database storage</li>
                    <li>Regular security updates and patches</li>
                    <li>Secure cloud infrastructure (AWS)</li>
                    <li>Regular backups and disaster recovery</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Organizational Measures:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Staff training on data protection</li>
                    <li>Access controls and user permissions</li>
                    <li>Regular security assessments</li>
                    <li>Data breach response procedures</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Data Breach Notification</h4>
                      <p className="text-yellow-700">In case of a data breach affecting your rights, we will notify you within 72 hours as required by GDPR.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="mb-8" id="cookies">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-6 w-6 mr-2" />
                8. Cookies & Tracking Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Types of Cookies We Use:</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <span className="font-medium">Essential Cookies</span>
                        <p className="text-sm text-gray-600">Required for website functionality</p>
                        <p className="text-xs text-gray-500 mt-1">Session management, security, form submissions</p>
                      </div>
                      <Badge variant="outline">Always Active</Badge>
                    </div>
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <span className="font-medium">Analytics Cookies</span>
                        <p className="text-sm text-gray-600">Google Analytics for usage statistics</p>
                        <p className="text-xs text-gray-500 mt-1">Page views, user behavior, performance metrics</p>
                      </div>
                      <Badge variant="secondary">Consent Required</Badge>
                    </div>
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <span className="font-medium">Preference Cookies</span>
                        <p className="text-sm text-gray-600">Remember your settings and preferences</p>
                        <p className="text-xs text-gray-500 mt-1">Language, theme, form data, user preferences</p>
                      </div>
                      <Badge variant="secondary">Consent Required</Badge>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">Marketing Cookies</span>
                        <p className="text-sm text-gray-600">Personalized advertisements and tracking</p>
                        <p className="text-xs text-gray-500 mt-1">Ad targeting, conversion tracking, social media</p>
                      </div>
                      <Badge variant="secondary">Consent Required</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Cookie Consent Management:</h4>
                  <p className="text-blue-700 mb-3">
                    You have full control over your cookie preferences. You can:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm mb-3">
                    <li>Accept or reject specific cookie categories</li>
                    <li>Change your preferences at any time</li>
                    <li>Withdraw consent without affecting lawfulness of prior processing</li>
                    <li>Use browser settings to block cookies entirely</li>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      size="sm" 
                      onClick={openSettings}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Cookie Preferences
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      onClick={() => window.open('https://support.google.com/accounts/answer/61416?hl=en', '_blank')}
                    >
                      Browser Cookie Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card className="mb-8" id="international-transfers">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-6 w-6 mr-2" />
                9. International Data Transfers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">Some of our service providers may be located outside the EU. When we transfer your data internationally, we ensure adequate protection through:</p>
                
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li><strong>Adequacy Decisions:</strong> Transfers to countries with EU-approved data protection</li>
                  <li><strong>Standard Contractual Clauses:</strong> EU-approved contracts ensuring data protection</li>
                  <li><strong>Certification Schemes:</strong> Providers certified under international data protection frameworks</li>
                </ul>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Current International Providers:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Amazon Web Services (AWS) - USA (Standard Contractual Clauses)</li>
                    <li>Google Analytics - USA (Data Processing Agreement)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="mb-8" id="contact">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-6 w-6 mr-2" />
                10. Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Data Protection Officer:</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> privacy@5gphones.be</p>
                    <p><strong>Phone:</strong> +32 (466) 13 41 81</p>
                    <p><strong>Address:</strong><br />
                       84A Bondgenotenlaan<br />
                       3000 Leuven, Belgium</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Supervisory Authority:</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Belgian Data Protection Authority</strong></p>
                    <p>Rue de la Presse 35<br />
                       1000 Brussels, Belgium</p>
                    <p><strong>Website:</strong> <a href="https://www.dataprotectionauthority.be" className="text-blue-600 hover:underline">dataprotectionauthority.be</a></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Policy Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. 
                We will notify you of significant changes by:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
                <li>Email notification to registered users</li>
                <li>Notice on our website homepage</li>
                <li>Updated "Last Modified" date at the top of this policy</li>
              </ul>
              <p className="text-gray-700">
                Your continued use of our services after such modifications constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* Footer Navigation */}
         
        </div>
      </section>
    </div>
  );
}
