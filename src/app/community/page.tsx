import ClientComponent from "./client";
import Head from "next/head";

// 让页面在运行时动态生成，避免构建时的 fetch 错误
export const dynamic = "force-dynamic";

const fetchBlogs = async () => {
  // 在服务器端渲染时使用完整的 URL
  const baseUrl = "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/blog/all`);
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
};

export default async function About() {
  const data = await fetchBlogs();
  const blogs = data.blogs;
  return (
    <div className="flex max-w-[1150px] m-auto items-start justify-between">
      <Head>
        <title>这是悠哉社区发帖区</title>
        <meta name="description" content="欢迎发帖" />
      </Head>
      <ClientComponent initialBlogs={blogs} />
    </div>
  );
}
