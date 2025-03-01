"use client";

import { Card } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import { markdownContent } from "../store/message";
import Head from "next/head";

export default function About() {
  return (
    <div className="about-content">
      <Head>
        <title>这是作者的简介</title>
        <meta name="description" content="欢迎来到作者的小窝" />
      </Head>
      <Card className="card p-8 shadow-lg flex items-center flex-col h-[1400px] mb-[22px] dark:bg-gray-900">
        <ReactMarkdown className="prose prose-lg dark:prose-invert prose-h2:mt-2 prose-h3:mt-5 prose-hr:my-2 mb-[100px] max-w-[840px] w-full">
          {markdownContent}
        </ReactMarkdown>
      </Card>
      <Card className="right-card w-[280px] shadow-lg h-[330px] mb-[20px] dark:bg-gray-900"></Card>
    </div>
  );
}
