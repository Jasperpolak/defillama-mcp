#!/usr/bin/env node
import { startMCPServer } from './mcp-server.js';

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startMCPServer().catch((error) => {
  console.error('Failed to start MCP Server:', error);
  process.exit(1);
});
