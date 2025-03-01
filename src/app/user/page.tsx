"use client";

import Image from "next/image";
import useUserStore from "../store/userStore";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { Blog, Comment } from "../store/message";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Button,
  Card,
  Tabs,
  Tab,
} from "@heroui/react";
import { redirect } from "next/navigation";
import { WiTime8 } from "react-icons/wi";
import DOMPurify from "dompurify";
import { BiLike } from "react-icons/bi";
import { EyeSlashFilledIcon, EyeFilledIcon } from "@/app/store/message";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function About() {
  const { user, token } = useUserStore();
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRePasswordVisible, setIsRePasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selected, setSelected] = useState("评论");
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleRePasswordVisibility = () => {
    setIsRePasswordVisible(!isRePasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleAvatarChange = async () => {
    if (!newAvatar) return;
    if (newAvatar.size > MAX_FILE_SIZE) {
      alert("文件大小超过限制，最大允许5MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", newAvatar);

    if (!token) {
      console.error("未找到用户令牌");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/avator", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "请求失败");
      }

      const data = await response.json();
      alert("头像更新成功");

      // 更新头像 URL
      if (data.avatarUrl) {
        useUserStore.setState({ user: { ...user, avatarUrl: data.avatarUrl } });
      }
    } catch (error) {
      console.error("更新头像时出错:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setNewAvatar(file);
    } else {
      console.error("请选择有效的图片文件");
    }
  };

  const handleRePassword = async () => {
    if (newPassword !== confirmPassword) {
      console.error("密码不一致");
      return;
    }
    if (!token) {
      return;
    }
    try {
      const response = await fetch("/api/user/repassword", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!response.ok) {
        throw new Error("error");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!token) {
      redirect("/");
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const commentResponse = await fetch(`/api/comments/${user?.userId}`);
        if (!commentResponse.ok) {
          throw new Error("获取评论失败");
        }
        const commentData = await commentResponse.json();
        setComments(commentData.comments);

        const blogResponse = await fetch(`/api/blog/${user?.userId}`);
        if (!blogResponse.ok) {
          throw new Error("获取帖子失败");
        }
        const blogData = await blogResponse.json();
        setBlogs(blogData.blogs);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="flex max-w-[1150px] m-auto justify-between flex-col">
      <Card className="w-full shadow-lg flex mb-[20px] h-[400px] dark:bg-gray-600">
        <div className="w-full h-[300px] gradient-bg relative"></div>
        <Image
          src={user?.avatarUrl || "/assets/20.jpg"}
          alt="用户头像"
          width={120}
          height={120}
          className="w-[120px] h-[120px] rounded-full cursor-pointer absolute left-10 bottom-20"
        />
        <div className="flex justify-around pt-[20px] pb-[10px]">
          <div className="text-[20px] text-[#4E5358] flex justify-center flex-col">
            <p>账号:{user?.username}</p>
            <p>ID:{user?.userId}</p>
          </div>
          <div className="text-[20px] text-[#4E5358] flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-2"
            />
            <Button
              size="sm"
              color="primary"
              onClick={handleAvatarChange}
              disabled={isLoading}
            >
              {isLoading ? "更新中..." : "更换头像"}
            </Button>
            <Button size="sm" color="success" onPress={onOpen}>
              重置密码
            </Button>
            <Modal
              isOpen={isOpen}
              placement="top-center"
              onOpenChange={onOpenChange}
            >
              <ModalContent className="w-[350px] pt-[20px]">
                {(onClose) => (
                  <form onSubmit={handleRePassword}>
                    <ModalBody>
                      <Input
                        name="password"
                        label="旧密码"
                        type={isPasswordVisible ? "text" : "password"}
                        variant="underlined"
                        onChange={(e) => setOldPassword(e.target.value)}
                        endContent={
                          <button
                            aria-label="toggle password visibility"
                            className="focus:outline-none"
                            type="button"
                            onClick={togglePasswordVisibility}
                          >
                            {isPasswordVisible ? (
                              <EyeFilledIcon className="eyeicon-style " />
                            ) : (
                              <EyeSlashFilledIcon className="eyeicon-style " />
                            )}
                          </button>
                        }
                      />
                      <Input
                        name="repassword"
                        label="新密码"
                        type={isRePasswordVisible ? "text" : "password"}
                        onChange={(e) => setNewPassword(e.target.value)}
                        variant="underlined"
                        endContent={
                          <button
                            aria-label="toggle re-password visibility"
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleRePasswordVisibility}
                          >
                            {isRePasswordVisible ? (
                              <EyeFilledIcon className="eyeicon-style " />
                            ) : (
                              <EyeSlashFilledIcon className="eyeicon-style " />
                            )}
                          </button>
                        }
                      />
                      <Input
                        name="confirmpassword"
                        label="确认新密码"
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        variant="underlined"
                        endContent={
                          <button
                            aria-label="toggle re-password visibility"
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {isConfirmPasswordVisible ? (
                              <EyeFilledIcon className="eyeicon-style" />
                            ) : (
                              <EyeSlashFilledIcon className="eyeicon-style" />
                            )}
                          </button>
                        }
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
                        取消
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => handleRePassword()}
                      >
                        确认
                      </Button>
                    </ModalFooter>
                  </form>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
      </Card>
      <Card className="w-full min-h-[450px] shadow-lg flex items-center dark:bg-gray-600 pt-[15px] mb-[15px]">
        <Tabs
          aria-label="Tabs colors"
          selectedKey={selected}
          color="danger"
          radius="full"
          onSelectionChange={(e) => setSelected(e as string)}
        >
          <Tab key="评论" title="评论">
            <div>
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="min-h-[70px] flex mb-[10px] min-w-[300px] hover:shadow-lg p-[10px] hover:translate-x-[-4px] transition-all duration-[1000ms]"
                >
                  <div className="w-[60px] h-[60px] mr-[20px]">
                    <Image
                      src={user?.avatarUrl || "/assets/20.jpg"}
                      alt="示例图片"
                      width={60}
                      height={60}
                      className="w-[60px] h-[60px] rounded-full"
                    />
                  </div>

                  <div className="flex flex-col items-start justify-center mr-[60px]">
                    <div className="text-[#4E5358] text-[14px] hover:text-pink-500">
                      <div>{comment.content}</div>
                    </div>
                    <div className="text-[#B1B1B1] text-[12px] flex">
                      <WiTime8 className="h-[18px] mr-[2px]" />
                      <p>{dayjs(comment.created_at).format("YYYY-MM-DD")}</p>
                    </div>
                  </div>
                  <div className="flex justify-around items-center">
                    <BiLike className="text-[22px] text-[#999999] mr-2" />
                    <p className="text-[#999999]">{comment.like_count}</p>
                  </div>
                </div>
              ))}
            </div>
          </Tab>
          <Tab key="帖子" title="帖子">
            {blogs.map((blog, index) => (
              <Link
                href={`/blog/${blog.slug}`}
                key={index}
                className=" flex justify-between mb-[10px] min-w-[300px] max-w-[800px] hover:shadow-lg p-[10px] hover:translate-x-[-4px] transition-all duration-[1000ms]"
              >
                <div className="w-[60px] h-[60px] mr-[20px]">
                  <Image
                    src={user?.avatarUrl || "/assets/20.jpg"}
                    alt="示例图片"
                    width={60}
                    height={60}
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div className="flex flex-col items-start justify-center mr-[60px]">
                  <div className="text-[#4E5358] text-[14px] hover:text-pink-500">
                    <div
                      className="text-[#4E5358] text-[14px] hover:text-pink-500 max-w-[500px]"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          blog.content.length > 400
                            ? blog.content.slice(0, 400)
                            : blog.content
                        ),
                      }}
                    ></div>
                  </div>
                  <div className="text-[#B1B1B1] text-[12px] flex">
                    <WiTime8 className="h-[18px] mr-[2px]" />
                    <p>{dayjs(blog.created_at).format("YYYY-MM-DD")}</p>
                  </div>
                </div>
                <div className="flex justify-around items-center">
                  <BiLike className="text-[22px] text-[#999999] mr-2" />
                  <p className="text-[#999999]">{blog.like_count}</p>
                </div>
              </Link>
            ))}
          </Tab>
          <Tab key="文章" title="文章"></Tab>
        </Tabs>
      </Card>
    </div>
  );
}
