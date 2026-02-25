const fs = require("fs");
const path = require("path");

// First, find the correct binary name
const binDir = path.join(__dirname, "node_modules", ".bin");
const bins = fs.readdirSync(binDir);
console.log("Available binaries:", bins.filter(f => f.includes("bitbucket") || f.includes("mcp") || f.includes("aashari")));
