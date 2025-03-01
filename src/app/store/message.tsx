export const tags = [
  "JS",
  "React",
  "Next.js",
  "Tailwind",
  "Node.js",
  "HTML",
  "ES6",
  "ESLint",
  "Prettier",
  "TS",
  "Redux",
  "MobX",
  "Vue.js",
  "Next.js",
  "Axios",
  "Html",
  "Css",
  "Redux",
  "Pinia",
  "Zustand",
  "Vite",
  "Npm",
  "Token",
  "Store",
];

export interface Article {
  id: number;
  category: string;
  tag: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  created_at: string;
  img: string;
  word_count: number;
}

export interface Blog {
  id: number;
  avatar_url: string;
  content: string;
  username: string;
  created_at: string;
  slug: string;
  img: string;
  like_count: number;
}

export interface Comment {
  id: number;
  userId: number;
  avatar_url: string;
  content: string;
  username: string;
  created_at: string;
  like_count: number;
}

export interface NewComment {
  avatar_url: string;
  content: string;
  username: string;
  created_at: string;
  is_author: string;
}

interface User {
  id: number;
  username: string;
  avatar_url: string;
  is_author: string;
}

export interface SearchResults {
  articles: Article[];
  blogs: Blog[];
  users: User[];
}

export const navItems = [
  { label: "全部", href: "/category" },
  { label: "推荐", href: "/category/recommend" },
  { label: "前端", href: "/category/front" },
  { label: "后端", href: "/category/backend" },
  { label: "AI", href: "/category/ai" },
  { label: "笔记", href: "/category/note" },
  { label: "Android", href: "/category/android" },
  { label: "IOS", href: "/category/ios" },
  { label: "数据库", href: "/category/database" },
  { label: "数据结构", href: "/category/data" },
  { label: "python", href: "/category/python" },
  { label: "感悟", href: "/category/sentiment" },
  { label: "日常", href: "/category/daily" },
];

export const categories = [
  { key: "recommend", label: "推荐" },
  { key: "front", label: "前端" },
  { key: "backend", label: "后端" },
  { key: "ai", label: "AI" },
  { key: "note", label: "笔记" },
  { key: "android", label: "Android" },
  { key: "ios", label: "IOS" },
  { key: "database", label: "数据库" },
  { key: "data", label: "数据结构" },
  { key: "python", label: "Python" },
  { key: "sentiment", label: "感悟" },
  { key: "daily", label: "日常" },
];

export const emojiList = [
  "😀",
  "😂",
  "😍",
  "😭",
  "👍",
  "🔥",
  "❤️",
  "😎",
  "😊",
  "😢",
  "😋",
  "🥰",
  "😄",
  "😆",
  "😉",
  "🤔",
  "🤩",
  "🤪",
  "😝",
  "😏",
  "🤤",
  "😬",
  "😷",
  "🤧",
  "🤒",
  "🥳",
  "😻",
  "💪",
  "👀",
  "🙌",
  "👏",
  "🤗",
  "🥺",
  "🤭",
  "😤",
  "😵",
  "🤠",
  "🥴",
  "😇",
  "😈",
];

export const EyeSlashFilledIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
        fill="currentColor"
      />
      <path
        d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
        fill="currentColor"
      />
      <path
        d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
        fill="currentColor"
      />
      <path
        d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
        fill="currentColor"
      />
      <path
        d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const EyeFilledIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
        fill="currentColor"
      />
      <path
        d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const markdownContent = `
## 关于我

---

### 自我描述

网名 *@*，现居武汉。  

在过去的学习过程中，我系统地掌握了 HTML、CSS 、JavaScript、vue和react 等前端基础技术。通过不断地实践和项目练习，我能够熟练运用这些技术进行网页的结构搭建、样式设计和交互实现。

例如，在完成一个小型个人博客网站的项目中，我运用所学知识，从页面布局的规划到细节样式的调整，再到用户交互功能的实现，每一个环节都进行了精心的设计和优化，最终成功完成了一个具有良好用户体验的网站。

> 保持持续输出，数量与质量之间的平衡我更倾向于数量，因为可以记录更多...  

- 未来，我将继续深入学习前端技术，不断提升自己的专业水平。
- 我希望能够参与到更具挑战性的项目中，为前端技术的发展贡献自己的一份力量。

---

### 相关背景

- 2004，我出生了！  
- 2023 - 至今，就读于某双非一本，专业为软件工程；  
- 目前还没有实习过，希望暑假能找到实习 ！
- …  
- 2101，希望我还活着！  
- 3001，我已经半步元婴！ 

---

### 联系我

- 邮箱：1300468170@qq.com
- 微信：j1300170
- GitHub：github.com/zj130046
`;
