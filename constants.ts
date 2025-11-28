// Models
// Using Pro for complex code generation logic
export const MODEL_GENERATOR = 'gemini-3-pro-preview'; 

// Prompt Template
export const GENERATOR_PROMPT_TEMPLATE = `You are an expert senior software engineer and technical writer.
You are tasked with creating a robust API client integration for a user who may be non-technical.

**Goal**: Generate a production-ready client library, usage example, and a beginner-friendly setup guide.

**Inputs**:
- API Documentation: {API_DOC_URL}
- Target Language: {LANGUAGE}

**REQUIREMENTS**:

1. **Client Library Code**:
   - **Authentication**: Must use Environment Variables for keys/tokens. NEVER hardcode secrets.
   - **Error Handling**: Implement robust error handling. Catch HTTP errors (4xx, 5xx), network timeouts, and JSON parsing errors. Re-throw them with clear, human-readable messages. Implement retries for 5xx errors or rate limits (429) if appropriate.
   - **Pagination**: If the API lists resources (like users, orders), implement auto-pagination (fetching all pages automatically or providing a simple iterator). Do not make the user manually handle page tokens.
   - **Logging**: Add logging for requests and responses to aid debugging.

2. **Usage Example**:
   - Provide a complete, runnable script file (e.g., \`main.py\` or \`index.js\`) that imports your library and runs a demo function (like "fetch all users").

3. **README.md (CRITICAL)**:
   - **Target Audience**: Non-technical users. Use simple, plain English.
   - **Structure**:
     - **Prerequisites**: Exactly what to install (Node, Python, etc) with download links.
     - **Installation**: Exact commands to copy-paste to install dependencies.
     - **Configuration**: EXPLICITLY explain how to set the API Key as an environment variable. Explain what a \`.env\` file is and how to create it.
     - **Usage**: The exact command to run the script.
     - **Troubleshooting**: Simple explanation of common errors (e.g., "If you see 401, check your API key").

**Output Format**:
Return the response in the following Markdown format. Use code blocks for all code.

# Client Library
<code_block_with_filename>

# Example Usage
<code_block_with_filename>

# README & Setup Guide
<markdown_content>
`;