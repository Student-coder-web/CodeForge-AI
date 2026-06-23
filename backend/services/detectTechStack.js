const fs = require("fs");
const path = require("path");

function findFiles(dir, targetFile, results = []) {
  const items = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      if (item.name === ".git") continue;

      findFiles(fullPath, targetFile, results);
    } else if (item.name === targetFile) {
      results.push(fullPath);
    }
  }

  return results;
}

function detectTechStack(repoPath) {
  const techStack = [];

  // =====================
  // PACKAGE.JSON ANALYSIS
  // =====================

  const packageFiles = findFiles(
    repoPath,
    "package.json"
  );

  for (const packageFile of packageFiles) {
    try {
      const packageJson = JSON.parse(
        fs.readFileSync(packageFile, "utf8")
      );

      const dependencies = {
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
      };

      // Frontend

      if (dependencies.react)
        techStack.push("React");

      if (dependencies.next)
        techStack.push("Next.js");

      if (dependencies["react-router-dom"])
        techStack.push("React Router");

      if (dependencies.tailwindcss)
        techStack.push("Tailwind CSS");

      // Backend

      if (dependencies.express)
        techStack.push("Express");

      if (dependencies.nestjs)
        techStack.push("NestJS");

      // Database

      if (dependencies.mongoose)
        techStack.push("MongoDB");

      if (dependencies.mongodb)
        techStack.push("MongoDB");

      if (dependencies.pg)
        techStack.push("PostgreSQL");

      if (dependencies.mysql2)
        techStack.push("MySQL");

      // AI

      if (dependencies.langchain)
        techStack.push("LangChain");

      if (dependencies.chromadb)
        techStack.push("ChromaDB");

      if (dependencies.openai)
        techStack.push("OpenAI");

      // Language

      if (dependencies.typescript)
        techStack.push("TypeScript");
      else
        techStack.push("JavaScript");
    } catch (error) {
      console.log(
        "Package Parse Error:",
        packageFile
      );
    }
  }

  // =====================
  // DOCKER DETECTION
  // =====================

  const dockerFiles = findFiles(
    repoPath,
    "Dockerfile"
  );

  if (dockerFiles.length > 0) {
    techStack.push("Docker");
  }

  // =====================
  // KUBERNETES DETECTION
  // =====================

  const yamlFiles = findFiles(
    repoPath,
    "deployment.yaml"
  );

  if (yamlFiles.length > 0) {
    techStack.push("Kubernetes");
  }

  // Folder Detection

  const folders = fs.readdirSync(repoPath, {
    withFileTypes: true,
  });

  for (const folder of folders) {
    if (
      folder.isDirectory() &&
      [
        "kubernetes",
        "k8s",
        "cluster-setup",
      ].includes(folder.name.toLowerCase())
    ) {
      techStack.push("Kubernetes");
    }
  }

  // =====================
  // NODE DETECTION
  // =====================

  if (packageFiles.length > 0) {
    techStack.push("Node.js");
  }

  return [...new Set(techStack)];
}

module.exports = detectTechStack;