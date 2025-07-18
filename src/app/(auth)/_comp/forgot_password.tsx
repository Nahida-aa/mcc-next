import { useRouter } from "next/navigation";
import {Form, Input, Button} from "@heroui/react";
import { FormEvent } from "react";

export function ForgotPassword () {
  const router = useRouter();
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("忘记密码表单提交");
  }
  return <>
  <Form className="w-full  max-w-2xl " validationBehavior="aria" onSubmit={onSubmit}>

          <input
            type="email"
            placeholder="请输入您的邮箱"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            发送重置链接
          </button>
  </Form>
      <div className="w-full flex justify-between mt-3">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-500 text-sm"
        >
          返回登录
        </button>
      </div>
  </>

}