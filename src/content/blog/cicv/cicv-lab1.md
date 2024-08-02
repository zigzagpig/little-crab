---
title: cicv lab1 作业1：编译Linux内核
description:  Linux驱动开发
pubDate: 07 26 2024
image: https://saroprock.oss-cn-hangzhou.aliyuncs.com/img/diary-968592_1280.jpg
tags:
  - 实验报告
  - 驱动开发
  - Linux
---


# 实验记录
编译得到 vmlinux 的文件截图和其他过程截图

1. vmlinux 的文件
![vmlinux 的文件](/images/cicv/作业1.png)
1. make-install
![make-install](/images/cicv/作业1-make-install.png)
1. make-menuconfig
![make-menuconfig](/images/cicv/作业1-make-menuconfig.png)

# 遇到的问题

1. 无法从资源管理器拖动文件到 vscode 打开的目录中怎么办?
    - 使用另一个vscode窗口拖
    - sftp 不好用
    - scp 命令
        ```bash
        scp path\to\your\image.png username@remote_host:path/to/remote/directory
        ```

2. vscode 如何查看 md 文件
    - Ctrl+Shift+V

3. md 如何插入图片, Markdown 文件可以引用当前目录下的文件吗
    ```markdown
    - ![图片描述](图片相对路径)
    - ![图片描述](./images/cicv/image.png)
    ```

4. 修改后登陆不上,此前没有设置密码,如何设置设置 root 密码
    - sudo passwd root

5. 服务器系统默认关闭了root连接,如何开启
    - 编辑sshd配置文件开启root登录
    - 修改/etc/ssh/sshd_config文件,找到PermitRootLogin directives,改为yes。
    ```bsah
    PermitRootLogin yes
    ```

6. vscode如何ssh连接服务器
    ```bash
    ssh momo@192.168.32.130 -A
    ssh root@192.168.32.130 -A
    ```

7. 给cargo设置国内源,注意`[source.ustc]`只能留一个删除其中一个不要的
    
    ```bash
    mkdir -vp ${CARGO_HOME:-$HOME/.cargo}

    cat << EOF | tee -a ${CARGO_HOME:-$HOME/.cargo}/config.toml
    [source.crates-io]
    replace-with = 'ustc'

    [source.ustc]
    registry = "git://mirrors.ustc.edu.cn/crates.io-index"

    # 或者如果无法使用 git 协议
    [source.ustc]
    registry = "https://mirrors.ustc.edu.cn/crates.io-index/"
    ```
    以上是cargo 1.68以下的方案,新版本访问链接 https://mirrors.ustc.edu.cn/help/crates.io-index.html

8. Rust Toolchain 国内反向代理
    链接 https://mirrors.ustc.edu.cn/help/rust-static.html
    
    使用 rustup 前，先设置环境变量 RUSTUP_DIST_SERVER （用于更新 toolchain）：
    `export RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static`
    以及 RUSTUP_UPDATE_ROOT （用于更新 rustup）：
    `export RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup`
    
    Windows 下对应的设置环境变量的 PowerShell 命令为：

    ```PowerShell
    $env:RUSTUP_DIST_SERVER="https://mirrors.ustc.edu.cn/rust-static"
    $env:RUSTUP_UPDATE_ROOT="https://mirrors.ustc.edu.cn/rust-static/rustup"
    ```

9. 设置 Debian 软件源
    链接 https://mirrors.tuna.tsinghua.edu.cn/help/debian/

10. 如何查看文件系统
    ```bash
    df -Th
    ```

11. 虚拟机磁盘满了如何扩容
    ```bash
    root@momo:/cicv-r4l-3-zigzagpig/linux# df -h
    Filesystem Size Used Avail Use% Mounted on
    tmpfs 388M 1.7M 386M 1% /run
    /dev/mapper/ubuntu--vg-ubuntu--lv 9.8G 8.7G 594M 94% /
    tmpfs 1.9G 0 1.9G 0% /dev/shm
    tmpfs 5.0M 0 5.0M 0% /run/lock
    tmpfs 1.9G 0 1.9G 0% /run/qemu
    /dev/sda2 1.8G 131M 1.5G 8% /boot
    tmpfs 3.7G 12K 3.7G 1% /var/snap/microk8s/common/var/lib/kubelet/pods/4d5dcf7f-7715-4e20-9180-32cdea028651/volumes/kubernetes.ioprojected/kube-api-access-t4xng
    tmpfs 388M 4.0K 388M 1% /run/user/1000
    ```
    /dev/mapper/ubuntu--vg-ubuntu--lv 9.8G 8.7G 594M 94% / 这个快满了,如何扩容
    1. 虚拟机里增加空间
    2. 查看卷组空间：首先，检查卷组中是否有空闲的空间可以分配给逻辑卷。
        ```bash
        vgdisplay
        ```
    3. 增加逻辑卷大小：如果卷组中有可用空间，你可以扩展逻辑卷。
        ```bash
        lvextend -L +SIZE /dev/mapper/ubuntu--vg-ubuntu--lv
        ```
    4. 扩展文件系统：扩展逻辑卷后，你需要扩展文件系统。
        ```bash
        resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
        ```
    
12. 如何配置git
    配置git以便与github同步
    由于github现在不再支持使用https的方式对代码进行更改，仅仅可以下载，只支持git的方式，因此我们还需要在docker中生成密钥放入您的github中，如果您不使用docker，并且本地的Linux环境下已经有了相应的密钥和公钥并放入github中，那么请忽略接下来的配置密钥的步骤。
    我们假定您已经有了一个github账号，如果没有请自行申请。
    配置git使用的username和email，该信息将会在git提交记录中显示
    ```bash
    git config --global user.name "Your username"
    git config --global user.email "Your email@example.com"
    ```

    请注意用你的github name和email填充
    随后，生成ssh key，以便使用ssh连接至github
    ```bash
    ssh-keygen -t rsa -C "Your email@example.com"
    ```

    然后一直敲回车
    随后
    ```bash
    cat ~/.ssh/id_rsa.pub
    ```

    将输出的公钥复制下来。
    打开github.com，登录后点击右上角头像，从中找到Settings，在打开的页面中，找到左侧“SSH and GPG keys”选项卡，点击 New SSH key
    将复制下来的内容黏贴到Key框内，并在Title里面给该密钥按照您的喜好取名。
    最后点击Add SSH key即可。

    您可以在docker或者命令行中使用
    ```bash
    ssh -T git@github.com
    ```

    进行测试，如果输出
    ```bash
    Hi,"Your name"！You've successfully authenticated!...
    ```

    等内容，则说明成功配置了密钥。
    随后，点击本文档上方课程相关资料中的Classroom链接。并点击Accept该邀请，Classroom会自动在你的账号下生成作业仓库，这和Rustlings仓库中的操作基本一致。
    查看你的作业仓库，并记下SSH访问的地址，如下图：

    随后，使用git将远程仓库克隆到本地


