const { spawn } = require("child_process");
const http = require("http");
const httpProxy = require("http-proxy");

const INTERNAL_PORT = 10000;
const EXTERNAL_PORT = parseInt(process.env.PORT) || 3001;

// Start the MCP server on localhost
const child = spawn("npx", ["-y", "@aashari/mcp-server-atlassian-bitbucket"], {
  env: { ...process.env, TRANSPORT_MODE: "http", MCP_HTTP_PORT: String(INTERNAL_PORT) },
  stdio: ["pipe", "pipe", "pipe"],
});

child.stderr.on("data", (d) => console.error("[mcp]", d.toString().trim()));
child.stdout.on("data", (d) => console.log("[mcp]", d.toString().trim()));
child.on("exit", (code) => {
  console.error(`[mcp] exited with code ${code}`);
  process.exit(1);
});

// Wait for the MCP server to be ready, then proxy it on 0.0.0.0
setTimeout(() => {
  const proxy = httpProxy.createProxyServer({ target: `http://127.0.0.1:${INTERNAL_PORT}` });

  const server = http.createServer((req, res) => {
    proxy.web(req, res, {}, (err) => {
      console.error("[proxy] error:", err.message);
      res.writeHead(502);
      res.end("MCP server not ready");
    });
  });

  // Handle SSE / upgrade connections
  server.on("upgrade", (req, socket, head) => {
    proxy.ws(req, socket, head);
  });

  server.listen(EXTERNAL_PORT, "0.0.0.0", () => {
    console.log(`[proxy] Listening on 0.0.0.0:${EXTERNAL_PORT} -> 127.0.0.1:${INTERNAL_PORT}`);
  });
}, 5000);
