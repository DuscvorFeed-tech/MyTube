const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const schemaPath = path.resolve(process.cwd(), 'build', 'schema.json');
  let schema = {};
  if (fs.existsSync(schemaPath)) {
    const data = fs.readFileSync(schemaPath);
    schema = JSON.parse(data);
  }
  res.status(200).json(schema);
};
