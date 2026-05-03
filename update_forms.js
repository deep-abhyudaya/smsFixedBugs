const fs = require('fs');
const path = require('path');

const formsDir = path.join('src', 'components', 'forms');
const files = fs.readdirSync(formsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(formsDir, file);
  let data = fs.readFileSync(filePath, 'utf8');

  // We want to replace the hardcoded "Something went wrong!" with state.message
  data = data.replace(
    /\{state\.error\s*&&\s*\(\s*<span className="text-red-500">Something went wrong!<\/span>\s*\)\s*\}/g,
    '{state.error && <span className="text-red-500">{(state as any).message || "Something went wrong!"}</span>}'
  );

  fs.writeFileSync(filePath, data);
}
