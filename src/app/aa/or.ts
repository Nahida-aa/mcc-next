// 64606397 -> 64.61M
// 1234 -> 1234
// 12345 -> 12.35K
// 123456 -> 1.23M
// 通用, 不只用于文件大小
export const formatSize = (size: number): string => {
  if (size < 1000) {
    return size.toString();
  } else if (size < 1000000) {
    return `${(size / 1000).toFixed(2)}K`;
  } else {
    return `${(size / 1000000).toFixed(2)}M`;
  }
}