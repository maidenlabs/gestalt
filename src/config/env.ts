import dotenv from "dotenv";
import { assert, object, string, optional, mask, number } from "superstruct";

// Required to bring in vars from env
dotenv.config();

// Define the structure of our config
const ConfigStruct = object({
  // Twitter Authentication
  TWITTER_USERNAME: string(),
  TWITTER_PASSWORD: string(),
  TWITTER_EMAIL: optional(string()),

  // Timing Parameters
  MINUTE_DELAY_BETWEEN_TWEETS: optional(number()),

  // API Configuration
  PROMPT_API_KEY: string(),
  PROMPT_BASE_URL: string(),
  PROMPT_MODEL: string(),

  // Agent Configuration
  AGENT_LIKENESS_X_USERNAME: string(),
  AGENT_LIKENESS_PRE_PROMPT: string(),
});

const Config = mask(process.env, ConfigStruct);

// Validate only our specific environment variables
assert(Config, ConfigStruct);

// Export for use in other files
export default Config;