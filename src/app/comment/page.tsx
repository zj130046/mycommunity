import Head from "next/head";
import ClientComponent from "./client";

const fetchComments = async () => {
  const res = await fetch("http://localhost:3000/api/comments");
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
};

export default async function About() {
  const data = await fetchComments();
  const comments = data.comments;

  return (
    <div className="flex max-w-[1150px] m-auto items-start justify-between">
      <Head>
        <title>这是悠哉社区评论页</title>
        <meta name="description" content="欢迎评论" />
      </Head>
      <ClientComponent initialComments={comments} />
    </div>
  );
}
