const fs = require('fs');
let data = fs.readFileSync('src/lib/actions.ts', 'utf8');

data = data.replace(
  /catch\s*\(\s*err\s*\)\s*\{\s*return\s*\{\s*success:\s*false,\s*error:\s*true\s*\}\s*;\s*\}/g,
  `catch (err: any) {
    console.error(err);
    return { success: false, error: true, message: err instanceof Error ? err.message : 'Unknown error' };
  }`
);

fs.writeFileSync('src/lib/actions.ts', data);
