"use client";
import dynamic from "next/dynamic";
const ContactMapSection = dynamic(() => import("./contact-map-section"), { ssr: false });

export default function ContactMapClientWrapper(props: { className?: string }) {
  return <ContactMapSection {...props} />;
}
