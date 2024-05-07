import React, { useEffect } from "react";
import InputField from "../components/InputField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThreadComponent from "../components/ThreadComponent";
import { Link } from "react-router-dom";
const ThreadsPage = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate;

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch("http://localhost:3000/get/threads");
        if (!response.ok) {
          throw new Error("Failed to fetch threads");
        }
        const data = await response.json();
        setThreads(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div>
        <button>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to="/create-thread"
          >
            Create new thread
          </Link>
        </button>
      </div>
      {threads.map((thread) => (
        <ThreadComponent key={thread._id} thread={thread} />
      ))}
    </div>
  );
};

export default ThreadsPage;
