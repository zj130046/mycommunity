import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const defaultWelcome = "你好，我是AI助手，有什么可以帮您？";

const AIChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", content: defaultWelcome },
  ]);
  const chatRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, open]);

  // 发送消息（后续可接API）
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { role: "ai", content: data.reply || "AI未能回复，请稍后再试。" },
      ]);
    } catch (e) {
      console.error(e);
      setMessages((msgs) => [
        ...msgs,
        { role: "ai", content: "AI服务异常，请稍后再试。" },
      ]);
    }
  };

  return (
    <>
      {/* 悬浮按钮 */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform"
          onClick={() => setOpen(true)}
          aria-label="打开AI助手"
        >
          <FaRobot />
        </button>
      )}
      {/* 聊天窗口 */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[90vw] bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white">
            <span className="font-bold">AI助手</span>
            <button onClick={() => setOpen(false)} aria-label="关闭">
              <FaTimes />
            </button>
          </div>
          <div
            ref={chatRef}
            className="flex-1 px-4 py-2 overflow-y-auto bg-gray-50 dark:bg-gray-800"
            style={{ maxHeight: 360 }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`my-2 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[80%] text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-gradient-to-tr from-pink-400 to-yellow-400 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <input
              className="flex-1 rounded-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none"
              type="text"
              placeholder="请输入内容..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              className="p-2 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 text-white hover:scale-110 transition-transform"
              onClick={sendMessage}
              aria-label="发送"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWidget;
