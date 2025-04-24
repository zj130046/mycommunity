import ClientComponent from "./client";
import Head from "next/head";

const fetchBlogs = async () => {
  const res = await fetch("http://localhost:3000/api/blog/all");
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
