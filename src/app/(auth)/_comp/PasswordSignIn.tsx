"use client"
import { validatePhoneOrEmail, validatePassword, validateLoginFormWithType } from "@/lib/validations/auth";
import {Form, Input, Button, Card, CardBody} from "@heroui/react";
import { Eye, EyeOff, LockKeyhole, 
  MailIcon 
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient, signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useAuthSession } from "@/components/providers/auth-provider";
import { auth } from "@/lib/auth";
import { toast } from "sonner";

export const PasswordSignIn = () => {
  const [phoneNumberOrEmail, setPhoneNumberOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const { data: session, status, update } = useAuthSession()
  // console.log("callbackUrl:", callbackUrl)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setIsSubmitted(true);
      const formData = Object.fromEntries(new FormData(e.currentTarget)) as {
        phoneNumberOrEmail: string;
        password: string;
      };
      console.log("表单数据:", formData)
      
      // 使用 Zod 验证整个表单并获取输入类型
      const validationResult = validateLoginFormWithType(formData);
      
      if (!validationResult.success) {
        console.error("表单验证失败:", validationResult.errors);
        return;
      }
      
      console.log("验证通过，提交数据:", validationResult.data);
      console.log("输入类型:", validationResult.inputType);
      
      const { phoneNumberOrEmail, password } = validationResult.data;
      
      // 根据 Zod 验证结果确定的类型调用不同的登录方法
      if (validationResult.inputType === 'email') {
        // 邮箱登录
        const res =  await signIn.email(
          {
            email: phoneNumberOrEmail,
            password,
            rememberMe: true,
            // callbackURL: callbackUrl
          },
          {
            onRequest: () => {
              console.log("邮箱登录请求开始");
            },
            onResponse: () => {
              console.log("邮箱登录请求完成");
            },
            onSuccess: () => {
              console.log("邮箱登录成功");
              update() // 更新会话状态
              router.push(callbackUrl);
            },
            onError: (ctx) => {
              console.error("邮箱登录失败:", ctx.error);
              // 这里可以添加错误提示
            }
          }
        );
      } else if (validationResult.inputType === 'phone') {
        // 手机号登录
        await signIn.phoneNumber(
          {
            phoneNumber: `+86${phoneNumberOrEmail}`,
            password,
            rememberMe: true,
          },
          {
            onRequest: () => {
              console.log("手机号登录请求开始");
            },
            onResponse: () => {
              console.log("手机号登录请求完成");
            },
            onSuccess: () => {
              console.log("手机号登录成功");
              router.push(callbackUrl);
            },
            onError: (ctx) => {
              console.error("手机号登录失败:", ctx.error);
              // 这里可以添加错误提示
            }
          }
        );
      } else {
        console.error("无效的登录方式");
      }
      
    } catch (error) {
      console.error("登录失败:", error);
      toast.error("登录失败: " + (error instanceof Error ? error.message : "未知错误"));
    } finally {
      setLoading(false);
    }
  };

  return <>
  <Form className="w-full  max-w-2xl " validationBehavior="aria"  onSubmit={onSubmit} >
    <p className="text-muted-foreground text-xs h-4 mt-4">你所在的地区仅支持 手机号 \ 微信 \ 邮箱 登录</p>
        <Input isRequired
          name="phoneNumberOrEmail" value={phoneNumberOrEmail} onValueChange={setPhoneNumberOrEmail}
          type="text"
          classNames={{
            base: "min-h-[64px] flex  justify-start",
            inputWrapper: "shadow-[0_1px_0px_0_rgba(0,0,0,0.35)]"
          }}
          validate={(value) => {
            if (isSubmitted) {return validatePhoneOrEmail(value)}
            if (!value) return 
            return validatePhoneOrEmail(value);
          }}
          startContent={
            <MailIcon className=" text-default-400 shrink-0 " />
          }
          placeholder="请输入手机号\邮箱地址"
          variant="underlined"
        />

        <Input  isRequired minLength={8}
          name="password" 
          value={password} 
          onValueChange={setPassword}
          classNames={{
            base: "min-h-[64px] flex  justify-start",
            inputWrapper: "shadow-[0_1px_0px_0_rgba(0,0,0,0.35)]"
          }}
        startContent={<LockKeyhole className="text-default-400 shrink-0 "/>}
        endContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-hidden"
            type="button"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? (
              <EyeOff className=" text-default-400 pointer-events-none" />
            ) : (
              <Eye className=" text-default-400 pointer-events-none" />
            )}
          </button>
        }
          validate={(value) => {
            if (isSubmitted) {return validatePassword(value)}
            if (!value) { return} 
            return validatePassword(value)
          }}
        // label="Password"
        placeholder="请输入密码"
        type={isVisible ? "text" : "password"}
        variant="underlined"
      />
      <p className="text-muted-foreground text-xs h-9">注册登录即代表已阅读并同意我们的 <Link href={"#"} className="text-accent-foreground underline">用户协议</Link> 与 <Link href={"#"}className="text-accent-foreground underline">隐私政策</Link></p>
      <Button isLoading={loading} color="primary" type="submit" className="w-full mt-6" >
        登录
      </Button>
    </Form>
      <div className="w-full flex justify-between mt-3">
        <button
          onClick={()=>router.push('/forgot_password')}
          className="text-blue-600 hover:text-blue-500 text-sm"
        >
          忘记密码
        </button>
        <button
          onClick={() => router.push('/sign_up')}
          className="text-blue-600 hover:text-blue-500 text-sm"
        >
          立即注册
        </button>
      </div>
  </>
}
