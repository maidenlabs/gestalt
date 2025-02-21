import OpenAI from "openai";
import Config from "../config/env";
import logger from "../utils/logger";

/**
 * Service for handling AI-powered text generation using OpenAI's API.
 * Manages connection to OpenAI and provides methods for generating tweet content.
 */
export class AIService {
  private client: OpenAI;

  /**
   * Initializes a new AIService instance with OpenAI client configuration.
   * Uses environment variables for API configuration.
   */
  constructor() {
    this.client = new OpenAI({
      baseURL: Config.PROMPT_BASE_URL,
      apiKey: Config.PROMPT_API_KEY,
    });
  }

  /**
   * Generates a tweet that mimics the style of a specified Twitter user.
   * 
   * @param likenessUsername - The username of the account to imitate
   * @param likenessPrePrompt - System prompt defining the personality to emulate
   * @param accountTweets - Recent tweets from the bot's account (used as blocklist)
   * @param likenessTweets - Recent tweets from the account being imitated
   * @returns Promise resolving to the generated tweet text, or undefined if generation fails
   */
  async generateTweet(
    likenessUsername: string,
    likenessPrePrompt: string,
    accountTweets: string[],
    likenessTweets: string[]
  ): Promise<string | undefined> {
    logger.debug("Generating tweet...");

    const content = `
      ====  
      Your directive  
      ----  
      1. STEAL THE VOICE: Mirror slang, jokes, and chaos DIRECTLY from the user's existing content.  
      2. AVOID REPETITION: Treat account history as a BLOCKLIST. Never reuse:  
        - Starting words/phrases (e.g., "[First 3 words of any prior post]")  
        - Topics/themes (e.g., "[TopicX]", "[ThemeY]")  
        - Unique phrases (e.g., "[Signature line]")  
      3. Vary output length drastically. No emojis, quotes, or markdown.  
      4. Start with .@${likenessUsername}  
      5. Reference this pre-prompt: ${likenessPrePrompt}
      ====  

      ====  
      Voice DNA (Steal These)(tone, capitalizations, structure, jokes, themes, etc.)
      ----  
      ${likenessTweets.join("\n")}  
      ====  

      ====  
      Blocklist (Avoid These)  
      ----  
      Scan prior content. DO NOT REPEAT:  
      - First 3 words of any post (e.g., "[Topic]...")  
      - Unique phrases (e.g., "[Phrase]...")  
      - Overused themes (e.g., "[Theme]...")  
      ${accountTweets.join("\n")}  
      ====  

      ====
      Only return the tweet text. Do not include any other text.
      ====
    `;

    const msg = await this.client.chat.completions.create({
      model: Config.PROMPT_MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content,
        },
      ],
    });
    return msg.choices[0].message.content?.replace(/"/g, "");
  }
}