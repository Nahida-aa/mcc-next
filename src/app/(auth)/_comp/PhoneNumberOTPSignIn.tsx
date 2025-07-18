"use client"
import { validatePhoneOrEmail, validatePassword, validateLoginFormWithType, PhoneNumberOTPSignInSchema } from "@/lib/validations/auth";
import {Form, Input, Button, Card, CardBody} from "@heroui/react";
import { Eye, EyeOff, Hash, LockKeyhole, 
  MailIcon, 
  Smartphone
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient, signIn } from "@/lib/auth-client";
import Link from "next/link";

export const PhoneNumberOTPSignIn = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/better-auth/dashboard';

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = Object.fromEntries(new FormData(e.currentTarget)) as {
        phoneNumber: string;
        password: string;
      };
      
      // 使用 Zod 验证整个表单并获取输入类型
      const validationResult = PhoneNumberOTPSignInSchema.safeParse(formData)
      
      if (!validationResult.success) {
        console.error("表单验证失败:", validationResult.error);
        return;
      }
      
      console.log("验证通过，提交数据:", validationResult.data);
      
      const { phoneNumber, code } = validationResult.data;
      
      const isVerified = await authClient.phoneNumber.verify({
        phoneNumber: `+86${phoneNumber}`,
        code: code
      }, {
        onRequest: () => {
          console.log("验证码登录请求开始");
        },
        onResponse: () => {
          console.log("验证码登录请求完成");
        },
        onSuccess: () => {
          console.log("验证码登录成功");
          router.push(callbackUrl);
        },
        onError: (ctx) => {
          console.error("验证码登录失败:", ctx.error);
          // 这里可以添加错误提示
        }
      })
      
    } catch (error) {
      console.error("登录失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return <>
  <Form className="w-full  max-w-2xl "  onSubmit={onSubmit}>
        <p className="text-muted-foreground text-xs h-4 mt-4">你所在的地区仅支持 手机号 \ 微信 \ 邮箱 登录</p>
        <Input isRequired
          // label="你所在的地区仅支持手机号\微信\邮箱登录"
          name="phoneNumber"
          type="text"
          classNames={{
            base: "min-h-[64px] flex  justify-start", // 预留错误信息空间
            inputWrapper: "shadow-[0_1px_0px_0_rgba(0,0,0,0.35)]"
          }}
          // className="min-h-[64px] flex  justify-start" 
          validate={(value) => {
            if (!value) return 
            return validatePhoneOrEmail(value);
          }}
          startContent={<>
            <Smartphone className=" text-default-400 shrink-0 " />+86
          </>}
          placeholder="请输入手机号"
          variant="underlined"
          
        />

      <Input name="code" isRequired 
        classNames={{
          base: "min-h-[64px] flex  justify-start",
          inputWrapper: "shadow-[0_1px_0px_0_rgba(0,0,0,0.35)]"
        }}
        startContent={<Hash className="text-default-400  shrink-0"  />}
        endContent={<Button onPress={() => {
          console.log("发送验证码");
        }}>
          发送验证码
        </Button>}
          validate={(value) => {
            if (!value) return 
            return validatePassword(value);
          }}
        placeholder="请输入验证码"
        variant="underlined"
      />
      <p className="text-muted-foreground text-xs h-9">注册登录即代表已阅读并同意我们的 <Link href={"#"}className="text-accent-foreground underline">用户协议</Link> 与 <Link href={"#"}className="text-accent-foreground underline">隐私政策</Link>，未注册的手机号将自动注册</p>
      <Button isLoading={loading} color="primary" type="submit" className="w-full mt-6" >
        登录
      </Button>
    </Form>
      <div className="min-h-8"></div>
  </>
}
