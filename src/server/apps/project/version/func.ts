// {name}_fabric_1.20.1-1.20.6.{ext}
export const genPrimaryFilename = (name: string, loaders: string[], gameVersions: string[]): string => {
  // 生成主要文件名，包含加载器和游戏版本信息
  const loaderStr = loaders.join('-'); // 多个加载器用-连接
  const gameVersionRange = gameVersions.length > 1 
    ? `${gameVersions[0]}-${gameVersions[gameVersions.length - 1]}`
    : gameVersions[0];
  // 解析文件名和扩展名
  const lastDotIndex = name.lastIndexOf('.');
  const nameWithoutExt = lastDotIndex > 0 ? name.substring(0, lastDotIndex) : name;
  const ext = lastDotIndex > 0 ? name.substring(lastDotIndex) : '';
          
  return `${nameWithoutExt}_${loaderStr}_${gameVersionRange}${ext}`;
}