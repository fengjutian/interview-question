# TypeScript 入门指南

## 什么是 TypeScript？

TypeScript 是 JavaScript 的超集，它添加了静态类型检查和其他特性，使代码更加可靠和可维护。TypeScript 代码会被编译为 JavaScript，可以在任何支持 JavaScript 的环境中运行。

## 主要特性

### 1. 静态类型检查

TypeScript 提供了静态类型系统，可以在编译时发现类型错误，减少运行时错误。

### 2. 类型推断

TypeScript 可以根据上下文自动推断变量的类型，减少手动类型注解的需要。

### 3. 接口

TypeScript 允许定义接口，描述对象的结构，提供更好的代码提示和类型检查。

### 4. 泛型

TypeScript 支持泛型，可以编写更灵活、可重用的代码。

### 5. 类

TypeScript 支持类和面向对象编程特性，如继承、封装和多态。

### 6. 模块

TypeScript 支持模块系统，可以更好地组织代码。

## 快速开始

### 1. 安装 TypeScript

```bash
# 使用 npm
npm install -g typescript

# 或者使用 yarn
yarn global add typescript
```

### 2. 创建 TypeScript 文件

创建一个名为 `hello.ts` 的文件：

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}

const message = greet('TypeScript');
console.log(message);
```

### 3. 编译 TypeScript 文件

```bash
tscc hello.ts
```

这将生成一个 `hello.js` 文件，然后可以运行它：

```bash
node hello.js
```

## 基本类型

TypeScript 支持以下基本类型：

### 1. 原始类型

- `number` - 数字
- `string` - 字符串
- `boolean` - 布尔值
- `null` - 空值
- `undefined` - 未定义
- `symbol` - 符号
- `bigint` - 大整数

### 2. 对象类型

- `object` - 普通对象
- `array` - 数组
- `tuple` - 元组
- `function` - 函数
- `class` - 类
- `interface` - 接口

## 类型注解

TypeScript 允许为变量、函数参数和返回值添加类型注解：

```typescript
// 变量类型注解
let age: number = 30;
let name: string = 'John';
let isActive: boolean = true;

// 函数参数和返回值类型注解
function add(a: number, b: number): number {
  return a + b;
}

// 数组类型注解
let numbers: number[] = [1, 2, 3];
let strings: string[] = ['a', 'b', 'c'];

// 元组类型注解
let person: [string, number] = ['John', 30];

// 对象类型注解
let user: {
  name: string;
  age: number;
  isActive: boolean;
} = {
  name: 'John',
  age: 30,
  isActive: true
};
```

## 接口

接口用于描述对象的结构：

```typescript
interface User {
  name: string;
  age: number;
  isActive?: boolean; // 可选属性
}

function greetUser(user: User): string {
  return `Hello, ${user.name}!`;
}

const john: User = {
  name: 'John',
  age: 30
};

console.log(greetUser(john));
```

## 类

TypeScript 支持类和面向对象编程：

```typescript
class Person {
  // 属性
  name: string;
  age: number;

  // 构造函数
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // 方法
  greet(): string {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }
}

// 创建实例
const person = new Person('John', 30);
console.log(person.greet());
```

## 泛型

泛型允许编写更灵活、可重用的代码：

```typescript
// 泛型函数
function identity<T>(value: T): T {
  return value;
}

const number = identity<number>(42);
const string = identity<string>('Hello');

// 泛型接口
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 42 };
const stringBox: Box<string> = { value: 'Hello' };

// 泛型类
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop()); // 输出: 2
```

## 模块

TypeScript 支持模块系统，可以更好地组织代码：

### 导出模块

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14;
```

### 导入模块

```typescript
// app.ts
import { add, subtract, PI } from './math';

console.log(add(1, 2)); // 输出: 3
console.log(subtract(5, 2)); // 输出: 3
console.log(PI); // 输出: 3.14
```

## 编译配置

TypeScript 可以通过 `tsconfig.json` 文件进行配置：

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## 最佳实践

### 1. 使用严格模式

在 `tsconfig.json` 中启用 `strict: true`，可以获得更严格的类型检查。

### 2. 合理使用类型注解

为函数参数和返回值添加类型注解，提高代码可读性和可维护性。

### 3. 使用接口

为复杂对象定义接口，提供更好的代码提示和类型检查。

### 4. 合理使用泛型

使用泛型编写更灵活、可重用的代码。

### 5. 模块化

使用模块系统组织代码，提高代码的可维护性和可重用性。

## 总结

TypeScript 是 JavaScript 的超集，它添加了静态类型检查和其他特性，使代码更加可靠和可维护。TypeScript 支持接口、泛型、类等特性，可以编写更灵活、可重用的代码。

通过使用 TypeScript，可以在编译时发现类型错误，减少运行时错误，提高代码的质量和可维护性。如果你正在开发大型应用程序，TypeScript 绝对值得一试！