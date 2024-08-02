---
title: cicv lab3 作业3：使用rust编写一个简单的内核模块并运行
description:  Linux驱动开发
pubDate: 07 26 2024
image: https://saroprock.oss-cn-hangzhou.aliyuncs.com/img/diary-968592_1280.jpg
tags:
  - 实验报告
  - 驱动开发
  - Linux
---
# 实验记录
insmod rust_helloworld.ko 的文件截图和其他过程截图

1. Kconfig
![Kconfig](/images/cicv/作业3-Kconfig.png)
1. Makefile
![Makefile](/images/cicv/作业3-Makefile.png)
1. helloworld输出
![helloworld输出](/images/cicv/作业3-helloworld输出.png)
1. helloworld输出2
![helloworld输出2](/images/cicv/作业3-helloworld输出2.png)

# 遇到的问题
1. 不知道是是没看清还是确实没输出,insmod rust_helloworld.ko没输出
    - 通过dmesg查看输出,后来不用这个命令也能看到输出,玄学QAQ
    ![dmesg](/images/cicv/image.png)
2. 系统提示 overlayfs: missing 'lowerdir'
    overlayfs: missing 'lowerdir'：这条消息与 overlay 文件系统有关。OverlayFS 是一种联合文件系统，它允许你将一个文件系统“叠加”在另一个文件系统之上。lowerdir 参数是 OverlayFS 配置的一部分，表示底层只读层。当你看到 "missing 'lowerdir'" 错误时，意味着你在挂载 OverlayFS 时没有指定这个参数，或者参数有误。你需要确保在挂载 OverlayFS 时正确配置 lowerdir。
    这是虚拟机存储在移动硬盘上不稳定导致
3. 不能正常编译Linux
    问
    ```bash
    make[1]: *** [scripts/Makefile.vmlinux_o:61: vmlinux.o] Error 137
    make: *** [Makefile:1229: vmlinux_o] Error 2 
    ```
    >---------------------
    >make出错,如何查看详细错误信息

    chatgpt:
    >检查内存使用情况：
    >Error 137 表示进程被终止，通常是因为系统内存不足。可以通过以下命令检查系统内存使用情况：

    于是重启电脑,给Ubuntu设置到6.6G内存6核顺利解决,chatgpt yysd没有他我要卡死在这里了.我怀疑过是是不是修改了什么文件,是不是make rust-analyze的问题,chatgpt把我从猜疑中拯救出来.
    就算不能解决也不要卡在这里,太多次太多次浅尝辄止了,不能在这里停止.

4. markdown如何使用引用
    使用大于号
    ```Markdown
    >
    ```

5. Linux如何查看内存
    `free -h`
6. Linux 如何复制文件
    `cp /1/2.txt /3/4.txt`
    可以使用相对地址和绝对地址,文件夹要加-r
7. vscode如何查看md文件
    shift+ctrl+v

# Linux内核驱动基础 相关命令
查看当前的控制台消息日志级别
```bash
cat /proc/sys/kernel/printk
```
添加Linux内核模块等
```bash
# 加载：
insmod xxx.ko #(注意模块与内核版本匹配)
# 卸载：
rmmod xxx.ko
# 列出已加载的模块：
lsmod
# 显示模块信息：
modinfo xxx.ko
# 根据依赖加载或卸载模块：
modprobe xxx.ko
```
内核配置与编译
```bash
# 内核配置方式
make config #: 遍历选择所要编译的内核
make allyesconfig #: 所有可编译的特性都选中
make allnoconfig #: 所有可选特性都不选中（注意有些必选项仍会选中）
make LLVM=1 menuconfig #: 在CLI界面中以菜单形式配置（常用，需要ncurses库）
# 另外，在Linux桌面中，可以使用GUI方式进行配置
make gconfig #: Gnome桌面，需要gtk
make kconfig #: KDE桌面，需要qt
make oldconfig #: 备份现有配置文件
LLVM=1, 调用clang/LLVM工具链来编译Linux内核
ARCH=, 指定目标系统架构，默认与本机相同；可指定ARCH=arm64进行跨平台交叉编译
INSTALL_PATH=，执行make install时指定内核文件的安装位置
INSTALL_MOD_PATH=，指定内核模块文件的安装位置
INSTALL_MOD_STRIP=1，安装模块时调用strip命令去掉符号表等信息以减小文件大小
make LLVM=1 -j $(nproc)，指定用于编译的内核数量，一般与CPU核心数相同，可以加快编译速度
#清理内核目录树
make clean #: 清理编译过程产生的文件（包含中间过程产生的文件以及编译出来的内核、模块）
make mrproper #: 在clean的基础上还同时清理.config文件
make distclean #: 在mrproper基础上清理掉编辑器备份、patch补丁
make LLVM=1 rust-analyzer #为rust-analyzer插件（提供语法分析、代码高亮等）生成rust-project.json配置文件
```
