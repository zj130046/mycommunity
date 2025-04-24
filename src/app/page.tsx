import DashboardLayout from "./category/layout";
import Category from "./category/page";
import Head from "next/head";
import { Article } from "./store/message";

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/articles/latest");
  const articles: Article[] = await res.json();
  return (
    <div>
      <Head>
        <title>这是悠哉社区首页</title>
        <meta name="description" content="欢迎来到悠哉社区" />
      </Head>
      <div className="flex max-w-[1170px] m-auto items-start justify-between">
        <DashboardLayout articles={articles}>
          <Category />
        </DashboardLayout>
      </div>
    </div>
  );
}
