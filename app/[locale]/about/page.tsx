"use client"

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
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export default function AboutPage() {
  const t = useTranslations('about');
  const [loading, setLoading] = useState(false);

  const teamMembers = [
    {
      name: t('team.members.alex.name'),
      role: t('team.members.alex.role'),
      experience: t('team.members.alex.experience'),
      specialties: [
        t('team.members.alex.specialty1'),
        t('team.members.alex.specialty2'),
        t('team.members.alex.specialty3')
      ],
      image: "/api/placeholder/300/300"
    },
    {
      name: t('team.members.sarah.name'),
      role: t('team.members.sarah.role'), 
      experience: t('team.members.sarah.experience'),
      specialties: [
        t('team.members.sarah.specialty1'),
        t('team.members.sarah.specialty2'),
        t('team.members.sarah.specialty3')
      ],
      image: "/api/placeholder/300/300"
    },
    {
      name: t('team.members.mike.name'),
      role: t('team.members.mike.role'),
      experience: t('team.members.mike.experience'), 
      specialties: [
        t('team.members.mike.specialty1'),
        t('team.members.mike.specialty2'),
        t('team.members.mike.specialty3')
      ],
      image: "/api/placeholder/300/300"
    },
    {
      name: t('team.members.emma.name'),
      role: t('team.members.emma.role'),
      experience: t('team.members.emma.experience'),
      specialties: [
        t('team.members.emma.specialty1'),
        t('team.members.emma.specialty2'),
        t('team.members.emma.specialty3')
      ],
      image: "/api/placeholder/300/300"
    }
  ];

  const achievements = [
    {
      icon: Users,
      number: t('achievements.items.customers.number'),
      title: t('achievements.items.customers.title'),
      description: t('achievements.items.customers.description')
    },
    {
      icon: Star,
      number: t('achievements.items.rating.number'),
      title: t('achievements.items.rating.title'),
      description: t('achievements.items.rating.description')
    },
    {
      icon: Clock,
      number: t('achievements.items.time.number'),
      title: t('achievements.items.time.title'),
      description: t('achievements.items.time.description')
    },
    {
      icon: Award,
      number: t('achievements.items.years.number'),
      title: t('achievements.items.years.title'),
      description: t('achievements.items.years.description')
    }
  ];

  const values = [
    {
      icon: Target,
      title: t('values.items.quality.title'),
      description: t('values.items.quality.description')
    },
    {
      icon: Heart,
      title: t('values.items.care.title'),
      description: t('values.items.care.description')
    },
    {
      icon: Shield,
      title: t('values.items.transparency.title'),
      description: t('values.items.transparency.description')
    },
    {
      icon: Wrench,
      title: t('values.items.expertise.title'),
      description: t('values.items.expertise.description')
    }
  ];

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
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">{t('hero.getInTouch')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white bg-transparent border-white hover:bg-white hover:text-indigo-600">
              <Link href="/quote">{t('hero.getQuote')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">{t('story.title')}</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-left">
                <p className="text-lg text-gray-600">
                  {t('story.paragraph1')}
                </p>
                <p className="text-gray-600">
                  {t('story.paragraph2')}
                </p>
                <p className="text-gray-600">
                  {t('story.paragraph3')}
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="font-semibold">2019</span>
                  </div>
                  <p className="text-sm text-gray-600">{t('story.timeline.2019')}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-6 w-6 text-green-600 mr-2" />
                    <span className="font-semibold">2021</span>
                  </div>
                  <p className="text-sm text-gray-600">{t('story.timeline.2021')}</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Award className="h-6 w-6 text-purple-600 mr-2" />
                    <span className="font-semibold">2024</span>
                  </div>
                  <p className="text-sm text-gray-600">{t('story.timeline.2024')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('achievements.title')}</h2>
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
          <h2 className="text-3xl font-bold text-center mb-12">{t('values.title')}</h2>
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
          <h2 className="text-3xl font-bold text-center mb-12">{t('team.title')}</h2>
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
                    <p className="text-sm font-semibold">{t('team.specialties')}</p>
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
          <h2 className="text-3xl font-bold text-center mb-12">{t('certifications.title')}</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-6 w-6 mr-2 text-blue-600" />
                    {t('certifications.professional.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{t('certifications.professional.item1')}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{t('certifications.professional.item2')}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{t('certifications.professional.item3')}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{t('certifications.professional.item4')}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-6 w-6 mr-2 text-purple-600" />
                    {t('certifications.training.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{t('certifications.training.item1')}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{t('certifications.training.item2')}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{t('certifications.training.item3')}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>{t('certifications.training.item4')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-xl mb-8">{t('cta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" >
              <Link href="/repairs">{t('cta.bookRepair')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white bg-transparent border-white hover:bg-white hover:text-indigo-600">
              <Link href="/contact">{t('cta.visitStore')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}