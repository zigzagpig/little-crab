---
title: 安装部署 astro EveSunMaple/Frosti 踩坑记录
description:  AstroPaper
pubDate: 07 11 2024
image: https://saroprock.oss-cn-hangzhou.aliyuncs.com/img/diary-968592_1280.jpg
tags:
  - astro
  - 踩坑记录
  - frosti
---
---
author: Sat Naing
pubDatetime: 2023-09-23T15:23:00Z
modDatetime: 2023-12-22T09:13:47.400Z
title: astro 安装 EveSunMaple/Frosti 踩坑记录
slug: astro
featured: true
draft: false
tags:
  - docs
description:
  Some rules & recommendations for creating or adding new posts using AstroPaper
  theme.
---
1. 问:安装连不上网怎么办
```sh
PS C:\note> npm create astro@latest -- --template EveSunMaple/Frosti
Need to install the following packages:
create-astro@4.8.1
Ok to proceed? (y) y
npm ERR! code ETIMEDOUT
npm ERR! errno ETIMEDOUT
npm ERR! network request to https://registry.npmjs.org/cross-spawn failed, reason:
npm ERR! network This is a problem related to network connectivity.
npm ERR! network In most cases you are behind a proxy or have bad network settings.
npm ERR! network
npm ERR! network If you are behind a proxy, please make sure that the
npm ERR! network 'proxy' config is set properly.  See: 'npm help config'

npm ERR! A complete log of this run can be found in: C:\Users\zigzagpig\AppData\Local\npm-cache\
```
gpt答:
有时切换到其他 npm 镜像源也可以解决问题，比如使用淘宝镜像：
```sh
npm config set registry https://registry.npmmirror.com/
# 然后就可以正常安装了
npm create astro@latest -- --template EveSunMaple/Frosti
```


2. git如何更改 remote
```sh
git remote remove origin #命令移除现有的远程仓库
git remote add origin 
git remote set-url origin https://new-url-example.com #git如何更改 remote
```

3. clash 脚本代理无法正常代理npm怎么办
```sh
clash   ERROR… script not found
```
不要使用脚本代理,直接全局就能代理
感谢: https://github.com/Sha1rholder/Clash-against-GFW

4. 如何使用emoji作为favicon图标
🦀:使用下面的代码,来源:https://css-tricks.com/emoji-as-a-favicon/
```html
<link rel="icon"
  href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦀</text></svg>">
```
如果乱码,那一定是:If you’re just throwing together a quick site, do not forget to set <meta charset="UTF-8"> before using this. Otherwise your icon will just look like weird characters.

5. vercel 部署EveSunMaple/Frosti报错 
项目目录打开终端输入：pnpm update如果没有 pnpm 请自行安装。
来源:https://github.com/EveSunMaple/Frosti/issues/8

6. 使用waline给博客增加评论区功能
使用方法见 https://waline.js.org/

7. npm 怎么设置代理
```sh
# 要确认代理设置是否正确，可以使用以下命令查看当前的npm配置：
npm config list
# 或者查看特定的代理配置：
npm config get proxy
npm config get https-proxy
# 取消代理设置：
# 如果您想取消代理设置，可以使用以下命令：
npm config delete proxy
npm config delete https-proxy


# 清除 HTTP 和 HTTPS 代理设置
npm config set proxy null
npm config set https-proxy null
# 可以运行以下命令来检查当前的 npm 配置，确保代理设置已被清除
npm config get proxy
npm config get https-proxy
# 运行以下命令将 HTTP 和 HTTPS 代理配置为 http://127.0.0.1:7890：
npm config set proxy http://127.0.0.1:7890
npm config set https-proxy http://127.0.0.1:7890
# 可以运行以下命令来检查代理配置是否正确
npm config get proxy
npm config get https-proxy
```
来源:https://blog.csdn.net/m0_65659549/article/details/138193623
https://zhuanlan.zhihu.com/p/709578605

8. typescript 的 自动格式化 bug
```ts
Expected ">" but found "/"
---
// Import the global.css file here so that it is included on
// all pages through the use of the
<BaseHead /> component.
// 上一行本应该是在注释里面的,结果保存之后自动下来导致出错了
```
9. XY problem 是什么
重要！千万不要陷入 XY problem！ https://xyproblem.info/ 有问题不好解决就发报错截图给我就行。
来源:https://www.bilibili.com/opus/958116429634207842?spm_id_from=333.999.0.0

10. 配置Astro
修改src\consts.ts里面的变量来设置,不要修改其他应用,除非想修改模板.

11. git push不让push
提示
```sh
Git push: Error: unpack failed: index-pack abnormal exit
PS C:\InfiniLM\exam-grading> git submodule add git@github.com:zigzagpig/rustlings.git rustlings
fatal: 'rustlings' already exists in the index
```
有可能是子模块的问题,使用`git submodule update --remote`更新,不然他引用的是老的版本.
能不用子模块就不用,问题很多,要用命令操作,不能直接删除/更改.

12. git 连不上GitHub这怎么办
尽量使用ssh来连接,因为https连接非常容易被墙.

13. vim 如何退出
冒号别忘了打
```sh
:q! #退出
:wq #保存并退出
```

14. 去哪获取全部的emoji
https://getemoji.com/

15. 
vercel 网站部署地址: https://vercel.com/zigzagpigs-projects
blog 访问地址: little-crab-blog.vercel.app