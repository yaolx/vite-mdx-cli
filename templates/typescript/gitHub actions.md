Github Actions 部署 react 项目

## 介绍

github actions 部署前端项目做个总结。

`GitHub Actions`类似`Jenkins`用来做持续集成，只要提交代码，就可以自动做构建，发布操作。免去自己部署的麻烦
用它部署构建是非常简单的，也方便给做个属于自己的博客网站
github actions 的方便之处是在于，不用自己写很多脚本

接下来以`react-boat`项目为例

## 创建 token

首先需要给开启 github actions 的项目一个 token，让开发者拥有推送代码的权限等

进入`github主页`-->`Settings`-->`Developer settings`-->`Personal access tokens`-->`Generate new token`生成 token
![[Pasted ima
![Pasted image 20220421150316](https://user-images.githubusercontent.com/7429874/164420280-3188ee40-0acf-44a6-b342-338bc56721e1.png)
勾上 workflow 工作流权限和 repo 项目基础权限
生成 token 后，复制，
然后到`react-boat`项目中，`Settings`-->`Secrets`-->`Actions`-->`New repository secret`
新建一个`ACCESS_TOKEN`，将前面复制的 token 写入

## 配置项目路径

在`package.json`中增加一个`homepage`，这一步是为了确定项目的根目录，在打包的时候，也要正确配置`js,css`的引用路径
![Pasted image 20220421151627](https://user-images.githubusercontent.com/7429874/164420343-ab4685ea-2427-4660-ba5e-b0f1983b2f03.png)

## 开启 Actions

点击`Actions`-->`set up a workflow yourself`，进入一个 yml 的文件编辑页面，这个脚本默认放在`项目根目录/.github/workflows/`
配置以下相关文档

```yml
name: GitHub Actions Build and Deploy Demo
on:
  push:
    branches:
      - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: checkout
        uses: actions/checkout@master
        # 安装依赖
      - name: install
        run: yarn
        # 打包构建
      - name: build
        run: yarn build:test
        # 部署运行
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4.3.0
        with:
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          BRANCH: gh-pages
          FOLDER: dist
```

从大到小可以按以下划分： **workflow（最大） --> job --> step --> action（最小）**

1. `name`:：脚本名称
2. `on`： 定义工作流触发的时机，这里表示`master`分支有`push`时，该工作流会触发
3. `jobs`：表示任务，可以有多个任务
   当前表示`build-and-deploy`这个任务
4. `runs-on`：指定工作流会在哪个虚拟机中运行，可选`windows`、`macos`、`ubuntu`
5. `steps`： 表示当前任务下的步骤，从上到下一次执行
   每个 step 有以下字段：

- `name`：步骤名
- `run`: 执行命令
- `env` 环境
- `uses`： 使用的 actions，可以从`marketplace`中招
- `with`：action 传入的参数

以上的 yml 中对应的说明：
`checkout`：用了一个`checkout`的`action`，拉取`master`的代码
`install`：安装依赖
`build`：打包测试环境
`deploy`：用到`JamesIves`写的一个 action，叫`github-pages-deploy-action`
传入基本配置：权限`ACCESS_TOKEN`，推送的分支：`BRANCH`，取打包的静态文件：`FOLDER`

配置好以后，随意修改下代码，再次推送到`master`分支，刷新 github 中的`react-boat`，会看到 Github Action 会自动运行，可以查看它打包的过程，构建完，会发现`react-boat`多了一个`gh-pages`分支，里面就是已经打包好的静态资源文件。

这时候去访问我们前面配置好的`homepage`，
会发现`404`
![Pasted image 20220421161115](https://user-images.githubusercontent.com/7429874/164420385-6607af91-5f18-413e-a14d-324310115c1f.png)

查看`github pages`文档发现还有一个 pages 要配置的

## 配置 github pages

点击`Settings` --> `Pages`
![Pasted image 20220421160422](https://user-images.githubusercontent.com/7429874/164420460-5b154e06-154a-49be-9935-889c524b1c5e.png)
选择`branch`改为`gh-pages`，点击`Save`
`actions`又再一次做构建任务，
再次访问`homepage`，发现可以访问，但是资源文件报错了
![Pasted image 20220421161412](https://user-images.githubusercontent.com/7429874/164420488-52faaf2a-d383-4b74-863b-394245f203d5.png)

经过排查发现`https://yaolx.github.io/react-boat/assets/index.8656a302.js`可以正常访问，
那说明是我的工程构建的时候根路径有问题，少了`react-boat`，跟 github 的没对应上
vite 构建出来的 js 地址是`assets/*.js`
需要改成`${项目名}/assets/*.js*`

## 调整 vite 构建路径

增加`base`

```js
import pkg from './package.json'

base: `/${pkg.name}/`
```

本地试着`yarn build:test`

![Pasted image 20220421161722](https://user-images.githubusercontent.com/7429874/164420512-25f5bb1a-95a2-42a0-a8f3-750804f73818.png)

可以正常将根路径加上`react-boat`了
再次提交代码， push 到`master`分支

等待构建发布。

![Pasted image 20220421162408](https://user-images.githubusercontent.com/7429874/164420539-f8955089-1e30-443a-b198-ff3487ba7290.png)
最终效果，可以正常访问了

[网站地址](https://yaolx.github.io/react-boat)

## 参考文档

[gitHub Pages 快速入门](https://docs.github.com/cn/pages/quickstart)
