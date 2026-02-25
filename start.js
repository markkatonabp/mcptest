const fs = require("fs");
const path = require("path");

// List all available binaries so we find the right name
const binDir = path.join(__dirname, "node_modules", ".bin");
console.log("Available binaries:", fs.readdirSync(binDir).filter(f => f.includes("bitbucket") || f.includes("mcp") || f.includes("aashari")));
console.log("All binaries:", fs.readdirSync(binDir));
