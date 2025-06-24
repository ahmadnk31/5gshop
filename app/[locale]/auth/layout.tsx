import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-indigo-100">
          {children}
        </div>
      </main>
    </div>
  );
}

// Note: Do NOT include <html> or <body> tags here. Only use them in the root app/layout.tsx.
