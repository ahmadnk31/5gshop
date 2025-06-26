"use client";
import { LeafletMap } from "@/components/leaflet-map";

interface ContactMapSectionProps {
  className?: string;
}

export default function ContactMapSection({ className }: ContactMapSectionProps) {
  return <LeafletMap className={className ?? "h-64 w-full rounded-lg"} />;
}
