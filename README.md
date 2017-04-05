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

## Configuring

The bot will comment with the template below by default. You can change it by creating a file in `.github/DUPLICATE_ISSUE_TEMPLATE.md` and customizing the contents.

The template uses [mustache](https://mustache.github.io/) for rendering, and has two variables available:

- `payload`: The payload from the [issue webhook event](https://developer.github.com/v3/activity/events/types/#issuesevent).
- `issues`: An array of duplicate [issues](https://developer.github.com/v3/issues/#list-issues-for-a-repository)

```
Hey @{{ payload.sender.login }},

We did a quick check and this issue looks very darn similar to

{{#issues}}
* [#{{ number }} - {{ title }}]({{ number }})
{{/issues}}

This could be a coincidence, but if any of these issues solves your problem then I did a good job :smile:

If not, the maintainers will get to this issue shortly.

Cheers,
Your Friendly Neighborhood ProBot
```

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
