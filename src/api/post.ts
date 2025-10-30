import http from "./http";

export interface Post {
  id: number;
  title: string;
  body?: string;
}

export async function fetchPosts(): Promise<Post[]> {
  const { data } = await http.get<Post[]>(
    "https://jsonplaceholder.typicode.com/posts",
  );
  return data;
}

export async function updatePost(
  id: number,
  payload: Partial<Post>,
): Promise<Post> {
  const { data } = await http.patch<Post>(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    payload,
  );
  return data;
}

export async function deletePost(id: number): Promise<void> {
  await http.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
}

export async function createPost(
  payload: Pick<Post, "title" | "body"> & { userId?: number },
): Promise<Post> {
  const { data } = await http.post<Post>(
    `https://jsonplaceholder.typicode.com/posts`,
    payload,
  );
  return data;
}
