"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact-actions";
import { useGoogleAnalytics } from "@/components/google-analytics";
import { useTranslations } from 'next-intl';
import { useSession } from "next-auth/react";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceType: string;
  device: string;
  message: string;
}

export function ContactForm() {
  const t = useTranslations('contact.form');
  const { data: session, status } = useSession();
  // Add Google Analytics tracking
  const { trackContactForm } = useGoogleAnalytics();

  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    serviceType: "",
    device: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: "" });

  // Auto-populate form with user data when session is available
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as any;
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [session, status]);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const result = await submitContactForm({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        serviceType: formData.serviceType,
        device: formData.device || undefined,
        message: formData.message,
      });

      if (result.success) {
        // Track successful contact form submission
        trackContactForm(`contact_${formData.serviceType || 'general'}`);
        
        setSubmitStatus({
          type: 'success',
          message: t('successMessage'),
        });
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          serviceType: "",
          device: "",
          message: "",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: t('errorMessage'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="h-6 w-6 text-green-600" />
          <span>{t('title')}</span>
        </CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitStatus.type && (
          <Alert className={`mb-6 ${submitStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            {submitStatus.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {status === "authenticated" && session?.user && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {t('autoFilled', { defaultValue: 'Contact information auto-filled from your profile' })}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('firstNameLabel')}</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder={t('firstNamePlaceholder')}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('lastNameLabel')}</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder={t('lastNamePlaceholder')}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={t('emailPlaceholder')}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('phoneLabel')}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={t('phonePlaceholder')}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">{t('serviceLabel')}</Label>
            <Select
              value={formData.serviceType}
              onValueChange={(value) => handleInputChange('serviceType', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('servicePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="repair">{t('serviceRepair')}</SelectItem>
                <SelectItem value="accessories">{t('serviceAccessories')}</SelectItem>
                <SelectItem value="quote">{t('serviceQuote')}</SelectItem>
                <SelectItem value="support">{t('serviceSupport')}</SelectItem>
                <SelectItem value="other">{t('serviceOther')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device">{t('deviceLabel')}</Label>
            <Input
              id="device"
              value={formData.device}
              onChange={(e) => handleInputChange('device', e.target.value)}
              placeholder={t('devicePlaceholder')}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t('messageLabel')}</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder={t('messagePlaceholder')}
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !formData.firstName || !formData.lastName || !formData.email || !formData.serviceType || !formData.message}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {t('sending')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t('sendMessage')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
