<?js
const fs = require('fs');
const content = fs.readFileSync('/home/claude/App_patched.jsx', 'utf8');
process.stdout.write(content);
?>