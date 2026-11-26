
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

import { retrieveChunks } from "./retrieve.js";

function createMcpServer() {
  const server = new McpServer({
    name: "rag-knowledge-assistant",
    version: "1.0.0",
  });

  server.registerTool(
    "search_knowledge_base",
    {
      title: "Search Knowledge Base",

      description:
        "Search uploaded PDFs, webpages and text documents using semantic similarity. Returns relevant document chunks with source information.",

      inputSchema: {
        query: z.string().trim().min(1).max(2000)
          .describe("The search query or question"),

        topK: z.number().int().min(1).max(10).default(3)
          .describe("Number of relevant chunks to retrieve"),
      },

      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
      },
    },

    async ({ query, topK }) => {
      try {
        const chunks = await retrieveChunks(query, topK);

        const result = {
          query,
          totalResults: chunks.length,

          sources: chunks.map((chunk, index) => ({
            sourceId: index + 1,
            document: chunk.document_title,
            chunkIndex: chunk.chunk_index,
            content: chunk.content,
            similarity: Number(chunk.similarity),
          })),
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error("MCP retrieval failed:", error);

        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Failed to search the knowledge base.",
            },
          ],
        };
      }
    }
  );

  return server;
}

export async function handleMcpRequest(req, res) {
  const server = createMcpServer();

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on("close", () => {
    void server.close().catch(console.error);
  });

  try {
    await server.connect(transport);

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP request failed:", error);

    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: req.body?.id ?? null,
      });
    }
  }
}