const Fuze = require('fuse.js');

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
      const commentBody =
`Hey There,
We did a quick check and this issue looks very darn similar to
${results.slice(0, 3).map(
  issue => `* [#${issue.number} - ${issue.title}](${issue.number})`
).join('  \n')}

This could be a cooincidence, but if any of these issues solves your problem then I did a good job :smile:

If not, the maintainers will get to this issue shortly.

Cheers,
Your Friendly Neighborhood ProBot`;

      await github.issues.createComment(context.issue({body: commentBody}));
    }
  });
};
