"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@heroui/react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect, useRef } from "react";

export const SearchUserProject = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const q = searchParams?.get("q") ?? "";
  const [inputValue, setInputValue] = useState(q);

  // 上次提交时间
  const lastSubmitRef = useRef<number>(0);

  // 防抖：输入停止 1500ms 后再触发
  useEffect(() => {
    const handler = setTimeout(() => {
      doSearch();
    }, 1500);

    return () => clearTimeout(handler);
  }, [inputValue]);

  const doSearch = () => {
    const params = new URLSearchParams(searchParams || undefined);
    if (inputValue) {
      params.set("q", inputValue);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  };

  // 表单提交：回车时立即触发搜索 + 节流
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const now = Date.now();

    if (now - lastSubmitRef.current < 1500) {
      return; // 节流：1.5s 内不重复提交
    }
    lastSubmitRef.current = now;

    doSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2" >
      <div className="flex-1 relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="搜索项目..."
          className="border rounded-md pl-10 py-1"
        />
      </div>
      <Button
        className="bg-gradient-to-r from-lime-400 to-green-500 text-white rounded-md"
        variant="shadow" 
        // onPress={() => router.push("/studio/projects/create")}
      >
        <PlusIcon size={16} />
        创建项目
      </Button>
    </form>
  );
};
