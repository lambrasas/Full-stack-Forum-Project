import { useState } from "react";
import { useUser } from "../Contexts/UserContext";
import InputField from "./InputField";
const CreateComment = ({ threadId, onCommentAdded }) => {
  const { user } = useUser();
  const [content, setContent] = useState("");

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    if (!user) {
      alert("You must be logged in to post comments.");
      return;
    }

    const optimisticComment = {
      content,
      threadId,
      createdDate: new Date().toISOString(),
      likes: [],
      dislikes: [],
      userId: {
        _id: user._id,
        name: user.name,
      },
    };

    try {
      const response = await fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: optimisticComment.content,
          userId: user._id,
          threadId,
        }),
      });

      if (response.ok) {
        const addedComment = await response.json();
        onCommentAdded({ ...optimisticComment, _id: addedComment._id });
        setContent("");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post comment.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Your Comment"
        inputType="textarea"
        onChange={handleContentChange}
        value={content}
        rows={5}
        maxLength={500}
        placeholder={"What is on your mind?"}
        style={{ width: "100%", margin: "10px 0" }}
      />
      <button type="submit">Post Comment</button>
    </form>
  );
};

export default CreateComment;
