const { OllamaEmbeddings } = require("@langchain/ollama");

async function embedChunks(chunks) {
  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
  });

  const vectors =
    await embeddings.embedDocuments(
      chunks.map(
        (chunk) => chunk.pageContent
      )
    );

  return vectors;
}

module.exports = embedChunks;