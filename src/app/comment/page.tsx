import Head from "next/head";
import ClientComponent from "./client";

// 让页面在运行时动态生成，避免构建时的 fetch 错误
export const dynamic = "force-dynamic";

const fetchComments = async () => {
  // 在服务器端渲染时使用完整的 URL
  const baseUrl = "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/comments`);
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
