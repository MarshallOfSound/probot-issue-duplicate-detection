const fs = require('fs');
const Fuze = require('fuse.js');
const mustache = require('mustache');

const template = fs.readFileSync('./template.md', {encoding: 'utf-8'});

module.exports = robot => {
  robot.on('issues.opened', async (event, context) => {
    const github = await robot.auth(event.payload.installation.id);

    // Get all issues that aren't the new issue
    const allIssues = await github.issues.getForRepo(context.repo());
    const otherIssues = allIssues.filter(issue => issue.number !== context.issue().number);
    const theIssue = allIssues.find(issue => issue.number === context.issue().number);

    const fuse = new Fuze(otherIssues, {
      shouldSort: true,
      threshold: 0.2,
      keys: [{
        name: 'title',
        weight: 0.8
      }, {
        name: 'body',
        weight: 0.2
      }]
    });

    const results = fuse.search(theIssue.title);
    if (results.length > 0) {
      const commentBody = mustache.render(template, {
        payload: event.payload,
        issues: otherIssues.slice(0, 3)
      });

      await github.issues.createComment(context.issue({body: commentBody}));
    }
  });
};
