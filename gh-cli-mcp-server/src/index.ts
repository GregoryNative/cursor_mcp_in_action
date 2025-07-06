import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { addTools } from "./tools/index";

const startServerOverStdio = async (): Promise<void> => {
  const mcpServer = new McpServer({ name: 'gh-cli-mcp-server', version: '1.0.0' }, { capabilities: {} });
  addTools(mcpServer);

  const mcpTransport = new StdioServerTransport();
  await mcpServer.connect(mcpTransport);
};

startServerOverStdio().catch(console.error);
