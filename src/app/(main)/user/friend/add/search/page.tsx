"use client";
import { HomeHeader } from '@/components/layout/header/home-header'
import React, { use, useState } from 'react'
import { cookies } from 'next/headers';
import Link from 'next/link'; // 对 next 内的 router 的跳转
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SubHeader } from '@/components/layout/header/sub-header';
import { ChevronRight, CircleX, Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

// import { toast as toast_toast } from "@/components/hooks/use-toast"
import { toast as sonner_toast } from "sonner"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { userLsWithCount_notFriend_by_currentUserId_word, UserLsWithCount_whenAddFriend } from '@/lib/db/q/user/friend';
import { SubmitButton } from '@/components/common/submit-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ShadcnAvatar } from '@/components/common/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  query: z.string().min(1, {
    message: "query must be at least 1 characters.",
  }),
})

// export function InputForm() {
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       query: "",
//     },
//   })

//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     // toast({
//     //   title: "You submitted the following values:",
//     //   description: (
//     //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//     //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//     //     </pre>
//     //   ),
//     // })
//     sonner_toast("You submitted the following values:", {
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     })
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
//         <FormField
//           control={form.control}
//           name="query"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Username</FormLabel>
//               <FormControl>
//                 <Input placeholder="shadcn" {...field} />
//               </FormControl>
//               <FormDescription>
//                 This is your public display name.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Submit</Button>
//       </form>
//     </Form>
//   )
// }


export default function SearchFriendPage() {
  const [searchResults, setSearchResults] = useState<UserLsWithCount_whenAddFriend | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: "",
    },
  })
  const isLoading = form.formState.isSubmitting
  const isSuccessful = form.formState.isSubmitSuccessful

  const handleSearch = async (data: z.infer<typeof FormSchema>) => {
    console.log(`searching for ${data.query}`);
    try {
      // const res = await fetch(`/api/search?q=${data.query}&offset=0&limit=10`);
      const res = await fetch(`/api/hono/user/list/not_friend?q=${data.query}`);
      const result = await res.json();
      if (res.ok) {
        const { users, count } = result as UserLsWithCount_whenAddFriend
        setSearchResults({ users, count });
        sonner_toast(`Found ${count} users matching "${data.query}"`, {
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(users, null, 2)}</code>
            </pre>
          ),
        })
      } else {
        sonner_toast(`An error occurred: ${result.message}`)
      }
    } catch (error: any) {
      console.error(error);
      sonner_toast(`An error occurred: ${error.message}`)
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    sonner_toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    await handleSearch(data)
  }
  const router = useRouter()

  return (<>
    <Form {...form}>
      <SubHeader 
      user={undefined} 
      className='sticky top-0 z-10' > 
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl className=''>
              <div className='relative w-auto mr-3 '>
                <Search size={20} className='absolute left-2 top-1/2 transform -translate-y-1/2 opacity-50' />
                <Input
                  placeholder='name\email\phone'
                  className='pl-8 pr-8 
                  focus-visible:ring-0 
                  focus-visible:ring-offset-0 bg-muted h-[2.375rem]'
                  {...field} // 后续可以补上 点击搜索框 将取消(暂停)请求(也可以不管)
                />
                {/* focus-visible:ring-1 */}
                <CircleX
                  size={20}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 opacity-50 cursor-pointer ${form.watch().query ? 'block' : 'hidden'}`}
                  onClick={() => form.setValue('query', '')}
                />
              </div>
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        </form>
      </SubHeader>
      {form.watch().query && (
        <SubmitButton isLoading={isLoading} className='bg-muted hover:bg-muted/80 text-foreground mt-0.5 flex justify-between focus-visible:ring-0 focus-visible:ring-offset-0 w-full rounded-none'
        onClick={form.handleSubmit(onSubmit)}
        >
          <div></div>
          <span>
            Search&quot;<span className='glow-purple'>{form.watch().query}</span>&quot;相关的
          </span>
          {!isLoading && <ChevronRight />}
        </SubmitButton>
      )}
    </Form>
      {/* <div className='relative w-full '>
        <Search size={20} className='absolute left-2 top-1/2 transform -translate-y-1/2 opacity-50' />
        <Input
          type='text'
          placeholder='name\email\phone'
          className='pl-8 pr-8 focus-visible:ring-1 focus-visible:ring-offset-0  '
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <CircleX
          size={20}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 opacity-50 cursor-pointer ${query ? 'block' : 'hidden'}`}
          onClick={() => setQuery('')}
        />
      </div> */}
    <main className='bg-background/30 h-full'>
      {!form.watch().query && (<div>Enter a query to search for users.</div>)}
      {isLoading && (<div>Searching...</div>)}
      {searchResults && (
      searchResults.count > 0 ? (
        <ul className=' m-2'>
          {searchResults.users.map((user, index) => (<>
            <li key={user.id} className={`flex items-center justify-between bg-muted hover:bg-muted/75 `} onClick={() => {console.log(user)
              router.push(`/${user.name}`)
            }}>
              <ShadcnAvatar src={user.image} size={14} className='my-3 ml-3' />
              <div className='w-full mx-3'>
                <div className='w-full flex items-center my-3'>
                  <div className='h-14 w-full '>
                    <div className='h-7 text-lg font-medium'>
                      {user.nickname ? (
                        <span>{user.nickname}({user.name})</span>
                      ) : (
                        <span>{user.name}</span>
                      )}
                    </div>
                  
                    <div className='h-7'>
                      <Badge variant="secondary" className=''>{user.gender}{user.age}岁</Badge>
                      {/* <div>{user.gender}{user.age}</div> */}
                    </div>
                  </div>
                  <Button variant='outline' className='bg-background/20' onClick={(e: any) => {
                    // 阻止事件冒泡
                    e.stopPropagation()
                    console.log("add")
                  }}>add</Button>
                </div>
              {index !== searchResults.users.length - 1 && <Separator className="mt-" />}
              </div>
            </li>
          </>))}
        </ul>
      ) : (
        <div>No users found matching your query.</div>
      )
      )}
    </main>
  </>)
}
