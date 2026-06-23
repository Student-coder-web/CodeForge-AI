const { ChatOllama } =
require("@langchain/ollama");

async function architectureAgent(
  ragContext
) {

  const llm =
    new ChatOllama({
      model: "phi3:latest",
      temperature: 0,
    });

  const prompt = `
You are a Software Architect.

Repository Context:

${ragContext}

Analyze:

1. Frontend Technology
2. Backend Technology
3. Database
4. Authentication
5. Deployment
6. Architecture Pattern

Return JSON:

{
 frontend:"",
 backend:"",
 database:"",
 authentication:"",
 deployment:"",
 architecture:""
}
`;

  const response =
    await llm.invoke(prompt);

  return response.content;
}

module.exports =
architectureAgent;