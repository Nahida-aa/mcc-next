"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// interface ContextType extends ContextType {}
// type ContextType = boolean 

export const ListIsExpandContext = createContext<{
  state: boolean,
  setState: (state: boolean) => void;
} | undefined>(undefined);

export const ListIsExpandContextProvider = ({ children }: { children: React.ReactNode 
  // isExpanded?: boolean
}) => {
  const pathname = usePathname();
  const [state, setState] = useState(false);

  useEffect(() => {
    // 检测是否访问项目详情页面
    if (pathname) {
      const pathSegments = pathname.split('/').filter(Boolean);
      
      // 定义所有项目类型
      const projectTypes = ['mod', 'resource_pack', 'data_pack', 'shader', 'world', 'project'];
      
      // 如果路径有两个段，且第一个段是项目类型，则认为是访问项目详情页
      if (pathSegments.length >= 2 && projectTypes.includes(pathSegments[0])) {
        setState(true);
      }
    }
  }, [pathname]);

  return <ListIsExpandContext.Provider value={{ state, setState }}>{children}</ListIsExpandContext.Provider>;
};

export const useListIsExpandContext = () => {
  const context = useContext(ListIsExpandContext);
  if (!context) {
    throw new Error('useListIsExpandContext must be used within a ListIsExpandContextProvider');
  }
  return context;
};