import { create } from "zustand";

interface SearchState {
  searchResults: any[];
  fetchResults: (keyword: string) => Promise<void>;
}

const useSearchStore = create<SearchState>()((set) => ({
  searchResults: [],
  fetchResults: async (keyword: string) => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }),
      });
      if (!response.ok) {
        alert("查询失败");
      }
      const data = await response.json();
      set({
        searchResults: data,
      });
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useSearchStore;
