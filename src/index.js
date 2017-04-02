const fs = require('fs');
const path = require('path');
const debug = require('debug')('index');
const mustache = require('mustache');

const search = require('./search');

const defaultTemplate = fs.readFileSync(path.resolve(__dirname, 'template.md'), { encoding: 'utf-8' });

module.exports = robot => {
  robot.on('issues.opened', async (event, context) => {
    const github = await robot.auth(event.payload.installation.id);
    debug('issue opened');

    // Get all issues that aren't the new issue
    const allIssues = await github.paginate(github.issues.getForRepo(context.repo()), issues => issues);

    const results = search(allIssues, context.issue().number);

    debug(`found ${results.length} potential duplicates`);

    if (results.length > 0) {
      let template;

      try {
        // Try to get issue template from the repository
        const params = context.repo({ path: '.github/DUPLICATE_ISSUE_TEMPLATE.md' });
        const data = await github.repos.getContent(params);
        template = Buffer.from(data.content, 'base64').toString();
      } catch (err) {
        // It doesn't have one, so let's use the default
        template = defaultTemplate;
      }

      const commentBody = mustache.render(template, {
        payload: event.payload,
        issues: results.slice(0, 3)
      });

      await github.issues.createComment(context.issue({ body: commentBody }));
    }
  });
};
