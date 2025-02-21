import { Profile, Scraper, Tweet } from "agent-twitter-client";

/**
 * Service for interacting with the X/Twitter API.
 * Handles tweet operations, user lookups, and account management.
 */
export class XService {
    /**
     * Creates a new instance of XService.
     * 
     * @param scraper - The Twitter scraper instance for making API calls
     */
    constructor(private scraper: Scraper) { }

    /**
     * Retrieves the most recent tweets from a specified user.
     * 
     * @param userID - The X/Twitter user ID to fetch tweets from
     * @param count - The number of tweets to retrieve
     * @returns Promise resolving to an array of tweet text content
     */
    async getLatestTweets(userID: string, count: number): Promise<string[]> {
        const tweets = this.scraper.getTweetsByUserId(userID, count);
        const tweetArray = [] as Tweet[];
        for await (const tweet of tweets) {
            tweetArray.push(tweet);
        }
        return tweetArray
            .filter((tweet) => tweet.text !== undefined)
            .map((tweet) => tweet.text!);
    }

    /**
     * Posts a new tweet to the authenticated account.
     * 
     * @param tweet - The text content to post
     * @returns Promise resolving to true if the tweet was posted successfully, false otherwise
     */
    async postTweet(tweet: string): Promise<boolean> {
        const response = await this.scraper.sendTweet(tweet);
        return response.status === 200;
    }

    /**
     * Retrieves the user ID for a given X/Twitter username.
     * 
     * @param screenName - The X/Twitter username (without @ symbol)
     * @returns Promise resolving to the user's ID
     */
    getUserIdByScreenName(screenName: string): Promise<string> {
        return this.scraper.getUserIdByScreenName(screenName);
    }

    /**
     * Retrieves information about the authenticated user.
     * 
     * @returns Promise resolving to the authenticated user's profile information
     */
    me(): Promise<Profile | undefined> {
        return this.scraper.me();
    }
}