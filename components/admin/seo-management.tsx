"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, RefreshCw, Search, Globe, Image as ImageIcon, FileText, Settings, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SEOSettings {
  // Global SEO
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  ogImage: string;
  keywords: string; // Comma-separated or JSON array string
  
  // Robots & Indexing
  robotsIndex: boolean;
  robotsFollow: boolean;
  googleBotIndex: boolean;
  googleBotFollow: boolean;
  
  // Verification
  googleVerification: string;
  yandexVerification: string;
  yahooVerification: string;
  
  // Social Media
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
  
  // Local Business
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  businessLatitude: string;
  businessLongitude: string;
  businessHours: string; // JSON string
}

const defaultSettings: SEOSettings = {
  siteName: "5gphones Leuven",
  siteTitle: "5gphones Leuven - Phone, Tablet, iPad, MacBook & Desktop Repair + Accessories | GSM Reparatie | Réparation",
  siteDescription: "Professional device repair & accessories in Leuven ✓ Phone, Tablet, iPad, MacBook, Desktop repair ✓ Cases, Chargers, Screen Protectors ✓ iPhone, Samsung, Huawei ✓ Fast service ✓ Warranty | Professionele reparatie en accessoires voor telefoons, tablets, laptops en computers ✓ Réparation professionnelle et accessoires téléphones, tablettes, ordinateurs",
  siteUrl: "https://5gphones.be",
  ogImage: "/5g-og.png",
  keywords: "phone repair leuven, mobile repair leuven, smartphone repair leuven, tablet repair leuven, ipad repair leuven, macbook repair leuven, laptop repair leuven, desktop repair leuven, computer repair leuven, gsm reparatie leuven, telefoon reparatie leuven, réparation téléphone louvain",
  robotsIndex: true,
  robotsFollow: true,
  googleBotIndex: true,
  googleBotFollow: true,
  googleVerification: "",
  yandexVerification: "",
  yahooVerification: "",
  twitterCard: "summary_large_image",
  twitterSite: "@5gphones",
  twitterCreator: "@5gphones",
  businessName: "5gphones Leuven",
  businessAddress: "Bondgenotenlaan 84A, 3000 Leuven, Belgium",
  businessPhone: "+32 466 13 41 81",
  businessEmail: "info@5gphones.be",
  businessLatitude: "50.8798",
  businessLongitude: "4.7005",
  businessHours: JSON.stringify([
    { day: "Monday", opens: "10:00", closes: "18:00" },
    { day: "Tuesday", opens: "10:00", closes: "18:00" },
    { day: "Wednesday", opens: "10:00", closes: "18:00" },
    { day: "Thursday", opens: "10:00", closes: "18:00" },
    { day: "Friday", opens: "10:00", closes: "18:00" },
    { day: "Saturday", opens: "10:00", closes: "18:30" }
  ])
};

export function SEOManagement() {
  const [settings, setSettings] = useState<SEOSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/seo-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          // Handle keywords - convert array to comma-separated string if needed
          const loadedSettings = { ...data.settings };
          if (Array.isArray(loadedSettings.keywords)) {
            loadedSettings.keywords = loadedSettings.keywords.join(', ');
          }
          setSettings({ ...defaultSettings, ...loadedSettings });
        }
      }
    } catch (error) {
      console.error('Failed to load SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const response = await fetch('/api/admin/seo-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'SEO settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof SEOSettings,>(key: K, value: SEOSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SEO Management</h2>
          <p className="text-gray-600 mt-1">Control your site's search engine optimization settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadSettings} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Settings
              </>
            )}
          </Button>
        </div>
      </div>

      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="robots">
            <Settings className="h-4 w-4 mr-2" />
            Robots & Indexing
          </TabsTrigger>
          <TabsTrigger value="social">
            <ImageIcon className="h-4 w-4 mr-2" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="local">
            <Search className="h-4 w-4 mr-2" />
            Local Business
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General SEO Settings</CardTitle>
              <CardDescription>Basic site information for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => updateSetting('siteName', e.target.value)}
                  placeholder="5gphones Leuven"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteTitle">Site Title</Label>
                <Input
                  id="siteTitle"
                  value={settings.siteTitle}
                  onChange={(e) => updateSetting('siteTitle', e.target.value)}
                  placeholder="Main page title (50-60 characters recommended)"
                  maxLength={70}
                />
                <p className="text-sm text-gray-500">{settings.siteTitle.length}/70 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting('siteDescription', e.target.value)}
                  placeholder="Meta description (150-160 characters recommended)"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-sm text-gray-500">{settings.siteDescription.length}/200 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => updateSetting('siteUrl', e.target.value)}
                  placeholder="https://5gphones.be"
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">Open Graph Image</Label>
                <Input
                  id="ogImage"
                  value={settings.ogImage}
                  onChange={(e) => updateSetting('ogImage', e.target.value)}
                  placeholder="/5g-og.png"
                />
                <p className="text-sm text-gray-500">Path to image (should be 1200x630px)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Textarea
                  id="keywords"
                  value={settings.keywords}
                  onChange={(e) => updateSetting('keywords', e.target.value)}
                  placeholder="Comma-separated keywords"
                  rows={4}
                />
                <p className="text-sm text-gray-500">Separate keywords with commas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="robots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Robots & Indexing</CardTitle>
              <CardDescription>Control how search engines crawl and index your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="robotsIndex">Allow Indexing</Label>
                    <p className="text-sm text-gray-500">Allow search engines to index your pages</p>
                  </div>
                  <Switch
                    id="robotsIndex"
                    checked={settings.robotsIndex}
                    onCheckedChange={(checked) => updateSetting('robotsIndex', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="robotsFollow">Follow Links</Label>
                    <p className="text-sm text-gray-500">Allow search engines to follow links on your pages</p>
                  </div>
                  <Switch
                    id="robotsFollow"
                    checked={settings.robotsFollow}
                    onCheckedChange={(checked) => updateSetting('robotsFollow', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="googleBotIndex">Google Bot Indexing</Label>
                    <p className="text-sm text-gray-500">Allow Google to index your pages</p>
                  </div>
                  <Switch
                    id="googleBotIndex"
                    checked={settings.googleBotIndex}
                    onCheckedChange={(checked) => updateSetting('googleBotIndex', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="googleBotFollow">Google Bot Follow Links</Label>
                    <p className="text-sm text-gray-500">Allow Google to follow links on your pages</p>
                  </div>
                  <Switch
                    id="googleBotFollow"
                    checked={settings.googleBotFollow}
                    onCheckedChange={(checked) => updateSetting('googleBotFollow', checked)}
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold">Search Engine Verification</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="googleVerification">Google Search Console</Label>
                  <Input
                    id="googleVerification"
                    value={settings.googleVerification}
                    onChange={(e) => updateSetting('googleVerification', e.target.value)}
                    placeholder="Google verification code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yandexVerification">Yandex Verification</Label>
                  <Input
                    id="yandexVerification"
                    value={settings.yandexVerification}
                    onChange={(e) => updateSetting('yandexVerification', e.target.value)}
                    placeholder="Yandex verification code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yahooVerification">Yahoo Verification</Label>
                  <Input
                    id="yahooVerification"
                    value={settings.yahooVerification}
                    onChange={(e) => updateSetting('yahooVerification', e.target.value)}
                    placeholder="Yahoo verification code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Settings</CardTitle>
              <CardDescription>Configure how your site appears when shared on social media</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitterCard">Twitter Card Type</Label>
                <select
                  id="twitterCard"
                  value={settings.twitterCard}
                  onChange={(e) => updateSetting('twitterCard', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterSite">Twitter Site</Label>
                <Input
                  id="twitterSite"
                  value={settings.twitterSite}
                  onChange={(e) => updateSetting('twitterSite', e.target.value)}
                  placeholder="@5gphones"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterCreator">Twitter Creator</Label>
                <Input
                  id="twitterCreator"
                  value={settings.twitterCreator}
                  onChange={(e) => updateSetting('twitterCreator', e.target.value)}
                  placeholder="@5gphones"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Local Business Information</CardTitle>
              <CardDescription>Information for local SEO and Google My Business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={settings.businessName}
                  onChange={(e) => updateSetting('businessName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea
                  id="businessAddress"
                  value={settings.businessAddress}
                  onChange={(e) => updateSetting('businessAddress', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Phone Number</Label>
                  <Input
                    id="businessPhone"
                    value={settings.businessPhone}
                    onChange={(e) => updateSetting('businessPhone', e.target.value)}
                    type="tel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Email</Label>
                  <Input
                    id="businessEmail"
                    value={settings.businessEmail}
                    onChange={(e) => updateSetting('businessEmail', e.target.value)}
                    type="email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessLatitude">Latitude</Label>
                  <Input
                    id="businessLatitude"
                    value={settings.businessLatitude}
                    onChange={(e) => updateSetting('businessLatitude', e.target.value)}
                    type="number"
                    step="any"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessLongitude">Longitude</Label>
                  <Input
                    id="businessLongitude"
                    value={settings.businessLongitude}
                    onChange={(e) => updateSetting('businessLongitude', e.target.value)}
                    type="number"
                    step="any"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessHours">Business Hours (JSON)</Label>
                <Textarea
                  id="businessHours"
                  value={settings.businessHours}
                  onChange={(e) => updateSetting('businessHours', e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-gray-500">Format: [&#123;"day": "Monday", "opens": "10:00", "closes": "18:00"&#125;, ...]</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

