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

function QuotePageContent() {
	const searchParams = useSearchParams();
	// Add Google Analytics tracking
	const { trackQuoteRequest, trackEvent } = useGoogleAnalytics();

	// Form state
	const [formData, setFormData] = useState({
		// Contact Information
		firstName: "",
		lastName: "",
		email: "",
		phone: "",

		// Device Information
		deviceType: "",
		brand: "",
		model: "",
		service: "",
		part: "",
		issueDescription: "",
		issues: [] as string[],
		photos: [] as Array<{ url: string; key: string }>,

		// Preferences
		urgency: "normal" as "urgent" | "normal" | "flexible",
		contactMethod: "email" as "email" | "phone" | "text" | "any",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
		"idle"
	);
	const [submitMessage, setSubmitMessage] = useState("");

	// Pre-populate form based on URL parameters
	useEffect(() => {
		const deviceType = searchParams.get("deviceType");
		const brand = searchParams.get("brand");
		const model = searchParams.get("model");
		const service = searchParams.get("service");
		const part = searchParams.get("part");

		setFormData((prev) => ({
			...prev,
			deviceType: deviceType || prev.deviceType,
			brand: brand || prev.brand,
			model: model || prev.model,
			service: service || prev.service,
			part: part || prev.part,
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
					issueDescription: "",
					issues: [],
					photos: [],
					urgency: "normal",
					contactMethod: "email",
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
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 sm:py-12 lg:py-16">
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
						Get Your Free Repair Quote
					</h1>
					<p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
						Fast, transparent pricing for all your device repair needs. Get an accurate
						quote in minutes.
					</p>
					<div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-sm sm:text-base md:text-lg">
						<div className="flex items-center">
							<CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2" />
							<span>Free Diagnostic</span>
						</div>
						<div className="flex items-center">
							<Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2" />
							<span>Fast Response</span>
						</div>
						<div className="flex items-center">
							<DollarSign className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2" />
							<span>Transparent Pricing</span>
						</div>
					</div>
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
									Repair Quote Request
								</CardTitle>
								<CardDescription>
									Please provide details about your device and the issue you're
									experiencing
								</CardDescription>
								{isPrePopulated && (
									<div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
										<div className="flex items-center text-green-800">
											<CheckCircle className="h-4 w-4 mr-2" />
											<span className="text-sm font-medium">
												Form pre-populated with device information from your
												selection
											</span>
										</div>
										<div className="mt-2 text-xs text-green-600">
											{formData.deviceType && (
												<span className="mr-3">
													Device: {formData.deviceType}
												</span>
											)}
											{formData.service && (
												<span className="mr-3">Service: {formData.service}</span>
											)}
											{formData.brand && (
												<span className="mr-3">Brand: {formData.brand}</span>
											)}
											{formData.model && (
												<span className="mr-3">Model: {formData.model}</span>
											)}
										</div>
									</div>
								)}
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-8">
									{/* Personal Information */}
									<div className="space-y-6">
										<h3 className="text-lg font-semibold border-b pb-2">
											Contact Information
										</h3>
										<div className="grid md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="firstName">First Name *</Label>
												<Input
													id="firstName"
													placeholder="John"
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
												<Label htmlFor="lastName">Last Name *</Label>
												<Input
													id="lastName"
													placeholder="Doe"
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
												<Label htmlFor="email">Email Address *</Label>
												<Input
													id="email"
													type="email"
													placeholder="john@example.com"
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
												<Label htmlFor="phone">Phone Number *</Label>
												<Input
													id="phone"
													type="tel"
													placeholder="+1 (555) 123-4567"
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
											Device Information
										</h3>

										<div className="space-y-4">
											<Label>Device Type *</Label>
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
														<span>Smartphone</span>
													</Label>
												</div>
												<div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
													<RadioGroupItem value="TABLET" id="tablet" />
													<Label
														htmlFor="tablet"
														className="flex flex-col items-center cursor-pointer"
													>
														<Tablet className="h-8 w-8 mb-2" />
														<span>Tablet</span>
													</Label>
												</div>
												<div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
													<RadioGroupItem value="LAPTOP" id="laptop" />
													<Label
														htmlFor="laptop"
														className="flex flex-col items-center cursor-pointer"
													>
														<Laptop className="h-8 w-8 mb-2" />
														<span>Laptop</span>
													</Label>
												</div>
												<div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
													<RadioGroupItem value="SMARTWATCH" id="smartwatch" />
													<Label
														htmlFor="smartwatch"
														className="flex flex-col items-center cursor-pointer"
													>
														<Watch className="h-8 w-8 mb-2" />
														<span>Smartwatch</span>
													</Label>
												</div>
												<div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
													<RadioGroupItem value="OTHER" id="other" />
													<Label
														htmlFor="other"
														className="flex flex-col items-center cursor-pointer"
													>
														<Camera className="h-8 w-8 mb-2" />
														<span>Other</span>
													</Label>
												</div>
											</RadioGroup>
										</div>

										<div className="grid md:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="brand">Brand *</Label>
												<Input
													id="brand"
													placeholder="e.g., Apple, Samsung, Dell"
													required
													value={formData.brand}
													onChange={(e) =>
														setFormData((prev) => ({ ...prev, brand: e.target.value }))
													}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="model">Model *</Label>
												<Input
													id="model"
													placeholder="e.g., iPhone 15 Pro, Galaxy S24, XPS 13"
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
												<Label htmlFor="service">Requested Service (if any)</Label>
												<Input
													id="service"
													placeholder="e.g., Screen Repair, Battery Replacement"
													value={formData.service}
													onChange={(e) =>
														setFormData((prev) => ({ ...prev, service: e.target.value }))
													}
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="part">Specific Part (if any)</Label>
												<Input
													id="part"
													placeholder="e.g., Front Camera, Charging Port"
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
											Issue Details
										</h3>

										<div className="space-y-4">
											<Label>
												What issues are you experiencing? (Check all that apply)
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
											<Label htmlFor="issueDescription">Detailed Description</Label>
											<Textarea
												id="issueDescription"
												placeholder="Please describe the issue in detail, when it started, and any relevant circumstances..."
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
										<Label>Photos (Optional)</Label>
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
											label="Drop photos here or click to browse"
											description="Upload photos of the damage or issue (optional, max 10MB per file)"
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
											Preferences
										</h3>

										<div className="grid md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label>Urgency</Label>
												<Select
													value={formData.urgency}
													onValueChange={(value: "urgent" | "normal" | "flexible") =>
														setFormData((prev) => ({ ...prev, urgency: value }))
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select urgency level" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="urgent">Urgent (Same day)</SelectItem>
														<SelectItem value="normal">Normal (1-2 days)</SelectItem>
														<SelectItem value="flexible">Flexible (3-5 days)</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label>Preferred Contact Method</Label>
												<Select
													value={formData.contactMethod}
													onValueChange={(value: "email" | "phone" | "text" | "any") =>
														setFormData((prev) => ({ ...prev, contactMethod: value }))
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="How should we contact you?" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="email">Email</SelectItem>
														<SelectItem value="phone">Phone Call</SelectItem>
														<SelectItem value="text">Text Message</SelectItem>
														<SelectItem value="any">Any method is fine</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
									</div>

									{/* Submit */}
									<div className="flex flex-col sm:flex-row gap-4 pt-6">
										<Button
											type="submit"
											size="lg"
											className="flex-1"
											disabled={isSubmitting}
										>
											<Calculator className="h-5 w-5 mr-2" />
											{isSubmitting ? "Submitting..." : "Get My Free Quote"}
										</Button>
										{isPrePopulated && (
											<Button
												type="button"
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
														issueDescription: "",
														issues: [],
														photos: [],
														urgency: "normal",
														contactMethod: "email",
													});
												}}
											>
												Clear Form
											</Button>
										)}
									</div>

									<div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
										<p>
											<strong>What happens next?</strong>
										</p>
										<ul className="mt-2 space-y-1 list-disc list-inside">
											<li>
												We'll review your request and contact you within 2 hours
											</li>
											<li>
												We'll provide a detailed quote via your preferred contact
												method
											</li>
											<li>
												If you approve, we'll schedule a convenient time for repair
											</li>
											<li>All quotes are valid for 30 days</li>
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
		<Suspense fallback={<div>Loading...</div>}>
			<QuotePageContent />
		</Suspense>
	);
}
