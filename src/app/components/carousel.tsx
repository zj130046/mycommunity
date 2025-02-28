"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Spinner } from "@heroui/react";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { Article } from "../../app/store/message";
import { Card, CardHeader } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

export default function Carousel() {
  const [articlesLatest, setArticlesLatest] = useState<Article[]>([]);
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch("/api/articles/latest");
        if (!response.ok) {
          throw new Error("error");
        }
        const data = await response.json();
        setArticlesLatest(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchArticle();
  }, []);

  if (!articlesLatest.length) {
    return (
      <div className="h-[400px] bg-gray-100 animate-pulse rounded-xl mx-auto mb-[40px]">
        <div className="h-full w-full flex-normal">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[1150px] mx-auto mb-[40px]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0} // 图片之间的间距
        slidesPerView={1} // 每次展示 1 张
        navigation // 左右箭头
        pagination={{ clickable: true }} // 下方小圆点
        autoplay={{ delay: 3000, disableOnInteraction: false }} // 自动播放
        loop={true} // 循环播放
        className="w-full h-[400px]"
      >
        {articlesLatest.map((article) => (
          <SwiperSlide key={article.id}>
            <Link href={`/article/${article.slug}`}>
              <Card className="relative w-full h-full">
                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                  <h4 className="text-white font-medium text-[30px]">
                    {article.title}
                  </h4>
                </CardHeader>
                <Image
                  src={article.img}
                  alt="Slide"
                  fill
                  sizes="(max-width: 768px) 100vw, 1150px"
                  className="object-cover"
                  priority
                />
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
