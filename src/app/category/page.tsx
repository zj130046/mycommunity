import { Article } from "../store/message";
import ClientComponent from "../components/articleCateGory";

interface Response {
  articles: Article[];
  total: number;
  categoryTotal: number;
}

// 让页面在运行时动态生成，避免构建时的 fetch 错误
export const dynamic = "force-dynamic";

export default async function Category() {
  // 在服务器端渲染时使用完整的 URL
  const baseUrl = "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/articles/all`);
  const data: Response = await res.json();
  const articles = data.articles;

  return <ClientComponent initialArticles={articles} />;
}
