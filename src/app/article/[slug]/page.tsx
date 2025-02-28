import { Article } from "@/app/store/message";
import ClientComponent from "../../components/articleDetail";

export async function generateStaticParams() {
  try {
    const res = await fetch("http://localhost:3000/api/articles/all");
    const data = await res.json();
    const slugs = data.articles.map((article: Article) => article.slug);
    return slugs.map((slug: string) => ({ slug }));
  } catch (error) {
    console.log(error);
  }
}

export default async function About({ params }: { params: { slug: string } }) {
  return <ClientComponent slug={params.slug} />;
}
