import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { ChatCompletionFunctions } from 'openai-edge/types/api'

const functions: ChatCompletionFunctions[] = [
  {
    name: 'get_current_weather',
    description: 'Get the current weather',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'The city and state, e.g. San Francisco',
        },
        format: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description:
            'The temperature unit to use. Infer this from the users location.',
        },
        description: {
          type: 'string',
          description:
            'In the current weather, no cloud in the sky. e.g. In the full day weather, there will be partly cloudy conditions in the morning, with clearing in the afternoon.',
        },
      },
      required: ['location', 'format'],
    },
  },
]

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

const weatherKey = process.env.OPENWEATHER_API_KEY!

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0613',
    stream: true,
    messages,
    functions,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    // @ts-ignore
    experimental_onFunctionCall: async (
      { name, arguments: args }: { name: string; arguments: any },
      createFunctionCallMessages: (arg0: {
        temperature: number
        dailyWeather: string
        currentWeather: string
        unit: string
      }) => any
    ) => {
      // if you skip the function call and return nothing, the `function_call`
      // message will be sent to the client for it to handle
      if (name === 'get_current_weather') {

        const currentLocation = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${args.location}&limit=1&appid=${weatherKey}`
        ).then((res) => res.json())

        const currentWeather = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${currentLocation[0].lat}&lon=${currentLocation[0].lon}&exclude=minutely,hourly&appid=${weatherKey}&units=metric`
        ).then((res) => res.json())

        // Call a weather API here
        const weatherData = {
          temperature: currentWeather.current.temp,
          dailyWeather: currentWeather.daily[0].summary,
          currentWeather: currentWeather.current.weather[0].description,
          unit: args.format === 'celsius' ? 'C' : 'F',
        }

        // `createFunctionCallMessages` constructs the relevant "assistant" and "function" messages for you
        const newMessages = createFunctionCallMessages(weatherData)

        return openai.createChatCompletion({
          messages: [...messages, ...newMessages],
          stream: true,
          model: 'gpt-3.5-turbo-0613',
          // see "Recursive Function Calls" below
          functions,
        })
      }
    },
  })
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
