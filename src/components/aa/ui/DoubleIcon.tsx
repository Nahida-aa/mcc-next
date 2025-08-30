import React from "react";

interface DoubleIconProps {
  primary: React.ReactNode;   // 主图标
  secondary?: React.ReactNode; // 次图标，可选
  size?: string;              // Tailwind 尺寸，默认 10
}

export const DoubleIcon: React.FC<DoubleIconProps> = ({ primary, secondary, size = "10" }) => {
  return (
    <div className={`relative w-${size} h-${size} rounded-md bg-muted`}>
      <div className="w-full h-full [&_svg]:size-10 text-[#9a9a9a]">{primary}</div>

      {secondary && (
        <div className="absolute -bottom-1 -right-1 size-6 p-1 [&_svg]:size-4 bg-[#ebebeb] rounded-full text-blue-400">
          {secondary}
        </div>
      )}
    </div>
  );
};
