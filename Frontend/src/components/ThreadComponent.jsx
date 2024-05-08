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
    likes: thread.likes.length,
    dislikes: thread.dislikes.length,
    userLiked: thread.likes.includes(user?._id),
    userDisliked: thread.dislikes.includes(user?._id),
  });

  useEffect(() => {
    setThreadState({
      likes: thread.likes.length,
      dislikes: thread.dislikes.length,
      userLiked: thread.likes.includes(user?._id),
      userDisliked: thread.dislikes.includes(user?._id),
    });
  }, [thread, user?._id]);

  const handleLike = async () => {
    if (!user) {
      alert("You must be logged in to like a thread.");
      return;
    }
    setThreadState((prevState) => ({
      ...prevState,
      likes: prevState.userLiked ? prevState.likes : prevState.likes + 1,
      dislikes: prevState.userDisliked
        ? prevState.dislikes - 1
        : prevState.dislikes,
      userLiked: true,
      userDisliked: false,
    }));
    try {
      const response = await fetch(
        `http://localhost:3000/like-thread/${thread._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like the thread on the server.");
      }
    } catch (error) {
      console.error("Failed to like the thread:", error);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      alert("You must be logged in to dislike a thread.");
      return;
    }
    setThreadState((prevState) => ({
      ...prevState,
      likes: prevState.userLiked ? prevState.likes - 1 : prevState.likes,
      dislikes: prevState.userDisliked
        ? prevState.dislikes
        : prevState.dislikes + 1,
      userLiked: false,
      userDisliked: true,
    }));
    try {
      const response = await fetch(
        `http://localhost:3000/dislike-thread/${thread._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to dislike the thread on the server.");
      }
    } catch (error) {
      console.error("Failed to dislike the thread:", error);
    }
  };

  return (
    <div className={styles.threadCard}>
      <div>
        <h1
          onClick={() => navigate(`/thread/${thread._id}`)}
          style={{ cursor: "pointer", width: "fit-content" }}
        >
          {thread.title}
        </h1>
      </div>
      <div className={styles.nameDateContainer}>
        <p className={`${styles.name} ${styles.nameDate}`}>
          {thread.userId.name}
        </p>
        <p className={`${styles.date} ${styles.nameDate}`}>
          {format(new Date(thread.createdDate), "dd/MM/yyyy")}
        </p>
      </div>
      <div className={styles.content}>
        {thread.content.substring(0, 100)}...
      </div>
      <div className={styles.buttonsContainer}>
        <button
          className={styles.addCommentButton}
          onClick={() => navigate(`/thread/${thread._id}`)}
        >
          <svg
            width="16"
            height="14"
            viewBox="0 0 16 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 0C3.58125 0 0 2.90937 0 6.5C0 6.87046 0.0382008 7.23341 0.111531 7.58653C0.550753 9.70157 1.59622 12.0507 0.06875 13.5781C0 13.65 -0.01875 13.7563 0.021875 13.85C0.0625 13.9438 0.15 14 0.25 14C0.720918 14 1.16504 13.9487 1.57924 13.8621C3.66095 13.4272 5.87335 13 8 13C12.4187 13 16 10.0906 16 6.5C16 2.90937 12.4187 0 8 0Z"
              fill="#33394F"
            />
          </svg>
          Add comment
        </button>
        <div className={styles.likeDislikeContainer}>
          <button
            style={{
              backgroundColor: threadState.userLiked ? "green" : "none",
              border: "none",
              borderRadius: "5px",
            }}
            onClick={handleLike}
          >
            👍 {threadState.likes}
          </button>
          <button
            style={{
              backgroundColor: threadState.userDisliked ? "red" : "none",
              border: "none",
              borderRadius: "5px",
            }}
            onClick={handleDislike}
          >
            👎 {threadState.dislikes}
          </button>
        </div>
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
