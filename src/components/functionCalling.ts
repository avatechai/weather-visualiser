import { ChatRequest, FunctionCallHandler, nanoid } from 'ai'

export const functionCallHandler: FunctionCallHandler = async (
  chatMessages,
  functionCall
) => {
  if (functionCall.name === 'get_current_weather') {
    if (functionCall.arguments) {
      const parsedFunctionCallArguments = JSON.parse(functionCall.arguments)

      // You now have access to the parsed arguments here (assuming the JSON was valid)
      // If JSON is invalid, return an appropriate message to the model so that it may retry?
      console.log(parsedFunctionCallArguments)
    }

    // const currentLocation = await fetch(
    //   `http://api.openweathermap.org/geo/1.0/direct?q=${args.location}&limit=1&appid=6b7eb6ca3be2c0c70d09318e47fb098e`
    // ).then((res) => res.json())
    // const currentWeather = await fetch(
    //   `https://api.openweathermap.org/data/3.0/onecall?lat=${currentLocation[0].lat}&lon=${currentLocation[0].lon}&exclude=minutely,hourly&appid=6b7eb6ca3be2c0c70d09318e47fb098e&units=metric`
    // ).then((res) => res.json())

    // Generate a fake temperature
    const temperature = Math.floor(Math.random() * (100 - 30 + 1) + 30)
    // Generate random weather condition
    const weather = ['sunny', 'cloudy', 'rainy', 'snowy'][
      Math.floor(Math.random() * 4)
    ]

    const functionResponse: ChatRequest = {
      messages: [
        ...chatMessages,
        {
          id: nanoid(),
          name: 'get_current_weather',
          role: 'function' as const,
          content: JSON.stringify({
            temperature,
            weather,
            info: 'This data is randomly generated and came from a fake weather API!',
          }),
        },
      ],
    }
    return functionResponse
  }
}
