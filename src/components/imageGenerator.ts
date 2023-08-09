export async function imageGenerator(
  place: string,
  dailyWeather?: string,
  currentWeather?: string
) {
  var myHeaders = new Headers()
  myHeaders.append(
    'authorization',
    'Bearer 5f1784ba-438c-42d1-b8cc-152632845c27'
  )
  myHeaders.append('accept', 'application/json')
  myHeaders.append('content-type', 'application/json')

  var raw = JSON.stringify({
    prompt: `A photo of ${place} weather, the day weather like ${dailyWeather}, the current weather like ${currentWeather}`,
    negativePrompt:
      'blurry, lowres, ugly, boring, poor lighting, dull, unclear, duplicate, error, low quality, out of frame, watermark, signature, double faces, two people, multiple people',
    steps: 50,
    width: 1024,
    height: 576,
    numberOfImages: 1,
    promptStrength: 7,
    enhancePrompt: false,
    restoreFaces: true,
    upscaleBy: 'x2',
  })

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  }

  const generate = await fetch(
    'https://api.tryleap.ai/api/v1/images/models/7575ea52-3d4f-400f-9ded-09f7b1b1a5b8/inferences',
    requestOptions
  ).then((response) => response.json())

  console.log(generate);

  return generate.id
}

export async function getGeneratedImage(id: string) {
  var myHeaders = new Headers()
  myHeaders.append(
    'authorization',
    'Bearer 5f1784ba-438c-42d1-b8cc-152632845c27'
  )
  myHeaders.append('accept', 'application/json')
  myHeaders.append('content-type', 'application/json')


  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  }

  const images = await fetch(
    'https://api.tryleap.ai/api/v1/images/models/7575ea52-3d4f-400f-9ded-09f7b1b1a5b8/inferences/' +
      id,
    requestOptions
  ).then((response) => response.json())

  return { images: images.images, status: images.state }
}
