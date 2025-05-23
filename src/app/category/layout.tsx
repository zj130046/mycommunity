"use client";

import Link from "next/link";

import { Card } from "@heroui/react";
import RightCard from "../components/rightcard";
import { usePathname } from "next/navigation";
import Carousel from "../components/carousel";
import { navItems, Article } from "../store/message";

interface DashboardLayoutProps {
  children: React.ReactNode;
  articles: Article[];
}

const DashboardLayout = ({ children, articles }: DashboardLayoutProps) => {
  const pathname = usePathname(); //当前页面路径
  const isAllSelected = pathname === "/category" || pathname === "/";

  return (
    <div className="m-auto w-full max-w-[1150px] flex flex-col justify-center">
      <Carousel articles={articles} />
      <div className="w-full flex justify-between">
        <div className="flex flex-col w-full article">
          <Card className="shadow-lg dark:bg-gray-900 mb-[20px]">
            <ul className="h-[40px] p-[4px] flex justify-between items-center bg-[#F4F4F5]">
              {navItems.map((item, index) =>
                pathname === item.href ||
                (item.label === "全部" && isAllSelected) ? (
                  <li
                    key={index}
                    className="text-[#fff] text-[14px] bg-[#F31260] pt-[4px] pb-[4px] px-[12px] rounded-xl"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ) : (
                  <li
                    key={index}
                    className="text-[#71717A] text-[14px] pt-[4px] pb-[4px] px-[12px]"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                )
              )}
            </ul>
          </Card>

          <div>{children}</div>
        </div>
        <RightCard />
      </div>
    </div>
  );
};

export default DashboardLayout;
