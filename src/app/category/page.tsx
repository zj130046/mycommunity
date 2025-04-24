import { Article } from "../store/message";
import ClientComponent from "../components/articleCateGory";

interface Response {
  articles: Article[];
  total: number;
  categoryTotal: number;
}

export default async function Category() {
  const res = await fetch("http://localhost:3000/api/articles/all");
  const data: Response = await res.json();
  const articles = data.articles;

  return <ClientComponent initialArticles={articles} />;
}
