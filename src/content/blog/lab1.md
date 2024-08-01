---
title: 操作系统 多道程序与分时多任务 rCore Lab 1 实验报告
description: 操作系统 多道程序与分时多任务 rCore Lab 1 实验报告
pubDate: 07 18 2024
image: https://saroprock.oss-cn-hangzhou.aliyuncs.com/img/diary-968592_1280.jpg
tags:
  - 操作系统
  - rCore
  - 实验报告
  - 多任务
---
# 简单总结你实现的功能（200字以内，不要贴代码）。
## 第一版
1. 文件`os/src/syscall/mod.rs` 在系统调用函数`syscall`入口处进行调用次数增加操作.
2. 文件`os/src/syscall/process.rs`,导入外部引用`task::get_current_task_info`,获取任务信息,并转构造成`TaskInfo `类型
3. 文件`os/src/task/mod.rs`,导入外部引用`use crate::config:: MAX_SYSCALL_NUM;`扩展`TaskControlBlock `用于初始化任务调用信息,`use crate::timer::get_time_ms;`分别在第一次调用系统函数和用系统调用获取相关信息时获取当前毫秒时间.实现两个供外部调用的函数`get_current_task_info()`和`increase_current_syscall_count()`,具体实现调用`TaskManager`的同名内部实现函数.
4. 文件`os/src/task/task.rs`,扩展`TaskControlBlock `用于存储任务调用信息

## 第二版
1. syscall 入口处调用 增加调用次数函数
2. crate::task 中, 为 TaskManager 添加调用次数统计和初次调用时间字段,并实现这些字段的具体调用方法
3. 使用 的 process 具体处理 syscall , 通过调用 crate::task 具体方法实现
---


# 完成问答题
## 简答作业
正确进入 U 态后，程序的特征还应有：使用 S 态特权指令，访问 S 态寄存器后会报错。请同学们可以自行测试这些内容（运行 三个 bad 测例 (`ch2b_bad_*.rs`) ），描述程序出错行为，同时注意注明你使用的 sbi 及其版本。
 -  `ch2b_bad_address.rs` 提示 `[kernel] PageFault in application, bad addr = 0x0, bad instruction = 0x804003ac, kernel killed it.`
 -  `ch2b_bad_instructions.rs` 提示 `[kernel] IllegalInstruction in application, kernel killed it.`
 -  `ch2b_hello_world.rs` 提示 `[kernel] IllegalInstruction in application, kernel killed it.`
 -  sbi 版本是 `[rustsbi] RustSBI version 0.3.0-alpha.2, adapting to RISC-V SBI v1.0.0`

---

## 深入理解 trap.S 中两个函数 __alltraps 和 __restore 的作用，并回答如下问题:
1. L40：刚进入 __restore 时，a0 代表了什么值。请指出 __restore 的两种使用情景。
    * 在RISC-V架构中，a0 是一个非常重要的寄存器，属于函数调用约定中用于传递参数和返回值的一部分。
    1. switch切换时,a0 进入 `__switch` 前是当前任务的栈指针sp,执行完 `__switch` 后进入 `__restore` a0 都是下一个任务的栈指针sp
    2. 系统调用时,开始参数,最后变为系统调用的返回值

2. L43-L48：这几行汇编代码特殊处理了哪些寄存器？这些寄存器的的值对于进入用户态有何意义？请分别解释。
```asm
ld t0, 32*8(sp)
ld t1, 33*8(sp)
ld t2, 2*8(sp)
csrw sstatus, t0
csrw sepc, t1
csrw sscratch, t2
```

处理了`SSTATUS`、`SEPC`和`SSCRATCH`三个寄存器,需要csrw指令。把用户态CSR（Control and Status Register,控制和状态寄存器）在内存中的值恢复到寄存器中.
    
   - `SSTATUS`寄存器是Supervisor Status寄存器，它包含了有关特权级、全局中断使能以及其他状态的控制位。SPP 等字段给出 Trap 发生之前 CPU 处在哪个特权级（S/U）等信息.注意 sstatus 是 S 特权级最重要的 CSR，可以从多个方面控制 S 特权级的 CPU 行为和执行状态。
    
   - `SEPC`寄存器是Supervisor Exception Program Counter寄存器，它保存了在发生陷入（trap）时的程序计数器值。这个寄存器会在`mret`或`sret`指令执行时，将控制权返回到该地址。

   - `SSCRATCH` 用于用户栈和内核栈的切换,sp保存当前栈的地址,SSCRATCH保存另一个,需要时互换.


3. L50-L56：为何跳过了 x2 和 x4？
```asm
ld x1, 1*8(sp)
ld x3, 3*8(sp)
.set n, 5
.rept 27
   LOAD_GP %n
   .set n, n+1
.endr
```
> 第 13\~24 行，保存 Trap 上下文的通用寄存器 x0\~x31，跳过 x0 和 tp(x4)，原因之前已经说明。我们在这里也不保存 sp(x2)，因为它在第 9 行 后指向的是内核栈。用户栈的栈指针保存在 sscratch 中，必须通过 csrr 指令读到通用寄存器中后才能使用，因此我们先考虑保存其它通用寄存器，腾出空间。

因为x2在前面几行已经恢复过了,而x4是多线程的目前用不上.
简单说就是其他的可以直接存,x2的内容需要用 `csrr ` 命令.
事实上我觉得这是没必要的.如果我错了请告诉我.

4. L60：该指令之后，sp 和 sscratch 中的值分别有什么意义？
```asm
csrrw sp, sscratch, sp
```
执行后发生交换,结果:now sp->kernel stack, sscratch->user stack

5. __restore：中发生状态切换在哪一条指令？为何该指令执行之后会进入用户态？
`sret`,因为:
而当 CPU 完成 Trap 处理准备返回的时候，需要通过一条 S 特权级的特权指令 sret 来完成，这一条指令具体完成以下功能：
- CPU 会将当前的特权级按照 sstatus 的 SPP 字段设置为 U 或者 S ；

- CPU 会跳转到 sepc 寄存器指向的那条指令，然后继续执行。

6. L13：该指令之后，sp 和 sscratch 中的值分别有什么意义？
```asm
csrrw sp, sscratch, sp
```
执行后发生交换,结果:now sscratch->kernel stack, sp->user stack

7. 从 U 态进入 S 态是哪一条指令发生的？
`ecall`
---
# 荣誉准则
## 加入 荣誉准则 的内容。否则，你的提交将视作无效，本次实验的成绩将按“0”分计。
### 警告
#### 请把填写了《你的说明》的下述内容拷贝到的到实验报告中。 否则，你的提交将视作无效，本次实验的成绩将按“0”分计。

1. 在完成本次实验的过程（含此前学习的过程）中，我曾分别与 以下各位 就（与本次实验相关的）以下方面做过交流，还在代码中对应的位置以注释形式记录了具体的交流对象及内容：

看了群聊记录.

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

缺点:
- 代码量不大,但是理解的过程需要耗费大量的时间.主要是rCore-Tutorial-Guide-2024S文档提供的信息量不足,需要查不少额外的资料,后面发现 rCore-Tutorial-Book-v3 文档才顺利一些,有些时效过了也需要踩坑.
- 在线视频清晰度不足.