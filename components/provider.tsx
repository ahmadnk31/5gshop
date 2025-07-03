'use client'
import { SessionProvider } from "next-auth/react";
import React from "react";
import { CartProvider } from "./cart-context";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Provider({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
}