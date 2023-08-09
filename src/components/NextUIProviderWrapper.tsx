'use client'

import { NextUIProvider } from '@nextui-org/system'

export default function NextUIProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <NextUIProvider>{children}</NextUIProvider>
}
