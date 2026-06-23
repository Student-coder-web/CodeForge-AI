const { ChatOllama } =
require("@langchain/ollama");

async function documentationAgent(
  ragContext
) {

  const llm =
    new ChatOllama({
      model: "phi3:latest",
      temperature: 0,
    });

  const prompt = `
You are a Senior Technical Writer.

Repository Context:

${ragContext}

Generate:

1. Project Overview
2. Main Features
3. Tech Stack
4. Folder Structure Explanation
5. Setup Instructions

Return clean markdown.
`;

  const response =
    await llm.invoke(prompt);

  return response.content;
}

module.exports =
documentationAgent;