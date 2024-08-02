---
title: rCore Lab 3 实验报告，操作系统:进程调度
description: 操作系统rCore:进程调度
pubDate: 07 25 2024
image: https://saroprock.oss-cn-hangzhou.aliyuncs.com/img/diary-968592_1280.jpg
tags:
  - 操作系统
  - rCore
  - 实验报告
  - 进程调度
---
# 简单总结你实现的功能（200字以内，不要贴代码）。

1. 实现 sys_spawn ，生成一个新任务，步骤跟生成新任务类似，需对父子进程关系进行额外处理
2. 添加优先级相关字段，完成设置优先级函数
3. 按优先级进行 task_stride 调度
---

# 总结
代码不复杂，但是还是踩了非常久的坑。
idle_task_cx 初始是0，调用 ____switch() 后ra寄存器自动变为调用处的地址，也就是指向 run_tasks()里的 ____switch()。其中过程就是 寄存器->idle_task_cx_ptr,next_task_cx_ptr->寄存器，此时 idle_task_cx_ptr 就完成了初始化。
折腾了很久才明白，上面就有人解答，但是我没看懂以为他也是疑问，本该多读几遍就明白的，结果折腾了一两天。


# 完成问答题
## 简答作业
### stride 算法深入

stride 算法原理非常简单，但是有一个比较大的问题。例如两个 pass = 10 的进程，使用 8bit 无符号整形储存 stride， p1.stride = 255, p2.stride = 250，在 p2 执行一个时间片后，理论上下一次应该 p1 执行。

实际情况是轮到 p1 执行吗？为什么？
- 不会，因为8位最大255，250+10>255溢出，结果仍然小于255.

我们之前要求进程优先级 >= 2 其实就是为了解决这个问题。可以证明， 在不考虑溢出的情况下 , 在进程优先级全部 >= 2 的情况下，如果严格按照算法执行，那么 STRIDE_MAX – STRIDE_MIN <= BigStride / 2。

为什么？尝试简单说明（不要求严格证明）。
BigStride/优先级 = 步长pass，优先级= BigStride/步长pass >=2,得步长pass <= BigStride / 2
每次都是最小的优先增加一个步长pass，STRIDE_MAX – STRIDE_MIN应该<= 一个步长pass <= BigStride / 2


已知以上结论，考虑溢出的情况下，可以为 Stride 设计特别的比较器，让 BinaryHeap<Stride> 的 pop 方法能返回真正最小的 Stride。补全下列代码中的 partial_cmp 函数，假设两个 Stride 永远不会相等。

```rust
use core::cmp::Ordering;

#[derive(Debug)]
struct Stride(u64);

impl PartialOrd for Stride {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        // STRIDE_MAX – STRIDE_MIN <= BigStride / 2 
        // 不满足上面的条件则大小结果相反
        if !(self.0.max(other.0) - self.0.min(other.0) >= u64::MAX / 2) {
            Some(self.0.cmp(&other.0))
        } else {
            Some(other.0.cmp(&self.0))
        }
    }
}

impl PartialEq for Stride {
   //TIPS: 使用 8 bits 存储 stride, BigStride = 255, 则: (125 < 255) == false, (129 < 255) == true.
   //貌似用不上
    fn eq(&self, other: &Self) -> bool {
        false
    }
}

fn main() {
    println!(
        "Hello, world! {}",
        fork_number("fork() && fork() && fork() || fork() && fork() || fork() && fork();")
    );

    let pass = u64::MAX / 255 * 10;
    // let big_stride = 255;
    let mut p1 = Stride(u64::MAX - 5);
    let mut p2 = Stride(u64::MAX - 10);
    for _ in 0..88 {
        println!("{:?} 和 {:?} ,结果是{:?}", p1, p2, p1.partial_cmp(&p2));

        if p1 > p2 {
            p2 = Stride(p2.0.wrapping_add(pass));
        } else {
            p1 = Stride(p1.0.wrapping_add(pass));
        }
    }
}

fn fork_number(s: &str) -> i32 {
    let fork_vec: Vec<usize> = s
        .split("||")
        .collect::<Vec<&str>>()
        .iter()
        .map(|x| x.matches("fork").count())
        .collect();
    println!("{:?}", fork_vec);
    fork_count(&fork_vec, 0) as _
}

// i 表示第 i 个 || 操作数, 每次处理一个
fn fork_count(v: &Vec<usize>, i: usize) -> usize {
    // 处理完所有操作数
    if i == v.len() {
        return 1;
    }
    // || 的操作数 && 的最终结果为 0 ,几个 fork 几种可能
    // ,后面的状态与前面的操作数无关,分步计算下一个操作数
    // 例: fork() && fork() && fork() 的结果为 0 时只可能是 0 10 110, 其他情况会短路
    v[i] * fork_count(v, i + 1)
    // || 的操作数 && 的最终结果为 1 ,只有全 1 一种可能
    // 两者相加就是fork 运行的次数
    + 1
}

```

## 请阅读下列代码，分析程序的输出 A 的数量：( 已知 && 的优先级比 || 高)
```c
int main() {
    fork() && fork() && fork() || fork() && fork() || fork() && fork();
    printf("A");
    return 0;
}
```
如果给出一个 && || 的序列，如何设计一个程序来得到答案？
- 我的答案见上面程序，文档的参考答案如下;
```python
def count_fork(seq):
counts = [1] +  [i.count("&&") + 1 for i in seq.split("||")]
total = sum([np.prod(counts[:i + 1]) for i in range(len(counts))])
return total
```

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

缺点和建议:
- 测例较弱，调度算法完全不对也能通过测例。
- 应该安排人维护文档，不断提升文档质量。维护人从参加训练营里面的人报名，每个实验给个便捷可达的界面进行讨论，踩坑率很高。