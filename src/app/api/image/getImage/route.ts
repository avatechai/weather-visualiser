import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const leapKey = process.env.LEAP_API_KEY!
  var myHeaders = new Headers()
  myHeaders.append('authorization', 'Bearer ' + leapKey)
  myHeaders.append('accept', 'application/json')
  myHeaders.append('content-type', 'application/json')
  const { id } = await req.json()

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  }

  const images = await fetch(
    'https://api.tryleap.ai/api/v1/images/models/26a1a203-3a46-42cb-8cfa-f4de075907d8/inferences/' +
      id,
    requestOptions
  ).then((response) => response.json())

  return NextResponse.json(
    { images: images.images, status: images.state },
    { status: 200 }
  )
}
