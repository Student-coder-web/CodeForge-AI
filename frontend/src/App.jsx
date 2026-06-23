import { useState } from "react";
import axios from "axios";

function App() {

  const [repoUrl, setRepoUrl] = useState("");

  const handleAnalyze = async () => {

    try {

      const response = await axios.post(
        "http://localhost:8000/api/analyze",
        {
          repoUrl
        }
      );

      console.log(response.data);

      alert(response.data.message);

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "40px"
      }}
    >
      <h1>CodeForge AI</h1>

      <input
        type="text"
        placeholder="Enter GitHub URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />

      <button onClick={handleAnalyze}>
        Analyze Repository
      </button>
    </div>
  );
}

export default App;