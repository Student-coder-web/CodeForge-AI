const { ChatOllama } =
require("@langchain/ollama");

async function generateInterviewQuestions(
  repoContext
) {

  const llm =
    new ChatOllama({
      model: "qwen3:8b",
      temperature: 0.7,
    });

  const prompt = `
You are a Senior Software Engineer.

Analyze the repository information below.

Repository Context:

${repoContext}

Generate:

1. 5 Beginner Questions
2. 5 Intermediate Questions
3. 5 Advanced Questions

Return only questions.
`;

  const response =
    await llm.invoke(prompt);

  return response.content;
}

module.exports =
generateInterviewQuestions;