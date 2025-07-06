# Cursor MCP in Action

A multi-component project demonstrating Cursor MCP (Model Context Protocol) integration with a React Native mobile app and Node.js server.

## Project Structure

```
cursor-mcp-in-action/
├── .cursor/                 # MCP configurations and rules
├── gh-cli-mcp-server/      # Local MCP server with GitHub CLI tool
├── react-native/          # Mobile application
└── server/                # Node.js server for products/orders/customers
```

### Components

- **`.cursor/`** - Contains MCP configurations and workspace rules
- **`gh-cli-mcp-server/`** - Local MCP server with a single tool to retrieve comments from GitHub CLI
- **`react-native/`** - Mobile application for POS system
- **`server/`** - Node.js server providing APIs for products, orders, and customers

## Setup Instructions

### 1. Install Dependencies

Run `yarn` in each of the three main directories:

```bash
# Install dependencies for all components
cd gh-cli-mcp-server && yarn
cd ../react-native && yarn
cd ../server && yarn
```

### 2. Start the Server

```bash
cd server
yarn start
```

### 3. Configure React Native

1. Get your server's IP address
2. Update `react-native/src/constants.ts` with your server IP as `BASE_URL`

### 4. Start React Native

```bash
cd react-native
yarn start
```

### 5. Verify MCP Tools

In Cursor, check that all MCP tools are loaded and available for use.

## Usage

Once all components are running:
- The mobile app will connect to the Node.js server for data
- The MCP server provides GitHub CLI integration for Cursor
- Use Cursor with the loaded MCP tools for enhanced development experience

## Development

This project demonstrates the integration of:
- Model Context Protocol (MCP) servers
- React Native mobile development
- Node.js backend services
- GitHub CLI automation through MCP tools 