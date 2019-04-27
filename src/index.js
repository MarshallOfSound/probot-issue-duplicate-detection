const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

const search = require('./search');

const defaultTemplate = fs.readFileSync(path.resolve(__dirname, 'template.md'), { encoding: 'utf-8' });

module.exports = robot => {
  robot.on('issues.opened', async context => {
    const github = context.github;
    context.log('issue opened');

    // Get all issues that aren't the new issue
    const req = github.issues.getForRepo(context.repo({state: 'all'}))
    const allIssues = await github.paginate(req, res => res.data);

    context.log(`Checking ${allIssues.length} issues`);

    const results = search(allIssues, context.issue().number);

    context.log(`found ${results.length} potential duplicates`);

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
        payload: context.payload,
        issues: results.slice(0, 3)
      });

      await github.issues.createComment(context.issue({ body: commentBody }));
    }
  });
};
