# Probot Issue Duplicate Detection

> a GitHub Integration built with [probot](https://github.com/probot/probot) that automatically
detects duplicate issues so you don't have to.

## Setup

```
# Install dependencies
npm install

# Run the bot
npm run
```

For more information, see the [documentation for probot](https://github.com/probot/probot).

## Deploying to Now

1. Install the now CLI with `npm i -g now`

2. [Create an integration](https://github.com/settings/integrations/new) on GitHub, using `https://[your-now-id].now.sh/`
(replacing `[your-now-id]` with a custom now alias) as the **Homepage URL**, **Callback URL**, and **Webhook URL**.
The permissions and events that your bot needs access to will depend on what you use it for. Read more about
[creating an integration](https://developer.github.com/early-access/integrations/creating-an-integration/).

3. After creating your Github integrations, make sure that you click the green install button on the top left
of the integration page.
This gives you an option of installing the integration on all or a subset of your repositories.

4. Download the Private Key and put it in this folder called "prod.pem"

5. Run `now`

6. You're up and running
