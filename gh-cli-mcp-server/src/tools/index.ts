import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
// eslint-disable-next-line node/no-extraneous-import
import { z } from 'zod'

import {execSync} from 'child_process';

// Utility function for GitHub CLI operations
function executeGhCommand(path: string, command: string): string {
  try {
    return execSync(`cd ${path} && gh ${command}`, {encoding: 'utf8'});
  } catch (error) {
    if (error instanceof Error) {
      throw new McpError(
        ErrorCode.InternalError,
        `GitHub CLI error: ${error.message}`
      );
    }
    throw error;
  }
}

export const addTools = (mcpServer: McpServer): void => {

  // Get current PR with comments
  mcpServer.tool(
    'gh_pr_view_comments',
    'View a pull request with comments using gh api',
    {
      folderPath: z.string().describe('Path to the repository locally. It\'s full path to current folder. Don\'t pass . (dot)'),
      pr_number: z.string().optional().describe('PR number to view (optional, defaults to current branch PR)'),
      repo: z.string().optional().describe('Repository in owner/repo format (optional, defaults to current repo)')
    },
    {
      title: 'View PR Comments',
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: true,
    },
    async (request) => {
      try {
        const folderPath = request.folderPath;
        let repoPath = '';
        let prNumber = request.pr_number;

        // If repo is provided, use it directly
        if (request.repo) {
          repoPath = request.repo;
        } else {
          // Get current repo info
          const repoInfo = executeGhCommand(folderPath, 'repo view --json owner,name');
          const repoData = JSON.parse(repoInfo);
          repoPath = `${repoData.owner.login}/${repoData.name}`;
        }

        // If PR number is not provided, get current branch PR
        if (!prNumber) {
          const prInfo = executeGhCommand(folderPath, 'pr view --json number');
          const prData = JSON.parse(prInfo);
          prNumber = prData.number.toString();
        }

        // Use GitHub API to get PR comments
        const comments = executeGhCommand(folderPath, `api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /repos/${repoPath}/pulls/${prNumber}/comments`);

        // Parse and format the response
        const commentsData = JSON.parse(comments);
        if (commentsData.length === 0) {
          return { isError: false, content: [{ type: 'text', text: 'No comments found on this pull request.' }] };
        }

        // Format comments for better readability
        const formattedComments = commentsData.map((comment: any) => {
          return `**${comment.user.login}** commented on ${new Date(comment.created_at).toLocaleString()}:
${comment.body}
---
File: ${comment.path || 'N/A'}
Line: ${comment.line || comment.original_line || 'N/A'}
${comment.html_url}
`;
        }).join('\n\n');

        return { isError: false, content: [{ type: 'text', text: formattedComments }] };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return { isError: true, content: [{ type: 'text', text: `Error executing gh command: ${errorMsg}` }] };
      }
    }
  );
};
