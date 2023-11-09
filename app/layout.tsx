import './globals.css'
import { Poppins } from 'next/font/google'
<<<<<<< Updated upstream
import { SessionProvider } from 'next-auth/react'
=======
import { SessionProvider, useSession } from 'next-auth/react'
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
// Wrap the entire application with SessionProvider
export function App({ Component, pageProps }: { Component: React.ComponentType, pageProps: any }) {
  return (
    <SessionProvider session={pageProps.session}>
=======
export function App({ Component, pageProps }: { Component: React.ComponentType, pageProps: any }) {
  const { data: session, status } = useSession(); // Move the useSession hook inside the App component

  return (
    <SessionProvider session={session}>
>>>>>>> Stashed changes
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
<<<<<<< Updated upstream
  )
}
=======
  );
}
>>>>>>> Stashed changes
