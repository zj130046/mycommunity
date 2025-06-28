import DashboardLayout from "./category/layout";
import Category from "./category/page";
import Head from "next/head";
import { Article } from "./store/message";

// 让页面在运行时动态生成，避免构建时的 fetch 错误
export const dynamic = "force-dynamic";

export default async function Home() {
  // 在服务器端渲染时使用完整的 URL
  const baseUrl = "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/articles/latest`);
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
