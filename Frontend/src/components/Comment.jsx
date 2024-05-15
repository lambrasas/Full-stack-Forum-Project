import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { useUser } from "../Contexts/UserContext";
import styles from "./Comment.module.scss";
import EditableContent from "./EditableContent";
import InputField from "./InputField";

const Comment = ({ comment, onDelete, onSave }) => {
  const { user } = useUser();
  const [likes, setLikes] = useState(comment.likes.length);
  const [dislikes, setDislikes] = useState(comment.dislikes.length);
  const [userLiked, setUserLiked] = useState(comment.likes.includes(user?._id));
  const [userDisliked, setUserDisliked] = useState(
    comment.dislikes.includes(user?._id)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  useEffect(() => {
    setUserLiked(comment.likes.includes(user?._id));
    setUserDisliked(comment.dislikes.includes(user?._id));
  }, [comment, user?._id]);

  const handleLike = async () => {
    if (!user) {
      alert("You must be logged in to react to a comment.");
      return;
    }
    if (!userLiked) {
      try {
        const response = await fetch(
          `http://localhost:3000/comments/${comment._id}/like`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setLikes(data.likes.length);
          setDislikes(data.dislikes.length);
          setUserLiked(true);
          setUserDisliked(false);
        } else {
          throw new Error("Failed to like comment");
        }
      } catch (error) {
        console.error("Error liking comment:", error);
      }
    }
  };

  const handleDislike = async () => {
    if (!user) {
      alert("You must be logged in to react to a comment.");
      return;
    }
    if (!userDisliked) {
      try {
        const response = await fetch(
          `http://localhost:3000/comments/${comment._id}/dislike`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setLikes(data.likes.length);
          setDislikes(data.dislikes.length);
          setUserLiked(false);
          setUserDisliked(true);
        } else {
          throw new Error("Failed to dislike comment");
        }
      } catch (error) {
        console.error("Error disliking comment:", error);
      }
    }
  };

  const handleEdit = () => {
    if (user && user._id === comment.userId._id) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (editContent !== comment.content) {
      try {
        const response = await fetch(
          `http://localhost:3000/comments/${comment._id}/edit`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user._id, content: editContent }),
          }
        );
        if (response.ok) {
          const updatedComment = await response.json();
          onSave(updatedComment);
          setIsEditing(false);
        } else {
          throw new Error("Failed to update comment.");
        }
      } catch (error) {
        console.error("Error updating comment:", error);
        alert("Failed to update comment.");
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/comments/${comment._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user._id }),
          }
        );

        if (response.ok) {
          onDelete(comment._id);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete the comment.");
        }
      } catch (error) {
        console.error("Error deleting the comment:", error);
        alert(error.message);
      }
    }
  };

  return (
    <div className={styles.comment}>
      <div>
        <strong>{comment.userId.name}</strong> -{" "}
        <span style={{ opacity: 0.5, fontSize: "13px" }}>
          {format(new Date(comment.createdDate), "dd/MM/yyyy")}
        </span>
        {comment.editedStatus && (
          <span
            style={{
              fontStyle: "italic",
              fontSize: "12px",
              marginLeft: "10px",
            }}
          >
            (Edited)
          </span>
        )}
        {isEditing ? (
          <InputField
            label="Edit Comment"
            inputType="textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={500}
          />
        ) : (
          <p>{comment.content}</p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={handleLike}
            style={{
              backgroundColor: userLiked ? "green" : undefined,
              border: "none",
              padding: "1px 5px",
              borderRadius: "5px",
            }}
          >
            👍 {likes}
          </button>
          <button
            onClick={handleDislike}
            style={{
              backgroundColor: userDisliked ? "red" : undefined,
              border: "none",
              padding: "1px 5px",
              borderRadius: "5px",
            }}
          >
            👎 {dislikes}
          </button>
        </div>

        <div>
          {user && user._id === comment.userId._id && (
            <div style={{ display: "flex", gap: "10px" }}>
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    style={{
                      backgroundColor: "blue",
                      border: "none",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{
                      backgroundColor: "gray",
                      border: "none",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    style={{
                      backgroundColor: "blue",
                      border: "none",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{
                      backgroundColor: "red",
                      border: "none",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    userId: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    createdDate: PropTypes.string.isRequired,
    likes: PropTypes.arrayOf(PropTypes.string),
    dislikes: PropTypes.arrayOf(PropTypes.string),
    editedStatus: PropTypes.bool,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Comment;
