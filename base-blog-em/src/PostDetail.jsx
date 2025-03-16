import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "./api";
import "./PostDetail.css";

export function PostDetail({ post, deleteMutation, updateMutation }) {
  // replace with useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id)
  });
  // console.log(post)
  if (isLoading) {
    return (
      <div><h1>Loading...</h1></div>
    )
  }
  if (isError) {
    return (
      <>
        <h3>Error</h3>
        <p>{error.toString()}</p>
      </>
    )
  }
  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <div>
        <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
        {deleteMutation.isPending && <p className="loading">Deleting post....</p>}
        {deleteMutation.isError && <p className="error">Error deleting the post {deleteMutation.error.toString()}</p>}
        {deleteMutation.isSuccess && <p className="success">Post was (no) deleted</p>}
      </div>
      <div>
        <button onClick={() => updateMutation.mutate(post.id)}>Update title</button>
        {updateMutation.isPending && <p className="loading">Updating post....</p>}
        {updateMutation.isError && <p className="error">Error updating the post {deleteMutation.error.toString()}</p>}
        {updateMutation.isSuccess && <p className="success">Post was (no) updated</p>}
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
