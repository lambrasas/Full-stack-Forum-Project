import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { useUser } from "../Contexts/UserContext";
import styles from "../components/ThreadComponent.module.scss";

const ThreadComponent = ({ thread }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [threadState, setThreadState] = useState({
    likes: thread.likes,
    dislikes: thread.dislikes,
    userLiked: thread.likes.includes(user?._id),
    userDisliked: thread.dislikes.includes(user?._id),
  });

  useEffect(() => {
    setThreadState({
      likes: thread.likes,
      dislikes: thread.dislikes,
      userLiked: thread.likes.includes(user?._id),
      userDisliked: thread.dislikes.includes(user?._id),
    });
  }, [thread, user?._id]);

  const handleInteraction = async (like) => {
    if (!user) {
      alert("You must be logged in to react to a thread.");
      return;
    }

    const actionType = like ? "like" : "dislike";
    const updatedLikes = new Set(threadState.likes);
    const updatedDislikes = new Set(threadState.dislikes);

    if (like && updatedLikes.has(user._id)) {
      updatedLikes.delete(user._id);
    } else if (!like && updatedDislikes.has(user._id)) {
      updatedDislikes.delete(user._id);
    } else {
      if (like) {
        updatedLikes.add(user._id);
        updatedDislikes.delete(user._id);
      } else {
        updatedDislikes.add(user._id);
        updatedLikes.delete(user._id);
      }
    }

    setThreadState({
      likes: Array.from(updatedLikes),
      dislikes: Array.from(updatedDislikes),
      userLiked: updatedLikes.has(user._id),
      userDisliked: updatedDislikes.has(user._id),
    });

    try {
      const response = await fetch(
        `http://localhost:3000/${actionType}-thread/${thread._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${actionType} the thread on the server.`);
      }
    } catch (error) {
      console.error(`Error in ${actionType}ing the thread:`, error);
      setThreadState({
        likes: thread.likes,
        dislikes: thread.dislikes,
        userLiked: thread.likes.includes(user?._id),
        userDisliked: thread.dislikes.includes(user?._id),
      });
    }
  };
  const truncateContent = (content, length = 100) => {
    return content.length > length
      ? content.substring(0, length) + "..."
      : content;
  };
  if (!thread) return <p>No thread found</p>;

  return (
    <div className={styles.threadCard}>
      <div className={styles.nameDateContainer}>
        <p className={styles.name}>{thread.userId.name}</p>
        <p className={styles.date}>
          {format(new Date(thread.createdDate), "dd/MM/yyyy")}
        </p>
      </div>
      <h1
        className={styles.title}
        onClick={() => navigate(`/thread/${thread._id}`)}
      >
        {thread.title}
      </h1>
      <p className={styles.content}>{truncateContent(thread.content)}</p>
      <div className={styles.buttonsContainer}>
        <button
          style={{
            backgroundColor: threadState.userLiked ? "green" : "gray",
            border: "none",
            padding: "1px 5px",
            borderRadius: "5px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleInteraction(true);
          }}
        >
          👍 {threadState.likes.length}
        </button>
        <button
          style={{
            backgroundColor: threadState.userDisliked ? "red" : "gray",
            border: "none",
            padding: "1px 5px",
            borderRadius: "5px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleInteraction(false);
          }}
        >
          👎 {threadState.dislikes.length}
        </button>
      </div>
    </div>
  );
};

ThreadComponent.propTypes = {
  thread: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdDate: PropTypes.string.isRequired,
    userId: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    likes: PropTypes.arrayOf(PropTypes.string),
    dislikes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ThreadComponent;
