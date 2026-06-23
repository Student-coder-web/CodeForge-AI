import { useState } from "react";
import axios from "axios";

function App() {
  const [repoUrl, setRepoUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [data, setData] =
    useState(null);

  const handleAnalyze = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/analyze",
        {
          repoUrl,
        }
      );

      setData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">
        CodeForge AI
      </h1>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="GitHub Repository URL"
          value={repoUrl}
          onChange={(e) =>
            setRepoUrl(e.target.value)
          }
          className="flex-1 p-3 rounded bg-slate-800 border border-slate-700"
        />

        <button
          onClick={handleAnalyze}
          className="bg-blue-600 px-6 py-3 rounded"
        >
          Analyze
        </button>
      </div>

      {loading && (
        <div className="text-xl">
          Analyzing Repository...
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Overview */}

          <div className="bg-slate-900 p-5 rounded">
            <h2 className="text-2xl font-bold mb-3">
              Repository Overview
            </h2>

            <p>
              <b>Name:</b>{" "}
              {data.repoName}
            </p>

            <p>
              <b>Project Type:</b>{" "}
              {data.projectType}
            </p>

            <p>
              <b>Architecture Score:</b>{" "}
              {data.architectureScore}
            </p>

            <p>
              <b>Chunks:</b>{" "}
              {data.chunks}
            </p>

            <p>
              <b>Retrieved Docs:</b>{" "}
              {data.retrievedDocs}
            </p>
          </div>

          {/* Tech Stack */}

          <div className="bg-slate-900 p-5 rounded">
            <h2 className="text-2xl font-bold mb-3">
              Tech Stack
            </h2>

            <div className="flex flex-wrap gap-2">
              {data.techStack?.map(
                (tech, index) => (
                  <span
                    key={index}
                    className="bg-blue-700 px-3 py-1 rounded"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Interview Agent */}

          <div className="bg-slate-900 p-5 rounded">
            <h2 className="text-2xl font-bold mb-3">
              Interview Agent
            </h2>

            <pre className="whitespace-pre-wrap">
              {data.questions}
            </pre>
          </div>

          {/* Documentation Agent */}

          <div className="bg-slate-900 p-5 rounded">
            <h2 className="text-2xl font-bold mb-3">
              Documentation Agent
            </h2>

            <pre className="whitespace-pre-wrap">
              {data.documentation}
            </pre>
          </div>

          {/* Architecture Agent */}

          <div className="bg-slate-900 p-5 rounded">
            <h2 className="text-2xl font-bold mb-3">
              Architecture Agent
            </h2>

            <pre className="whitespace-pre-wrap">
              {data.architectureReport}
            </pre>
          </div>

          {/* Repository Structure */}

          <div className="bg-slate-900 p-5 rounded">
            <h2 className="text-2xl font-bold mb-3">
              Repository Structure
            </h2>

            {data.structure?.map(
              (item, index) => (
                <div key={index}>
                  {item.type === "folder"
                    ? "📁"
                    : "📄"}{" "}
                  {item.name}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;