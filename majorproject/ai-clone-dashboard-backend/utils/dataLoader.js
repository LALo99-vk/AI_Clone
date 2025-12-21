const fs = require('fs');
const path = require('path');

function loadDataset(filename) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, '../datasets', filename), 'utf8')
  );
}

module.exports = { loadDataset };
