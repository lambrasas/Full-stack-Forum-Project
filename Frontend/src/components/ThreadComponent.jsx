import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { useUser } from "../Contexts/UserContext";

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
      if (response.ok) {
        const updatedThread = await response.json();
        setThreadState({
          likes: updatedThread.likes.length,
          dislikes: updatedThread.dislikes.length,
          userLiked: true,
          userDisliked: false,
        });
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
      if (response.ok) {
        const updatedThread = await response.json();
        setThreadState({
          likes: updatedThread.likes.length,
          dislikes: updatedThread.dislikes.length,
          userLiked: false,
          userDisliked: true,
        });
      }
    } catch (error) {
      console.error("Failed to dislike the thread:", error);
    }
  };

  return (
    <div style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
      <div>
        <h1
          onClick={() => navigate(`/thread/${thread._id}`)}
          style={{ cursor: "pointer", width: "fit-content" }}
        >
          {thread.title}
        </h1>
      </div>
      <div>
        <p>{thread.userId.name}</p>
        <p>{format(new Date(thread.createdDate), "dd/MM/yyyy")}</p>
      </div>
      <div>{thread.content.substring(0, 100)}...</div>
      <div>
        <button onClick={() => navigate(`/thread/${thread._id}`)}>
          Add comment
        </button>
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
