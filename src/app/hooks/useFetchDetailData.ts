import { useState, useEffect } from "react";

function useFetchDetailData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`fetch err`);
        setData(await response.json());
      } catch (err) {
        setError(err instanceof Error ? err : new Error("未知错误"));
      }
    };

    fetchData();
  }, [url]);

  return { data, error };
}

export default useFetchDetailData;
