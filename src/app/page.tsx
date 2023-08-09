import dynamic from 'next/dynamic'
import { NextUIProvider } from '@nextui-org/react'
import NextUIProviderWrapper from '@/components/NextUIProviderWrapper'

const Chat = dynamic(() => import('@/components/Chat'), { ssr: false })

export default function Home() {
  return (
    <NextUIProviderWrapper>
      <main className='flex min-h-screen flex-col items-center justify-between relative'>
        <Chat />
      </main>
    </NextUIProviderWrapper>
  )
}
