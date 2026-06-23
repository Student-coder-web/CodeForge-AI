const { ChatOllama } = require("@langchain/ollama");

async function test() {
  try {
    console.log("Starting...");

    const llm = new ChatOllama({
      model: "qwen3:8b",
    });

    console.log("Model created");

    const response = await llm.invoke(
      "What is React?"
    );

    console.log("SUCCESS");
    console.log(response.content);

  } catch (error) {
    console.error("ERROR:");
    console.error(error);
  }
}

test();