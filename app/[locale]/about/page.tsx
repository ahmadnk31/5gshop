import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Award, 
  Target, 
  Heart, 
  Wrench, 
  Clock, 
  Shield, 
  Star,
  CheckCircle,
  Calendar,
  MapPin
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & Lead Technician",
      experience: "15+ years",
      specialties: ["iPhone Repair", "Logic Board Repair", "Data Recovery"],
      image: "/api/placeholder/300/300"
    },
    {
      name: "Sarah Chen",
      role: "Senior Repair Technician", 
      experience: "8+ years",
      specialties: ["Android Repair", "Tablet Repair", "Software Issues"],
      image: "/api/placeholder/300/300"
    },
    {
      name: "Mike Rodriguez",
      role: "Laptop Specialist",
      experience: "10+ years", 
      specialties: ["MacBook Repair", "PC Repair", "Performance Optimization"],
      image: "/api/placeholder/300/300"
    },
    {
      name: "Emma Wilson",
      role: "Customer Service Manager",
      experience: "5+ years",
      specialties: ["Customer Relations", "Quality Assurance", "Parts Management"],
      image: "/api/placeholder/300/300"
    }
  ];

  const achievements = [
    {
      icon: Users,
      number: "10,000+",
      title: "Happy Customers",
      description: "Devices repaired successfully"
    },
    {
      icon: Star,
      number: "4.9/5",
      title: "Customer Rating",
      description: "Based on 1,200+ reviews"
    },
    {
      icon: Clock,
      number: "24-48h",
      title: "Avg. Repair Time",
      description: "Fast turnaround guaranteed"
    },
    {
      icon: Award,
      number: "5",
      title: "Years in Business",
      description: "Trusted local service provider"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Quality First",
      description: "We use only premium parts and maintain the highest repair standards"
    },
    {
      icon: Heart,
      title: "Customer Care",
      description: "Your satisfaction is our priority - we treat every device like it's our own"
    },
    {
      icon: Shield,
      title: "Transparency",
      description: "No hidden fees, clear communication, and honest pricing"
    },
    {
      icon: Wrench,
      title: "Expertise",
      description: "Certified technicians with years of experience and ongoing training"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About 5gphones Leuven
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your trusted partner for device repairs and premium accessories since 2019
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white bg-transparent border-white hover:bg-white hover:text-indigo-600">
              <Link href="/quote">Get Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-left">
                <p className="text-lg text-gray-600">
                  5gphones was founded in 2019 with a simple mission: to provide reliable, 
                  affordable device repair services to our community. What started as a small 
                  repair shop has grown into a trusted local business serving thousands of customers.
                </p>
                <p className="text-gray-600">
                  We noticed that many people were frustrated with expensive repair quotes, 
                  long wait times, and poor customer service from other providers. That's when 
                  we decided to create a different kind of repair shop - one that puts customers 
                  first and delivers exceptional service at fair prices.
                </p>
                <p className="text-gray-600">
                  Today, we're proud to be the go-to repair destination for smartphones, tablets, 
                  laptops, and more. Our team of certified technicians has the expertise to handle 
                  everything from simple screen replacements to complex logic board repairs.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="font-semibold">2019</span>
                  </div>
                  <p className="text-sm text-gray-600">Founded 5gphones with a vision to revolutionize device repair services</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-6 w-6 text-green-600 mr-2" />
                    <span className="font-semibold">2021</span>
                  </div>
                  <p className="text-sm text-gray-600">Expanded to our current location and added premium accessories</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Award className="h-6 w-6 text-purple-600 mr-2" />
                    <span className="font-semibold">2024</span>
                  </div>
                  <p className="text-sm text-gray-600">Achieved 10,000+ successful repairs and 4.9/5 customer rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Achievements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <achievement.icon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-3xl font-bold text-blue-600">{achievement.number}</CardTitle>
                  <CardDescription className="text-lg font-semibold">{achievement.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-16 w-16 text-gray-400" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-semibold">{member.role}</CardDescription>
                  <Badge variant="outline">{member.experience}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map((specialty, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Certifications & Training</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-6 w-6 mr-2 text-blue-600" />
                    Professional Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Apple Authorized Service Provider</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Samsung Certified Repair Center</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>CompTIA A+ Certified Technicians</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Mobile Device Repair Certification</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-6 w-6 mr-2 text-purple-600" />
                    Ongoing Training
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Monthly technical training sessions</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Latest repair technique workshops</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>New device training programs</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Customer service excellence training</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the 5gphones Leuven Difference?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers who trust us with their devices</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/repairs">Book a Repair</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white bg-transparent border-white hover:bg-white hover:text-indigo-600">
              <Link href="/contact">Visit Our Store</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
