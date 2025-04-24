import ClientComponent from "../../components/articleCateGory";
import { Article } from "@/app/store/message";

export async function generateStaticParams() {
  try {
    const res = await fetch("http://localhost:3000/api/articles/all");
    const data = await res.json();
    const articles = data.articles.map((article: Article) => article.category);
    return articles.map((article: Article) => ({ article }));
  } catch (error) {
    console.log(error);
  }
}

export default async function Category({
  params,
}: {
  params: { category: string };
}) {
  const { category } = await params;
  const res = await fetch(`http://localhost:3000/api/articles/${category}`);
  const data = await res.json();

  return <ClientComponent initialArticles={data} />;
}
