import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Image } from "@/components/image/Image"

export const Announcement = () => {
  return <section className="flex gap-4 my-2 max-w-fit justify-center h-fit">
    <Card className="p-2 gap-0 bg-amber-800">
      <CardHeader className="flex m-7 p-0 justify-center items-center">
        <Image className="dark:invert "
          src="/next.svg" alt="Next.js logo"
          width={180} height={38}
          priority
        />
      </CardHeader>
      <CardContent className="w-fit bg-secondary py-2 flex-1 rounded-md">
        <h1 className="text-center text-2xl md:text-3xl leading-relaxed md:leading-loose font-semibold ">MC联合创作论坛</h1>
        <p className="text-sm text-center text-muted-foreground">创作者们的联合创作基地</p>
        <p className="text-nowrap text-lg">保持自己的热情 珍惜每一份情谊</p>
        <p className="text-nowrap text-lg">好好的做出计划 陪伴着彼此生长</p>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
    <section className="flex flex-col space-y-4 min-w-fit">
      <Card className="p-2">
        <div className="bg-secondary rounded-md p-1">
          <CardHeader className="m-4">
            <CardTitle className="text-center">迎新资料</CardTitle>
          </CardHeader>
          <CardContent className="  p-1 mb-2">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-4">
              <li className="text-nowrap text-xs">平台用户协议</li>
              <li className="text-nowrap text-xs">平台介绍资料</li>
              <li className="text-nowrap text-xs">平台规章制度</li>
              <li className="text-nowrap text-xs">平台用户守则</li>
            </ul>
          </CardContent>
        </div>
      </Card>
      <Card className="flex-1 p-2">
      <CardContent className="bg-secondary rounded-md  p-1 h-full ">
        <h2 className="text-center">平台寄语</h2>
          </CardContent>
      </Card>
    </section>
  </section>
}

export const Announcement2 = () => {
  return (
    <section className="flex gap-4 my-2 justify-center h-fit">
      <div className="relative">
        {/* 告示牌主板 */}
        <div
          className="bg-yellow-200 border-4 border-yellow-700 rounded-lg shadow-lg px-8 py-4 min-w-[320px] max-w-full font-minecraft text-brown-900 text-center relative"
          style={{
            fontFamily: "'Minecraftia', 'monospace', 'SimHei', 'Arial'",
            boxShadow: "0 4px 12px #0004",
            // 可选：模拟木纹
            backgroundImage: "repeating-linear-gradient(90deg, #f7e09c 0 10px, #e2b86b 10px 20px)"
          }}
        >
          {/* 钉子装饰 */}
          <span className="absolute left-2 top-2 w-3 h-3 bg-gray-400 rounded-full border-2 border-gray-700"></span>
          <span className="absolute right-2 top-2 w-3 h-3 bg-gray-400 rounded-full border-2 border-gray-700"></span>
          <span className="absolute left-2 bottom-2 w-3 h-3 bg-gray-400 rounded-full border-2 border-gray-700"></span>
          <span className="absolute right-2 bottom-2 w-3 h-3 bg-gray-400 rounded-full border-2 border-gray-700"></span>
          {/* 内容 */}
          <div className="mb-2">
            <Image className="mx-auto mb-2 dark:invert" src="/next.svg" alt="Next.js logo" width={120} height={28} priority />
            <h1 className="text-2xl font-bold mb-1">MC联合创作论坛</h1>
            <p className="text-sm mb-1">创作者们的联合创作基地</p>
            <p className="text-base">保持自己的热情 珍惜每一份情谊</p>
            <p className="text-base">好好的做出计划 陪伴着彼此生长</p>
          </div>
        </div>
      </div>
      {/* 右侧内容可保留原样 */}
      <section className="flex flex-col space-y-4 min-w-fit">
        {/* ...原有内容... */}
      </section>
    </section>
  )
}

export const MinecraftAnnouncement = () => {
  return (
    <section className="flex flex-col md:flex-row gap-6 mb-8 max-w-fit justify-center items-center relative">
      {/* 主告示牌 */}
      <div className="relative">
        {/* 木桩支撑 */}
        <div className="absolute left-1/2 -bottom-16 w-8 h-20 bg-[#8B4513] -translate-x-1/2 z-0 rounded-b-md shadow-md"></div>

        <Card className="p-3 border-4 border-[#5D4037] bg-[#A1887F] shadow-lg relative z-10 transform rotate-1 minecraft-sign">
          <CardHeader className="flex p-2 justify-center items-center">
            <div className="relative w-[180px] h-[38px] mb-2">
              <Image
                className="minecraft-pixel-image"
                src="/placeholder.svg?height=38&width=180"
                alt="Minecraft Logo"
                width={180}
                height={38}
                priority
              />
            </div>
          </CardHeader>
          <CardContent className="w-fit bg-[#D7CCC8] py-3 px-4 flex-1 rounded-md border-2 border-[#8D6E63] minecraft-text">
            <h1 className="text-center text-2xl md:text-3xl leading-relaxed font-bold text-[#5D4037] minecraft-heading">
              MC联合创作论坛
            </h1>
            <p className="text-sm text-center text-[#795548] my-2">创作者们的联合创作基地</p>
            <p className="text-nowrap text-lg text-[#5D4037]">保持自己的热情 珍惜每一份情谊</p>
            <p className="text-nowrap text-lg text-[#5D4037]">好好的做出计划 陪伴着彼此生长</p>
          </CardContent>
        </Card>
      </div>

      {/* 小告示牌 */}
      <section className="flex flex-col space-y-6 min-w-fit">
        {/* 迎新资料告示牌 */}
        <div className="relative">
          {/* 木桩支撑 */}
          <div className="absolute left-1/2 -bottom-12 w-6 h-16 bg-[#8B4513] -translate-x-1/2 z-0 rounded-b-md shadow-md"></div>

          <Card className="p-3 border-4 border-[#5D4037] bg-[#A1887F] shadow-lg relative z-10 transform -rotate-1 minecraft-sign">
            <div className="bg-[#D7CCC8] rounded-md p-2 border-2 border-[#8D6E63]">
              <CardHeader className="p-2 mb-0">
                <CardTitle className="text-center text-base leading-none font-bold text-[#5D4037] minecraft-heading">迎新资料</CardTitle>
              </CardHeader>
              <CardContent className="p-2 mb-1">
                
                <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <li className="text-nowrap text-xs text-[#5D4037] minecraft-text">平台用户协议</li>
                  <li className="text-nowrap text-xs text-[#5D4037] minecraft-text">平台介绍资料</li>
                  <li className="text-nowrap text-xs text-[#5D4037] minecraft-text">平台规章制度</li>
                  <li className="text-nowrap text-xs text-[#5D4037] minecraft-text">平台用户守则</li>
                </ul>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* 平台寄语告示牌 */}
        <div className="relative">
          {/* 木桩支撑 */}
          <div className="absolute left-1/2 -bottom-12 w-6 h-16 bg-[#8B4513] -translate-x-1/2 z-0 rounded-b-md shadow-md"></div>

          <Card className="p-3 border-4 border-[#5D4037] bg-[#A1887F] shadow-lg relative z-10 transform rotate-2 minecraft-sign">
            <CardContent className="bg-[#D7CCC8] rounded-md p-3 h-full border-2 border-[#8D6E63]">
              <h2 className="text-center text-[#5D4037] font-bold ">平台寄语</h2>
              <p className="text-xs text-[#795548] mt-2 text-center minecraft-text">欢迎来到我的世界创作社区</p>
              <p className="text-xs text-[#795548] mt-2 text-center minecraft-text">平台寄语，平台寄语</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </section>
  )
}