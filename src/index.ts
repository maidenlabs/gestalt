import { Scraper } from "agent-twitter-client";
import { AIService } from "./services/openai";
import { AuthManager } from "./utils/auth";
import { XService } from "./services/x";
import Config from "./config/env";
import { minutesDelay } from "./utils/common";
import logger from "./utils/logger";

/**
 * Main application entry point. Runs a continuous loop that:
 * 1. Authenticates with X/Twitter
 * 2. Fetches recent tweets from both the bot and target account
 * 3. Generates new tweets using AI
 * 4. Posts the generated tweets
 * 
 * The loop runs indefinitely with a configurable delay between tweets.
 * 
 * @throws Error if authentication fails or if required services cannot be initialized
 */
async function main() {
  // Initialize services
  const scraper = new Scraper();
  const authManager = new AuthManager(scraper);
  const xService = new XService(scraper);
  const aiService = new AIService();

  // Authenticate with X/Twitter
  await authManager.ensureAuthenticated();
  logger.info(`Authenticated as ${Config.TWITTER_USERNAME}`);

  // Get user information for both the bot and target account
  const me = await xService.me();

  const [styleTarget, contentTarget] = [
    Config.AGENT_STYLE_TARGET_USERNAME.replace("@", ""),
    Config.AGENT_CONTENT_TARGET_USERNAME.replace("@", ""),
  ]

  // Get likeness user ids
  const [styleLikeness, contentLikeness] = await Promise.all([
    xService.getUserIdByScreenName(styleTarget),
    xService.getUserIdByScreenName(contentTarget),
  ])

  logger.info(
    `Imitating: [style: ${styleTarget}, content ${contentTarget}] from ${me?.username} (${me?.userId})`
  );

  // Main tweet generation and posting loop
  while (true) {
    // Wait for the configured delay period before next tweet
    await minutesDelay(Config.MINUTE_DELAY_BETWEEN_TWEETS ?? 30);

    try {
      logger.info("Beginning tweet generation cycle...");

      // Fetch recent tweets from both accounts
      const existingTweets = {
        account: await xService.getLatestTweets(me?.userId!, 5),
        style: await xService.getLatestTweets(styleLikeness, 15),
        content: await xService.getLatestTweets(contentLikeness, 15)
      }

      // Generate a new tweet using AI
      const tweet = await aiService.generateTweet(
        Config.AGENT_PERSONA_PROMPT,
        existingTweets
      );

      logger.info({
        message: "Generated tweet",
        tweet,
      })

      // Post the generated tweet if one was created
      if (tweet) {
        await xService.postTweet(tweet);
      }
    } catch (error) {
      logger.error("Error generating or posting tweet:", error);
      // Continue the loop even if an error occurs
    }
  }
}

// Start the application
main().catch(logger.error);