import { redirect } from 'next/navigation'

// Root layout that redirects to default locale
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This should not render - redirect happens in middleware
  // But if someone hits the root without locale, redirect to default
  redirect('/en')
}
