function architectureAnalyzer(techStack) {

  let projectType = "Unknown Project";
  let score = 50;

  if (
    techStack.includes("React") &&
    techStack.includes("Express")
  ) {
    projectType = "Full Stack Web Application";
    score += 20;
  }

  if (techStack.includes("Docker")) {
    score += 10;
  }

  if (techStack.includes("Kubernetes")) {
    score += 20;
  }

  if (
    techStack.includes("LangChain") ||
    techStack.includes("ChromaDB")
  ) {
    projectType = "AI Application";
    score += 15;
  }

  if (
    techStack.includes("Docker") &&
    techStack.includes("Kubernetes")
  ) {
    projectType =
      "Cloud Native Full Stack Application";
  }

  return {
    projectType,
    architectureScore: score,
  };
}

module.exports = architectureAnalyzer;