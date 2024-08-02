---
title: cicv lab2 作业2：对Linux内核进行一些配置
description:  Linux驱动开发
pubDate: 07 26 2024
image: https://saroprock.oss-cn-hangzhou.aliyuncs.com/img/diary-968592_1280.jpg
tags:
  - 实验报告
  - 驱动开发
  - Linux
---

# 实验记录
编译内核模块 r4l_e1000_demo.o 的文件截图和其他过程截图

1. e1000改为内核模块
![e1000改为内核模块](/images/cicv/作业2-e1000改为内核模块.png)
1. 编译得到内核模块
![make-install](/images/cicv/作业2-编译得到内核模块.png)
1. 作业2-Linux启动
![make-menuconfig](/images/cicv/作业2-Linux启动.png)



Q: 在该文件夹中调用make LLVM=1，该文件夹内的代码将编译成一个内核模块。请结合你学到的知识，回答以下两个问题：
1、编译成内核模块，是在哪个文件中以哪条语句定义的？
/src_e1000/Kbuild 里的
```Kbuild
obj-m := r4l_e1000_demo.o
```
2、该模块位于独立的文件夹内，却能编译成Linux内核模块，这叫做out-of-tree module，请分析它是如何与内核代码产生联系的？
cicv-r4l-3-zigzagpig/src_e1000/makefile 文件指定了linux目录,并且也指定了cicv-r4l-3-zigzagpig/src_e1000 目录

```makefile
KDIR ?= ../linux

default:
	$(MAKE) -C $(KDIR) M=$$PWD
```

实验结果
```bash
~ # insmod r4l_e1000_demo.ko
[  131.493863] r4l_e1000_demo: loading out-of-tree module taints kernel.
[  131.499452] r4l_e1000_demo: Rust for linux e1000 driver demo (init)
[  131.500099] r4l_e1000_demo: Rust for linux e1000 driver demo (probe): None
[  131.631993] ACPI: \_SB_.LNKC: Enabled at IRQ 11
[  131.655481] r4l_e1000_demo: Rust for linux e1000 driver demo (net device get)
[  131.657451] insmod (81) used greatest stack depth: 11192 bytes left
~ # ip link set eth0 up
[  172.973908] r4l_e1000_demo: Rust for linux e1000 driver demo (net device ope)
[  172.976289] r4l_e1000_demo: Rust for linux e1000 driver demo (net device get)
[  172.977517] IPv6: ADDRCONF(NETDEV_CHANGE): eth0: link becomes ready
[  172.980619] r4l_e1000_demo: Rust for linux e1000 driver demo (net device get)
~ # [  172.988048] r4l_e1000_demo: Rust for linux e1000 driver demo (net device0
[  172.988856] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  172.989427] r4l_e1000_demo: pending_irqs: 3
[  172.990129] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
[  173.498237] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  173.498670] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  173.498920] r4l_e1000_demo: pending_irqs: 3
[  173.499154] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
[  173.881602] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  173.882221] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  173.882555] r4l_e1000_demo: pending_irqs: 3
[  173.882783] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
[  174.521998] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  174.522659] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  174.522856] r4l_e1000_demo: pending_irqs: 3
[  174.523098] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
[  174.523615] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  174.524114] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  174.524387] r4l_e1000_demo: pending_irqs: 3
[  174.524730] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
[  175.161187] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  175.161671] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  175.161892] r4l_e1000_demo: pending_irqs: 3
[  175.162285] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
[  178.746080] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  178.746574] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  178.746778] r4l_e1000_demo: pending_irqs: 3
[  178.747176] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
[  187.450228] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  187.450877] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  187.451302] r4l_e1000_demo: pending_irqs: 3
[  187.451779] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
[  205.369346] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  205.370114] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  205.370481] r4l_e1000_demo: pending_irqs: 3
[  205.370692] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
ip addr add broadcast 10.0.2.255 dev eth0
[  238.241549] r4l_e1000_demo: Rust for linux e1000 driver demo (net device get)
[  238.243048] r4l_e1000_demo: Rust for linux e1000 driver demo (net device get)
ip: RTNETLINK answers: Invalid argument
~ # [  242.745429] r4l_e1000_demo: Rust for linux e1000 driver demo (net device0
[  242.746085] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  242.746354] r4l_e1000_demo: pending_irqs: 3
[  242.746673] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
ip addr add 10.0.2.15/255.255.255.0 dev eth0
[  291.237675] r4l_e1000_demo: Rust for linux e1000 driver demo (net device get)
[  291.238283] r4l_e1000_demo: Rust for linux e1000 driver demo (net device get)
~ # [  316.473429] r4l_e1000_demo: Rust for linux e1000 driver demo (net device0
[  316.474076] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  316.474593] r4l_e1000_demo: pending_irqs: 3
[  316.474850] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
ip route add default via 10.0.2.1
~ # ping 10.0.2.2
PING 10.0.2.2 (10.0.2.2): 56 data bytes
[  395.147708] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  395.149108] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  395.149491] r4l_e1000_demo: pending_irqs: 131
[  395.149967] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
[  395.151564] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta1
[  395.152090] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  395.152371] r4l_e1000_demo: pending_irqs: 131
[  395.153442] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=0 ttl=255 time=11.662 ms
[  396.157174] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta2
[  396.157577] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  396.157718] r4l_e1000_demo: pending_irqs: 131
[  396.158078] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=1 ttl=255 time=1.549 ms
[  397.161070] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta3
[  397.161544] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  397.161757] r4l_e1000_demo: pending_irqs: 131
[  397.162070] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=2 ttl=255 time=2.138 ms
[  398.163974] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta4
[  398.164453] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  398.164742] r4l_e1000_demo: pending_irqs: 131
[  398.165048] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=3 ttl=255 time=1.680 ms
[  399.166522] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta5
[  399.167006] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  399.167189] r4l_e1000_demo: pending_irqs: 131
[  399.167331] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=4 ttl=255 time=1.462 ms
[  400.168457] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta6
[  400.169545] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  400.170016] r4l_e1000_demo: pending_irqs: 131
[  400.170334] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=5 ttl=255 time=2.981 ms
[  401.172186] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta7
[  401.172664] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  401.173003] r4l_e1000_demo: pending_irqs: 131
[  401.173243] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=6 ttl=255 time=1.883 ms
[  402.175083] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  402.175865] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  402.176258] r4l_e1000_demo: pending_irqs: 131
[  402.176868] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=7 ttl=255 time=2.585 ms
[  403.179049] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta1
[  403.179618] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  403.179965] r4l_e1000_demo: pending_irqs: 131
[  403.180385] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=8 ttl=255 time=2.190 ms
[  404.182047] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta2
[  404.182462] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  404.182803] r4l_e1000_demo: pending_irqs: 131
[  404.183029] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=9 ttl=255 time=1.540 ms
[  405.184056] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta3
[  405.184476] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  405.184735] r4l_e1000_demo: pending_irqs: 131
[  405.184948] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=10 ttl=255 time=1.491 ms
[  406.186740] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta4
[  406.187369] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  406.187594] r4l_e1000_demo: pending_irqs: 131
[  406.187833] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=11 ttl=255 time=1.671 ms
[  407.189582] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta5
[  407.190145] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  407.190377] r4l_e1000_demo: pending_irqs: 131
[  407.190626] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=12 ttl=255 time=1.708 ms
[  408.192067] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta6
[  408.192583] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  408.193011] r4l_e1000_demo: pending_irqs: 131
[  408.193251] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=13 ttl=255 time=1.716 ms
[  409.195054] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta7
[  409.195504] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  409.195754] r4l_e1000_demo: pending_irqs: 131
[  409.196020] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=14 ttl=255 time=1.643 ms
[  410.197467] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  410.198032] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  410.198380] r4l_e1000_demo: pending_irqs: 131
[  410.198931] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=15 ttl=255 time=2.017 ms
[  411.199980] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta1
[  411.200603] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  411.200890] r4l_e1000_demo: pending_irqs: 131
[  411.201207] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=16 ttl=255 time=1.735 ms
[  412.202302] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta2
[  412.203055] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  412.203268] r4l_e1000_demo: pending_irqs: 131
[  412.203446] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=17 ttl=255 time=1.800 ms
[  413.205187] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta3
[  413.205681] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  413.205889] r4l_e1000_demo: pending_irqs: 131
[  413.206168] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=18 ttl=255 time=1.440 ms
[  414.207315] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta4
[  414.207661] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  414.207809] r4l_e1000_demo: pending_irqs: 131
[  414.207958] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=19 ttl=255 time=1.466 ms
[  415.209753] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta5
[  415.210106] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  415.210470] r4l_e1000_demo: pending_irqs: 131
[  415.210690] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=20 ttl=255 time=1.441 ms
[  416.211711] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta6
[  416.212321] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  416.212750] r4l_e1000_demo: pending_irqs: 131
[  416.213079] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=21 ttl=255 time=1.864 ms
[  417.214923] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta7
[  417.215477] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  417.215786] r4l_e1000_demo: pending_irqs: 131
[  417.216093] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=22 ttl=255 time=1.750 ms
[  418.217200] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  418.217780] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  418.218078] r4l_e1000_demo: pending_irqs: 131
[  418.218371] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=23 ttl=255 time=1.780 ms
[  419.219629] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta1
[  419.220093] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  419.220412] r4l_e1000_demo: pending_irqs: 131
[  419.220785] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=24 ttl=255 time=1.724 ms
[  420.222021] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta2
[  420.222502] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  420.223123] r4l_e1000_demo: pending_irqs: 131
[  420.223399] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=25 ttl=255 time=2.030 ms
[  421.224899] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta3
[  421.225316] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  421.225529] r4l_e1000_demo: pending_irqs: 131
[  421.225790] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=26 ttl=255 time=1.673 ms
[  422.227129] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta4
[  422.227675] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  422.227946] r4l_e1000_demo: pending_irqs: 131
[  422.228311] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=27 ttl=255 time=1.680 ms
[  423.230004] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta5
[  423.230355] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  423.230534] r4l_e1000_demo: pending_irqs: 131
[  423.230688] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=28 ttl=255 time=1.219 ms
[  424.232064] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta6
[  424.232493] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  424.232776] r4l_e1000_demo: pending_irqs: 131
[  424.233049] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=29 ttl=255 time=1.648 ms
[  425.234566] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta7
[  425.235216] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  425.235468] r4l_e1000_demo: pending_irqs: 131
[  425.235700] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=30 ttl=255 time=1.940 ms
[  426.237398] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  426.237815] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  426.238135] r4l_e1000_demo: pending_irqs: 131
[  426.238413] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=31 ttl=255 time=1.624 ms
[  427.239976] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta1
[  427.240376] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  427.240587] r4l_e1000_demo: pending_irqs: 131
[  427.240775] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=32 ttl=255 time=1.668 ms
[  428.242303] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta2
[  428.242870] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  428.243317] r4l_e1000_demo: pending_irqs: 131
[  428.243458] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=33 ttl=255 time=1.768 ms
[  429.244539] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta3
[  429.245398] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  429.245945] r4l_e1000_demo: pending_irqs: 131
[  429.246415] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=34 ttl=255 time=2.965 ms
[  430.248091] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta4
[  430.248535] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  430.248719] r4l_e1000_demo: pending_irqs: 131
[  430.248909] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=35 ttl=255 time=1.368 ms
[  431.250373] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta5
[  431.250863] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  431.251200] r4l_e1000_demo: pending_irqs: 131
[  431.251406] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=36 ttl=255 time=1.481 ms
[  432.252549] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta6
[  432.253274] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  432.253452] r4l_e1000_demo: pending_irqs: 131
[  432.253603] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=37 ttl=255 time=1.708 ms
[  433.255112] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta7
[  433.255813] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  433.256179] r4l_e1000_demo: pending_irqs: 131
[  433.256547] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=38 ttl=255 time=2.188 ms
[  434.258131] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  434.258596] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  434.258834] r4l_e1000_demo: pending_irqs: 131
[  434.259061] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=39 ttl=255 time=1.955 ms
[  435.260752] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta1
[  435.261346] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  435.261692] r4l_e1000_demo: pending_irqs: 131
[  435.261854] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=40 ttl=255 time=1.606 ms
[  436.262857] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta2
[  436.263388] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  436.263603] r4l_e1000_demo: pending_irqs: 131
[  436.263717] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=41 ttl=255 time=1.305 ms
[  437.264949] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta3
[  437.265645] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  437.266261] r4l_e1000_demo: pending_irqs: 131
[  437.266520] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=42 ttl=255 time=2.365 ms
[  438.267960] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta4
[  438.268629] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  438.268855] r4l_e1000_demo: pending_irqs: 131
[  438.269018] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=43 ttl=255 time=2.112 ms
[  439.270740] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta5
[  439.271677] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  439.271965] r4l_e1000_demo: pending_irqs: 131
[  439.272273] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=44 ttl=255 time=2.371 ms
[  440.273756] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta6
[  440.274439] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  440.274615] r4l_e1000_demo: pending_irqs: 131
[  440.274873] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=45 ttl=255 time=1.795 ms
[  441.276590] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta7
[  441.277066] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  441.277282] r4l_e1000_demo: pending_irqs: 131
[  441.277688] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=46 ttl=255 time=1.924 ms
[  442.279550] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta0
[  442.279945] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  442.280169] r4l_e1000_demo: pending_irqs: 131
[  442.280347] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=47 ttl=255 time=1.691 ms
[  443.282066] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta1
[  443.282815] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  443.283239] r4l_e1000_demo: pending_irqs: 131
[  443.283397] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
64 bytes from 10.0.2.2: seq=48 ttl=255 time=1.938 ms
^C
--- 10.0.2.2 ping statistics ---
49 packets transmitted, 49 packets received, 0% packet loss
round-trip min/avg/max = 1.219/2.019/11.662 ms
~ # [  445.497602] r4l_e1000_demo: Rust for linux e1000 driver demo (net device2
[  445.498064] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  445.498463] r4l_e1000_demo: pending_irqs: 131
[  445.498808] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)
[  468.025756] r4l_e1000_demo: Rust for linux e1000 driver demo (net device sta3
[  468.026680] r4l_e1000_demo: Rust for linux e1000 driver demo (handle_irq)
[  468.026847] r4l_e1000_demo: pending_irqs: 3
[  468.027054] r4l_e1000_demo: Rust for linux e1000 driver demo (napi poll)

```


# 遇到的问题
1. vscode如何使用key连接服务器
	1. 配置 SSH 密钥
	```bash
	ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
	```
	2. 将公钥添加到远程服务器
		- 使用上节的方法
		- 复制文字粘贴
			1. 显示公钥内容
			```bash
			type C:\Users\zigzagpig\.ssh\id_rsa.pub
			```
			2. 服务器修改~/.ssh/authorized_keys
			```bash
			nano ~/.ssh/authorized_keys
			```
			3. 修改权限600,读写
			```bash
			chmod 600 ~/.ssh/authorized_keys
			```
			如何查看文件权限
			```bash
			ls -l
			```
	3. 配置 SSH 配置文件
	```~/.ssh/config
	Host my-remote-server
    	HostName remote_host
    	User root
    	IdentityFile ~/.ssh/id_rsa
	```