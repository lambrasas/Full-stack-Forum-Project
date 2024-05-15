import { useEffect, useState } from "react";
import ThreadComponent from "../components/ThreadComponent";
import { Link } from "react-router-dom";
import styles from "../components/ThreadsPage.module.scss";
import FilterDropdown from "../components/FilterDropdown";
import LogoutButton from "../components/LogoutButton";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Contexts/UserContext";
const ThreadsPage = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(
    () => localStorage.getItem("filter") || "likesDesc"
  );
  const navigate = useNavigate();
  const { user } = useUser();
  useEffect(() => {
    if (!user) {
      console.log("No user found, redirecting to login page.");
      navigate("/");
      return;
    }

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

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    localStorage.setItem("filter", newFilter);
  };

  const getSortedThreads = (threads, filter) => {
    const sortedThreads = [...threads];

    switch (filter) {
      case "likesAsc":
        return sortedThreads.sort((a, b) => {
          if (a.likes.length === b.likes.length) {
            return new Date(a.createdDate) - new Date(b.createdDate);
          }
          return a.likes.length - b.likes.length;
        });

      case "likesDesc":
        return sortedThreads.sort((a, b) => {
          if (a.likes.length === b.likes.length) {
            return new Date(b.createdDate) - new Date(a.createdDate);
          }
          return b.likes.length - a.likes.length;
        });

      case "dislikesAsc":
        return sortedThreads.sort((a, b) => {
          if (a.dislikes.length === b.dislikes.length) {
            return new Date(a.createdDate) - new Date(b.createdDate);
          }
          return a.dislikes.length - b.dislikes.length;
        });

      case "dislikesDesc":
        return sortedThreads.sort((a, b) => {
          if (a.dislikes.length === b.dislikes.length) {
            return new Date(b.createdDate) - new Date(a.createdDate);
          }
          return b.dislikes.length - a.dislikes.length;
        });

      case "repliesAsc":
        return sortedThreads.sort((a, b) => {
          if (a.comments.length === b.comments.length) {
            return new Date(a.createdDate) - new Date(b.createdDate);
          }
          return a.comments.length - b.comments.length;
        });

      case "repliesDesc":
        return sortedThreads.sort((a, b) => {
          if (a.comments.length === b.comments.length) {
            return new Date(b.createdDate) - new Date(a.createdDate);
          }
          return b.comments.length - a.comments.length;
        });

      case "newest":
        return sortedThreads.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );

      case "oldest":
        return sortedThreads.sort(
          (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
        );

      default:
        return sortedThreads;
    }
  };

  const sortedThreads = getSortedThreads(threads, filter);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.threadsPageContainer}>
      <div className={styles.createThreadButtonContainer}>
        <FilterDropdown filter={filter} onChange={handleFilterChange} />
        <button className={styles.link}>
          <Link
            style={{ color: "white", fontWeight: "600" }}
            to="/create-thread"
          >
            Create new thread
          </Link>
        </button>
        <LogoutButton />
      </div>

      <div className={styles.threadsListContainer}>
        {sortedThreads.map((thread) => (
          <ThreadComponent
            key={thread._id}
            thread={thread}
            onDelete={handleThreadDelete}
            truncate={true}
          />
        ))}
      </div>
    </div>
  );
};

export default ThreadsPage;
