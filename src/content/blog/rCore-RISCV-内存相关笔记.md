---
title: rCore RISC-V 内存相关笔记
description: 操作系统rCore:RISC-V 内存笔记
pubDate: 07 21 2024
image: https://saroprock.oss-cn-hangzhou.aliyuncs.com/img/diary-968592_1280.jpg
tags:
  - 操作系统
  - rCore
  - 内存管理
---
- 通过修改 S 特权级的一个名为 satp (RV64 Supervisor address translation and protection register satp) 的 CSR 来启用分页模式
    - 4位; MODE 控制 CPU 使用哪种页表实现；

    - 16位; ASID 表示地址空间标识符，这里还没有涉及到进程的概念，我们不需要管这个地方；

    - 44位; PPN 存的是根页表所在的物理页号。这样，给定一个虚拟页号，CPU 就可以从三级页表的根页表开始一步步的将其映射到一个物理页号。

- 虚拟地址(Virtual address)
    - [38:12] 是 虚拟页号 VPN(Virtual Page Number)
    - [11:0] 是 页内偏移 (Page Offset)
- 物理地址(physical address)
    -  [55:12] 是 物理页号 (physical page number)
    -  [11:0] 是 页内偏移 (Page Offset)

```rust
// os/src/mm/address.rs

const PA_WIDTH_SV39: usize = 56;
const PPN_WIDTH_SV39: usize = PA_WIDTH_SV39 - PAGE_SIZE_BITS;

impl From<usize> for PhysAddr {
    //屏蔽63-56位
    // 1 << 1 = 0b10
    // 1 << 2 = 0b100
    fn from(v: usize) -> Self { Self(v & ( (1 << PA_WIDTH_SV39) - 1 )) }
}
impl From<usize> for PhysPageNum {
    //屏蔽63-44位以上高位
    fn from(v: usize) -> Self { Self(v & ( (1 << PPN_WIDTH_SV39) - 1 )) }
}

impl From<PhysAddr> for usize {
    fn from(v: PhysAddr) -> Self { v.0 }
}
impl From<PhysPageNum> for usize {
    fn from(v: PhysPageNum) -> Self { v.0 }
}
```

```rust
// os/src/mm/address.rs

impl PhysAddr {
    pub fn page_offset(&self) -> usize { self.0 & (PAGE_SIZE - 1) }
}

impl From<PhysAddr> for PhysPageNum {
    fn from(v: PhysAddr) -> Self {
      // 不理解跳过
        assert_eq!(v.page_offset(), 0);
        v.floor()
    }
}

impl From<PhysPageNum> for PhysAddr {
    fn from(v: PhysPageNum) -> Self { Self(v.0 << PAGE_SIZE_BITS) }
}

// os/src/mm/address.rs

impl PhysAddr {
    pub fn floor(&self) -> PhysPageNum { PhysPageNum(self.0 / PAGE_SIZE) }
    pub fn ceil(&self) -> PhysPageNum { PhysPageNum((self.0 + PAGE_SIZE - 1) / PAGE_SIZE) }
}
```

- 页表项 (PTE, Page Table Entry) 
```rust
// os/src/mm/page_table.rs

#[derive(Copy, Clone)]
#[repr(C)]
pub struct PageTableEntry {
    pub bits: usize,
}

impl PageTableEntry {
    pub fn new(ppn: PhysPageNum, flags: PTEFlags) -> Self {
        //这里为什么是<< 10,应该是因为不是物理地址,所以只保存必要信息
        PageTableEntry {
            bits: ppn.0 << 10 | flags.bits as usize,
        }
    }
    pub fn empty() -> Self {
        PageTableEntry {
            bits: 0,
        }
    }
    pub fn ppn(&self) -> PhysPageNum {
        //右移10,并且屏蔽物理页号不需要的位
        (self.bits >> 10 & ((1usize << 44) - 1)).into()
    }
    pub fn flags(&self) -> PTEFlags {
        PTEFlags::from_bits(self.bits as u8).unwrap()
    }
}
```


- vscode中rust语言的 analyzer 宏展开快捷键 ?
- 按f1弹出运行命令输入框，搜索expand，会看到展开宏的命令 
- 出处:https://www.zhihu.com/zvideo/1285707439627931648
  
- PageTable 页表 和 页表项 PageTableEntry 之间是什么关系


一些数据结构
```rust
pub struct MemorySet {
    page_table: PageTable,
    areas: Vec<MapArea>,
}

pub struct PageTable {
    root_ppn: PhysPageNum,
    frames: Vec<FrameTracker>,
}
// 这个FrameTracker在PageTable和MapArea里都有
pub struct FrameTracker {
    /// physical page number
    pub ppn: PhysPageNum,
}

pub struct PhysPageNum(pub usize);

pub struct MapArea {
    vpn_range: SimpleRange<VirtPageNum>,
    data_frames: BTreeMap<VirtPageNum, FrameTracker>,
    map_type: MapType,
    map_perm: MapPermission,
}

pub type VPNRange = SimpleRange<VirtPageNum>;

pub struct SimpleRange<T>
where
    T: StepByOne + Copy + PartialEq + PartialOrd + Debug,
{
    l: T,
    r: T,
}

pub struct VirtPageNum(pub usize);

pub enum MapType {
    Identical,//恒等
    Framed,//随机
}

pub struct MapPermission {
    bits: u8,
}







```


页表 - 物理页号

e000 TRAP_CONTEXT_BASE
f000 TRAMPOLINE
10000 程序的末尾



疑问? 页表项到底是怎么存储的?




如何查看 rust 函数调用关系图?
Crabviz: 基于 LSP 的 call graph 生成工具，VS Code 插件已发布
你可以在 VS Code 的插件市场搜索 Crabviz 并安装，安装之后

- 调出命令面板（ Windows、Linux 按 Ctrl+Shift+P，macOS 按 Cmd+Shift+P ）
- 输入 "Crabviz"，选择 "Crabviz: Generate Call Graph"
- Crabviz 会检测项目中的语言，如果检测到有多种语言的话，会让你选择其中一种进行分析
- 这时应该会看到下方出现 "Crabviz: Generating call graph" 的提示，等待完成后可在新页面看到结果

链接:[查看更多](https://rustcc.cn/article?id=4367d516-4850-4289-bc6c-20c22dbba9e5)



内核栈的各地址存储的内容
```rust
/// Return (bottom, top) of a kernel stack in kernel space.
pub fn kernel_stack_position(app_id: usize) -> (usize, usize) {
    // TRAMPOLINE = 0xFFFFFFFFFFFFF000
    // KERNEL_STACK_SIZE = 0x2000 = 8192
    // PAGE_SIZE = 0x1000 = 4094 = 4k
    let top = TRAMPOLINE - app_id * (KERNEL_STACK_SIZE + PAGE_SIZE);
    let bottom = top - KERNEL_STACK_SIZE;
    (bottom, top)
}
```

切换地址空间就是更换页表的根地址

疑问?内核的用户栈是干嘛的?
保存应用的寄存器



```asm
csrrw sp, sscratch, sp
# now sp->*TrapContext in user space, sscratch->user stack
```
用户栈是干嘛的?
存放
用户空间TrapContext是干嘛的?
TODO,流程还要梳理

sret返回哪个地址?
sepc寄存器存的地址

如何在写代码时用英文标点,其他页面时用中文标点?
安装两个输入法,随时切换.

Supervisor Previous Privilege Mode 翻译?

sstatus 的作用是什么?

内核态如何为用户态准备地址空间?

fence.i 和 sfence.vma 分别是干嘛的?有什么区别?
- 首先需要使用 fence.i 指令清空指令缓存 i-cache 。这是因为，在内核中进行的一些操作可能导致一些原先存放某个应用代码的物理页帧如今用来存放数据或者是其他应用的代码，i-cache 中可能还保存着该物理页帧的错误快照。因此我们直接将整个 i-cache 清空避免错误。接着使用 jr 指令完成了跳转到 __restore 的任务。
- sfence.vma 是清空快表?



```rust
// os/src/task/context.rs

impl TaskContext {
    pub fn goto_trap_return() -> Self {
        Self {
            ra: trap_return as usize,
            s: [0; 12],
        }
    }
}
```
ra 和 switch 等是什么时候被调用的?

lazy_static有什么用?



页表隔离和非页表隔离的具体过程是怎么样的?
最重要的是现在的操作系统改成什么样了?

如何一句话命令开启服务器?

帧跟踪器 FrameTracker 是如何实现自动释放物理页的?
- 销毁时调用自己实现的 drop 函数进行释放
```rust
fn drop(&mut self) {
        frame_dealloc(self.ppn);
    }
```


TASK_MANAGER 的初始化过程
- 获取应用数量
- 定义 `tasks: Vec<TaskControlBlock>`
- 向 tasks 添加初始信息
  - 循环获取应用数据
    - 获取应用数据的引用,即ELF数据
  - 使用应用数据新建 TaskControlBlock
    - from_elf 建立地址空间
      - `MemorySet::new_bare()`
        ```rust
        Self {
            page_table: PageTable::new(),
            areas: Vec::new(),
        }
        ```
      - 设置跳板`memory_set.map_trampoline()` 
      - 解析ELF信息`xmas_elf::ElfFile::new(elf_data)`
      - 验证魔法数
      - 根据程序头数目创建各段,并分配物理地址 `MapArea::new`
        - 初始化段代码
        ```rust
        Self {
            vpn_range: VPNRange::new(start_vpn, end_vpn),
            data_frames: BTreeMap::new(),
            map_type,
            map_perm,
        }
        ```
        - 分配物理地址,并把应用数据写到物理地址上 `memory_set.push`
          - `map_area.map(&mut self.page_table)` 
            - VPNRange 循环`MapArea.map_one(page_table, vpn)`
              - 分配物理页号,并与虚拟页号匹配
              - `page_table.map(vpn, ppn, pte_flags)` 虚实页号匹配,带权限
                - `PageTableEntry` 页表条目 查找物理地址,不存在就创建 `self.find_pte_create(vpn)`
        - 建立栈段
        - 建立TrapContext段
    - 根据trap虚拟地址查询陷入上下文的物理地址
    - 设置应用执行状态
    - 设置内核栈位置 `kernel_stack_position(app_id: usize)`
      - 跳板页之下为每个应用KERNEL_STACK_SIZE = 2页大小的地址,应用直接空一页



第四章测试代码的方法
make run TEST=4 BASE=2


