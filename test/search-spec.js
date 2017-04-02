const { expect } = require('chai');

const search = require('../src/search');
let issues = require('./data/issues.json');

issues = issues.filter((issue, index) => {
  return !issues.find((tIssue, tIndex) => tIssue.number === issue.number && index !== tIndex && index < tIndex);
});

describe('search', () => {
  it('should return an empty array when there are no matches', () => {
    const results = search(issues, 2106);
    expect(results).to.be.an('array');
    expect(results).to.have.lengthOf(0);
  });

  it('should return a list of valid duplicates when there are matches', () => {
    // Media key double skip
    const results = search(issues, 2217);
    expect(results.length).to.be.at.least(5);

    // High CPU Usage
    const results2 = search(issues, 2320);
    expect(results2.length).to.be.at.least(5);

    // Offline Music
    const results3 = search(issues, 2091);
    expect(results3.length).to.be.at.least(3);
  });
});
