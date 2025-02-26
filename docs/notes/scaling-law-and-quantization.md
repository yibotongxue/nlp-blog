---
head:
  - - link
    - rel: stylesheet
      href: https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css
---

# Scaling Law 和量化

Scaling Law 表示模型参数、数据大小和计算量之于准确率损失的作用，而计算量常用浮点数运算次数表示，因而浮点数的量化问题也在本篇笔记的讨论。

## 单位和大小的概念

对于上面提到的若干概念，我们需要有定量的描述，而不是简单的大小以示区别。

对于模型参数，常用个数来表示，最近很火的[DeepSeek](https://www.deepseek.com/)，很多单位鼓吹自己部署了所谓的满血版的DeepSeek，一般指的就是深度求索公司开源出来的671B的模型，这个671B即为模型参数个数的表示，其中的B为十亿，671B即为6710亿个参数。

对于数据，常用的表示方法有两种，一种是 token 的个数，另一种是数据的字节数，这二者的对应关系是不确定的， C4 数据集 150B 个 tokens 对应 800G 数据，其中的 150B 的 B 表示十亿，而 800G 中的 G 表示 $2^30$ 个字节，换算一下的话，一个 token 大约是 5.33 个字节，但不同的数据可能是不同的，这个计算仅仅是指导性的。在 Scaling Law 的定量描述中，常用的单位是 token 的个数。

:::tip
需要注意的是，一个 token 不一定是一个字符，而往往会在分词的时候为多个字符（事实上分词的时候多是以字节为单位合并的，准确的应该是多个字节）
:::

关于计算量大小的表示，则较为复杂，通常的说是即为浮点数计算次数。关于浮点数，来看[维基百科](https://www.wikipedia.org/)给出的[定义](https://en.wikipedia.org/wiki/Floating-point_arithmetic)：

> In computing, floating-point arithmetic (FP) is arithmetic on subsets of real numbers formed by a significand (a signed sequence of a fixed number of digits in some base) multiplied by an integer power of that base. Numbers of this form are called floating-point numbers.[1]: 3 [2]: 10 

而模型训练、推理中最常用就是浮点数，因而计算量往往用浮点数计算次数表示。具体介绍其单位，FLOP表示一次浮点数的乘加运算，在硬件实现中，乘法和加法通常被同时执行，因而表示一次操作。PFDays，为Petaflop Days的缩写，Petaflop即1 Peta的FLOP，其中Peta表示一匹特，即一千万亿次，而FLOP即为上面介绍的那样，Petaflop表示每秒执行10^15次浮点数运算的计算能力单位，Days为时间单位，表示计算时间，从而PFDays表示一个系统在特定时间内执行的计算量。

## Scaling Law

有了上面的对于模型参数、数据量和计算量的大小的了解，我们可以开始了解 Scaling Law 的内容。

### 模型参数、数据量和计算量的关系

一般的，计算量近似为模型参数和数据量乘积的六倍（当然这是在考虑尽可能利用计算量的前提下的），如果用 $C$ 表示计算量，而以 $N$ 表示模型参数个数，以 $D$ 表示数据量，即有如下经典的公式

$$
C = 6ND
$$

这里的单位即为上面提到的通常的单位。

这个公式告诉我们的是，当计算量确定的时候，确定数据量即可确定模型参数个数的上限，确定模型参数个数即可确定可以训练的数据量的大小。

### Scaling Law 介绍

Scaling Law 表示的是损失与模型参数、数据量和计算量的关系，而通常计算预算是确定的，我们需要探究的是模型大小和数据量对于损失的影响。通常的认为，模型越大、数据量越大，损失越小，但受限于计算预算，这两者不可能任意大，我们需要有一个定量的描述，描述一定的模型大小和数据量大小之上的损失大小，从而在计算量确定的时候能寻找一个最佳的搭配使得训练效果最好（即损失最低），这个定量关系就是所谓的 Scaling Law 。

#### Kaplan Scaling Law

Kaplan 等人在2020年的论文提出了模型的性能与参数、数据和计算量之间存在一种幂律关系：

$$
L(N) = (\frac{N_c}{N})^{\alpha_N}, L(D) = (\frac{D_c}{D})^{\alpha_D}, L(C) = (\frac{C_C}{C})^{\alpha_C}
$$

其中

$$
\alpha_N \approx 0.076, \alpha_D \approx 0.095, \alpha_C \approx 0.050
$$

比较发现， $\alpha_N$ 比 $\alpha_D$ 大，因而模型参数对模型性能的影响更大，在计算量允许的前提下应该有限提升模型参数。因应这一发现，OpenAI在训练GPT-3的时候极大地提高了模型参数，而数据量相对不够。

#### Chinchilla Scaling Law

当前影响最大的Scaling Law应该是Chinchilla Scaling Law，它是由DeepMind在2022年提出的，其之于Kaplan Scaling Law的最大区别是指出了应该同比例提高模型参数和数据量，而不是一味地优先提高模型参数。其核心公式为

$$
L(N, D) = E + \frac{A}{N^\alpha} + \frac{B}{D^{\beta}}
$$

其中 $E$ , $A$ , $B$ 是常数， $\alpha = 0.34$ , $\beta = 0.28$ 。这里很容易注意到 $\alpha$ 和 $\beta$ 的差距并不是很大，因而应该按照相同比例扩展数据和参数，而不是仅扩展参数量。

Chinchilla Scaling Law 也给出了一个经验性的方法，一般的比较合适的 token 和参数比应该为 $20:1$ ，按这一标准，GPT-3的数据量是明显不足的。

### 使用 Scaling Law

Scaling Law 可以指导我们训练模型的时候选择合适的模型参数大小和数据量。从应用上，这是比较简单的，如果我们掌握了模型性能与模型参数和数据的关系，结合我们的算力预算以及公式

$$
C = 6ND
$$

等很容易给出合适的模型大小或数据量大小，比较重要的问题是在于寻找Scaling Law，这会因设备、数据等不同而不同，因而不能直接套用别人的实验发现。Scaling Law核心的并不是给出了具体的数字，而是指出了模型性能与模型参数和数据量存在幂律关系，因而我们可以通过较小的算力进行实验，然后拟合出关系曲线，从而给出大的算力下合适的模型参数和数据大小。一般有三种方法：

1. 固定模型大小，改变训练数据
2. 固定计算量，改变模型大小
3. 拟合幂律曲线
