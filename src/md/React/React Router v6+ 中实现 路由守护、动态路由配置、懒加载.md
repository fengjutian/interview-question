---
title: React Router v6+ 中实现 路由守护、动态路由配置、懒加载
category: React
tags: [React, React Router v6, 路由守护, 动态路由配置, 懒加载]
description: React Router v6+ 中实现 路由守护、动态路由配置、懒加载的详细步骤和代码示例
date: 2026-02-05
---

## 1️⃣ 安装依赖

```bash
npm install react-router-dom
```

如果用 TypeScript，别忘了：

```bash
npm install -D @types/react-router-dom
```

---

## 2️⃣ 创建懒加载组件

React 的 `lazy` + `Suspense` 可以实现按需加载组件：

```tsx
// pages/Home.tsx
export default function Home() {
  return <h2>首页</h2>;
}

// pages/Login.tsx
export default function Login() {
  return <h2>登录页</h2>;
}

// pages/Dashboard.tsx
export default function Dashboard() {
  return <h2>仪表盘（需要登录）</h2>;
}
```

---

## 3️⃣ 创建路由守护组件

路由守护用于判断用户是否有权限访问某个路由，比如是否登录：

```tsx
// components/PrivateRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
  isAuth: boolean;
}

export default function PrivateRoute({ children, isAuth }: PrivateRouteProps) {
  const location = useLocation();
  
  if (!isAuth) {
    // 未登录，重定向到登录页，并保留重定向信息
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```

---

## 4️⃣ 动态路由配置

把路由写成数组，方便动态生成，并支持懒加载：

```tsx
// routes/index.tsx
import { lazy } from 'react';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

interface RouteItem {
  path: string;
  element: JSX.Element;
  private?: boolean; // 是否需要守护
}

export const routes: RouteItem[] = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/dashboard', element: <Dashboard />, private: true },
];
```

---

## 5️⃣ 配置 Router

用 `useRoutes` 或 `<Routes>` 动态生成路由，并用 `Suspense` 包裹懒加载组件：

```tsx
// App.tsx
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const isAuth = Boolean(localStorage.getItem('token')); // 简单示例

  return (
    <BrowserRouter>
      <Suspense fallback={<div>加载中...</div>}>
        <Routes>
          {routes.map(({ path, element, private: isPrivate }) => (
            <Route
              key={path}
              path={path}
              element={
                isPrivate ? <PrivateRoute isAuth={isAuth}>{element}</PrivateRoute> : element
              }
            />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
```

✅ 特点：

1. **懒加载**：用 `lazy` + `Suspense` 按需加载页面。
2. **路由守护**：`PrivateRoute` 判断登录状态，未登录跳转 `/login`。
3. **动态路由**：路由配置统一管理，方便新增、删除或权限控制。

---

## 6️⃣ 可扩展优化

* 可以在 `routes` 中添加 **roles/权限字段**，通过 `PrivateRoute` 判断是否有访问权限。
* 可以在 `PrivateRoute` 内部做 **加载用户信息** 或 **刷新 token** 的逻辑。
* 对复杂项目，可以拆分成 **嵌套路由**，只需在 `RouteItem` 中增加 `children` 即可。

---

如果你需要，我可以帮你写一个 **完整的动态路由+多层嵌套+权限+懒加载示例**，非常接近企业实战的做法。

你希望我帮你写吗？
