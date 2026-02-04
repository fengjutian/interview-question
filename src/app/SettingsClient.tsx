"use client";

import React, { useState, useEffect } from "react";
import { IconMoon, IconSun, IconSetting, IconGithubLogo } from '@douyinfe/semi-icons';
import { SideSheet } from '@douyinfe/semi-ui';

export default function SettingsClient() {
  // 状态管理：侧边栏可见性
  const [sideSheetVisible, setSideSheetVisible] = useState(false);
  // 状态管理：当前主题
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  
  // 初始化主题
  useEffect(() => {
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark' | 'system');
      applyTheme(savedTheme as 'light' | 'dark' | 'system');
    }
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);
  
  // 应用主题
  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const body = document.body;
    let isDarkMode = false;
    
    if (newTheme === 'dark') {
      isDarkMode = true;
    } else if (newTheme === 'system') {
      isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    if (isDarkMode) {
      body.setAttribute('theme-mode', 'dark');
    } else {
      body.removeAttribute('theme-mode');
    }
    
    // 保存主题设置到本地存储
    localStorage.setItem('theme', newTheme);
  };
  
  // 处理主题切换
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };
  
  // 处理设置图标点击
  const handleSettingClick = () => {
    setSideSheetVisible(true);
  };
  
  // 处理月亮图标点击（快速切换深色/浅色模式）
  const handleMoonClick = () => {
    if (theme === 'dark') {
      handleThemeChange('light');
    } else {
      handleThemeChange('dark');
    }
  };
  
  // 处理 GitHub 图标点击
  const handleGithubClick = () => {
    window.open('https://github.com/fengjutian/interview-question', '_blank');
  };
  
  // 获取当前实际主题状态（用于显示图标）
  const getCurrentTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };
  
  return (
    <>
      <div className="flex items-center gap-4">
        {getCurrentTheme() === 'dark' ? (
          <IconSun className="cursor-pointer text-yellow-400 hover:text-yellow-500" size="large" onClick={handleMoonClick} />
        ) : (
          <IconMoon className="cursor-pointer text-gray-600 hover:text-gray-900" size="large" onClick={handleMoonClick} />
        )}
        <IconSetting className="cursor-pointer text-gray-600 hover:text-gray-900" size="large" onClick={handleSettingClick} />
        <IconGithubLogo className="cursor-pointer text-gray-600 hover:text-gray-900" size="large" onClick={handleGithubClick} />
      </div>
      
      {/* 设置侧边栏 */}
      <SideSheet
        title="设置"
        visible={sideSheetVisible}
        onCancel={() => setSideSheetVisible(false)}
        width={400}
        placement="right"
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">应用设置</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium mb-2">主题设置</h4>
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => handleThemeChange('light')}
                  className={`px-3 py-1 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  浅色
                </button>
                <button 
                  onClick={() => handleThemeChange('dark')}
                  className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  深色
                </button>
                <button 
                  onClick={() => handleThemeChange('system')}
                  className={`px-3 py-1 rounded ${theme === 'system' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  跟随系统
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-md font-medium mb-2">显示设置</h4>
              <div className="flex items-center justify-between">
                <span>启用动画效果</span>
                <button className="w-12 h-6 bg-gray-200 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-md font-medium mb-2">关于</h4>
              <p className="text-sm text-gray-600">博客应用 v1.0.0</p>
              <p className="text-sm text-gray-600 mt-1">基于 Next.js 和 Semi Design 构建</p>
            </div>
          </div>
        </div>
      </SideSheet>
    </>
  );
}
