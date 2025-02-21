# Gestalt

Gestalt is an X bot that uses AI to generate tweets that mimic the style of a specified Twitter user. It continuously fetches recent tweets, generates new content using OpenAI, and posts the generated tweets.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Development](#development)
- [License](#license)

## Installation

To get started with Gestalt, follow these steps:

1. Ensure that [git](https://git-scm.com/) and the [Node Version Manager](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) is installed. 

2. Ensure that the `yarn` package manager is installed
    ```sh
        npm install -g yarn
    ```

3. Clone the repository:
    ```sh
    git clone https://github.com/maidenlabs/gestalt.git
    cd gestalt
    ```

4. Install the dependencies:
    ```sh
    yarn install
    ```

5. Create a `.env` file based on the `.env.example` file and fill in the required values:
    ```sh
    cp .env.example .env
    ```

## Usage

To start the application, run:
```sh
yarn start
```

## Configuration

The application uses environment variables for configuration. These variables are defined in the .env file. Here is an example of the required configuration:

```sh
# Twitter Authentication
TWITTER_USERNAME=your_twitter_username
TWITTER_PASSWORD=your_twitter_password
TWITTER_EMAIL=your_twitter_email

# API Configuration
PROMPT_API_KEY=your_llm_key
PROMPT_BASE_URL=https://api.openai.com/v1 # or any other provider that support the OpenAI standard (deepseek, openrouter, etc)
PROMPT_MODEL=text-davinci-003 # or any other model you'd like to use that is supported by the provider

# Timing Configuration
MINUTE_DELAY_BETWEEN_TWEETS=integer

# Agent Personality Settings
AGENT_PERSONA_PROMPT=target_twitter_username
AGENT_STYLE_TARGET_USERNAME=target_twitter_username
AGENT_CONTENT_TARGET_USERNAME=system_prompt_for_ai
```

## Development

To build the TypeScript code, run:

```bash
yarn build
```

To run the application in development mode with TypeScript, run:

```bash
yarn start
```

## Docker

To build and run the application using Docker, follow these steps:

1. Build the Docker image:
    ```sh
    docker build -t gestalt-app .
    ```

2. Run the Docker container:
    ```sh
    docker run -it --env-file .env gestalt-app
    ```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.