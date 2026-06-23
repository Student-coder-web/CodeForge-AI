function buildRepoContext(
  repoName,
  techStack,
  projectType,
  structure
) {

  return `
Repository Name:
${repoName}

Project Type:
${projectType}

Tech Stack:
${techStack.join(", ")}

Repository Structure:
${structure
  .map(item => item.name)
  .join("\n")}
`;
}

module.exports =
buildRepoContext;