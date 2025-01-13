// 登录状态下: 的主页:src/app/(main)/logged_in.tsx

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";


// 登录状态下 显示
export default function LoggedInIndexPage() {
  return (
    <main className='space-y-2'>
      <span>当前登录了哦</span>
      {/* <HomeHeader user={session?.user} /> */}
      <Button className='h-auto'>
        <a href="/api/hono" target="_blank">
          去 api 交互文档(Scalar UI)
        </a>
      </Button><br />
      <Button className='h-auto w-full'>
        <a href="/docs" target="_blank" className="w-full">
          去 api 交互文档(Swagger UI)<br />
          样式有问题, 我没完整的进行修复, 不建议使用, <br />
          因为我有提供 openapi.json 可以下载<br />
          或复制源代码
        </a>
      </Button><br />
      <Button >
      <a href="/api/hono/doc" target="_blank">
          去 openapi.json 
      </a>
      </Button><br />
      <Button>
        <a href="https://api.Nahida-aa.us.kg" target="_blank" >
          去 api 交互文档(FastApi)(已废弃)
        </a>
      </Button><br />
      <ScrollArea></ScrollArea>
    </main>
  );
}
