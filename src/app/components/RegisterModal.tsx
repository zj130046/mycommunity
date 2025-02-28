import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../store/message";

interface RegisterModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLoginOpen: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onOpenChange,
  onLoginOpen,
  onSubmit,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRePasswordVisible, setIsRePasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleRePasswordVisibility = () => {
    setIsRePasswordVisible(!isRePasswordVisible);
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

              <div className="text-[28px] text-[#4E5358]">注册</div>
              <Link
                href="#"
                className="text-[12px] text-[#777777] w-[110px]  hover:text-pink-500"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenChange(false);
                  onLoginOpen();
                }}
              >
                已有帐户? 立即登录
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
                label="注册密码"
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
                      <EyeFilledIcon className="eyeicon-style " />
                    ) : (
                      <EyeSlashFilledIcon className="eyeicon-style " />
                    )}
                  </button>
                }
              />
              <Input
                name="repassword"
                autoComplete="off"
                label="确认密码"
                type={isRePasswordVisible ? "text" : "password"}
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
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                取消
              </Button>
              <Button color="success" type="submit">
                注册
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
