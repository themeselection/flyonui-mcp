#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { apiClient } from "./utils/http-client.js";

// Create server instance
const server = new McpServer({
    name: "FlyonUI MCP Server",
    version: "1.0.0",
});

// A tool to get create Instructions to follow for IDE agent to generate/create/update FlyonUI blocks.
server.registerTool(
    "get-create-instructions",
    {
        title: "Get Instructions for FlyonUI.",
        description: "Get instructions for creating FlyonUI blocks using existing blocks. This tool provides instructions for creating new FlyonUI blocks using existing blocks. Use this tool when the user requests to generate a new component. mentions /create-flyonui or /cui. Strictly follow the steps one by one to ensure successful code generation.Retrieves Instructions for IDE agent to follow for creating/generating/updating FlyonUI blocks.",
    },
    async () => {
        try {
            const url = `/instructions?path=create-ui.md`;
            const response = await apiClient.get(url);

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(response.data, null, 2),
                    }
                ],
            };
        }
        catch (error) {
            console.error("Error fetching block metadata:", error);
            throw new Error("Failed to fetch block metadata");
        }
    }
);

// A tool to get instructions for generating FlyonUI blocks using the existing FlyonUI blocks as an inspiration.
server.registerTool(
    "get-inspire-instructions",
    {
        title: "Get Instructions for generating FlyonUI blocks using the existing FlyonUI blocks as an inspiration.",
        description: "Get instructions for working with FlyonUI blocks. This tool provides instructions for creating new FlyonUI blocks by taking the inspiration from existing FlyonUI blocks. Use this tool when the user requests to generate a new component by inspirations. mentions /inspire-flyonui or /iui.",
    },
    async () => {
        try {
            const url = `/instructions?path=inspire-ui.md`;
            const response = await apiClient.get(url);

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(response.data, null, 2),
                    }
                ],
            };
        }
        catch (error) {
            console.error("Error fetching block metadata:", error);
            throw new Error("Failed to fetch block metadata");
        }
    }
);

// A tool to get instructions for refining FlyonUI blocks.
server.registerTool(
    "get-refine-instructions",
    {
        title: "Get Instructions for refining flyonui blocks/code/component or page.",
        description: "Get instructions for refining FlyonUI blocks. This tool provides instructions for refining existing FlyonUI blocks. Use this tool when the user requests to refine an existing component. mentions /refine-flyonui or /rui.",
    },
    async () => {
        try {
            const url = `/instructions?path=refine-ui.md`;
            const response = await apiClient.get(url);

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(response.data, null, 2),
                    }
                ],
            };
        }
        catch (error) {
            console.error("Error fetching block metadata:", error);
            throw new Error("Failed to fetch block metadata");
        }
    }
);

// A tool to get the metadata of a block from a given URL.
server.registerTool(
    "get-blocks-metadata",
    {
        title: "Get Block Metadata",
        description: "Fetch the metadata of a block from a given URL. Use this tool to retrieve the block metadata. This will provide the metadata of all the FlyonUI blocks available for use.",
    },
    async () => {
        try {
            const url = `/instructions?path=block_metadata.json`;
            const response = await apiClient.get(url);

            if (response.status !== 200) {
                throw new Error(`Failed to fetch block metadata: ${response.status}`);
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(response.data, null, 2),
                    }
                ],
            };
        }
        catch (error) {
            console.error("Error fetching block metadata:", error);
            throw new Error("Failed to fetch block metadata");
        }
    }
);

// A tool to get the metadata of the block.
server.registerTool(
    "get-block-meta-content",
    {
        title: "Get Block Meta Content",
        description: "Fetch the content of the block metadata from the FlyonUI MCP server. Use this tool to retrieve the block metadata content.",
        inputSchema: { endpoint: z.string() },
    },
    async ({ endpoint }) => {
        try {

            const url = endpoint + "?type=mcp";
            const response = await apiClient.get(url);

            if (response.status !== 200) {
                throw new Error(`Failed to fetch block meta content: ${response.status}`);
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(response.data, null, 2),
                    }
                ],
            };
        }
        catch (error) {
            console.error("Error fetching block meta content:", error);
            throw new Error("Failed to fetch block meta content");
        }
    }
);

// A tool to get the content of a block from a given URL.
server.registerTool(
    "get-block-content",
    {
        title: "Get Block Data",
        description: "Fetch the content of a block from a given URL. Use this tool to retrieve the code block content from the authenticated URL.",
        inputSchema: { endpoint: z.string(), type: z.string() }
    },
    async ({ endpoint, type }) => {
        try {
            const url = endpoint + "?type=" + type;
            const response = await apiClient.get(url);

            if (response.status !== 200) {
                throw new Error(`Failed to fetch block data: ${response.status}`);
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(response.data, null, 2),
                    }
                ],
            };
        }
        catch (error) {
            console.error("Error fetching block data:", error);
            throw new Error("Failed to fetch block data");
        }
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("FlyonUI MCP Server is running...");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});