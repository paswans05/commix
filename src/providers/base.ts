import { ChatCompletionMessageParam } from 'openai/resources';

export interface AIProvider {
  generateCommitMessage(
    messages: ChatCompletionMessageParam[]
  ): Promise<string | undefined>;
}
