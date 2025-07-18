"use client";

import "../../styles/globals.css";
import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { HiOutlineHome } from "react-icons/hi2";
import { BiListUl, BiLabel } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { FaRegMoon } from "react-icons/fa";
import { useState, useEffect, lazy, Suspense } from "react";
import { GoChevronUp, GoChevronDown, GoSun } from "react-icons/go";
import Link from "next/link";
import useSearchStore from "./store/searchStore";
import useUserStore from "./store/userStore";
import { Button, useDisclosure, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { handleLoginSubmit, handleRegisterSubmit } from "./utils";
import Head from "next/head";
import useDebounce from "./hooks/useDebounce";
import AIChatWidget from "./components/AIChatWidget";

const LoginModal = lazy(() => import("./components/LoginModal"));
const RegisterModal = lazy(() => import("./components/RegisterModal"));
const CustomDropdown = lazy(() => import("./components/customDropdown"));

const LoadingFallback = <div>Loading...</div>;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onOpenChange: onLoginOpenChange,
  } = useDisclosure();
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onOpenChange: onRegisterOpenChange,
  } = useDisclosure();
  const [darkMode, setDarkMode] = useState(false);
  const { token, login } = useUserStore();
  const { fetchResults } = useSearchStore();
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  // 初始化 darkMode
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) setDarkMode(saved === "true");
  }, []);

  // 切换 dark class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode + "");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleSearch = async () => {
    if (keyword.length === 0) {
      return;
    }
    router.push(`/search/${keyword}`);
    await fetchResults(keyword);
    setKeyword("");
  };

  const debouncedHandleSearch = useDebounce(handleSearch, 500);

  // 移除 useEffect 里设置 data-theme 和 body 背景图片的代码

  return (
    <html lang="zh">
      <Head>
        <meta name="description" content="这是悠哉社区，欢迎大家使用！" />
        <title>悠哉社区</title>
      </Head>
      <body className="transition-colors duration-[1000ms] bg-white text-black dark:bg-gray-900 dark:text-white">
        <nav className="w-full bg-[white] sticky px-20 top-0 flex justify-around h-[67px] dark:bg-gray-900 dark:text-white z-50">
          <div className="flex-normal">
            <Image
              src="/assets/image.png"
              alt="示例图片"
              width={85}
              height={40}
              className="w-[85px] h-[40px]"
            />
          </div>
          <ul className="flex cursor-pointer navmedia">
            <li className=" hover:text-pink-500 layout-style">
              <HiOutlineHome />
              <Link href="/">首页</Link>
            </li>
            <li className=" hover:text-pink-500 layout-style">
              <BiListUl />
              <Link href="/community">社区</Link>
            </li>
            <li className=" hover:text-pink-500 layout-style">
              <BiLabel />
              <Link href="/comment">留言板</Link>
            </li>
            <li className=" hover:text-pink-500 layout-style">
              <AiOutlineUser />
              <Link href="/about">关于</Link>
            </li>
          </ul>
          <li className=" hover:text-pink-500 layout-style minmedia">
            <Input
              autoComplete="off"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  debouncedHandleSearch();
                }
              }}
              endContent={
                <IoIosSearch
                  className="cursor-pointer text-2xl text-default-400 flex-shrink-0"
                  onClick={debouncedHandleSearch}
                />
              }
            />
          </li>
          <ul className="flex items-center gap-2 usermedia">
            {token ? (
              <Suspense
                fallback={
                  <div className="w-[45px] h-[45px] rounded-full flex-normal bg-gray-100 animate-pulse"></div>
                }
              >
                <CustomDropdown />
              </Suspense>
            ) : (
              <>
                <li className="flex-normal">
                  <Button
                    className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    radius="full"
                    size="sm"
                    onPress={onLoginOpen}
                  >
                    登录
                  </Button>
                </li>
                <li className="flex-normal">
                  <Button
                    className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                    radius="full"
                    size="sm"
                    onPress={onRegisterOpen}
                  >
                    注册
                  </Button>
                </li>
              </>
            )}
            <li className=" hover:text-pink-500 layout-style">
              {darkMode ? (
                <FaRegMoon className="text-2xl" onClick={toggleDarkMode} />
              ) : (
                <GoSun className="text-2xl" onClick={toggleDarkMode} />
              )}
            </li>
          </ul>
        </nav>
        <main className=" mt-[50px]">{children}</main>
        <Suspense fallback={LoadingFallback}>
          <LoginModal
            isOpen={isLoginOpen}
            onOpenChange={onLoginOpenChange}
            onRegisterOpen={onRegisterOpen}
            onSubmit={(e) => handleLoginSubmit(e, login, onLoginOpenChange)}
          />
        </Suspense>
        <Suspense fallback={LoadingFallback}>
          <RegisterModal
            isOpen={isRegisterOpen}
            onOpenChange={onRegisterOpenChange}
            onLoginOpen={onLoginOpen}
            onSubmit={(e) => handleRegisterSubmit(e, onRegisterOpenChange)}
          />
        </Suspense>
        <div
          className="button-style bottom-[29%] dark:bg-gray-900 hover:text-pink-500"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <GoChevronUp className="text-2xl" />
        </div>
        <div className="button-style bottom-[22%] dark:bg-gray-900 hover:text-pink-500">
          {darkMode ? (
            <FaRegMoon className="text-2xl" onClick={toggleDarkMode} />
          ) : (
            <GoSun className="text-2xl" onClick={toggleDarkMode} />
          )}
        </div>
        <div
          className="button-style bottom-[15%] dark:bg-gray-900 hover:text-pink-500"
          onClick={() =>
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth",
            })
          }
        >
          <GoChevronDown className="text-2xl" />
        </div>
        <div className="bg-[#FFF] h-[280px]"></div>
        <AIChatWidget />
      </body>
    </html>
  );
}
