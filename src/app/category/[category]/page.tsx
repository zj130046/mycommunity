import ClientComponent from "../../components/articleCateGory";
import { Article } from "@/app/store/message";

export async function generateStaticParams() {
  try {
    // 在构建时，如果无法连接到数据库，返回空数组
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

    // 在服务器端渲染时使用完整的 URL
    const baseUrl = "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/articles/all`);
    const data = await res.json();
    const articles = data.articles.map((article: Article) => article.category);
    return articles.map((article: Article) => ({ article }));
  } catch (error) {
    console.log("generateStaticParams error:", error);
    // 如果出错，返回空数组，让页面在运行时动态生成
    return [];
  }
}

export default async function Category({
  params,
}: {
  params: { category: string };
}) {
  const { category } = await params;

  // 在服务器端渲染时使用完整的 URL
  const baseUrl = "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/articles/${category}`);
  const data = await res.json();

  return <ClientComponent initialArticles={data} />;
}
