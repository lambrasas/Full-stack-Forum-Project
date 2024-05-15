import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ViewSingleThreadComponent from "../components/ViewSingleThreadComponent";
import { Link } from "react-router-dom";
import CreateComment from "../components/CreateComment";
import Comment from "../components/Comment";
import styles from "../components/ViewThreadPage.module.scss";

const ViewThreadPage = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const threadResponse = await fetch(
          `http://localhost:3000/get/thread/${threadId}`
        );
        const threadData = await threadResponse.json();
        if (threadResponse.ok) {
          setThread(threadData);
        } else {
          throw new Error(threadData.message || "Failed to fetch the thread");
        }

        const commentsResponse = await fetch(
          `http://localhost:3000/comments/${threadId}`
        );
        const commentsData = await commentsResponse.json();
        if (commentsResponse.ok) {
          const sortedComments = commentsData.sort(
            (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
          );
          setComments(sortedComments);
        } else {
          throw new Error(commentsData.message || "Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [threadId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!thread) return <p>No thread found</p>;

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  const handleCommentDelete = (commentId) => {
    setComments((currentComments) =>
      currentComments.filter((c) => c._id !== commentId)
    );
  };

  const handleCommentSave = (updatedComment) => {
    setComments((currentComments) =>
      currentComments.map((c) =>
        c._id === updatedComment._id ? updatedComment : c
      )
    );
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className={styles.linkContainer}>
        <Link
          style={{
            color: "white",
            background: "#7299e1",
            padding: "5px",
            borderRadius: "5px",
          }}
          to="/threads"
        >
          Back to threads
        </Link>
      </div>

      <div>
        <ViewSingleThreadComponent thread={thread} />
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <CreateComment
            threadId={threadId}
            onCommentAdded={handleCommentAdded}
          />
          <div className={styles.commmentsContainer}>
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onDelete={handleCommentDelete}
                onSave={handleCommentSave}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewThreadPage;
