---
title: Flutter 基础
category: Flutter
tags: [Flutter, 基础, 面试题]
description: Flutter 基础知识总结，包括 Dart 语言的基础语法、Flutter 组件的使用方法、Flutter 路由管理等核心概念
date: 2026-02-05
---
## 为什么使用Flutter?(Flutter的特点)
- 性能：实现了自绘引擎，保持不同端UI一致性，动画流畅性。
- 生态：从Github上来看，目前Flutter活跃用户正在高速增长。从Stackoverflow上提问来看，Flutter社区现在已经很庞大。
- 技术支持：现在Google正在大力推广Flutter，Flutter的作者中很多人都是来自Chromium团队，并且github上活跃度很高。
- 开发效率：Flutter的热重载可帮助开发者快速地进行测试、构建UI、添加功能并更快地修复错误。在iOS和Android模拟器或真机上可以实现毫秒级热重载，并且不会丢失状态。

## Flutter定义了三种不同类型的Channel
- **BasicMessageChannel**：用于传递字符串和半结构化的信息。
- **MethodChannel**：用于传递方法调用（method invocation）。
- **EventChannel**：用于数据流（event streams）的通信。

注意
Method Channel 是非线程安全的。原生代码在处理方法调用请求时，如果涉及到异步或非主线程切换，需要确保回调过程是在原生系统的 UI 线程（也就是 Android 和 iOS 的主线程）中执行的，否则应用可能会出现奇怪的 Bug，甚至是 Crash。

## Flutter是如何做到一套Dart代码可以编译运行在Android和iOS平台的？所以说具体的原理。

Skia绘制，实现跨平台应用层渲染一致性
Method Channel 机制

为了解决调用原生系统底层能力以及相关代码库复用问题，Flutter 为开发者提供了一个轻量级的解决方案，即逻辑层的方法通道（Method Channel）机制。基于方法通道，我们可以将原生代码所拥有的能力，以接口形式暴露给 Dart，从而实现 Dart 代码与原生代码的交互，就像调用了一个普通的 Dart API 一样。

![alt text](imgs/flutter/image.png)

## Flutter在不使用WebView和JS方案的情况下。如何做到热更新？说一下大概思路。
- iOS 目前不支持，不能过审
- 安卓，可以替换so文件来实现
可以接入Tinker进行热更新，而且有Bugly做为补丁版本控制台，来上传下发补丁，统计数量。

## 如何让Flutter 编译出来的APP的包大小尽可能的变小？
1. 移除无用代码和无用资源，压缩图片, 安卓里拆 App Bundle,
2. Dart 编译产物做针对性优化
动态下发：剥离 Data 段及一切非必要产物，打包后动态下发。
内置压缩：以二进制形态内置动态下发包。
3. Flutter 引擎编译产物优化
主要优化思路有升级 Bulild Tools 统一双编译参数，
定制化编译裁剪引擎内部部分特定无用功能。
4. 机器码指令优化
精简机器码指令，Google 也回复称未来 Dart 与 OC 基本持平。
