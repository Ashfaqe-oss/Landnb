import { chatbotPrompt } from "@/app/helpers/chatbot-promp";
import {
  ChatGPTMessage,
  OpenAIStream,
  OpenAIStreamPayload,
} from "@/lib/openai-stream";
import { MessageArraySchema } from "@/lib/validators/message";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config={
  runtime: "edge"
}

export async function POST(request: Request) {
  const { messages } = await request.json();

  //now parse the messages against zod schema
  const parsedMessages = MessageArraySchema.parse(messages);

  //to chatgpt api.. parse then loop thru each to modify return
  const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => {
    return {
      role: message.isUserMessage ? "user" : "system",
      content: message.text,
    };
  });

  //to reverse the order of messages -- push inserts at last, but unshift at the front of array
  outboundMessages.unshift({
    role: "system",
    content: chatbotPrompt,
  });

  //open ai stream
  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    // model: "text-davinci-003",
    messages: outboundMessages,
    temperature: 0.4,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 150,
    stream: true,
    n: 1,
  };

  //helper --  // Call the OpenAIStream API with the prepared payload
  const stream = await OpenAIStream(payload);

  return new Response(stream);
}

//   Imports necessary modules and types required for the function.

// Defines an asynchronous function named POST that takes a Request object as a parameter.

// Retrieves the messages field from the JSON body of the request and assigns it to the messages variable.

// Parses the messages using the MessageArraySchema to ensure they match the expected structure defined in the validator.

// Maps the parsed messages to the format required by the ChatGPT API. Each message is transformed into an object with a role (either 'user' or 'system') and content (the message text).

// Adds a system prompt message with the chatbotPrompt content to the beginning of the outbound messages array using unshift().

// Prepares the payload object with the necessary parameters for the OpenAIStream API call, including the model, messages, temperature, top-p, frequency penalty, presence penalty, max tokens, stream, and n (number of responses).

// Calls the OpenAIStream API with the prepared payload, awaiting the response stream.

// Returns a new Response object containing the obtained stream

// model: Specifies the language model to be used. In this case, it is set to 'gpt-3.5-turbo', indicating the GPT-3.5 Turbo model.

// messages: An array of messages to be sent as input to the language model. These messages typically consist of a series of user and system messages exchanged in a conversation. The outboundMessages array, created earlier, is assigned to this parameter.

// temperature: Controls the randomness of the generated text. Higher values (e.g., 0.8) produce more random output, while lower values (e.g., 0.2) make the output more deterministic and focused.

// top_p: Also known as nucleus sampling or probabilistic sampling, it restricts the generated text to the most probable tokens. It determines the cumulative probability distribution to truncate the generated output.

// frequency_penalty: Adjusts the penalty for frequently used tokens in the generated text. Higher values (e.g., 1.2) make the output more focused and avoid repetitive phrases, while lower values (e.g., 0.8) make the output more diverse and may include more repetitions.

// presence_penalty: Adjusts the penalty for generating new tokens that were not present in the input messages. Higher values (e.g., 1.2) encourage the model to stay on-topic and use words from the input, while lower values (e.g., 0.8) allow the model to be more creative and generate new words.

// max_tokens: Specifies the maximum number of tokens in the generated response. It helps to limit the length of the output to a desired size.

// stream: Indicates whether the API should stream the response back or wait for the complete response. When set to true, the response will be streamed incrementally.

// n: Specifies the number of responses to generate. In this case, it is set to 1, indicating that only one response will be generated.
