import { Article } from "@/app/store/message";
import ClientComponent from "../../components/articleDetail";

export async function generateStaticParams() {
  //ssg 告诉 Next.js：提前生成所有 slug 的静态路径。
  try {
    // 在构建时，如果无法连接到数据库，返回空数组
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

    // 在服务器端渲染时使用完整的 URL
    const baseUrl = "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/articles/all`);
    const data = await res.json();
    const slugs = data.articles.map((article: Article) => article.slug);
    return slugs.map((slug: string) => ({ slug }));
  } catch (error) {
    console.log("generateStaticParams error:", error);
    // 如果出错，返回空数组，让页面在运行时动态生成
    return [];
  }
}

export default async function About({ params }: { params: { slug: string } }) {
  return <ClientComponent slug={params.slug} />;
}
