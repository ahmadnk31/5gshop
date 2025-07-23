"use client";
import LeafletMapWrapper from "@/components/leaflet-map-wrapper";

interface ContactMapSectionProps {
  className?: string;
}

export default function ContactMapSection({ className }: ContactMapSectionProps) {
  return <LeafletMapWrapper className={className ?? "h-64 w-full rounded-lg"} />;
}
