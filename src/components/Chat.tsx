'use client'

import { useChat } from 'ai/react'
import { useAvatar, getAIReplyWithEmotion } from '@avatechai/avatars/react'
import { ElevenLabsVoiceService } from '@avatechai/avatars/voice'
import {
  defaultAvatarLoaders,
  defaultBlendshapesService_2,
} from '@avatechai/avatars/default-loaders'
import { buildCharacterPersonaPrompt } from '@avatechai/avatars'

import { useEffect, useState } from 'react'
import { getGeneratedImage, imageGenerator } from './imageGenerator'
import { Button, Card, CardBody } from '@nextui-org/react'

const elevenLabs = new ElevenLabsVoiceService(
  process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY!,
  'eleven_monolingual_v1',
  'EXAVITQu4vr4xnSDxMaL'
)

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat()

  // console.log('messages', messages)
  const [image, setImage] = useState('')
  const [message, setMessage] = useState('')

  const [text, currentEmotion] = getAIReplyWithEmotion(messages, isLoading)

  const {
    avatarDisplay,
    handleFirstInteractionAudio,
    availableEmotions,
    audioStatus,
  } = useAvatar({
    // Avatar State
    text: message,
    currentEmotion: currentEmotion,
    avatarId: '89479c95-4ec5-42f7-ac0f-03f8340e8bda',
    toggleMouseInteract: false,
    // Loader + Plugins
    avatarLoaders: defaultAvatarLoaders,
    blendshapesService: defaultBlendshapesService_2,

    audioService: elevenLabs,

    // Style Props
    scale: 4,
    className: 'w-full md:w-[400px] h-[400px]',
  })

  // Set initial prompt
  useEffect(() => {
    if (!availableEmotions) return
    setMessages([
      {
        content: buildCharacterPersonaPrompt({
          name: 'Ava',
          context: 'Im ava, a virtual idol from avatechs.',
          exampleReplies: [
            'I am ava!',
            'I love next js!',
            'What are you working on recently?',
            'npm i @avatechai/avatars',
          ],
          emotionList: availableEmotions,
        }),
        role: 'system',
        id: '1',
      },
    ])
  }, [availableEmotions])

  useEffect(() => {
    ;(async () => {
      if (!text || text == '') return
      const generateId = await imageGenerator(text)
      let status = 'pending'
      while (status != 'finished') {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const { images, status: currentStatus } = await getGeneratedImage(
          generateId
        )
        status = currentStatus
        if (images.length == 0) continue
        setImage(images[0].uri)
        setMessage(text)
      }
    })()
    // console.log('isLoading', input)
  }, [text])

  return (
    <>
      {image && (
        <img src={image} alt='' className='absolute w-screen h-screen'></img>
      )}
      <div className='p-10 flex flex-col absolute bottom-0 right-0'>
        {/* Avatar Display */}
        {/* <div>
          Audio Status:
          <span className='bg-gray-200 rounded-lg px-2'>{audioStatus}</span>
        </div> */}
        <div className='flex h-full w-full !border-4 ring ring-white justify-center rounded-full glass overflow-hidden'>
          {avatarDisplay}
        </div>
      </div>
      <div className='flex w-[34rem] h-screen items-end py-20'>
      <div className='flex h-72 glass p-6 w-full justify-center rounded-2xl overflow-hidden'>
          <div
            className={
              'flex flex-col w-full px-6 py-2 overflow-y-scroll noscrollbar h-screen gap-2'
            }
          >
            {messages
              .map(
                (m) =>
                  m.role != 'system' && (
                    <Card
                      key={m.id}
                      className={
                        'flex bg-background/60 h-fit min-h-16 ' +
                        (m.role === 'user' ? 'self-end' : 'self-start')
                      }
                    >
                      <CardBody className=''>
                        {m.role === 'user' ? 'User: ' : 'AI: '}
                        {m.content}
                      </CardBody>
                    </Card>
                  )
              )
              .reverse()}
          </div>
          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(e)
              handleFirstInteractionAudio()
            }}
            className='px-2 max-w-md fixed bottom-0 flex items-center gap-2 justify-center mb-8 w-full'
          >
            <input
              placeholder='Say something...'
              className='max-w-md border border-gray-300 rounded-full shadow-xl p-3 w-full'
              value={input}
              onChange={handleInputChange}
            />
            <Button variant='ghost' type='submit'>
              Send
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
