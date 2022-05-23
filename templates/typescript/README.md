# 介绍

个人博客，用 markdown 写技术文章，同时支持 pc 端和移动端。
并通过 github actions 自动构建并发布。

## 技术栈

- `vite`
- `react17`
- `typescript`
- `react-router-v6`
- `antd`
- `mobx`

## 代码校验

### 开发阶段

- `vscode`
- `eslint`
- `typescript` 静态代码检查
- `prettier` 格式化代码

### 提交 git

- `lint-staged`
- `husky`

## CI/CD

- `github actions`
- `github pages`

## 功能点描述

1. 纵享 vite 构建带来的丝滑开发体验
2. MDX 实现 markdown 和 jsx 的无缝结合，适用组件库文档生成
3. 解析 md 目录及文件，动态生成菜单
4. 实现 md 文件全局搜索功能
5. 利用 gitHub Actions 进行静态站构建发布

## 使用说明

- 格式：

  目前只支持 2 层级目录树

  文件夹格式：`${文本}_${文本}`

  mdx 文件格式：`${日期}@${文章标题}.mdx`

  如下所示：

  ![20220506214758](https://cdn.jsdelivr.net/gh/yaolx/picBed@main/blogs/pics/20220506214758.png)

- 步骤：

  按照 md 目录里的文档格式，上传对应的 mdx 文件即可自动生成对应的菜单或者数据

  ![20220506215026](https://cdn.jsdelivr.net/gh/yaolx/picBed@main/blogs/pics/20220506215026.png)
