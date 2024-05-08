import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ViewSingleThreadComponent from "../components/ViewSingleThreadComponent";

const ViewThreadPage = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (threadId) {
      fetch(`http://localhost:3000/get/thread/${threadId}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch the thread");
          return response.json();
        })
        .then((data) => {
          setThread(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error: ", error);
          setError(error.message);
          setLoading(false);
        });
    } else {
      console.error("Thread ID is undefined");
      setError("Thread ID is undefined");
      setLoading(false);
    }
  }, [threadId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!thread) return <p>No thread found</p>;

  return (
    <div>
      <ViewSingleThreadComponent thread={thread} />
    </div>
  );
};

export default ViewThreadPage;
