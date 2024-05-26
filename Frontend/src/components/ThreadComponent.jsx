import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { useUser } from "../Contexts/UserContext";
import styles from "./ThreadComponent.module.scss";
import truncateText from "./truncateText";

const ThreadComponent = ({ thread, onDelete, truncate }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [threadState, setThreadState] = useState({
    content: thread.content,
    likes: thread.likes,
    dislikes: thread.dislikes,
    userLiked: thread.likes.includes(user?._id),
    userDisliked: thread.dislikes.includes(user?._id),
    editedStatus: thread.editedStatus,
  });
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/comments/${thread._id}`
        );
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [thread]);

  useEffect(() => {
    setThreadState((prevState) => ({
      ...prevState,
      content: thread.content,
      likes: thread.likes,
      dislikes: thread.dislikes,
      userLiked: thread.likes.includes(user?._id),
      userDisliked: thread.dislikes.includes(user?._id),
      editedStatus: thread.editedStatus,
    }));
  }, [thread, user?._id]);

  const handleInteraction = async (like) => {
    if (!user) {
      alert("You must be logged in to react to a thread.");
      return;
    }

    const actionType = like ? "like" : "dislike";
    const url = `http://localhost:3000/${actionType}-thread/${thread._id}`;
    const body = JSON.stringify({ userId: user._id });

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      const updatedThread = await response.json();
      setThreadState((prevState) => ({
        ...prevState,
        likes: updatedThread.likes,
        dislikes: updatedThread.dislikes,
        userLiked: updatedThread.likes.includes(user?._id),
        userDisliked: updatedThread.dislikes.includes(user?._id),
      }));
    } catch (error) {
      console.error(`Error in ${actionType}ing the thread:`, error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this thread?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/delete-thread/${thread._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user._id }),
          }
        );
        if (response.ok) {
          onDelete(thread._id);
          alert("Thread deleted successfully.");
        } else {
          throw new Error("Failed to delete the thread.");
        }
      } catch (error) {
        console.error("Error deleting the thread:", error);
        alert(error.message);
      }
    }
  };
  if (!thread) return <p>No thread found</p>;

  const truncatedContent = truncate
    ? truncateText(threadState.content, 150)
    : threadState.content;

  return (
    <div className={styles.threadCard}>
      <div className={styles.nameDateContainer}>
        <div>
          <p className={styles.name}>{thread.userId.name}</p>
          <p className={styles.date}>
            {format(new Date(thread.createdDate), "dd/MM/yyyy")}
          </p>
        </div>

        <div>
          {threadState.editedStatus && (
            <p className={styles.editedLabel}>Edited by OP</p>
          )}
        </div>
      </div>
      <h1
        className={styles.title}
        onClick={() => navigate(`/thread/${thread._id}`)}
      >
        {thread.title}
      </h1>

      <p className={styles.content}>{truncatedContent}</p>

      <div className={styles.buttonsContainer}>
        <button
          className={`${styles.buttonBase} ${
            threadState.userLiked ? styles.likeButton : styles.neutralButton
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleInteraction(true);
          }}
        >
          👍 {threadState.likes.length}
        </button>
        <button
          className={`${styles.buttonBase} ${
            threadState.userDisliked
              ? styles.dislikeButton
              : styles.neutralButton
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleInteraction(false);
          }}
        >
          👎 {threadState.dislikes.length}
        </button>
        {user && user._id === thread.userId._id && (
          <button
            className={`${styles.buttonBase} ${styles.deleteButton}`}
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
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
    }).isRequired,
    likes: PropTypes.arrayOf(PropTypes.string),
    dislikes: PropTypes.arrayOf(PropTypes.string),
    editedStatus: PropTypes.bool,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  truncate: PropTypes.bool,
};

export default ThreadComponent;
