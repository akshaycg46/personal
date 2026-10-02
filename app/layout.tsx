import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'Akshay Gupta — Computer Science & Software Development',
 description: 'Computer Science student at the University of Central Florida. Explore projects in voice-based AI, financial tools, and Java web development.',
 icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
