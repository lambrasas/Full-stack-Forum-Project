import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThreadComponent from "../components/ThreadComponent";
import { Link } from "react-router-dom";
import styles from "../components/ThreadsPage.module.scss";
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
  const handleThreadDelete = (threadId) => {
    setThreads(threads.filter((thread) => thread._id !== threadId));
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.threadsPageContainer}>
      <div className={styles.createThreadButtonContainer}>
        <button className={styles.link}>
          <Link
            style={{ color: "white", fontWeight: "600" }}
            to="/create-thread"
          >
            Create new thread
          </Link>
        </button>
      </div>
      <div className={styles.threadsListContainer}>
        {threads.map((thread) => (
          <ThreadComponent
            key={thread._id}
            thread={thread}
            onDelete={handleThreadDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ThreadsPage;
