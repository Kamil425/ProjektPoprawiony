import './globals.css'
import { Poppins } from 'next/font/google'
import { SessionProvider, useSession } from 'next-auth/react'
import { checkInactiveUsersAndSendNotifications } from "./NotificationService/page";
import mongoose from "mongoose";
import cron from "node-cron";

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

// Run the background task
cron.schedule("0 * * * *", async () => {
  await checkInactiveUsersAndSendNotifications();
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='h-full w-full'>
      <body className={poppins.className}>{children}</body>
    </html>
  )
}

export function App({ Component, pageProps }: { Component: React.ComponentType, pageProps: any }) {
  const { data: session, status } = useSession(); // Move the useSession hook inside the App component

  return (
    <SessionProvider session={session}>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
  );
}