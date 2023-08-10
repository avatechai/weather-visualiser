const leapKey = process.env.NEXT_PUBLIC_LEAP_API_KEY!
var myHeaders = new Headers()
myHeaders.append('authorization', 'Bearer ' + leapKey)
myHeaders.append('accept', 'application/json')
myHeaders.append('content-type', 'application/json')

export async function postGenerateImage(place: string) {
  var raw = JSON.stringify({
    prompt: `8k portrait of photo of ${place} weather`,
    negativePrompt:
      'blurry, lowres, ugly, boring, poor lighting, dull, unclear, duplicate, error, low quality, out of frame, watermark, signature, double faces, two people, multiple people, (deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck',
    steps: 60,
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
    'https://api.tryleap.ai/api/v1/images/models/26a1a203-3a46-42cb-8cfa-f4de075907d8/inferences',
    requestOptions
  ).then((response) => response.json())

  return generate.id
}

export async function getGeneratedImage(id: string) {
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
  }

  const images = await fetch(
    'https://api.tryleap.ai/api/v1/images/models/26a1a203-3a46-42cb-8cfa-f4de075907d8/inferences/' +
      id,
    requestOptions
  ).then((response) => response.json())

  return { images: images.images, status: images.state }
}
