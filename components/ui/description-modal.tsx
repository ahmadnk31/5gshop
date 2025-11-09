"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";

interface DescriptionModalProps {
  description: string;
  title: string;
  maxLength?: number;
  variant?: "hero" | "admin"; // Add variant prop
}

export function DescriptionModal({ 
  description, 
  title,
  maxLength = 150,
  variant = "hero" 
}: DescriptionModalProps) {
  const [open, setOpen] = useState(false);
  
  // Check if description needs truncation
  const needsTruncation = description.length > maxLength;
  const truncatedDescription = needsTruncation 
    ? description.substring(0, maxLength) + "..." 
    : description;

  // Styles based on variant
  const textClass = variant === "hero" 
    ? "text-lg text-green-50" 
    : "text-sm text-gray-500";
  
  const buttonClass = variant === "hero"
    ? "text-white hover:text-green-100 p-0 h-auto font-normal underline flex items-center gap-1"
    : "text-blue-600 hover:text-green-800 p-0 h-auto font-normal underline flex items-center gap-1 text-xs";

  if (!needsTruncation) {
    return <p className={textClass}>{description}</p>;
  }

  return (
    <div>
      <p className={`${textClass} ${needsTruncation ? 'mb-1' : ''}`}>
        {truncatedDescription}
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="link" 
            className={buttonClass}
          >
            Show More
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Full description of {title}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
