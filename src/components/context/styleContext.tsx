"use client";
import { createContext, useContext, useState } from 'react';

// 1. 定义你的样式状态的结构
interface StyleState {
  border: boolean;
  // 未来可以添加更多样式属性，例如:
  // fontSize: number;
}

// 2. 定义 Context 将提供的值的结构
interface StyleContextType {
  styleState: StyleState;
  setStyleState: React.Dispatch<React.SetStateAction<StyleState>>;
  // 如果需要，未来也可以在这里添加更具体的更新函数，例如:
  // toggleBorder: () => void;
}
// 3. 为 Context 提供一个初始（默认）值
// 这里的 setStyleState 是一个空操作函数，以避免在 Provider 外部调用时出错
const initialStyleState: StyleState = {
  border: true,
  // 在这里初始化其他未来添加的属性
};

export const StyleContext = createContext<StyleContextType>({
  styleState: initialStyleState,
  setStyleState: () => {
    // console.warn(
    console.error(
      'setStyleState was called outside of a StyleContextProvider. ' +
      'Make sure your component is wrapped in StyleContextProvider.'
    );
  },
});

// 4. 创建 StyleContextProvider 组件
export const StyleContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [styleState, setStyleState] = useState<StyleState>(initialStyleState);

  // 如果需要，你可以在这里定义更具体的更新函数
  // const toggleBorder = () => {
  //   setStyleState(prevState => ({ ...prevState, border: !prevState.border }));
  // };

  const contextValue: StyleContextType = {
    styleState,
    setStyleState,
    // toggleBorder, // 如果你添加了 toggleBorder，也需要在这里提供
  };

  return <StyleContext.Provider value={contextValue}>{children}</StyleContext.Provider>;
};

// 5. 创建自定义 Hook 以便在组件中使用 Context
export const useStyle = (): StyleContextType => {
  const context = useContext(StyleContext);
  if (!context) {
    // 理论上，由于有默认值，context 不会是 null/undefined，但保留此检查作为最后的保障。
    throw new Error('useStyle must be used within a StyleContextProvider');
  }
  return context;
};