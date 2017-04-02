const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const issues = [];

const getPage = pageNum =>
  fetch(`https://api.github.com/repos/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/issues?state=all&per_page=100&page=${pageNum}`)
    .then(r => r.json())
    .then(data => {
      if (data.length > 0) {
        issues.push(...data);
        getPage(pageNum + 1);
      } else {
        fs.writeFileSync(path.resolve(__dirname, 'issues.json'), JSON.stringify(issues));
      }
    });

getPage(0);
