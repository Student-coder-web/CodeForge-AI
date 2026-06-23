const fs = require("fs");
const path = require("path");

function extractRepoContext(repoPath) {
  let context = "";

  function traverse(dir) {
    const files = fs.readdirSync(dir, {
      withFileTypes: true,
    });

    for (const file of files) {
      const fullPath = path.join(
        dir,
        file.name
      );

      // Skip unnecessary folders
      if (
        file.isDirectory() &&
        ["node_modules", ".git"].includes(
          file.name
        )
      ) {
        continue;
      }

      if (file.isDirectory()) {
        traverse(fullPath);
      } else {
        try {
          const ext =
            path.extname(file.name);

          const importantFiles = [
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".md",
            ".json",
          ];

          if (
            importantFiles.includes(ext) ||
            file.name === "README.md" ||
            file.name === "package.json"
          ) {
            const content =
              fs.readFileSync(
                fullPath,
                "utf8"
              );

            context += `
===================================
FILE: ${fullPath}
===================================

${content}

`;
          }
        } catch (err) {
          console.log(
            "Skipping:",
            fullPath
          );
        }
      }
    }
  }

  traverse(repoPath);

  return context;
}

module.exports = extractRepoContext;