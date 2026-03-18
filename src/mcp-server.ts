import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { DefiLlamaClient } from './defillama-client.js';
import { registerAllTools } from './tools/index.js';
import express, { Request, Response } from 'express';
import cors from 'cors';

export async function startMCPServer() {
  const useHttp = process.argv.includes('--http') || process.argv.includes('-h');

  const client = new DefiLlamaClient();

  const server = new McpServer({
    name: 'DeFi Llama MCP Server',
    version: '1.0.0',
  });

  registerAllTools(server, client);

  if (useHttp) {
    await startWithHttp(server);
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
}

async function startWithHttp(server: McpServer) {
  const app = express();
  app.use(express.json());
  app.use(cors({
    origin: '*',
    exposedHeaders: ['Mcp-Session-Id']
  }));

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('ok');
  });

  app.post('/mcp', async (req: Request, res: Response) => {
    try {
      const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      res.on('close', () => {
        transport.close();
      });
    } catch (error) {
      console.error('Error handling MCP request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }
    }
  });

  app.get('/mcp', async (_req: Request, res: Response) => {
    res.writeHead(405).end(JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null
    }));
  });

  app.delete('/mcp', async (_req: Request, res: Response) => {
    res.writeHead(405).end(JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null
    }));
  });

  const PORT = parseInt(process.env.PORT || '3000', 10);
  app.listen(PORT, () => {
    console.log(`DeFi Llama MCP Server listening on port ${PORT}`);
  });

  process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    process.exit(0);
  });
}
