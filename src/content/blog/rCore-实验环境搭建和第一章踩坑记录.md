---
title: rCore 实验环境搭建和第一章踩坑记录
description: 实验环境搭建和第一章踩坑记录
pubDate: 07 17 2024
image: https://saroprock.oss-cn-hangzhou.aliyuncs.com/img/diary-968592_1280.jpg
tags:
  - 操作系统
  - rCore
  - 环境搭建
  - 踩坑记录
---
# 1.bash提示:
```bash
warning: spurious network error (3 tries remaining): [7] Couldn't connect to server (Failed to connect to 127.0.0.1 port 7890 after 0 ms: Couldn't connect to server)
```
解决办法:取消Git代理
```bash
#取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy

#设置代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

#查看代理
git config --global --get http.proxy
git config --global --get https.proxy
git  config --list
```


# 2.bash提示:
```bash
Unable to write file 'vscode-remote://wsl+ubuntu-20.04/home/......
```
解决办法:用管理员打开终端,参考 https://www.reddit.com/r/bashonubuntuonwindows/comments/jiau7k/cant_open_visual_studio_code_from_wsl_2_ubuntu/ 


# 3.bash提示:【WSL报错】执行:wsl --list --online；错误:0x80072ee7
```bash

```
解决办法:开系统代理，到外网即可修复！！！！！ https://blog.csdn.net/zyk961755/article/details/137907793


# 4.提示:`code .`打开vscode 无权限修改
解决办法:修改文件夹权限
```bash
exit #退出管理员账户,不退运行不了`code .`
sudo chown -R xiaopangxie /home/xiaopangxie/
```
https://stackoverflow.com/questions/64142801/i-am-unable-make-file-or-directory-in-visual-studio-code-in-win-subsystem-for-li


# 5.WSL 的基本命令 https://learn.microsoft.com/zh-cn/windows/wsl/basic-commands
```bash
#安装
wsl --install
#列出可用的 Linux 发行版

#将 WSL 版本设置为 1 或 2
wsl --set-version <distribution name> <versionNumber>
wsl --set-version <distribution name> <versionNumber>
#将 WSL 默认版本设置为 2
wsl --set-default-version 2
#检查 WSL 状态
wsl --status
#关闭
wsl --shutdown
#启动
wsl -d Ubuntu-20.04
```


# 6.运行`$ rust-readobj -h target/riscv64gc-unknown-none-elf/debug/os`时,提示`rust-readobj: command not found`
```bash
cargo install cargo-binutils
rustup component add llvm-tools
```
解决方法:安装cargo-binutils, https://github.com/rust-embedded/cargo-binutils

提示:无法从“https://raw.githubusercontent.com/microsoft/WSL/master/distributions/DistributionInfo.json”中提取列表分发。无法解析服务器的名称或地址

解决办法:修改dns到114.114.114.114,8.8.8.8
然后还不行,重启解决了- -!


# 7.提示:
```bash
xiaopangxie@miaomiao:~/os/os$ qemu-system-riscv64 -machine virt -nographic -bios ../bootloader/rustsbi-qemu.bin -device loader,file=target/riscv64gc-unknown-none-elf/release/os.bin,addr=0x80200000
qemu-system-riscv64: Unable to load the RISC-V firmware "../bootloader/rustsbi-qemu.bin"
```
解决办法:https://github.com/rcore-os/rCore-Tutorial-Book-v3/issues/96
1. 可能是目录下没有bootloader文件，可以从ch1分支的代码中复制一份
2. 可以直接在我们的代码仓库里面找到，每个分支上都有一份。比如这里https://github.com/rcore-os/rCore-Tutorial-v3/blob/main/bootloader/rustsbi-qemu.bin。


# 8.提示:
```bash
error[E0658]: use of unstable library feature 'panic_info_message'
```
解决办法:`main.rs` 里面加上`#![feature(panic_info_message)]`



# 9.提示:
```bash
= note: rust-lld: error: undefined symbol: rust_main
```
解决办法:代码加上`#[no_mangle]`



# 10.提示:无法使用其他文件的println宏
解决办法:添加`use crate::println;`



# 11.CSR是什么 以及相关寄存器的
CSR 是 "Control and Status Register"（控制和状态寄存器）的缩写，在计算机架构中，它们用于存储处理器的控制和状态信息。这些寄存器通常用于控制处理器的操作、管理中断和异常处理、存储处理器状态，以及其他相关功能。对于 RISC-V 架构，CSR 在系统操作、调试、性能监控和其他高级处理任务中发挥着重要作用。
在 RISC-V 架构中，特定的 CSR 负责处理与特权级别（如 S 特权级，或超级特权级）和陷阱（Trap）相关的功能。以下是与 S 特权级 Trap 相关的几个重要 CSR 及其功能说明：

sstatus（Supervisor Status Register）：
功能：该寄存器包含与 S 特权级状态相关的信息，例如处理器在陷阱（Trap）发生之前所处的特权级（S/U），中断使能状态等。
作用：提供 CPU 当前状态的快照，特别是涉及特权级的状态。

sepc（Supervisor Exception Program Counter）：
功能：当发生异常（Exception）时，该寄存器记录发生异常之前正在执行的最后一条指令的地址。
作用：用于异常返回时恢复执行环境。

scause（Supervisor Cause Register）：
功能：描述陷阱（Trap）发生的原因。可以指示是异常（如非法指令）还是中断（如定时器中断），以及具体的异常或中断类型。
作用：帮助陷阱处理程序确定采取何种处理措施。

stval（Supervisor Trap Value Register）：
功能：提供陷阱（Trap）附加信息，具体信息取决于陷阱的类型。对于某些异常，它可能包含引发异常的地址或其他相关数据。
作用：为陷阱处理程序提供更多上下文信息，以便更好地处理陷阱。

stvec（Supervisor Trap Vector Base Address Register）：
功能：控制陷阱处理代码的入口地址。即，当发生陷阱时，处理器跳转到 stvec 指定的地址执行相应的陷阱处理程序。
作用：设置陷阱处理程序的起始位置，确保陷阱被正确处理。
这些寄存器在操作系统和低级系统软件中扮演关键角色，允许操作系统有效地管理异常和中断，维护系统稳定性和安全性。通过对这些 CSR 的配置和使用，系统软件可以实现对硬件资源的精细控制和管理。


# 12.一些汇编指令
- csrr: 读 CSR 寄存器。
- csrw: 写 CSR 寄存器。
- csrrw: 交换 CSR 寄存器和通用寄存器的值。
- sd（Store Doubleword）: 存储双字（8 字节）到内存。
- ld（Load Doubleword）: 从内存加载双字（8 字节）。
- mv: 寄存器间值传递。
- addi: 寄存器加立即数。
- call: 调用子程序。
- sret: 从 S 模式返回。



# 13.vscode 跳转返回/前进快捷键
Windows/Linux: `Alt + Left Arrow` `Alt + Right Arrow`




# 14.Git放弃所有更改
```bash
git reset --hard HEAD
```




# 15.vscode多行操作
1. 多光标编辑 (Multi-cursor Editing)

使用鼠标
- 按住 Alt 键（Windows/Linux）或 Option 键（Mac）并点击：在你想要放置光标的地方点击，会创建多个光标。
- 按住 Alt 键（Windows/Linux）或 Option 键（Mac）并拖动鼠标：在文本上拖动鼠标以创建一列光标。


使用键盘
- Ctrl + Alt + 下/上箭头键（Windows/Linux）或 Cmd + Option + 下/上箭头键（Mac）：每按一次箭头键，都会在上方或下方添加一个光标。
- Ctrl + D（Windows/Linux）或 Cmd + D（Mac）：选择当前光标所在的单词，按下 Ctrl + D/Cmd + D 会在下一个匹配单词上添加光标，重复按会继续选择下一个匹配的单词。
- Ctrl + Shift + L（Windows/Linux）或 Cmd + Shift + L（Mac）：选择所有匹配当前选中文本的行，并在每一行的末尾创建光标。

2. 块选择 (Column Selection)

使用鼠标
- 按住 Shift + Alt 键（Windows/Linux）或 Shift + Option 键（Mac）并拖动鼠标：在你想要选择的区域拖动鼠标，选择一个文本块。

使用键盘
- Ctrl + Shift + Alt + 箭头键（Windows/Linux）或 Cmd + Shift + Option + 箭头键（Mac）：使用箭头键在想要选择的区域进行选择。
3. 使用命令面板

可以通过命令面板快速访问多光标操作：

- 按 Ctrl + Shift + P（Windows/Linux）或 Cmd + Shift + P（Mac）调出命令面板。
- 输入 Insert Cursor Above 或 Insert Cursor Below 来在光标上方或下方插入新的光标。



# 16.休眠后wsl无响应
```bash
taskkill /f /im wslservice.exe
```
解决办法:杀死wsl管理程序 https://github.com/microsoft/WSL/issues/8763#issuecomment-1436727525



# 17.这是可变和不可变借用同时存在吗?
为什么能不可变借用next_task_cx_ptr和可变借用current_task_cx_ptr 能同时存在,详细分析这个程序
提示:
```rust
//path: os/src/task/mod.rs
/// Switch current `Running` task to the task we have found,
    /// or there is no `Ready` task and we can exit with all applications completed
    fn run_next_task(&self) {
        if let Some(next) = self.find_next_task() {
            let mut inner = self.inner.exclusive_access();
            let current = inner.current_task;
            inner.tasks[next].task_status = TaskStatus::Running;
            inner.current_task = next;
            let current_task_cx_ptr = &mut inner.tasks[current].task_cx as *mut TaskContext;
            let next_task_cx_ptr = &inner.tasks[next].task_cx as *const TaskContext;
            drop(inner);
            // before this, we should drop local variables that must be dropped manually
            unsafe {
                __switch(current_task_cx_ptr, next_task_cx_ptr);
            }
            // go back to user mode
        } else {
            panic!("All applications completed!");
        }
    }
```
事实就是指针不是借用,只是获取了可变指针和不可变指针而已
链接:https://chatgpt.com/share/801d565d-eab2-48a0-a030-57836980112b




# 18.wsl中`git push`提示无法用密码登录
```bash
xiaopangxie@miaomiao:~/2024s-rcore-zigzagpig$ git push
Username for 'https://github.com': zigzagpig
Password for 'https://zigzagpig@github.com':
remote: Support for password authentication was removed on August 13, 2021.
remote: Please see https://docs.github.com/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls for information on currently recommended modes of authentication.
fatal: Authentication failed for 'https://github.com/LearningOS/2024s-rcore-zigzagpig.git/'
```
解决办法:还得是`chatgpt`,各种搜索都不靠谱.不仅完美解决还提供了两种方法.

`chatgpt`:GitHub 于 2021 年 8 月 13 日移除了对密码认证的支持。你需要使用其他认证方式来推送代码到 GitHub，例如使用 **Personal Access Token (PAT)** 或 **SSH** 认证。以下是两种解决方案：

### 解决方案 1：使用 Personal Access Token (PAT)

1. **生成 Personal Access Token**：

   - 登录到你的 GitHub 帐户。
   - 点击右上角的头像，然后选择 “Settings”。
   - 在左侧菜单中，选择 “Developer settings”。
   - 点击 “Personal access tokens”，然后点击 “Tokens (classic)”。
   - 点击 “Generate new token” 按钮，选择适当的范围（scope），例如 `repo`，以允许推送到仓库。
   - 生成 Token 后，记下该 Token，因为只会显示一次。

2. **配置 Git 使用 Personal Access Token**：

   当 Git 提示输入用户名和密码时：

   - 用户名仍然使用 GitHub 用户名。
   - 密码使用刚刚生成的 Personal Access Token。

3. **推送代码**：

   ```bash
   git push
   ```

   输入用户名和 PAT 代替密码。

### 解决方案 2：使用 SSH 认证

1. **生成 SSH 密钥对**：

   如果你还没有 SSH 密钥对，生成一个新的：

   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

   按提示输入路径和密码短语（如果需要）。

2. **添加公钥到 GitHub**：

   - 复制公钥内容：

     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```

   - 登录到 GitHub，进入 “Settings” -> “SSH and GPG keys” -> “New SSH key”，粘贴公钥内容，并为其指定一个名称。

3. **测试 SSH 连接**：

   ```bash
   ssh -T git@github.com
   ```

   成功的话会显示类似 `Hi username! You've successfully authenticated, but GitHub does not provide shell access.` 的消息。

4. **将远程仓库的 URL 更改为 SSH URL**：

   你需要将仓库的 URL 从 HTTPS 改为 SSH：

   ```bash
   git remote set-url origin git@github.com:LearningOS/2024s-rcore-zigzagpig.git
   ```

5. **推送代码**：

   ```bash
   git push
   ```

### 总结

1. 使用 Personal Access Token (PAT) 替代密码进行身份验证。
2. 或者，使用 SSH 密钥对进行身份验证。

根据你的偏好选择一种方法，并按照上述步骤进行配置。


# 19.如何让Markdown中的asm汇编代码在vscode中高亮
解决办法:安装扩展 `ASM Code Lens`




# 20.Markdown中如何使用嵌套列表?chatgpt答
在Markdown中，创建嵌套列表（即列表中的列表）是通过缩进的方法来实现的。嵌套列表可以包括有序列表（使用数字）和无序列表（使用星号、减号或加号）。以下是一些嵌套列表的示例：

### 无序列表嵌套无序列表

```markdown
- 一级列表项
  - 二级列表项
    - 三级列表项
  - 另一个二级列表项
- 另一个一级列表项
```

### 有序列表嵌套无序列表

```markdown
1. 一级列表项
   - 二级列表项
     - 三级列表项
   - 另一个二级列表项
2. 另一个一级列表项
```

### 无序列表嵌套有序列表

```markdown
- 一级列表项
  1. 二级列表项
     1. 三级列表项
     2. 另一个三级列表项
  2. 另一个二级列表项
- 另一个一级列表项
```

### 有序列表嵌套有序列表

```markdown
1. 一级列表项
   1. 二级列表项
      1. 三级列表项
      2. 另一个三级列表项
   2. 另一个二级列表项
2. 另一个一级列表项
```

### 注意事项

1. **缩进**：Markdown对缩进的要求并不严格，但通常使用两个或四个空格。使用一致的缩进方式可以确保嵌套结构正确显示。
2. **混合使用**：可以混合使用无序列表和有序列表，只需要正确缩进即可。

### 示例展示

以下是上面嵌套列表的Markdown源码和预期渲染效果：

```markdown
- 一级列表项
  - 二级列表项
    - 三级列表项
  - 另一个二级列表项
- 另一个一级列表项

1. 一级列表项
   - 二级列表项
     - 三级列表项
   - 另一个二级列表项
2. 另一个一级列表项

- 一级列表项
  1. 二级列表项
     1. 三级列表项
     2. 另一个三级列表项
  2. 另一个二级列表项
- 另一个一级列表项

1. 一级列表项
   1. 二级列表项
      1. 三级列表项
      2. 另一个三级列表项
   2. 另一个二级列表项
2. 另一个一级列表项
```

希望这些示例能帮助你理解如何在Markdown中创建嵌套列表！

# 疑问1: 为什么taskcontext 跟 trapcontext的上下文不一样?