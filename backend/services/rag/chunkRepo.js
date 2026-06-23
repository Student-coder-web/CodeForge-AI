const fs = require("fs");
const path = require("path");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
async function chunkRepo(repoPath) {
  let documents = [];

  function traverse(dir) {
    const files = fs.readdirSync(dir, {
      withFileTypes: true,
    });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (
        file.isDirectory() &&
        [".git", "node_modules"].includes(
          file.name
        )
      ) {
        continue;
      }

      if (file.isDirectory()) {
        traverse(fullPath);
      } else {
        try {
          const ext = path.extname(file.name);

          if (
            [".js", ".jsx", ".ts", ".tsx", ".md", ".json"]
              .includes(ext)
          ) {
            const content =
              fs.readFileSync(
                fullPath,
                "utf8"
              );

            documents.push({
              pageContent: content,
              metadata: {
                source: fullPath,
              },
            });
          }
        } catch (err) {}
      }
    }
  }

  traverse(repoPath);

  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

  const chunks =
    await splitter.splitDocuments(
      documents
    );

  return chunks;
}

module.exports = chunkRepo;