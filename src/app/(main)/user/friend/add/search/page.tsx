"use client";
import { HomeHeader } from '@/components/layout/header/home-header'
import React, { useState } from 'react'
import { cookies } from 'next/headers';
import Link from 'next/link'; // 对 next 内的 router 的跳转
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area';
import { server_auth } from '@/app/(auth)/auth';
import { SubHeader } from '@/components/layout/header/sub-header';
import { ChevronRight, CircleX, Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input"

interface Result {
  id: number;
  name: string;
  email: string;
}

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
  // const [session, cookieStore] = await Promise.all([server_auth(), cookies()]);
  // const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: "",
    },
  })
  const handleSearch = async (data: z.infer<typeof FormSchema>) => {
    console.log(`searching for ${data.query}`);
    // 模拟搜索结果
    const mockResults: Result[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];
    // setResults(mockResults.filter(user => user.name.includes(query) || user.email.includes(query)));
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


  return (<>
    <Form {...form}>
      <SubHeader 
      // user={session?.user} 
      user={undefined} 
      className='sticky top-0 z-10' > 
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl className=''>
              <div className='relative w-auto mr-1 '>
                <Search size={20} className='absolute left-2 top-1/2 transform -translate-y-1/2 opacity-50' />
                <Input
                  placeholder='name\email\phone'
                  className='pl-8 pr-8 
                  focus-visible:ring-0 
                  focus-visible:ring-offset-0 bg-muted h-[2.375rem]'
                  {...field}
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
        <Button type="submit" className='bg-muted hover:bg-muted/80 text-foreground mt-0.5 flex justify-between focus-visible:ring-0 focus-visible:ring-offset-0 w-full'
        onClick={form.handleSubmit(onSubmit)}
        >
          <div></div>
          <span>
            Search<span className='glow-purple'>{form.watch().query}</span>相关的
          </span>
          <ChevronRight />
        </Button>
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
    
    <main className=''>
      <ul>
        {results.length === 0 ? (
          <li>No results found.</li>
        ) : (
          results.map(user => (
            <li key={user.id} className='p-2 border-b'>
              <div className='font-medium'>{user.name}</div>
              <div className='text-sm text-gray-500'>{user.email}</div>
            </li>
          ))
        )}
      </ul>
    </main>
  </>)
}
