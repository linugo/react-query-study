import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
// const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const maxPostPage = 10;

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  }) // deleteMutation.mutate
  const updateMutation = useMutation({
    mutationFn: (postId) => updatePost(postId)
  })
  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage)
      })
    }
  }, [currentPage, queryClient])
  // replace with useQuery
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["posts", currentPage], // 쿼리 캐시 내의 데이터를 정의(항상 배열)
    queryFn: () => fetchPosts(currentPage),// 데이터를 가져오기 위해 실행할 함수
    staleTime: 2000, // 2초
  });
  // 우선 첫번째 에러 발생 -> fetch는 비동기라서 처음 렌더링할 때 data가 없어 map을 돌릴 수 없다고 나옴
  if (isLoading) { return <h3>Loading...</h3> }

  if (isError) {
    return (
      <>
        <h3>Oops.. Something went wrong</h3>
        <p>{error.toString()}</p>
      </>
    )
  }
  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              deleteMutation.reset();
              updateMutation.reset();
              setSelectedPost(post)
            }
            }
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 1} onClick={() => {
          setCurrentPage((previousValue) => previousValue - 1)
        }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= maxPostPage} onClick={() => {
          setCurrentPage((previousValue) => previousValue + 1)
        }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} deleteMutation={deleteMutation} updateMutation={updateMutation} />}
    </>
  );
}
