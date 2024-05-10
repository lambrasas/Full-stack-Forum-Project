import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useUser } from "../Contexts/UserContext";
import styles from "./ViewSingleThreadComponent.module.scss";

const ViewSingleThreadComponent = () => {
  const { threadId } = useParams();
  const { user } = useUser();
  const [thread, setThread] = useState(null);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!threadId) {
      console.error("Thread ID is undefined");
      setError("Thread ID is undefined");
      setLoading(false);
      return;
    }
    const fetchThread = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/get/thread/${threadId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the thread");
        }
        const data = await response.json();
        setThread(data);
        setUserLiked(data.likes.includes(user?._id));
        setUserDisliked(data.dislikes.includes(user?._id));
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchThread();
  }, [threadId, user?._id]);

  const handleLikeDislike = async (like = true) => {
    if (!user) {
      alert("You must be logged in to like or dislike a thread.");
      return;
    }
    if ((like && userLiked) || (!like && userDisliked)) {
      return;
    }

    try {
      const url = `http://localhost:3000/${like ? "like" : "dislike"}-thread/${
        thread._id
      }`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${like ? "like" : "dislike"} the thread on the server.`
        );
      }
      const updatedThreadData = await response.json();
      setThread(updatedThreadData);
      setUserLiked(like);
      setUserDisliked(!like);
    } catch (error) {
      console.error(
        `Failed to ${like ? "like" : "dislike"} the thread:`,
        error
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!thread) return <p>No thread found</p>;

  return (
    <div className={styles.singleThreadContainer}>
      <div className={styles.nameDateContainer}>
        <p className={styles.name}>{thread.userId.name}</p>
        <p className={styles.date}>
          {format(new Date(thread.createdDate), "dd/MM/yyyy")}
        </p>
      </div>
      <div className={styles.titleContainer}>
        <h1>{thread.title}</h1>
      </div>
      <div className={styles.contentContainer}>{thread.content}</div>
      <div className={styles.reactButtonsContainer}>
        <button
          className={styles.reactButton}
          style={{
            backgroundColor: userLiked ? "green" : undefined,
            border: "none",
            padding: "1px 5px",
            borderRadius: "5px",
          }}
          onClick={() => handleLikeDislike(true)}
        >
          👍 {thread.likes.length}
        </button>
        <button
          className={styles.reactButton}
          style={{
            backgroundColor: userDisliked ? "red" : undefined,
            border: "none",
            padding: "1px 5px",
            borderRadius: "5px",
          }}
          onClick={() => handleLikeDislike(false)}
        >
          👎 {thread.dislikes.length}
        </button>
      </div>
    </div>
  );
};

export default ViewSingleThreadComponent;
