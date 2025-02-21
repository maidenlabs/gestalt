import { Scraper } from "agent-twitter-client";
import fs from "fs/promises";
import path from "path";
import Config from "../config/env";
import logger from "./logger";

/**
 * Manages X/Twitter authentication state using cookie persistence.
 * Handles login, cookie storage, and session management to maintain authentication
 * between application restarts.
 */
export class AuthManager {
  /**
   * Creates a new instance of AuthManager.
   * 
   * @param scraper - The Twitter scraper instance to manage authentication for
   */
  constructor(private scraper: Scraper) {}

  /**
   * Ensures the scraper is authenticated, either by loading existing cookies
   * or performing a new login.
   * 
   * @throws Error if authentication fails
   */
  async ensureAuthenticated(): Promise<void> {
    if (await this.cookiesExist()) {
      await this.loadCookies();
      logger.debug("You are already logged in. No need to log in again.");
    } else {
      await this.loginAndSaveCookies();
    }
  }

  /**
   * Checks if a cookies file exists from a previous session.
   * 
   * @returns Promise resolving to true if cookies exist, false otherwise
   */
  private async cookiesExist(): Promise<boolean> {
    return fs
      .access(this.cookiesPath)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Gets the full path to the cookies storage file.
   * 
   * @returns Absolute path to the cookies.json file
   */
  private get cookiesPath(): string {
    return path.resolve(__dirname, "../../cookies.json");
  }

  /**
   * Performs a fresh login using credentials from environment variables
   * and saves the resulting cookies to disk.
   * 
   * @throws Error if login fails or cookies cannot be saved
   */
  private async loginAndSaveCookies(): Promise<void> {
    try {
      await this.scraper.login(
        Config.TWITTER_USERNAME,
        Config.TWITTER_PASSWORD,
        Config.TWITTER_EMAIL
      );

      const cookies = await this.scraper.getCookies();
      await fs.writeFile(this.cookiesPath, JSON.stringify(cookies));
      logger.debug("Logged in and cookies saved.");
    } catch (error) {
      logger.error("Error during login:", error);
      throw error;
    }
  }

  /**
   * Loads previously saved cookies from disk and applies them to the scraper.
   * This restores the authentication state from a previous session.
   * 
   * @throws Error if cookies cannot be loaded or are invalid
   */
  private async loadCookies(): Promise<void> {
    try {
      const cookiesData = await fs.readFile(this.cookiesPath, "utf8");
      const cookiesArray = JSON.parse(cookiesData);

      const cookieStrings = cookiesArray.map((cookie: any) => {
        return `${cookie.key}=${cookie.value}; Domain=${cookie.domain}; Path=${
          cookie.path
        }; ${cookie.secure ? "Secure" : ""}; ${
          cookie.httpOnly ? "HttpOnly" : ""
        }; SameSite=${cookie.sameSite || "Lax"}`;
      });

      await this.scraper.setCookies(cookieStrings);
      logger.debug("Cookies loaded from file.");
    } catch (error) {
      logger.error("Error loading cookies:", error);
      throw error;
    }
  }
}