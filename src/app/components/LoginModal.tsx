import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

import { EyeFilledIcon, EyeSlashFilledIcon } from "@/app/store/message";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onRegisterOpen: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onOpenChange,
  onRegisterOpen,
  onSubmit,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent className="w-[350px]">
        {(onClose) => (
          <form onSubmit={onSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              <Image
                src="/assets/image.png"
                alt="示例图片"
                width={200}
                height={100}
                className="m-auto mb-[30px]"
              />

              <div className="text-[28px] text-[#4E5358]">登录</div>
              <Link
                href="#"
                className="text-[12px] text-[#777777] w-[110px]  hover:text-pink-500"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenChange(false);
                  onRegisterOpen();
                }}
              >
                没有帐户? 立即注册
              </Link>
            </ModalHeader>
            <ModalBody>
              <Input
                name="username"
                label="用户名"
                variant="underlined"
                autoComplete="off"
              />
              <Input
                name="password"
                label="登陆密码"
                type={isPasswordVisible ? "text" : "password"}
                variant="underlined"
                autoComplete="off"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? (
                      <EyeFilledIcon className="eyeicon-style" />
                    ) : (
                      <EyeSlashFilledIcon className="eyeicon-style" />
                    )}
                  </button>
                }
              />
              <div className="flex py-2 px-1 justify-between text-[#777777]">
                <Checkbox
                  name="rememberLogin"
                  classNames={{
                    label: "text-small",
                  }}
                >
                  记住登录
                </Checkbox>
                <p>忘记密码</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                取消
              </Button>
              <Button color="primary" type="submit">
                登录
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
