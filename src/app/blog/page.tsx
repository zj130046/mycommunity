"use client";

import { Button, Card, Select, SelectItem, Input } from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import useUserStore from "../../app/store/userStore";
import { PiUserCirclePlus } from "react-icons/pi";
import { IoMdPaperPlane } from "react-icons/io";
import { MdOutlineDataSaverOff, MdLogin } from "react-icons/md";
import { IoPricetagOutline } from "react-icons/io5";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import MyEditor from "@/app/components/editor";
import { useState, useEffect, lazy, Suspense } from "react";
import Image from "next/image";
import { categories } from "../store/message";
import { handleLoginSubmit, handleRegisterSubmit } from "../utils/page";
import { uploadFile } from "../utils/page";

const LoginModal = lazy(() => import("../components/LoginModal"));
const RegisterModal = lazy(() => import("../components/RegisterModal"));

export default function About() {
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
  const [isSubmitted, setIsSubmitted] = useState(false); // 标记文章是否已提交
  const { user, login, token } = useUserStore();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [img, setImg] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setImg(URL.createObjectURL(file)); // 预览图片
    }
  };

  const handleSubmit = async () => {
    let imageUrl = img;

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("文件大小不能超过 5MB，请选择更小的文件。");
        return;
      }
      imageUrl = await uploadFile(file);
      if (!imageUrl) return;
    }

    if (!imageUrl) {
      alert("请选择图片");
      return;
    }
    if (!token) {
      console.error("未找到 JWT，请重新登录");
      return;
    }

    const data = { title, excerpt, content, category, tag, img: imageUrl };
    const response = await fetch("/api/articles/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      alert("文章提交成功");
      await deleteDraft();
      setIsSubmitted(true);
    } else {
      console.error("文章提交失败:", result.message);
    }
  };

  const deleteDraft = async () => {
    if (!token) {
      console.error("未找到 JWT，请重新登录");
      return;
    }
    try {
      const response = await fetch("/api/articles/draft", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        console.log("草稿删除成功:", result);
        setTitle("");
        setExcerpt("");
        setContent("");
        setCategory("");
        setTag("");
        setImg("");
      } else {
        console.error("草稿删除失败:", result.message);
      }
    } catch (error) {
      console.error("草稿删除出错:", error);
    }
  };

  const handleDraft = async () => {
    let imageUrl = img; // 使用当前图片 URL
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("文件大小不能超过 5MB，请选择更小的文件。");
        return;
      }
      imageUrl = await uploadFile(file);
      if (!imageUrl) return;
    }
    if (!token) {
      console.error("未找到 JWT，请重新登录");
      return;
    }
    // 如果既没有新文件，也没有已有图片 URL，提示用户选择文件
    if (!imageUrl) {
      alert("请选择文件");
      return;
    }

    const data = { title, excerpt, content, category, tag, img: imageUrl };
    const response = await fetch("/api/articles/draft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      alert("草稿保存成功");
    } else {
      console.error("草稿保存失败:", result.message);
    }
  };

  const loginCard = (
    <Card className="h-[500px] shadow-lg max-w-[840px] mb-[20px] dark:bg-gray-900 p-[22px]">
      <div className="flex flex-col items-center m-auto">
        <p className="mt-[20px] mb-[20px] text-[16.8px] text-[#B1B1B1] text-center">
          你好,请先登录！
        </p>
        <div className="flex gap-2 mb-[20px]">
          <li className="flex-normal">
            <Button
              radius="full"
              size="sm"
              color="primary"
              onPress={onLoginOpen}
            >
              <MdLogin className="mr-[-4px]" />
              <p>登录</p>
            </Button>
          </li>
          <li className="flex-normal">
            <Button
              radius="full"
              size="sm"
              color="success"
              onPress={onRegisterOpen}
            >
              <PiUserCirclePlus className="mr-[-4px]" />
              <p>注册</p>
            </Button>
          </li>
        </div>
      </div>
    </Card>
  );

  const loggedInCard = (
    <Card className="min-h-[500px] max-w-[840px] flex gap-5 shadow-lg mb-[20px] dark:bg-gray-900 p-[22px]">
      <Input
        name="title"
        label="标题"
        value={title}
        variant="underlined"
        autoComplete="off"
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        name="excerpt"
        label="摘要"
        value={excerpt}
        variant="underlined"
        autoComplete="off"
        onChange={(e) => setExcerpt(e.target.value)}
      />
      <MyEditor
        defaultContent={content}
        onChange={(html) => setContent(html)}
      />
      <label
        htmlFor="coverUpload"
        className="relative flex-normal h-32 w-full border-2 border-dashed border-gray-300 rounded-md cursor-pointer"
      >
        <input
          type="file"
          id="coverUpload"
          className="absolute opacity-0 w-full h-full cursor-pointer"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
        />
        {img ? (
          <Image
            src={img}
            alt="封面预览"
            fill
            className="h-full w-full object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-500">添加文章封面</span>
        )}
      </label>
    </Card>
  );

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        if (!token) {
          console.error("未找到 JWT，请重新登录");
          return;
        }
        const response = await fetch("/api/articles/draft", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          setTitle(result.title);
          setExcerpt(result.excerpt);
          setContent(result.content);
          setCategory(result.category);
          setTag(result.tag);
          setImg(result.img);
        }
      } catch (error) {
        console.error("获取草稿出错:", error);
      }
    };

    if (user?.username && !isSubmitted) {
      fetchDraft();
    }
  }, [user?.username, isSubmitted, token]);

  return (
    <div className="about-content">
      {user?.username ? loggedInCard : loginCard}
      <Suspense fallback="<div>Load...</div>">
        <LoginModal
          isOpen={isLoginOpen}
          onOpenChange={onLoginOpenChange}
          onRegisterOpen={onRegisterOpen}
          onSubmit={(e) => handleLoginSubmit(e, login, onLoginOpenChange)}
        />
      </Suspense>

      <Suspense fallback="<div>Load...</div>">
        <RegisterModal
          isOpen={isRegisterOpen}
          onOpenChange={onRegisterOpenChange}
          onLoginOpen={onLoginOpen}
          onSubmit={(e) => handleRegisterSubmit(e, onRegisterOpenChange)}
        />
      </Suspense>

      <Card className="w-[280px] text-[14px] h-[290px] p-[20px] right-card">
        <div className="mb-[14px]">
          <Select
            className="max-w-xs"
            label="分类"
            placeholder="请选择分类"
            selectedKeys={[category]}
            onSelectionChange={(keys) => setCategory(Array.from(keys)[0])}
            startContent={<HiOutlineDocumentDuplicate />}
            scrollShadowProps={{
              isEnabled: false,
            }}
          >
            {categories.map((cat) => (
              <SelectItem key={cat.key}>{cat.label}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="mb-[14px]">
          <Input
            name="tag"
            label="标签"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            startContent={<IoPricetagOutline className="h-[20px]" />}
            autoComplete="off"
            placeholder="请输入标签"
          />
        </div>
        <Button
          color="success"
          className="text-[#fff] mb-[14px]"
          onClick={handleDraft}
        >
          <MdOutlineDataSaverOff />
          保存草稿
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          <IoMdPaperPlane />
          提交发布
        </Button>
      </Card>
    </div>
  );
}
