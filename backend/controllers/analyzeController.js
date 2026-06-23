const simpleGit = require("simple-git");
const path = require("path");
const fs = require("fs");

const detectTechStack = require("../services/detectTechStack");
const architectureAnalyzer = require("../services/architectureAnalyzer");

const chunkRepo = require("../services/rag/chunkRepo");
const createVectorStore = require("../services/rag/vectorStore");
const retrieveContext = require("../services/rag/retrieveContext");
const generateInterviewQuestions = require("../services/rag/generateInterviewQuestions");
const architectureAgent = require(
  "../services/agents/architectureAgent"
);
const analyzeRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({
        success: false,
        message: "Repository URL is required",
      });
    }

    console.log("Repository URL:", repoUrl);

    const repoName = repoUrl
      .split("/")
      .pop()
      .replace(".git", "");

    const tempDir = path.join(__dirname, "../temp");

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const localPath = path.join(tempDir, repoName);

    // Remove old clone
    if (fs.existsSync(localPath)) {
      fs.rmSync(localPath, {
        recursive: true,
        force: true,
      });
    }

    console.log("Cloning Repository...");

    await simpleGit().clone(
      repoUrl,
      localPath
    );

    console.log("Repository Cloned");

    // Repository Structure
    const files = fs.readdirSync(localPath, {
      withFileTypes: true,
    });

    const structure = files.map((file) => ({
      name: file.name,
      type: file.isDirectory()
        ? "folder"
        : "file",
    }));

    // Tech Stack Analysis
    const techStack =
      detectTechStack(localPath);

    const architectureData =
      architectureAnalyzer(techStack);

    // ==========================
    // RAG PIPELINE
    // ==========================

    console.log("Chunking Repository...");

    const chunks =
      await chunkRepo(localPath);

    console.log(
      "Total Chunks:",
      chunks.length
    );

    console.log(
      "Creating Vector Store..."
    );

    const vectorStore =
      await createVectorStore(
        chunks
      );

    console.log(
      "Vector Store Created"
    );

    console.log(
      "Retrieving Relevant Context..."
    );

    const relevantDocs =
      await retrieveContext(
        vectorStore,
        `
        repository architecture
        frontend
        backend
        authentication
        api integration
        database
        security
        interview questions
        `
      );

    console.log(
      "Retrieved Docs:",
      relevantDocs.length
    );

    const ragContext =
      relevantDocs
        .map(
          (doc) =>
            doc.pageContent
        )
        .join("\n\n");

    const documentationAgent =
      require(
        "../services/agents/documentationAgent"
      );

    const documentation =
      await documentationAgent(
        ragContext
      );

    const architectureReport =
      await architectureAgent(
        ragContext
      );
    console.log(
      "RAG Context Length:",
      ragContext.length
    );

    console.log(
      "Generating Questions..."
    );

    const questions =
      await generateInterviewQuestions(
        ragContext
      );

    console.log(
      "Questions Generated"
    );

    return res.json({
      success: true,
      repoName,
      structure,
      techStack,
      ...architectureData,
      chunks: chunks.length,
      retrievedDocs:
        relevantDocs.length,
      questions,
      documentation,
      architectureReport
    });

  } catch (error) {

    console.error(
      "ERROR IN ANALYZE REPO:"
    );

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  analyzeRepo,
};