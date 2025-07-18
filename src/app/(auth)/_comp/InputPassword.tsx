"use client"

import { validatePassword } from "@/lib/validations/auth";
import { Input } from "@heroui/react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";

export const InputPassword = ({
  name = "password", value, onValueChange, isSubmitted = false,
  placeholder="请输入密码",
  validate = (value: string) => {
    if (isSubmitted && !value) return "请填写密码";
    if (!value) return;
    return validatePassword(value);
  }
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  isSubmitted?: boolean;
  name?: string;
  placeholder?: string;
  validate?: (value: string) => string | null | undefined;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <Input
      isRequired
      name={name} value={value} onValueChange={onValueChange}
      type={isVisible ? "text" : "password"}
      classNames={{
        base: "min-h-[64px] flex justify-start",
        inputWrapper: "shadow-[0_1px_0px_0_rgba(0,0,0,0.35)]"
      }}
      startContent={
        <LockKeyhole className="text-default-400 shrink-0" />
      }
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-hidden"
          type="button"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <EyeOff className="text-default-400 pointer-events-none" />
          ) : (
            <Eye className="text-default-400 pointer-events-none" />
          )}
        </button>
      }
      placeholder={placeholder}
      variant="underlined"
      validate={validate}
    />
  );
}