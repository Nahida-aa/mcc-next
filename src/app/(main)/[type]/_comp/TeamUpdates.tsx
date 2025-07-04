"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"

const Content = () => (
  <div>
    <p>
      Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt aute id
      consequat veniam incididunt duis in sint irure nisi. Mollit officia cillum Lorem ullamco minim
      nostrud elit officia tempor esse quis.
    </p>
    <p>
      Sunt ad dolore quis aute consequat. Magna exercitation reprehenderit magna aute tempor
      cupidatat consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum
      quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit
      incididunt nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
      deserunt nostrud ad veniam.
    </p>
    <p>
      Est velit labore esse esse cupidatat. Velit id elit consequat minim. Mollit enim excepteur ea
      laboris adipisicing aliqua proident occaecat do do adipisicing adipisicing ut fugiat.
      Consequat pariatur ullamco aute sunt esse. Irure excepteur eu non eiusmod. Commodo commodo et
      ad ipsum elit esse pariatur sit adipisicing sunt excepteur enim.
    </p>
    <p>
      Incididunt duis commodo mollit esse veniam non exercitation dolore occaecat ea nostrud
      laboris. Adipisicing occaecat fugiat fugiat irure fugiat in magna non consectetur proident
      fugiat. Commodo magna et aliqua elit sint cupidatat. Sint aute ullamco enim cillum anim ex.
      Est eiusmod commodo occaecat consequat laboris est do duis. Enim incididunt non culpa velit
      quis aute in elit magna ullamco in consequat ex proident.
    </p>
    <p>
      Dolore incididunt mollit fugiat pariatur cupidatat ipsum laborum cillum. Commodo consequat
      velit cupidatat duis ex nisi non aliquip ad ea pariatur do culpa. Eiusmod proident adipisicing
      tempor tempor qui pariatur voluptate dolor do ea commodo. Veniam voluptate cupidatat ex nisi
      do ullamco in quis elit.
    </p>
    <p>
      Cillum proident veniam cupidatat pariatur laborum tempor cupidatat anim eiusmod id nostrud
      pariatur tempor reprehenderit. Do esse ullamco laboris sunt proident est ea exercitation
      cupidatat. Do Lorem eiusmod aliqua culpa ullamco consectetur veniam voluptate cillum. Dolor
      consequat cillum tempor laboris mollit laborum reprehenderit reprehenderit veniam aliqua
      deserunt cupidatat consequat id.
    </p>
    <p>
      Est id tempor excepteur enim labore sint aliquip consequat duis minim tempor proident. Dolor
      incididunt aliquip minim elit ea. Exercitation non officia eu id.
    </p>
    <p>
      Ipsum ipsum consequat incididunt do aliquip pariatur nostrud. Qui ut sint culpa labore Lorem.
      Magna deserunt aliquip aute duis consectetur magna amet anim. Magna fugiat est nostrud veniam.
      Officia duis ea sunt aliqua.
    </p>
    <p>
      Ipsum minim officia aute anim minim aute aliquip aute non in non. Ipsum aliquip proident ut
      dolore eiusmod ad fugiat fugiat ut ex. Ea velit Lorem ut et commodo nulla voluptate veniam ea
      et aliqua esse id. Pariatur dolor et adipisicing ea mollit. Ipsum non irure proident ipsum
      dolore aliquip adipisicing laborum irure dolor nostrud occaecat exercitation.
    </p>
    <p>
      Culpa qui reprehenderit nostrud aliqua reprehenderit et ullamco proident nisi commodo non ut.
      Ipsum quis irure nisi sint do qui velit nisi. Sunt voluptate eu reprehenderit tempor consequat
      eiusmod Lorem irure velit duis Lorem laboris ipsum cupidatat. Pariatur excepteur tempor veniam
      cillum et nulla ipsum veniam ad ipsum ad aute. Est officia duis pariatur ad eiusmod id
      voluptate.
    </p>
  </div>)


export const TeamUpdates = () => {
  return (
    <section className="h-full">
      <Card className="p-1 h-full">
      <div className="bg-secondary rounded-md p-1 flex flex-col h-full">
          <CardHeader className="m-2 flex-1 h-4">
            <CardTitle className="text-center">团队动态</CardTitle>
          </CardHeader>
          <CardContent className="flex-1  p-1 mb-2">
          <ScrollArea className="h-[calc(100vh-380px)]">
            <Content />
          </ScrollArea>
          </CardContent>
        </div>
      </Card>
    </section>
  );
};

export const ProjectUpdates = () => {
  return (
    <section className="h-full">
      <Card className="p-1 h-full">
      <div className="bg-secondary rounded-md p-1 flex flex-col h-full">
          <CardHeader className="m-2 flex-1 h-4">
            <CardTitle className="text-center">项目动态</CardTitle>
          </CardHeader>
          <CardContent className="flex-1  p-1 mb-2">
          <ScrollArea className="h-[calc(100vh-380px)]">
            <Content />
          </ScrollArea>
          </CardContent>
        </div>
      </Card>
    </section>
  );
};




import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Pickaxe, Home, Sword, Diamond } from "lucide-react"

const MinecraftTeamContent = () => (
  <div className="space-y-4 text-sm">
    <div className="mb-2 rounded-md p-2 bg-[#D7CCC8] hover:bg-[#A1887F]/20 hover:shadow-md hover:-translate-y-px">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-blue-600" />
        <span className="font-bold text-[#5D4037]">建筑师团队</span>
        <Badge className="bg-green-600 text-white text-xs">活跃</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Steve发起了团队组建者看团建意愿书，目前已有12名建筑师响应，准备开始大型城堡建设项目。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>2小时前</span>
      </div>
    </div> 

    <div className="minecraft-update-item">
      <div className="flex items-center gap-2 mb-2">
        <Pickaxe className="w-4 h-4 text-gray-600" />
        <span className="font-bold text-[#5D4037]">挖矿小队</span>
        <Badge className="bg-orange-600 text-white text-xs">进行中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Alex的团队经过全体成员的同意解散了，原因是钻石矿脉开采完毕，任务圆满完成。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>4小时前</span>
      </div>
    </div>

    <div className="minecraft-update-item">
      <div className="flex items-center gap-2 mb-2">
        <Home className="w-4 h-4 text-brown-600" />
        <span className="font-bold text-[#5D4037]">红石工程师</span>
        <Badge className="bg-red-600 text-white text-xs">招募中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Redstone的团队评级提升了，从初级工程师晋升为高级红石大师，现在可以承接更复杂的自动化项目。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>6小时前</span>
      </div>
    </div>

    <div className="minecraft-update-item">
      <div className="flex items-center gap-2 mb-2">
        <Sword className="w-4 h-4 text-purple-600" />
        <span className="font-bold text-[#5D4037]">冒险公会</span>
        <Badge className="bg-purple-600 text-white text-xs">探索中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Explorer成功完成了初次团建，团队在末地成功击败了末影龙，获得了龙蛋奖励。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>8小时前</span>
      </div>
    </div>

    <div className="minecraft-update-item">
      <div className="flex items-center gap-2 mb-2">
        <Diamond className="w-4 h-4 text-cyan-600" />
        <span className="font-bold text-[#5D4037]">装备制作组</span>
        <Badge className="bg-cyan-600 text-white text-xs">制作中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Crafter的团队开始了新的附魔装备制作计划，目标是为所有团队成员制作钻石套装。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>12小时前</span>
      </div>
    </div>
  </div>
)

const MinecraftProjectContent = () => (
  <div className="space-y-4 text-sm">
    <div className="minecraft-update-item ">
      <div className="flex items-center gap-2 mb-2">
        <Home className="w-4 h-4 text-amber-600" />
        <span className="font-bold text-[#5D4037]">巨型城堡建设</span>
        <Badge className="bg-amber-600 text-white text-xs">75%</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Builder团队发起了一个新项目：建造中世纪风格的巨型城堡，预计需要3个月完成，现已完成地基和城墙建设。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>1小时前</span>
      </div>
    </div>

    <div className="minecraft-update-item">
      <div className="flex items-center gap-2 mb-2">
        <Pickaxe className="w-4 h-4 text-gray-600" />
        <span className="font-bold text-[#5D4037]">自动化农场</span>
        <Badge className="bg-green-600 text-white text-xs">完成</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Farmer团队的项目宣布完成了，全自动小麦、胡萝卜、土豆农场正式投入使用，日产量达到1000+。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>3小时前</span>
      </div>
    </div>

    <div className="minecraft-update-item">
      <div className="flex items-center gap-2 mb-2">
        <Sword className="w-4 h-4 text-red-600" />
        <span className="font-bold text-[#5D4037]">地下城探索</span>
        <Badge className="bg-red-600 text-white text-xs">进行中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Dungeon团队完成了工程建设阶段，成功清理了5个地下城，获得了大量稀有装备和经验。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>5小时前</span>
      </div>
    </div>

    <div className="minecraft-update-item">
      <div className="flex items-center gap-2 mb-2">
        <Diamond className="w-4 h-4 text-blue-600" />
        <span className="font-bold text-[#5D4037]">红石计算机</span>
        <Badge className="bg-blue-600 text-white text-xs">设计中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Engineer团队对红石计算机项目发起了工作任务分配，目标是建造一台可以进行基本运算的红石计算机。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>7小时前</span>
      </div>
    </div>

    <div className="minecraft-update-item">
      <div className="flex items-center gap-2 mb-2">
        <Home className="w-4 h-4 text-purple-600" />
        <span className="font-bold text-[#5D4037]">主题公园建设</span>
        <Badge className="bg-purple-600 text-white text-xs">规划中</Badge>
      </div>
      <p className="text-[#795548] mb-1">
        网络用户Theme团队启动了Minecraft主题公园项目，计划建造过山车、摩天轮等娱乐设施，预计耗时6个月。
      </p>
      <div className="flex items-center gap-2 text-xs text-[#8D6E63]">
        <Clock className="w-3 h-3" />
        <span>10小时前</span>
      </div>
    </div>
  </div>
)

export const MinecraftTeamUpdates = () => {
  return (
    <section className="h-full">
      <Card className=" h-full bg-[#BCAAA4] p-0 gap-0 border border-[#5D4037]">
          <CardHeader className="m-0 p-2 mt-1">
            <CardTitle className="text-center text-[#5D4037] text-base flex items-center justify-center gap-2">
              <Users className="w-5 h-5 " />
              团队动态
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-2">
            <ScrollArea className="h-[calc(100vh-480px)] minecraft-scroll">
              <MinecraftTeamContent />
            </ScrollArea>
          </CardContent>
      </Card>
    </section>
  )
}

export const MinecraftProjectUpdates = () => {
  return (
    <section className="h-full">
      <Card className="p-0 h-full gap-0  bg-[#BCAAA4]  border border-[#5D4037]">
          <CardHeader className="m-0 p-2 mt-1">
            <CardTitle className="text-center text-[#5D4037] text-base flex items-center justify-center gap-2">
              <Pickaxe className="w-5 h-5" />
              项目动态
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-2 mb-2">
            {/* h-[calc(100vh-380px)] */}
            <ScrollArea className="h-[calc(100vh-480px)] minecraft-scroll">
              <MinecraftProjectContent />
            </ScrollArea>
          </CardContent>
      </Card>
    </section>
  )
}

export const MinecraftUpdatesSection = () => {
  return (
    <ResizablePanelGroup className="flex-1 h-auto minecraft-panel-group" direction="horizontal">
      <ResizablePanel defaultSize={50}>
        <MinecraftTeamUpdates />
      </ResizablePanel>
      <ResizableHandle className="my-3 minecraft-handle" />
      <ResizablePanel defaultSize={50}>
        <MinecraftProjectUpdates />
      </ResizablePanel>

      <style jsx global>{`
        .minecraft-card {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        
        .minecraft-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23795548' fillOpacity='0.1'%3E%3Crect x='0' y='0' width='10' height='10' /%3E%3Crect x='10' y='10' width='10' height='10' /%3E%3C/g%3E%3C/svg%3E");
          z-index: 0;
          border-radius: inherit;
        }
        
        .minecraft-inner {
          position: relative;
          z-index: 1;
        }
        
        .minecraft-title {
          font-family: 'Courier New', monospace;
          font-weight: bold;
          text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
        }
        
        .minecraft-update-item {
          background: rgba(161, 136, 127, 0.1);
          padding: 12px;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }
        
        .minecraft-update-item:hover {
          background: rgba(161, 136, 127, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .minecraft-scroll [data-radix-scroll-area-viewport] {
          scrollbar-width: thin;
          scrollbar-color: #8D6E63 #D7CCC8;
        }
        
        .minecraft-scroll [data-radix-scroll-area-scrollbar] {
          background: #8D6E63;
        }
        
        .minecraft-handle {
          background: #8D6E63;
          border: 2px solid #5D4037;
          border-radius: 4px;
        }
        
        .minecraft-handle:hover {
          background: #795548;
        }
        
        .minecraft-panel-group {
          gap: 8px;
        }
      `}</style>
    </ResizablePanelGroup>
  )
}
