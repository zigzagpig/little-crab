---
title: rCore Lab 2 实验报告，内存管理
description: 操作系统rCore:内存管理
pubDate: 07 19 2024
image: https://saroprock.oss-cn-hangzhou.aliyuncs.com/img/diary-968592_1280.jpg
tags:
  - 操作系统
  - rCore
  - 实验报告
  - 内存管理
---
# 简单总结你实现的功能（200字以内，不要贴代码）。
1. 为内存管理代码添加了注释。
2. 完成 munmap 。遍历给定虚拟地址对应的虚拟页，依次释放对应的虚拟页，发现虚拟页不存在直接返回错误，严谨的做法是先扫描一遍，不存在错误再进行处理。
   - 注意判断出错的时机，第一个段搜不到直接跳出是不对的，所有段都不存在才是错误，这个错误调试了非常久，一定要学gdb。
3. 完成 mmap 。求出起止虚拟页和虚拟地址，判断可能的错误，使用data_frames.get() 来判断虚拟页是否已存在。将系统调用的的权限参数转成内核可以识别的格式，插入一个新的段。注意 len=0 的情况。
4. 修改 sys_task_info 和 sys_get_time 的处理方法，用户态数据转成内核可使用的引用，防止跨页错误，需要逐字节写入。
---

# 总结
代码真的非常重要，看文章看视频以为懂了，读代码才发现完全不懂，跑测试的时候才发现自己的理解漏洞百出。
代码和测试非常重要！！！
每个结构体，字段和函数都要弄懂才是真的懂。

- 发现问题
   1. 运行自动测试脚本时,会改变代码目录,导致无法再继续执行测试
   2. 每次需要重新从 GitHub 下载测试代码,效率低
- 解决
   1. 使用 git reset --hard HEAD 重置到测试之前的状态,先确定OS目录没有代码会丢失再运行
   2. 需要多次下载的代码暂存到本地,以后都从本地复制
- 借助 chatgpt 写相对复杂的shell脚本并不是太难的事情,代码如下

```shell
#!/bin/sh

test() {
    # Sample input line (in practice, replace this with actual command output)
    # output="Test passed21919: 15/15"
    output=$(make test CHAPTER=4 OFFLINE=1)
    echo "$output"

    # Extract the part after "Test passed" and before the colon
    # Use `awk` to split and retrieve numbers
    output=$(echo "$output" | awk -F 'Test passed' '{print $2}')
    # echo "$output"
    result=$(echo "$output" | awk -F ': ' '{print $2}')

    # Extract the passed and total numbers
    passed=$(echo "$result" | awk -F '/' '{print $1}')
    total=$(echo "$result" | awk -F '/' '{print $2}')

    # Check if the passed number is equal to the total number
    if [ "$passed" -eq "$total" ]; then
        echo "All tests passed."
    else
        echo "Some tests failed."
    fi
    echo "result: $result" | tr -d '[:space:]'
    echo " "
}

clone_repos() {

    # 定义临时仓库存放位置
    REPO_DIR=~/2024s-rcore-zigzagpig/repos

    # 定义目标仓库克隆位置
    TARGET_DIR=~/2024s-rcore-zigzagpig/ci-user

    # 检查临时仓库是否已经存在，如果不存在则克隆
    # git clone https://github.com/LearningOS/rCore-Tutorial-Checker-2024S.git ci-user
    # git clone https://github.com/LearningOS/rCore-Tutorial-Test-2024S.git ci-user/user
    [ ! -d "$REPO_DIR/ci-user" ] && git clone https://github.com/LearningOS/rCore-Tutorial-Checker-2024S.git repos/ci-user
    [ ! -d "$REPO_DIR/user" ] && git clone https://github.com/LearningOS/rCore-Tutorial-Test-2024S.git repos/user

    # 创建目标目录
    # mkdir -p "$TARGET_DIR"
    # mkdir -p "$TARGET_DIR/user"

    # 从临时仓库克隆到目标位置
    git clone "$REPO_DIR/ci-user" "$TARGET_DIR"
    git clone "$REPO_DIR/user" "$TARGET_DIR/user"

}

# Define the commands to execute in a function
execute_commands() {
    echo "Executing commands..."
    # Place your commands here
    # For example:
    cd ~/2024s-rcore-zigzagpig/ || exit
    sudo rm -r ~/2024s-rcore-zigzagpig/ci-user
    git reset --hard HEAD
    # git clone https://github.com/LearningOS/rCore-Tutorial-Checker-2024S.git ci-user
    # git clone https://github.com/LearningOS/rCore-Tutorial-Test-2024S.git ci-user/user
    clone_repos
    cd ~/2024s-rcore-zigzagpig/ci-user || exit
    test
    cd ~/2024s-rcore-zigzagpig/ || exit
    git reset --hard HEAD
    git status
    # Add more commands as needed
}

# Capture the output of git status
output=$(git status)

# Define the lines to check
line1="config.toml"
line2="Makefile"
line3="build.rs"
clean_message="nothing to commit, working tree clean"

# Check if all the lines are present in the output
if echo "$output" | grep -q "$line1" && echo "$output" | grep -q "$line2" && echo "$output" | grep -q "$line3"; then
    echo "All specified lines found. Executing commands."
    execute_commands
# Check if the clean message is present in the output
elif echo "$output" | grep -q "$clean_message"; then
    echo "Working tree clean. Executing commands."
    execute_commands
else
    echo "Conditions not met. No action taken."
fi

```

- 缺点
   1. 代码不干净，多余注释调试代码未清理
- 经验
   1. 要学 gdb，不然调试半天才发现错误
   2. 看视频看教程，以为自己懂了，结果一写代码完全不会，花了非常大力气啃代码才能理解。概念的东西非常好理解，理解代码的具体逻辑才是王道。


# 完成问答题
## 简答作业
1. 请列举 SV39 页表页表项的组成，描述其中的标志位有何作用？
![页表项](https://rcore-os.cn/rCore-Tutorial-Book-v3/_images/sv39-pte.png)
- 中间44(10-53)位物理页号
- 最低的8(0-7)位是标志位,各标志位的作用
   - V(Valid)：仅当位 V 为 1 时，页表项才是合法的；
   - R(Read)/W(Write)/X(eXecute)：分别控制索引到这个页表项的对应虚拟页面是否允许读/写/执行；
   - U(User)：控制索引到这个页表项的对应虚拟页面是否在 CPU 处于 U 特权级的情况下是否被允许访问；
   - G：暂且不理会；
   - A(Accessed)：处理器记录自从页表项上的这一位被清零之后，页表项的对应虚拟页面是否被访问过；
   - D(Dirty)：处理器记录自从页表项上的这一位被清零之后，页表项的对应虚拟页面是否被修改过。

2. 缺页
缺页指的是进程访问页面时页面不在页表中或在页表中无效的现象，此时 MMU 将会返回一个中断， 告知 os 进程内存访问出了问题。os 选择填补页表并重新执行异常指令或者杀死进程。

   1. 请问哪些异常可能是缺页导致的？
      直接看的答案： mcause 寄存器中会保存发生中断异常的原因，其中 Exception Code 为 12 时发生指令缺页异常，为 15 时发生 store/AMO 缺页异常，为 13 时发生 load 缺页异常。
   2. 发生缺页时，描述相关重要寄存器的值，上次实验描述过的可以简略。
      - scause: 中断/异常发生时， CSR 寄存器 scause 中会记录其信息， Interrupt 位记录是中断还是异  常， Exception Code 记录中断/异常的种类。
      - sstatus: 记录处理器当前状态，其中 SPP 段记录当前特权等级。
      - stvec: 记录处理 trap 的入口地址，现有两种模式 Direct 和 Vectored 。
      - sscratch: 其中的值是指向hart相关的S态上下文的指针，比如内核栈的指针。
      - sepc: trap 发生时会将当前指令的下一条指令地址写入其中，用于 trap 处理完成后返回。
      - stval: trap 发生进入S态时会将异常信息写入，用于帮助处理 trap ，其中会保存导致缺页异常的虚拟地址

缺页有两个常见的原因，其一是 Lazy 策略，也就是直到内存页面被访问才实际进行页表操作。 比如，一个程序被执行时，进程的代码段理论上需要从磁盘加载到内存。但是 os 并不会马上这样做， 而是会保存 .text 段在磁盘的位置信息，在这些代码第一次被执行时才完成从磁盘的加载操作。

   1. 这样做有哪些好处？
      按需使用,不会加载多余的内容浪费内存。

其实，我们的 mmap 也可以采取 Lazy 策略，比如：一个用户进程先后申请了 10G 的内存空间， 然后用了其中 1M 就直接退出了。按照现在的做法，我们显然亏大了，进行了很多没有意义的页表操作。

   1. 处理 10G 连续的内存页面，对应的 SV39 页表大致占用多少内存 (估算数量级即可)？
      10 * 1024M / 512 = 20M,(512是10的9次方)
      20 * 1024KB / 512 = 40KB
      40 * 1024B / 512 = 80B
      约 20 M 

   2. 请简单思考如何才能实现 Lazy 策略，缺页时又如何处理？描述合理即可，不需要考虑实现。
      分配内存时先记录，访问时缺页中断，从外存加载到内存。

缺页的另一个常见原因是 swap 策略，也就是内存页面可能被换到磁盘上了，导致对应页面失效。

   1. 此时页面失效如何表现在页表项(PTE)上？
      最低位为0。
3. 双页表与单页表

   为了防范侧信道攻击，我们的 os 使用了双页表。但是传统的设计一直是单页表的，也就是说， 用户线程和对应的内核线程共用同一张页表，只不过内核对应的地址只允许在内核态访问。 (备注：这里的单/双的说法仅为自创的通俗说法，并无这个名词概念，详情见 KPTI )

      1. 在单页表情况下，如何更换页表？
         每个应用都有一个地址空间，可以将其中的逻辑段分为内核和用户两部分，分别映射到内核和用户的数据和代码，且分别在 CPU 处于 S/U 特权级时访问。
         在任务切换的时候才需要切换地址空间。
         任务上下文中保存页表 token 信息，恢复任务上下文之后，读取 token 写入 satp 刷新页表，返回应用执行。
      2. 单页表情况下，如何控制用户态无法访问内核页面？（tips:看看上一题最后一问）
         内核页面的页表项 U 标志位设为 0。
      3. 单页表有何优势？（回答合理即可）
         容易实现；高频进行系统调用的时候能够避免地址空间切换的开销。
      4. 双页表实现下，何时需要更换页表？假设你写一个单页表操作系统，你会选择何时更换页表（回答合理即可）？
         trap_handle 的时候；切换任务的时候。

---
# 荣誉准则
## 加入 荣誉准则 的内容。否则，你的提交将视作无效，本次实验的成绩将按“0”分计。
### 警告
#### 请把填写了《你的说明》的下述内容拷贝到的到实验报告中。 否则，你的提交将视作无效，本次实验的成绩将按“0”分计。

1. 在完成本次实验的过程（含此前学习的过程）中，我曾分别与 以下各位 就（与本次实验相关的）以下方面做过交流，还在代码中对应的位置以注释形式记录了具体的交流对象及内容：

看了群聊记录.
看了 rCore-Tutorial-Book-v3 的答案。

2. 此外，我也参考了 以下资料 ，还在代码中对应的位置以注释形式记录了具体的参考来源及内容：

chatgpt yyds,向他提问获取了非常多重要信息,没有他根本完不成.

3. 我独立完成了本次实验除以上方面之外的所有工作，包括代码与文档。 我清楚地知道，从以上方面获得的信息在一定程度上降低了实验难度，可能会影响起评分。

4. 
- 我从未使用过他人的代码，不管是原封不动地复制，还是经过了某些等价转换。 
- 我未曾也不会向他人（含此后各届同学）复制或公开我的实验代码，我有义务妥善保管好它们。
- 我提交至本实验的评测系统的代码，均无意于破坏或妨碍任何计算机系统的正常运转。
- 我清楚地知道，以上情况均为本课程纪律所禁止，若违反，对应的实验成绩将按“-100”分计。

---
# 推荐markdown文档格式。
ok!


# (optional) 你对本次实验设计及难度/工作量的看法，以及有哪些需要改进的地方，欢迎畅所欲言。
优点:通过代码可以非常深刻地理解操作系统的运行过程,希望一直办下去.
代码真的非常重要，看文章看视频以为懂了，读代码才发现完全不懂，跑测试的时候才发现自己的理解漏洞百出。
代码和测试非常重要！！！

缺点:
- 内核与应用地址空间的隔离 部分讲的不是很清楚，看了很多遍还是不太懂两种页表的具体如何实现。
- 在线视频清晰度不足。成本过大的话，可以把高清的存到B站的视频网站。