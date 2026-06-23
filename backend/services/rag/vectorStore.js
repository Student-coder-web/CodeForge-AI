const { Chroma } =
require("@langchain/community/vectorstores/chroma");

const { OllamaEmbeddings } =
require("@langchain/ollama");

async function createVectorStore(
  chunks
) {
  const embeddings =
    new OllamaEmbeddings({
      model: "nomic-embed-text",
    });

  const vectorStore =
    await Chroma.fromDocuments(
      chunks,
      embeddings,
      {
        collectionName:
          "repo-analysis",

        url:
          "http://localhost:8001",
      }
    );

  return vectorStore;
}

module.exports =
  createVectorStore;