const simpleGit = require("simple-git");
const path = require("path");
const fs = require("fs");

const detectTechStack = require(
  "../services/detectTechStack"
);
const architectureAnalyzer = require(
  "../services/architectureAnalyzer"
);
const buildRepoContext = require(
  "../services/rag/repositoryContext"
);
const generateInterviewQuestions = require(
  "../services/rag/generateInterviewQuestions"
);

const analyzeRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    const repoName = repoUrl
      .split("/")
      .pop()
      .replace(".git", "");

    const tempDir = path.join(
      __dirname,
      "../temp"
    );

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, {
        recursive: true,
      });
    }

    const localPath = path.join(
      tempDir,
      repoName
    );

    if (fs.existsSync(localPath)) {
      fs.rmSync(localPath, {
        recursive: true,
        force: true,
      });
    }

    await simpleGit().clone(
      repoUrl,
      localPath
    );

    const files = fs.readdirSync(localPath, {
      withFileTypes: true,
    });

    const structure = files.map((file) => ({
      name: file.name,
      type: file.isDirectory()
        ? "folder"
        : "file",
    }));

    const techStack =
      detectTechStack(localPath);

    const architectureData =
      architectureAnalyzer(techStack);

    const repoContext = buildRepoContext(
      repoName,
      techStack,
      architectureData.projectType,
      structure
    );

    console.log("Generating questions...");

    const questions =
      await generateInterviewQuestions(
        repoContext
      );

    console.log("Questions generated");

    return res.json({
      success: true,
      repoName,
      structure,
      techStack,
      ...architectureData,
      questions,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  analyzeRepo,
};