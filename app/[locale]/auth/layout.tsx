import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // make it a gradient from primary to secondary animate it from primary to secondary
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary to-secondary animate-gradient-x bg-primary">
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-primary bg-[length:400%_400%] animate-[gradient_6s_ease-in-out_infinite]">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-primary-100">
          {children}
        </div>
      </main>
    </div>
  );
}

// Note: Do NOT include <html> or <body> tags here. Only use them in the root app/layout.tsx.
