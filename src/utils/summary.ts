/**
 * 生成文本摘要
 * @param content 原始文本内容
 * @param maxLength 摘要最大长度
 * @returns 生成的摘要
 */
export function generateSummary(content: string, maxLength: number = 100): string {
  // 移除Markdown格式标记
  let plainText = content
    // 移除标题标记
    .replace(/^#{1,6}\s+/gm, '')
    // 移除粗体和斜体标记
    .replace(/\*{1,3}(.*?)\*{1,3}/g, '$1')
    // 移除代码块
    .replace(/```[\s\S]*?```/g, '')
    // 移除行内代码
    .replace(/`(.*?)`/g, '$1')
    // 移除链接
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    // 移除图片
    .replace(/!\[(.*?)\]\((.*?)\)/g, '')
    // 移除列表标记
    .replace(/^[\*\-\+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // 移除空白行
    .replace(/\n\s*\n/g, ' ')
    // 移除多余的空格
    .replace(/\s+/g, ' ')
    .trim();

  // 截取指定长度并添加省略号
  if (plainText.length > maxLength) {
    // 尝试在单词边界截取
    const truncated = plainText.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex).trim() + '...';
    } else {
      return truncated.trim() + '...';
    }
  }
  
  return plainText;
}
