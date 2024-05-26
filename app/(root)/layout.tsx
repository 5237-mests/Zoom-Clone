import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "MEETVID",
  description: "Video Calling app",
  icons: {
    icon: "/icons/logo.svg",
  }
};

const RootLayoyt = ({ children } : {children : ReactNode}) => {
  return (
    <main>
      <StreamVideoProvider>
        {children}
      </StreamVideoProvider>
    </main>
  )
}

export default RootLayoyt