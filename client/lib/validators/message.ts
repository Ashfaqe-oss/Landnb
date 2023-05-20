import { z } from 'zod'

export const MessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  isUserMessage: z.boolean(),
})

// array validator -- to parse the previous messages that exist in memory
export const MessageArraySchema = z.array(MessageSchema)

export type Message = z.infer<typeof MessageSchema>
