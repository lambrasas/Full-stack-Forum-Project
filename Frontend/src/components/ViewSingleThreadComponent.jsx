import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useUser } from "../Contexts/UserContext";
import styles from "./ViewSingleThreadComponent.module.scss";
import EditableContent from "./EditableContent";
const ViewSingleThreadComponent = () => {
  const { threadId } = useParams();
  const { user } = useUser();
  const [thread, setThread] = useState(null);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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
      setUserLiked(updatedThreadData.likes.includes(user?._id));
      setUserDisliked(updatedThreadData.dislikes.includes(user?._id));
    } catch (error) {
      console.error(
        `Failed to ${like ? "like" : "dislike"} the thread:`,
        error
      );
    }
  };
  const handleContentSave = async (newContent) => {
    const response = await fetch(
      `http://localhost:3000/threads/${thread._id}/edit`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, content: newContent }),
      }
    );
    if (response.ok) {
      const updatedThread = await response.json();
      setThread({
        ...thread,
        content: updatedThread.content,
        editedStatus: true,
      });
      setIsEditing(false);
    } else {
      setError("Failed to update the thread.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!thread) return <p>No thread found</p>;

  return (
    <div className={styles.singleThreadContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.nameDateContainer}>
          <p className={styles.name}>{thread.userId.name}</p>
          <p className={styles.date}>
            {format(new Date(thread.createdDate), "dd/MM/yyyy")}
          </p>
        </div>
      </div>
      <div className={styles.titleContainer}>
        <h1>{thread.title}</h1>
      </div>
      <div className={styles.contentContainer}>
        {user && user._id === thread.userId._id ? (
          <EditableContent
            content={thread.content}
            onSave={handleContentSave}
            threadId={thread._id}
            maxLength={1000}
          />
        ) : (
          <p>{thread.content}</p>
        )}
        {thread.editedStatus && (
          <p className={styles.editedLabel}>Edited by OP</p>
        )}
      </div>
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
