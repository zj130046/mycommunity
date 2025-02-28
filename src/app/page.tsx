import DashboardLayout from "./category/layout";
import Category from "./category/page";
import Head from "next/head";

export default async function Home() {
  return (
    <div>
      <Head>
        <title>这是悠哉社区首页</title>
        <meta name="description" content="欢迎来到悠哉社区" />
      </Head>
      <div className="flex max-w-[1170px] m-auto items-start justify-between">
        <DashboardLayout>
          <Category />
        </DashboardLayout>
      </div>
    </div>
  );
}
