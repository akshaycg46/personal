import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Akshay Gupta — Beyond the ordinary', description: 'Computer science at UCF. An Ahri-inspired personal universe by Akshay Gupta.', icons: { icon: '/favicon.svg' } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
