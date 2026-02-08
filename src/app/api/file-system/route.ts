import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 获取 md 目录的绝对路径
const getMdDirPath = (): string => {
  return path.join(process.cwd(), 'src', 'md');
};

// 确保目录存在
const ensureDir = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, parentKey, label, oldPath, newPath } = body;
    const mdDir = getMdDirPath();

    switch (action) {
      case 'addFolder': {
        let folderPath = '';
        if (parentKey === null) {
          folderPath = path.join(mdDir, label);
        } else {
          folderPath = path.join(mdDir, parentKey, label);
        }
        ensureDir(folderPath);
        return NextResponse.json({ success: true, path: folderPath });
      }

      case 'addFile': {
        const fileName = label.endsWith('.md') ? label : `${label}.md`;
        let filePath = '';
        if (parentKey === null) {
          filePath = path.join(mdDir, fileName);
        } else {
          filePath = path.join(mdDir, parentKey, fileName);
        }
        ensureDir(path.dirname(filePath));
        const defaultContent = `# ${label.replace('.md', '')}\n\n这是一个新的 Markdown 文件。`;
        fs.writeFileSync(filePath, defaultContent, 'utf8');
        return NextResponse.json({ success: true, path: filePath });
      }

      case 'delete': {
        const deletePath = path.join(mdDir, oldPath);
        if (fs.existsSync(deletePath)) {
          if (fs.lstatSync(deletePath).isDirectory()) {
            fs.rmSync(deletePath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(deletePath);
          }
        }
        return NextResponse.json({ success: true });
      }

      case 'rename': {
        const oldFilePath = path.join(mdDir, oldPath);
        const newFilePath = path.join(mdDir, newPath);
        if (fs.existsSync(oldFilePath)) {
          ensureDir(path.dirname(newFilePath));
          fs.renameSync(oldFilePath, newFilePath);
        }
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('File system operation error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
