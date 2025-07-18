"use client";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import Image from "next/image";
import { CircleUserRound, Eye, EyeOff, ImageUp, Loader2, LockKeyhole, MailIcon, X } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button, Form, Input } from "@heroui/react";
import Link from "next/link";
import { usernameSchema, validateEmail, validatePassword, validatePhoneOrEmail, validateUsername } from "@/lib/validations/auth";
import { InputPassword } from "./InputPassword";

export function SignUp() {
	const [loading, setLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	// const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const router = useRouter();

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};
	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			setLoading(true)
			setIsSubmitted(true);
			const formData = Object.fromEntries(new FormData(e.currentTarget)) as {
				username: string;
				email: string;
				password: string;
				passwordConfirmation: string;
				image?: File;
			};
			console.log("表单数据:", formData);

			if (formData.password !== formData.passwordConfirmation) {
				toast.error("密码和确认密码不匹配");
				return;
			}

			const response = await signUp.email({
				email: formData.email,
				password: formData.password,
				name: formData.username,
				username: formData.username,
				image: formData.image ? await convertImageToBase64(formData.image) : "",
				callbackURL: "/",
			});

			if (response.error) {
				toast.error(response.error.message);
			} else {
				router.push("/");
			}
		} catch (error) {
			console.error("注册失败:", error);
			toast.error("注册失败，请稍后再试");
		} finally {
			setLoading(false);
		}
	}

	return (<>
	<Form className="w-full  max-w-2xl " validationBehavior="aria" onSubmit={onSubmit}>
		{/* <p className="text-muted-foreground text-xs h-4 mt-4">你所在的地区仅支持 手机号 \ 微信 \ 邮箱 登录</p> */}
		<Input isRequired
			name="username"
			type="text"
			classNames={{
				base: "min-h-[64px] flex  justify-start",
				inputWrapper: "shadow-[0_1px_0px_0_rgba(0,0,0,0.35)]"
			}}
			validate={(value) => {
				if (isSubmitted && !value) return "请填写用户名"
				if (!value) return 
				return validateUsername(value);
			}}
			startContent={
				<CircleUserRound className=" text-default-400 shrink-0 " />
			}
			placeholder="请输入用户名"
			variant="underlined"
		/>
		<Input isRequired
			name="email"
			type="email"
			classNames={{
				base: "min-h-[64px] flex  justify-start",
				inputWrapper: "shadow-[0_1px_0px_0_rgba(0,0,0,0.35)]"
			}}
			validate={(value) => {
				if (isSubmitted && !value) return "请填写邮箱地址"
				if (!value) return 
				return validateEmail(value);
			}}
			startContent={
				<MailIcon className=" text-default-400 shrink-0 " />
			}
			placeholder="请输入邮箱地址"
			variant="underlined"
		/>
	
		<InputPassword value={password} onValueChange={setPassword} isSubmitted={isSubmitted} />
		<InputPassword value={passwordConfirmation} onValueChange={setPasswordConfirmation} placeholder="请再次输入密码" 
			validate={(value)=>{
				if (isSubmitted && !value) return "请再次输入密码"
				if (!value) return;
				if (value !== password) {return "两次输入的密码不一致";}
				return validatePassword(value);
			}} name="passwordConfirmation" />
		<div className="flex w-full gap-4">
			{imagePreview && (
				<div className="relative w-16 h-16 min-w-16 rounded-sm overflow-hidden">
					<Image
						src={imagePreview}
						alt="Profile preview"
						layout="fill"
						objectFit="cover"
					/>
				</div>
			)}
			<div className="flex items-center gap-2 w-full">
				<Input name="image"
					id="image"
					type="file"
					accept="image/*" 
					onChange={handleImageChange}
					classNames={{
						base: "min-h-[64px] flex justify-start ",
						inputWrapper: "shadow-[0_1px_0px_0_rgba(0,0,0,0.35)]",
						input: "group-data-[has-value=true]:text-muted-foreground",
					}}
					variant="underlined"
					onClear={() => {
						// setImage(null);
						setImagePreview(null);
					}}
					startContent={<ImageUp className=" text-default-400 shrink-0 " />}
				/>
				{/* {imagePreview && (
					<X
						className="cursor-pointer"
						onClick={() => {
							setImage(null);
							setImagePreview(null);
						}}
					/>
				)} */}
			</div>
		</div>
		<p className="text-muted-foreground text-xs h-9">注册登录即代表已阅读并同意我们的 <Link href={"#"} className="text-accent-foreground underline">用户协议</Link> 与 <Link href={"#"}className="text-accent-foreground underline">隐私政策</Link></p>
		<Button isLoading={loading} color="primary" type="submit" className="w-full mt-6" >
			注册
		</Button>
	</Form>
				<div className="w-full flex justify-center mt-3">
        <button
          onClick={() => router.push('/sign_in')}
          className="text-blue-600 hover:text-blue-500 text-sm"
        >
          返回登录
        </button>
      </div>
	</>
	);
}

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}