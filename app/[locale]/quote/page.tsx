"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileUpload } from "@/components/ui/file-upload";
import {
	Calculator,
	Smartphone,
	Tablet,
	Laptop,
	Watch,
	Camera,
	Upload,
	CheckCircle,
	Clock,
	DollarSign,
	AlertCircle,
} from "lucide-react";
import { submitQuoteRequest } from "@/app/actions/quote-actions";
// Import Google Analytics tracking for quote requests
import { useGoogleAnalytics } from "@/components/google-analytics";
import { QuoteRequestTracker, PageSectionTracker } from "@/components/analytics-components";
import { useTranslations } from 'next-intl';
import { useSession } from "next-auth/react";
import { Skeleton } from '@/components/ui/skeleton';

function QuotePageContent() {
	const searchParams = useSearchParams();
	// Add Google Analytics tracking
	const { trackQuoteRequest, trackEvent } = useGoogleAnalytics();
	const t = useTranslations('quote');
	const { data: session, status } = useSession();
	
	// Form state
  const [formData, setFormData] = useState({
	// Contact Information
	firstName:  "",
	lastName:  "",
	email: "",
	phone:  "",

	// Device Information
	deviceType: "",
	brand: "",
	model: "",
	service: "",
	part: "",
	sku: "",
	supplier: "",
	issueDescription: "",
	issues: [] as string[],
	photos: [] as Array<{ url: string; key: string }>,

	// Preferences
	urgency: "normal" as "urgent" | "normal" | "flexible",
	contactMethod: "email" as "email" | "phone" | "text" | "any",
	quality: '',
  });

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
		"idle"
	);
	const [submitMessage, setSubmitMessage] = useState("");

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

	// Pre-populate form based on URL parameters
useEffect(() => {
  const deviceType = searchParams.get("deviceType");
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const service = searchParams.get("service");
  const part = searchParams.get("part");
  let quality = searchParams.get("quality");
  const sku = searchParams.get("sku");
  const supplier = searchParams.get("supplier");

  // Normalize quality to match dropdown options
  const normalizeQuality = (q: string | null | undefined) => {
	if (!q) return '';
	const map: Record<string, string> = {
	  oem: 'OEM',
	  original: 'Original',
	  premium: 'Premium',
	  aftermarket: 'Aftermarket',
	  refurbished: 'Refurbished',
	};
	const key = q.trim().toLowerCase();
	return map[key] || '';
  };

  setFormData((prev) => ({
	...prev,
	deviceType: deviceType || prev.deviceType,
	brand: brand || prev.brand,
	model: model || prev.model,
	service: service || prev.service,
	part: part || prev.part,
	quality: normalizeQuality(quality) || prev.quality,
	sku: sku || prev.sku,
	supplier: supplier || prev.supplier,
	issueDescription: generateIssueDescription(
	  deviceType,
	  brand,
	  model,
	  service,
	  part
	),
  }));

  // Auto-select relevant issues based on service/part
  if (service || part) {
	const autoIssues = getAutoSelectedIssues(service, part);
	setFormData((prev) => ({ ...prev, issues: autoIssues }));
  }
}, [searchParams]);

	const generateIssueDescription = (
		deviceType?: string | null,
		brand?: string | null,
		model?: string | null,
		service?: string | null,
		part?: string | null
	) => {
		if (service && brand && model) {
			return `${service} for ${brand} ${model}`;
		} else if (part && brand && model) {
			return `${part} replacement for ${brand} ${model}`;
		} else if (service) {
			return `${service} service request`;
		} else if (part) {
			return `${part} replacement request`;
		}
		return "";
	};

	const getAutoSelectedIssues = (service?: string | null, part?: string | null) => {
		const issues: string[] = [];
		const text = (service || part || "").toLowerCase();

		if (text.includes("screen") || text.includes("display")) issues.push("Screen damage");
		if (text.includes("battery")) issues.push("Battery issues");
		if (text.includes("camera")) issues.push("Camera issues");
		if (text.includes("audio") || text.includes("speaker") || text.includes("microphone"))
			issues.push("Audio issues");
		if (text.includes("charging") || text.includes("port")) issues.push("Charging port");
		if (text.includes("water") || text.includes("liquid")) issues.push("Water damage");

		return issues;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus("idle");

		try {
			const result = await submitQuoteRequest({
				// Contact Information
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				phone: formData.phone,

				// Device Information
				deviceType: formData.deviceType,
				brand: formData.brand,
				model: formData.model,
				service: formData.service,
				part: formData.part,
				issueDescription: formData.issueDescription,
				issues: formData.issues,
				photos: formData.photos,

				// Preferences
				urgency: formData.urgency,
				contactMethod: formData.contactMethod,
				quality: formData.quality,
				
			});

			if (result.success) {
				// Track successful quote request
				trackQuoteRequest(
					formData.deviceType || 'unknown', 
					formData.service || formData.part || 'general_repair'
				);
				
				setSubmitStatus("success");
				setSubmitMessage(
					"Quote request submitted successfully! We'll contact you within 2 hours."
				);
				
				// Clear form
				setFormData({
					firstName: "",
					lastName: "",
					email: "",
					phone: "",
					deviceType: "",
					brand: "",
					model: "",
					service: "",
					part: "",
					sku: "",
					supplier: "",
					issueDescription: "",
					issues: [],
					photos: [],
					urgency: "normal",
					contactMethod: "email",
					quality: '',
				});
			} else {
				setSubmitStatus("error");
				setSubmitMessage(result.message || "Failed to submit quote request. Please try again.");
			}
		} catch (error) {
			console.error("Quote submission error:", error);
			setSubmitStatus("error");
			setSubmitMessage("An unexpected error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const isPrePopulated = !!(
		searchParams.get("deviceType") ||
		searchParams.get("brand") ||
		searchParams.get("service") ||
		searchParams.get("part")
	);

	return (
		<div className="flex flex-col min-h-screen">
			<QuoteRequestTracker deviceType={formData.deviceType || 'unknown'} repairType={formData.service || formData.part || 'general_repair'} />
			{/* Hero Section */}
			<section
				className="relative flex items-center justify-center min-h-[220px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px] animate-gradient-x bg-[length:200%_200%] px-4"
				style={{
					background: 'linear-gradient(120deg, #16A34A 0%, #2563EB 50%, #14B8A6 100%)',
					backgroundSize: '200% 200%',
					animation: 'gradient-x 8s ease-in-out infinite',
				}}
			>
				<div className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-2xl mx-auto py-8 sm:py-12">
					<h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4 drop-shadow-lg">
						{t('hero.title', { defaultValue: 'Get a Free Quote' })}
					</h1>
					<p className="text-base sm:text-lg md:text-2xl text-white/90 mb-0 max-w-xl mx-auto">
						{t('hero.subtitle', { defaultValue: 'Tell us about your device and we\'ll send you a quote.' })}
					</p>
				</div>
			</section>

			{/* Success/Error Messages */}
			{submitStatus !== "idle" && (
				<section className="py-8">
					<div className="container mx-auto px-4">
						<div
							className={`max-w-3xl mx-auto p-4 rounded-lg flex items-center space-x-3 ${
								submitStatus === "success"
									? "bg-green-50 border border-green-200 text-green-800"
									: "bg-red-50 border border-red-200 text-red-800"
							}`}
						>
							{submitStatus === "success" ? (
								<CheckCircle className="h-5 w-5 text-green-600" />
							) : (
								<AlertCircle className="h-5 w-5 text-red-600" />
							)}
							<span className="font-medium">{submitMessage}</span>
						</div>
					</div>
				</section>
			)}

			{/* Quote Form */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center text-2xl">
									<Calculator className="h-7 w-7 mr-3" />
									{t('form.title')}
								</CardTitle>
								<CardDescription>
									{t('form.description')}
								</CardDescription>
								{isPrePopulated && (
									<div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
										<div className="flex items-center text-green-800">
											<CheckCircle className="h-4 w-4 mr-2" />
											<span className="text-sm font-medium">
												{t('form.prepopulate.success')}
											</span>
										</div>
										<div className="mt-2 text-xs text-green-600">
											{formData.deviceType && (
												<span className="mr-3">
													{t('form.deviceType')}: {formData.deviceType}
												</span>
											)}
											{formData.service && (
												<span className="mr-3">
													{t('form.service')}: {formData.service}
												</span>
											)}
											{formData.brand && (
												<span className="mr-3">
													{t('form.brand')}: {formData.brand}
												</span>
											)}
											{formData.model && (
												<span className="mr-3">
													{t('form.model')}: {formData.model}
												</span>
											)}
										</div>
									</div>
								)}
								{status === "authenticated" && session?.user && (
									<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
										<div className="flex items-center text-blue-800">
											<CheckCircle className="h-4 w-4 mr-2" />
											<span className="text-sm font-medium">
												{t('form.autoFilled', { defaultValue: 'Contact information auto-filled from your profile' })}
											</span>
										</div>
									</div>
								)}
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-8">
									{/* Personal Information */}
									<div className="space-y-6">
										<h3 className="text-lg font-semibold border-b pb-2">
											{t('form.contactInformation.title')}
										</h3>
										<div className="grid md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="firstName">{t('form.contactInformation.firstName')}</Label>
												<Input
													id="firstName"
													placeholder={t('form.contactInformation.firstNamePlaceholder')}
													required
													value={formData.firstName}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															firstName: e.target.value,
														}))
													}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="lastName">{t('form.contactInformation.lastName')}</Label>
												<Input
													id="lastName"
													placeholder={t('form.contactInformation.lastNamePlaceholder')}
													required
													value={formData.lastName}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															lastName: e.target.value,
														}))
													}
												/>
											</div>
										</div>
										<div className="grid md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="email">{t('form.contactInformation.email')}</Label>
												<Input
													id="email"
													type="email"
													placeholder={t('form.contactInformation.emailPlaceholder')}
													required
													value={formData.email}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															email: e.target.value,
														}))
													}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="phone">{t('form.contactInformation.phone')}</Label>
												<Input
													id="phone"
													type="tel"
													placeholder={t('form.contactInformation.phonePlaceholder')}
													required
													value={formData.phone}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															phone: e.target.value,
														}))
													}
												/>
											</div>
										</div>
									</div>

									{/* Device Information */}
									<div className="space-y-6">
										<h3 className="text-lg font-semibold border-b pb-2">
											{t('form.deviceInformation.title')}
										</h3>

										<div className="space-y-4">
											<Label>{t('form.deviceInformation.deviceType')}</Label>
											<RadioGroup
												value={formData.deviceType}
												onValueChange={(value) =>
													setFormData((prev) => ({ ...prev, deviceType: value }))
												}
												className="grid grid-cols-2 md:grid-cols-5 gap-4"
											>
												<div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
													<RadioGroupItem value="SMARTPHONE" id="smartphone" />
													<Label
														htmlFor="smartphone"
														className="flex flex-col items-center cursor-pointer"
													>
														<Smartphone className="h-8 w-8 mb-2" />
														<span>{t('form.deviceInformation.deviceTypeOptions.smartphone')}</span>
													</Label>
												</div>
												<div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
													<RadioGroupItem value="TABLET" id="tablet" />
													<Label
														htmlFor="tablet"
														className="flex flex-col items-center cursor-pointer"
													>
														<Tablet className="h-8 w-8 mb-2" />
														<span>{t('form.deviceInformation.deviceTypeOptions.tablet')}</span>
													</Label>
												</div>
												<div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
													<RadioGroupItem value="LAPTOP" id="laptop" />
													<Label
														htmlFor="laptop"
														className="flex flex-col items-center cursor-pointer"
													>
														<Laptop className="h-8 w-8 mb-2" />
														<span>{t('form.deviceInformation.deviceTypeOptions.laptop')}</span>
													</Label>
												</div>
												<div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
													<RadioGroupItem value="SMARTWATCH" id="smartwatch" />
													<Label
														htmlFor="smartwatch"
														className="flex flex-col items-center cursor-pointer"
													>
														<Watch className="h-8 w-8 mb-2" />
														<span>{t('form.deviceInformation.deviceTypeOptions.smartwatch')}</span>
													</Label>
												</div>
												<div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
													<RadioGroupItem value="OTHER" id="other" />
													<Label
														htmlFor="other"
														className="flex flex-col items-center cursor-pointer"
													>
														<Camera className="h-8 w-8 mb-2" />
														<span>{t('form.deviceInformation.deviceTypeOptions.other')}</span>
													</Label>
												</div>
											</RadioGroup>
										</div>

										<div className="grid md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="brand">{t('form.brand')}</Label>
												<Input
													id="brand"
													placeholder={t('form.brandPlaceholder')}
													required
													value={formData.brand}
													onChange={(e) =>
														setFormData((prev) => ({ ...prev, brand: e.target.value }))
													}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="model">{t('form.model')}</Label>
												<Input
													id="model"
													placeholder={t('form.modelPlaceholder')}
													required
													value={formData.model}
													onChange={(e) =>
														setFormData((prev) => ({ ...prev, model: e.target.value }))
													}
												/>
											</div>
										</div>

										<div className="grid md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="service">{t('form.service')}</Label>
												<Input
													id="service"
													placeholder={t('form.servicePlaceholder')}
													value={formData.service}
													onChange={(e) =>
														setFormData((prev) => ({ ...prev, service: e.target.value }))
													}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="part">{t('form.part')}</Label>
												<Input
													id="part"
													placeholder={t('form.partPlaceholder')}
													value={formData.part}
													onChange={(e) =>
														setFormData((prev) => ({ ...prev, part: e.target.value }))
													}
												/>
											</div>
										</div>
									</div>

									{/* Issue Details */}
									<div className="space-y-6">
										<h3 className="text-lg font-semibold border-b pb-2">
											{t('form.issueDetails.title')}
										</h3>

										<div className="space-y-4">
											<Label>
												{t('form.issueDetails.issuesDescription')}
											</Label>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
												{[
													"Screen damage",
													"Battery issues",
													"Water damage",
													"Charging port",
													"Camera issues",
													"Audio issues",
													"Performance issues",
													"Software problems",
													"Physical damage",
												].map((issue) => (
													<div key={issue} className="flex items-center space-x-2">
														<Checkbox
															id={issue}
															checked={formData.issues.includes(issue)}
															onCheckedChange={(checked) => {
																if (checked) {
																	setFormData((prev) => ({
																		...prev,
																		issues: [...prev.issues, issue],
																	}));
																} else {
																	setFormData((prev) => ({
																		...prev,
																		issues: prev.issues.filter((i) => i !== issue),
																	}));
																}
															}}
														/>
														<Label htmlFor={issue} className="text-sm">
															{issue}
														</Label>
													</div>
												))}
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="issueDescription">{t('form.issueDetails.detailedDescription')}</Label>
											<Textarea
												id="issueDescription"
												placeholder={t('form.issueDetails.detailedDescriptionPlaceholder')}
												rows={4}
												value={formData.issueDescription}
												onChange={(e) =>
													setFormData((prev) => ({ ...prev, issueDescription: e.target.value }))
												}
											/>
										</div>
									</div>

									{/* Photo Upload */}
									<div className="space-y-4">
										<Label>{t('form.photoUpload.label')}</Label>
										<FileUpload
											onUploadComplete={(fileUrl, key) => {
												setFormData((prev) => ({
													...prev,
													photos: [...prev.photos, { url: fileUrl, key }],
												}));
											}}
											onUploadError={(error) => {
												console.error("Upload error:", error);
												alert("Failed to upload photo. Please try again.");
											}}
											accept="image/*"
											maxSize={10}
											multiple={true}
											label={t('form.photoUpload.dropZoneLabel')}
											description={t('form.photoUpload.dropZoneDescription')}
										/>
										{formData.photos.length > 0 && (
											<div className="flex flex-wrap gap-2 mt-2">
												{formData.photos.map((photo, index) => (
													<div key={index} className="relative">
														<img
															src={photo.url}
															alt={`Upload ${index + 1}`}
															className="w-20 h-20 object-cover rounded border"
														/>
														<button
															type="button"
															onClick={() => {
																setFormData((prev) => ({
																	...prev,
																	photos: prev.photos.filter((_, i) => i !== index),
																}));
															}}
															className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
														>
															×
														</button>
													</div>
												))}
											</div>
										)}
									</div>

									{/* Preferences */}
									<div className="space-y-6">
										<h3 className="text-lg font-semibold border-b pb-2">
											{t('form.preferences.title')}
										</h3>

										<div className="grid md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label>{t('form.preferences.urgency')}</Label>
												<Select
													value={formData.urgency}
													onValueChange={(value: "urgent" | "normal" | "flexible") =>
														setFormData((prev) => ({ ...prev, urgency: value }))
													}
												>
													<SelectTrigger>
														<SelectValue placeholder={t('form.preferences.urgencyPlaceholder')} />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="urgent">{t('form.preferences.urgencyOptions.urgent')}</SelectItem>
														<SelectItem value="normal">{t('form.preferences.urgencyOptions.normal')}</SelectItem>
														<SelectItem value="flexible">{t('form.preferences.urgencyOptions.flexible')}</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label>{t('form.preferences.contactMethod')}</Label>
												<Select
													value={formData.contactMethod}
													onValueChange={(value: "email" | "phone" | "text" | "any") =>
														setFormData((prev) => ({ ...prev, contactMethod: value }))
													}
												>
													<SelectTrigger>
														<SelectValue placeholder={t('form.preferences.contactMethodPlaceholder')} />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="email">{t('form.preferences.contactMethodOptions.email')}</SelectItem>
														<SelectItem value="phone">{t('form.preferences.contactMethodOptions.phone')}</SelectItem>
														<SelectItem value="text">{t('form.preferences.contactMethodOptions.text')}</SelectItem>
														<SelectItem value="any">{t('form.preferences.contactMethodOptions.any')}</SelectItem>
													</SelectContent>
												</Select>
											</div>
											{/* Quality Dropdown */}
											<div className="space-y-2">
												<Label>{t('form.quality')}</Label>
												{searchParams.get('quality') ? (
													<Input
														id="quality"
														value={formData.quality}
														readOnly
														className="bg-gray-100 cursor-not-allowed"
													/>
												) : (
													<Select
													
														value={formData.quality}
														onValueChange={(value) => setFormData((prev) => ({ ...prev, quality: value }))}
													>
														<SelectTrigger>
															<SelectValue placeholder={t('form.quality')} />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="OEM">OEM</SelectItem>
															<SelectItem value="Original">Original</SelectItem>
															<SelectItem value="Premium">Premium</SelectItem>
															<SelectItem value="Aftermarket">Aftermarket</SelectItem>
															<SelectItem value="Refurbished">Refurbished</SelectItem>
														</SelectContent>
													</Select>
												)}
											</div>
										</div>
									</div>

									{/* Submit */}
									<div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
										<Button
											type="submit"
											size="lg"
											className=""
											disabled={isSubmitting}
										>
											<Calculator className="h-5 w-5 mr-2" />
											{isSubmitting ? t('form.submitButton.submitting') : t('form.submitButton.label')}
										</Button>
										{isPrePopulated && (
											<Button
												type="submit"
												variant="ghost"
												size="lg"
												onClick={() => {
												setFormData({
													firstName: "",
													lastName: "",
													email: "",
													phone: "",
													deviceType: "",
													brand: "",
													model: "",
													service: "",
													part: "",
													sku: "",
													supplier: "",
													issueDescription: "",
													issues: [],
													photos: [],
													urgency: "normal",
													contactMethod: "email",
													quality: '',
												});
												}}
											>
												{t('form.clearButton')}
											</Button>
										)}
									</div>

									<div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
										<p>
											<strong>{t('form.nextSteps.title')}</strong>
										</p>
										<ul className="mt-2 space-y-1 list-disc list-inside">
											<li>
												{t('form.nextSteps.step1')}
											</li>
											<li>
												{t('form.nextSteps.step2')}
											</li>
											<li>
												{t('form.nextSteps.step3')}
											</li>
											<li>{t('form.nextSteps.step4')}</li>
										</ul>
									</div>
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		</div>
	);
}

export default function QuotePage() {
	return (
		<Suspense fallback={
			<div className="container mx-auto px-4 py-8">
				<Skeleton className="w-1/2 h-8 mb-4" />
				<Skeleton className="w-1/3 h-6 mb-6" />
				{[...Array(6)].map((_, i) => (
					<Skeleton key={i} className="w-full h-12 mb-4" />
				))}
				<Skeleton className="w-1/3 h-10 mt-8" />
			</div>
		}>
			<QuotePageContent />
		</Suspense>
	);
}
