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

Analyze the repository.

Repository Context:

${repoContext}

Tasks:

1. Identify the project purpose.
2. Analyze architecture.
3. Generate:
   - 5 Beginner Questions
   - 5 Intermediate Questions
   - 5 Advanced Questions

Questions must be based on the actual code,
README,
dependencies,
and architecture.

Return only questions.
`;

  const response =
    await llm.invoke(prompt);

  return response.content;
}

module.exports =
generateInterviewQuestions;