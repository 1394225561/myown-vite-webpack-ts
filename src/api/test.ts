import { get } from './index'
// 定义返回值的类型
export interface RGetInfo {
  content: {
    title: string;
    value: string[];
  };
}

// 定义参数的类型
export interface PGetInfo {
  keyword: string;
}

export const getInfo = get<RGetInfo, PGetInfo>('/api/getInfo')
