const Fuze = require('fuse.js');
const nlp = require('compromise');

const remove = (value, arr, noReg) => {
  for (const repl of arr) {
    value = value.replace(noReg ? repl : new RegExp(`(?:^| |\\/)${repl}(?: |$|\\.|\\/)`, 'ig'), '');
  }
  return value;
};

const cache = {};

const ignoredTerms = [
  'Feature Request:',
  'Feature Request',
  'request:',
  'issue:',
  'issue',
  'Bug:',
  'Bug',
  '\\[BUG\\]',
  '\\[ISSUE\\]',
  '\\[FEATURE\\]',
  '\\[FEATURE REQUEST\\]',
  'Uncaught Exception:',
  'the',
  'and',
  'a',
  'an',
  'when',
  'it',
  'to',
  'or'
];

module.exports = (allIssues, issueNumber, extraIgnoredTerms = []) => {
  const otherIssues = allIssues.filter(issue => issue.number !== issueNumber);
  const theIssue = allIssues.find(issue => issue.number === issueNumber);

  const fuse = new Fuze(otherIssues, {
    shouldSort: true,
    threshold: 0.4,
    keys: ['title'],
    include: ['score'],
    getFn: (obj, path) => {
      if (cache[obj[path]]) {
        return cache[obj[path]];
      }
      let value = obj[path];
      if (typeof value === 'string') {
        value = remove(value, nlp(value).contractions().data().map(o => o.text), true);
        value = remove(value, ignoredTerms.concat(extraIgnoredTerms));
      }
      cache[obj[path]] = value;
      return value;
    }
  });

  return fuse.search(theIssue.title).filter(({ score }) => score <= 0.4).map(({ item }) => item);
};
