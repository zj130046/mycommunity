import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { Article } from "../store/message";

interface CarouselProps {
  articles: Article[];
}

export default function Carousel({ articles }: CarouselProps) {
  const [articlesLatest, setArticlesLatest] = useState<Article[]>([]);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    if (articles.length > 0) {
      setArticlesLatest([
        articles[articles.length - 1], //克隆最后一张
        ...articles,
        articles[0],
      ]);
      setActiveIndex(1);
    }
  }, [articles]);

  useEffect(() => {
    const timerId = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timerId);
  }, [articlesLatest.length]);

  const prevSlide = () => {
    if (activeIndex <= 0) return;
    setActiveIndex((prevIndex) => prevIndex - 1);
    setIsTransitioning(true);
  };

  const nextSlide = () => {
    if (activeIndex >= articlesLatest.length - 1) return;
    setActiveIndex((prevIndex) => prevIndex + 1);
    setIsTransitioning(true);
  };

  const handleTransitionEnd = () => {
    if (activeIndex === articlesLatest.length - 1) {
      setIsTransitioning(false);
      setActiveIndex(1);
    } else if (activeIndex === 0) {
      setIsTransitioning(false);
      setActiveIndex(articlesLatest.length - 2);
    } else {
      setIsTransitioning(true);
    }
  };

  if (articlesLatest.length === 0) {
    return (
      <div className="carousel h-[400px] bg-gray-100 animate-pulse rounded-xl mx-auto mb-[40px]">
        <div className="h-full w-full flex-normal">
          <div className="flex items-center justify-center h-full">
            <div className="loader"></div>
          </div>
        </div>
      </div>
    );
  }

  const firstRealImage = articlesLatest[1]?.img;

  return (
    <>
      {/* 预加载首张图片，优化页面首屏加载速度 */}
      <Head>
        {firstRealImage && (
          <link rel="preload" as="image" href={firstRealImage} />
        )}
      </Head>

      <div className="relative mb-[40px] carousel">
        <div className="h-full overflow-hidden">
          <div
            className={`flex ${
              isTransitioning
                ? "transition-transform duration-500 ease-in-out"
                : ""
            }`}
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
            onTransitionEnd={handleTransitionEnd} //handleTransitionEnd 瞬间无动画跳转到真实的对应项
          >
            {articlesLatest.map((article, index) => (
              <div
                key={index}
                className="w-full h-[400px] flex-shrink-0 relative"
              >
                <Link
                  href={`/article/${article.slug}`}
                  className="w-full h-full"
                >
                  <Image
                    width={1150}
                    height={400}
                    src={article.img}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    quality={50}
                    priority={index === 1} //  只优先加载首图
                  />
                </Link>
                <div className="absolute top-0 mt-4 ml-4">
                  <h4 className="text-white text-[30px]">{article.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex justify-center items-end px-4">
          <ul className="flex gap-2 mb-4">
            {articlesLatest.slice(1, -1).map((_, index) => (
              <li
                key={index}
                className={`rounded-full ${
                  activeIndex === index + 1 ? "bg-yellow-500" : "bg-white"
                } w-2 h-2 cursor-pointer`}
                onClick={() => setActiveIndex(index + 1)}
              ></li>
            ))}
          </ul>
        </div>

        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button
            className="bg-white bg-opacity-25 backdrop-blur-sm text-black px-4 py-2 rounded-full hover:bg-opacity-30"
            onClick={prevSlide}
          >
            &lt;
          </button>
          <button
            className="bg-white bg-opacity-25 backdrop-blur-sm text-black px-4 py-2 rounded-full hover:bg-opacity-30"
            onClick={nextSlide}
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
}
