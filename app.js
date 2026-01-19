// 核心状态
const state = {
  algorithms: [],
  filters: {
    levels: new Set(),
    categories: new Set(),
    tags: new Set(),
    search: '',
    view: 'all', // all | selected | unselected
    groupByCategory: false
  },
  selections: new Set(JSON.parse(localStorage.getItem('algomap:selected') || '[]')),
  viewMode: 'levels'
};

const LEVEL_CLASS = {
  '入门': 'level-beginner',
  '普及': 'level-regular',
  '提高': 'level-advanced',
  '省选': 'level-province',
  'NOI': 'level-noi',
  '省选/NOI': 'level-province',
  '普及/提高': 'level-regular',
  '提高/省选': 'level-province',
  '入门/普及': 'level-beginner',
  '普及/省选/NOI': 'level-regular',
  '提高/省选/NOI': 'level-advanced',
  '提高/普及': 'level-regular',
  '未标注': 'level-neutral'
};

const LEVEL_FILTERS = ['入门', '普及', '提高', '省选', 'NOI'];

const FALLBACK_ALGORITHMS = [
  {
    "id": "enumerate",
    "name": "枚举 (Enumerate)",
    "category": "基础算法",
    "group": "枚举",
    "level": "入门"
  },
  {
    "id": "simulation",
    "name": "模拟 (Simulation)",
    "category": "基础算法",
    "group": "模拟",
    "level": "入门"
  },
  {
    "id": "recursion",
    "name": "递归 (Recursion)",
    "category": "基础算法",
    "group": "递归与分治",
    "level": "入门/普及"
  },
  {
    "id": "divide-conquer",
    "name": "分治 (Divide & Conquer)",
    "category": "基础算法",
    "group": "递归与分治",
    "level": "普及"
  },
  {
    "id": "greedy",
    "name": "贪心 (Greedy)",
    "category": "基础算法",
    "group": "贪心",
    "level": "普及"
  },
  {
    "id": "sorting-basic",
    "name": "选择/冒泡/插入排序",
    "category": "基础算法",
    "group": "排序",
    "level": "入门"
  },
  {
    "id": "sorting-advanced",
    "name": "快速/归并/堆排序",
    "category": "基础算法",
    "group": "排序",
    "level": "普及"
  },
  {
    "id": "sorting-counting",
    "name": "计数/桶/基数排序",
    "category": "基础算法",
    "group": "排序",
    "level": "普及"
  },
  {
    "id": "binary-search",
    "name": "二分法 (Binary Search)",
    "category": "基础算法",
    "group": "二分",
    "level": "普及"
  },
  {
    "id": "ternary-search",
    "name": "三分法 (Ternary Search)",
    "category": "基础算法",
    "group": "三分",
    "level": "提高"
  },
  {
    "id": "binary-lifting",
    "name": "倍增 (Binary Lifting)",
    "category": "基础算法",
    "group": "倍增",
    "level": "普及/提高"
  },
  {
    "id": "prefix-sum-diff",
    "name": "前缀和 & 差分",
    "category": "基础算法",
    "group": "前缀和与差分",
    "level": "普及"
  },
  {
    "id": "discretization",
    "name": "离散化",
    "category": "基础算法",
    "group": "构造",
    "level": "普及/提高"
  },
  {
    "id": "constructive",
    "name": "构造算法",
    "category": "基础算法",
    "group": "构造",
    "level": "提高"
  },
  {
    "id": "dfs",
    "name": "DFS (深度优先搜索)",
    "category": "搜索",
    "group": "基础搜索",
    "level": "普及"
  },
  {
    "id": "bfs",
    "name": "BFS (广度优先搜索)",
    "category": "搜索",
    "group": "基础搜索",
    "level": "普及"
  },
  {
    "id": "bidirectional-search",
    "name": "双向搜索 (Bidirectional)",
    "category": "搜索",
    "group": "搜索优化",
    "level": "提高"
  },
  {
    "id": "heuristic-search",
    "name": "启发式搜索 (A* / IDA*)",
    "category": "搜索",
    "group": "启发式",
    "level": "提高/省选"
  },
  {
    "id": "memoization",
    "name": "记忆化搜索",
    "category": "搜索",
    "group": "搜索技巧",
    "level": "普及/提高"
  },
  {
    "id": "iddfs",
    "name": "迭代加深搜索",
    "category": "搜索",
    "group": "搜索技巧",
    "level": "提高"
  },
  {
    "id": "pruning",
    "name": "剪枝 (Pruning)",
    "category": "搜索",
    "group": "搜索技巧",
    "level": "提高"
  },
  {
    "id": "simulated-annealing",
    "name": "模拟退火 (SA)",
    "category": "搜索",
    "group": "随机化",
    "level": "省选"
  },
  {
    "id": "hill-climb",
    "name": "爬山算法",
    "category": "搜索",
    "group": "随机化",
    "level": "提高/省选"
  },
  {
    "id": "genetic-pso",
    "name": "遗传算法 / 粒子群",
    "category": "搜索",
    "group": "随机化",
    "level": "省选/NOI"
  },
  {
    "id": "dlx",
    "name": "DLX (Dancing Links)",
    "category": "搜索",
    "group": "精确覆盖",
    "level": "省选/NOI"
  },
  {
    "id": "knapsack-basic",
    "name": "01背包 / 完全 / 多重背包",
    "category": "DP",
    "group": "背包DP",
    "level": "普及"
  },
  {
    "id": "knapsack-advanced",
    "name": "混合背包 / 二维费用背包",
    "category": "DP",
    "group": "背包DP",
    "level": "普及/提高"
  },
  {
    "id": "interval-dp",
    "name": "区间 DP",
    "category": "DP",
    "group": "区间DP",
    "level": "提高"
  },
  {
    "id": "dag-dp",
    "name": "DAG 上的 DP",
    "category": "DP",
    "group": "基础DP",
    "level": "普及/提高"
  },
  {
    "id": "tree-dp",
    "name": "树形 DP",
    "category": "DP",
    "group": "树形DP",
    "level": "提高"
  },
  {
    "id": "reroot-dp",
    "name": "换根 DP",
    "category": "DP",
    "group": "树形DP",
    "level": "提高"
  },
  {
    "id": "bitmask-dp",
    "name": "状压 DP",
    "category": "DP",
    "group": "状态压缩",
    "level": "提高/省选"
  },
  {
    "id": "digit-dp",
    "name": "数位 DP",
    "category": "DP",
    "group": "数位DP",
    "level": "提高/省选"
  },
  {
    "id": "plug-dp",
    "name": "插头 DP (轮廓线DP)",
    "category": "DP",
    "group": "插头DP",
    "level": "省选/NOI"
  },
  {
    "id": "probability-dp",
    "name": "概率与期望 DP",
    "category": "DP",
    "group": "概率DP",
    "level": "提高/省选"
  },
  {
    "id": "dynamic-dp",
    "name": "动态 DP",
    "category": "DP",
    "group": "动态DP",
    "level": "省选/NOI"
  },
  {
    "id": "mono-queue-dp",
    "name": "单调队列优化 DP",
    "category": "DP",
    "group": "DP优化",
    "level": "提高/省选"
  },
  {
    "id": "slope-trick",
    "name": "斜率优化 DP",
    "category": "DP",
    "group": "DP优化",
    "level": "省选"
  },
  {
    "id": "quadrangle-ineq",
    "name": "四边形不等式优化",
    "category": "DP",
    "group": "DP优化",
    "level": "省选"
  },
  {
    "id": "decision-monotonicity",
    "name": "决策单调性优化",
    "category": "DP",
    "group": "DP优化",
    "level": "省选/NOI"
  },
  {
    "id": "string-hash",
    "name": "字符串哈希 (Hash)",
    "category": "字符串",
    "group": "基础",
    "level": "普及/提高"
  },
  {
    "id": "kmp",
    "name": "KMP 算法",
    "category": "字符串",
    "group": "匹配",
    "level": "提高"
  },
  {
    "id": "trie",
    "name": "Trie 树 (字典树)",
    "category": "字符串",
    "group": "字典树",
    "level": "提高"
  },
  {
    "id": "ac-automaton",
    "name": "AC 自动机",
    "category": "字符串",
    "group": "多模式匹配",
    "level": "提高/省选"
  },
  {
    "id": "suffix-array",
    "name": "后缀数组 (SA)",
    "category": "字符串",
    "group": "后缀结构",
    "level": "省选"
  },
  {
    "id": "sam",
    "name": "后缀自动机 (SAM)",
    "category": "字符串",
    "group": "后缀结构",
    "level": "省选/NOI"
  },
  {
    "id": "suffix-balanced-tree",
    "name": "后缀平衡树",
    "category": "字符串",
    "group": "后缀结构",
    "level": "NOI"
  },
  {
    "id": "gsam",
    "name": "广义后缀自动机",
    "category": "字符串",
    "group": "后缀结构",
    "level": "省选/NOI"
  },
  {
    "id": "manacher",
    "name": "Manacher (马拉车)",
    "category": "字符串",
    "group": "回文",
    "level": "提高"
  },
  {
    "id": "pam",
    "name": "回文自动机 (PAM)",
    "category": "字符串",
    "group": "回文",
    "level": "省选/NOI"
  },
  {
    "id": "sequence-automaton",
    "name": "序列自动机",
    "category": "字符串",
    "group": "自动机",
    "level": "省选"
  },
  {
    "id": "minimal-representation",
    "name": "最小表示法",
    "category": "字符串",
    "group": "技巧",
    "level": "提高"
  },
  {
    "id": "lyndon",
    "name": "Lyndon 分解",
    "category": "字符串",
    "group": "技巧",
    "level": "省选/NOI"
  },
  {
    "id": "bit-ops",
    "name": "进制转换 / 位运算",
    "category": "数学",
    "group": "基础",
    "level": "入门/普及"
  },
  {
    "id": "prime-sieve",
    "name": "质数筛法 (埃氏/欧拉筛)",
    "category": "数学",
    "group": "数论",
    "level": "普及"
  },
  {
    "id": "bezout-exgcd",
    "name": "裴蜀定理 & 扩展欧几里得",
    "category": "数学",
    "group": "数论",
    "level": "提高"
  },
  {
    "id": "mod-inverse",
    "name": "乘法逆元",
    "category": "数学",
    "group": "数论",
    "level": "提高"
  },
  {
    "id": "euler-fermat",
    "name": "欧拉定理 & 费马小定理",
    "category": "数学",
    "group": "数论",
    "level": "提高"
  },
  {
    "id": "crt",
    "name": "中国剩余定理 (CRT/exCRT)",
    "category": "数学",
    "group": "数论",
    "level": "提高/省选"
  },
  {
    "id": "lucas",
    "name": "卢卡斯定理 (Lucas/exLucas)",
    "category": "数学",
    "group": "数论",
    "level": "省选"
  },
  {
    "id": "mobius",
    "name": "莫比乌斯反演",
    "category": "数学",
    "group": "数论",
    "level": "省选"
  },
  {
    "id": "dujia-min25",
    "name": "杜教筛 / Min_25 筛",
    "category": "数学",
    "group": "数论",
    "level": "省选/NOI"
  },
  {
    "id": "primitive-root-bsgs",
    "name": "原根 / 离散对数 (BSGS)",
    "category": "数学",
    "group": "数论",
    "level": "省选"
  },
  {
    "id": "matrix-fastpow",
    "name": "矩阵运算 & 矩阵快速幂",
    "category": "数学",
    "group": "线性代数",
    "level": "提高"
  },
  {
    "id": "gauss",
    "name": "高斯消元",
    "category": "数学",
    "group": "线性代数",
    "level": "提高/省选"
  },
  {
    "id": "linear-basis",
    "name": "线性基",
    "category": "数学",
    "group": "线性代数",
    "level": "提高/省选"
  },
  {
    "id": "comb-catalan",
    "name": "排列组合 / 卡特兰数",
    "category": "数学",
    "group": "组合数学",
    "level": "提高"
  },
  {
    "id": "stirling-bell",
    "name": "斯特林数 / 贝尔数",
    "category": "数学",
    "group": "组合数学",
    "level": "省选"
  },
  {
    "id": "inclusion-exclusion",
    "name": "容斥原理",
    "category": "数学",
    "group": "组合数学",
    "level": "提高/省选"
  },
  {
    "id": "burnside-polya",
    "name": "Burnside / Polya 定理",
    "category": "数学",
    "group": "群论",
    "level": "省选/NOI"
  },
  {
    "id": "fft-ntt",
    "name": "FFT / NTT (快速傅里叶/数论变换)",
    "category": "数学",
    "group": "多项式",
    "level": "省选"
  },
  {
    "id": "fwt",
    "name": "FWT (快速沃尔什变换)",
    "category": "数学",
    "group": "多项式",
    "level": "省选"
  },
  {
    "id": "poly-operations",
    "name": "多项式全家桶 (求逆/除法等)",
    "category": "数学",
    "group": "多项式",
    "level": "省选/NOI"
  },
  {
    "id": "generating-function",
    "name": "生成函数",
    "category": "数学",
    "group": "组合数学",
    "level": "省选/NOI"
  },
  {
    "id": "simplex",
    "name": "线性规划 (单纯形法)",
    "category": "数学",
    "group": "运筹学",
    "level": "省选/NOI"
  },
  {
    "id": "nim-sg",
    "name": "博弈论 (Nim游戏/SG函数)",
    "category": "数学",
    "group": "博弈论",
    "level": "提高/省选"
  },
  {
    "id": "lagrange",
    "name": "拉格朗日插值",
    "category": "数学",
    "group": "数值算法",
    "level": "省选"
  },
  {
    "id": "basic-ds",
    "name": "栈 / 队列 / 链表",
    "category": "数据结构",
    "group": "线性结构",
    "level": "入门/普及"
  },
  {
    "id": "mono-stack-queue",
    "name": "单调栈 / 单调队列",
    "category": "数据结构",
    "group": "线性结构",
    "level": "普及/提高"
  },
  {
    "id": "sparse-table",
    "name": "ST 表 (稀疏表)",
    "category": "数据结构",
    "group": "线性结构",
    "level": "普及/提高"
  },
  {
    "id": "heap",
    "name": "堆 (Priority Queue)",
    "category": "数据结构",
    "group": "堆",
    "level": "普及"
  },
  {
    "id": "leftist-pairing-heap",
    "name": "左偏树 / 配对堆",
    "category": "数据结构",
    "group": "堆",
    "level": "省选"
  },
  {
    "id": "dsu",
    "name": "并查集 (基础/带权)",
    "category": "数据结构",
    "group": "集合",
    "level": "普及/提高"
  },
  {
    "id": "dsu-extended",
    "name": "扩展域并查集",
    "category": "数据结构",
    "group": "集合",
    "level": "提高"
  },
  {
    "id": "bit",
    "name": "树状数组 (BIT)",
    "category": "数据结构",
    "group": "树状数组",
    "level": "提高"
  },
  {
    "id": "segment-tree-basic",
    "name": "线段树 (基础)",
    "category": "数据结构",
    "group": "线段树",
    "level": "提高"
  },
  {
    "id": "weight-segment-tree",
    "name": "权值线段树",
    "category": "数据结构",
    "group": "线段树",
    "level": "提高"
  },
  {
    "id": "scanline",
    "name": "扫描线",
    "category": "数据结构",
    "group": "线段树应用",
    "level": "提高/省选"
  },
  {
    "id": "dynamic-seg-tree",
    "name": "动态开点线段树",
    "category": "数据结构",
    "group": "线段树",
    "level": "省选"
  },
  {
    "id": "seg-merge-split",
    "name": "线段树合并 / 分裂",
    "category": "数据结构",
    "group": "线段树",
    "level": "省选"
  },
  {
    "id": "bst-treap-splay",
    "name": "平衡树 (Treap / Splay)",
    "category": "数据结构",
    "group": "BST",
    "level": "提高/省选"
  },
  {
    "id": "bst-sbt-wblt",
    "name": "平衡树 (SBT / WBLT)",
    "category": "数据结构",
    "group": "BST",
    "level": "省选"
  },
  {
    "id": "block-array",
    "name": "块状数组 / 分块",
    "category": "数据结构",
    "group": "分块",
    "level": "提高/省选"
  },
  {
    "id": "mo-algorithm",
    "name": "莫队算法 (普通/带修/回滚)",
    "category": "数据结构",
    "group": "莫队",
    "level": "省选"
  },
  {
    "id": "persistent-seg-tree",
    "name": "可持久化线段树 (主席树)",
    "category": "数据结构",
    "group": "可持久化",
    "level": "省选"
  },
  {
    "id": "persistent-structures",
    "name": "可持久化平衡树 / Trie / 并查集",
    "category": "数据结构",
    "group": "可持久化",
    "level": "省选/NOI"
  },
  {
    "id": "tree-of-trees",
    "name": "树套树 (线段树套平衡树等)",
    "category": "数据结构",
    "group": "嵌套结构",
    "level": "省选"
  },
  {
    "id": "lct",
    "name": "动态树 (LCT)",
    "category": "数据结构",
    "group": "动态树",
    "level": "省选/NOI"
  },
  {
    "id": "kd-tree",
    "name": "K-D Tree",
    "category": "数据结构",
    "group": "多维",
    "level": "省选"
  },
  {
    "id": "odt",
    "name": "ODT (珂朵莉树/颜色段均摊)",
    "category": "数据结构",
    "group": "技巧",
    "level": "提高/省选"
  },
  {
    "id": "graph-representation",
    "name": "图的存储 / 遍历",
    "category": "图论",
    "group": "基础",
    "level": "入门/普及"
  },
  {
    "id": "topo-sort",
    "name": "拓扑排序",
    "category": "图论",
    "group": "基础",
    "level": "普及"
  },
  {
    "id": "shortest-path",
    "name": "最短路 (Dijkstra/SPFA)",
    "category": "图论",
    "group": "最短路",
    "level": "普及/提高"
  },
  {
    "id": "floyd",
    "name": "Floyd 算法",
    "category": "图论",
    "group": "最短路",
    "level": "普及"
  },
  {
    "id": "difference-constraints",
    "name": "差分约束系统",
    "category": "图论",
    "group": "最短路应用",
    "level": "提高"
  },
  {
    "id": "k-shortest",
    "name": "k 短路",
    "category": "图论",
    "group": "最短路应用",
    "level": "省选"
  },
  {
    "id": "mst",
    "name": "最小生成树 (Kruskal/Prim)",
    "category": "图论",
    "group": "生成树",
    "level": "普及/提高"
  },
  {
    "id": "mst-count-bottleneck",
    "name": "最小生成树计数 / 瓶颈生成树",
    "category": "图论",
    "group": "生成树",
    "level": "省选"
  },
  {
    "id": "tree-diameter-centroid",
    "name": "树的直径 / 重心",
    "category": "图论",
    "group": "树上问题",
    "level": "普及/提高"
  },
  {
    "id": "lca",
    "name": "LCA (最近公共祖先)",
    "category": "图论",
    "group": "树上问题",
    "level": "提高"
  },
  {
    "id": "hld",
    "name": "树链剖分 (重链/长链)",
    "category": "图论",
    "group": "树上问题",
    "level": "提高/省选"
  },
  {
    "id": "tree-difference",
    "name": "树上差分",
    "category": "图论",
    "group": "树上问题",
    "level": "提高"
  },
  {
    "id": "virtual-tree",
    "name": "虚树",
    "category": "图论",
    "group": "树上问题",
    "level": "省选"
  },
  {
    "id": "tree-divide",
    "name": "树分治 (点分治/边分治)",
    "category": "图论",
    "group": "树上问题",
    "level": "省选"
  },
  {
    "id": "scc",
    "name": "强连通分量 (SCC)",
    "category": "图论",
    "group": "连通性",
    "level": "提高"
  },
  {
    "id": "bcc",
    "name": "双连通分量 (BCC) / 割点 / 桥",
    "category": "图论",
    "group": "连通性",
    "level": "提高"
  },
  {
    "id": "block-tree",
    "name": "圆方树",
    "category": "图论",
    "group": "连通性",
    "level": "省选/NOI"
  },
  {
    "id": "two-sat",
    "name": "2-SAT 问题",
    "category": "图论",
    "group": "连通性",
    "level": "提高/省选"
  },
  {
    "id": "euler-circuit",
    "name": "欧拉回路 / 欧拉路",
    "category": "图论",
    "group": "欧拉图",
    "level": "提高"
  },
  {
    "id": "bipartite-matching",
    "name": "二分图匹配 (匈牙利)",
    "category": "图论",
    "group": "二分图",
    "level": "提高"
  },
  {
    "id": "km",
    "name": "二分图最大权匹配 (KM)",
    "category": "图论",
    "group": "二分图",
    "level": "省选"
  },
  {
    "id": "maxflow",
    "name": "网络流 (最大流 Dinic/ISAP)",
    "category": "图论",
    "group": "网络流",
    "level": "省选"
  },
  {
    "id": "mcmf",
    "name": "最小费用最大流 (MCMF)",
    "category": "图论",
    "group": "网络流",
    "level": "省选"
  },
  {
    "id": "bounded-flow",
    "name": "上下界网络流",
    "category": "图论",
    "group": "网络流",
    "level": "省选/NOI"
  },
  {
    "id": "min-cut-closure",
    "name": "最小割 / 闭合子图",
    "category": "图论",
    "group": "网络流应用",
    "level": "省选"
  },
  {
    "id": "arborescence",
    "name": "最小树形图 (朱刘算法)",
    "category": "图论",
    "group": "其他",
    "level": "省选"
  },
  {
    "id": "planar-graph",
    "name": "平面图 / 对偶图",
    "category": "图论",
    "group": "其他",
    "level": "省选"
  },
  {
    "id": "matrix-tree",
    "name": "Matrix-Tree 定理",
    "category": "图论",
    "group": "矩阵树",
    "level": "省选/NOI"
  },
  {
    "id": "prufer",
    "name": "Prufer 序列",
    "category": "图论",
    "group": "树上问题",
    "level": "省选"
  },
  {
    "id": "geometry-vector",
    "name": "向量 / 点积 / 叉积",
    "category": "计算几何",
    "group": "基础",
    "level": "提高"
  },
  {
    "id": "convex-hull",
    "name": "凸包 (Graham / Andrew)",
    "category": "计算几何",
    "group": "多边形",
    "level": "提高/省选"
  },
  {
    "id": "rotating-calipers",
    "name": "旋转卡壳",
    "category": "计算几何",
    "group": "多边形",
    "level": "省选"
  },
  {
    "id": "half-plane-intersection",
    "name": "半平面交",
    "category": "计算几何",
    "group": "多边形",
    "level": "省选"
  },
  {
    "id": "min-circle",
    "name": "最小圆覆盖",
    "category": "计算几何",
    "group": "基础",
    "level": "省选"
  },
  {
    "id": "geometry-3d",
    "name": "三维计算几何 (三维凸包)",
    "category": "计算几何",
    "group": "三维",
    "level": "省选/NOI"
  },
  {
    "id": "offline-cdq",
    "name": "离线算法 (CDQ分治)",
    "category": "杂项",
    "group": "离线",
    "level": "省选"
  },
  {
    "id": "overall-binary",
    "name": "整体二分",
    "category": "杂项",
    "group": "离线",
    "level": "省选"
  },
  {
    "id": "mo-advanced",
    "name": "莫队算法 (树上/二次离线)",
    "category": "杂项",
    "group": "离线",
    "level": "省选/NOI"
  },
  {
    "id": "randomization",
    "name": "随机化技巧",
    "category": "杂项",
    "group": "技巧",
    "level": "提高"
  },
  {
    "id": "performance-tuning",
    "name": "卡常技巧",
    "category": "杂项",
    "group": "技巧",
    "level": "省选"
  }
];

document.getElementById('fallback-data').textContent = JSON.stringify(FALLBACK_ALGORITHMS, null, 2);

const el = {
  list: document.getElementById('algorithmList'),
  mindmap: document.getElementById('mindMapView'),
  levelFilters: document.getElementById('levelFilters'),
  categoryFilters: document.getElementById('categoryFilters'),
  search: document.getElementById('searchInput'),
  statTotal: document.getElementById('stat-total'),
  statVisible: document.getElementById('stat-visible'),
  statSelected: document.getElementById('stat-selected'),
  modeButtons: Array.from(document.querySelectorAll('.mode-btn')),
  selectAllVisible: document.getElementById('selectAllVisible'),
  invertVisible: document.getElementById('invertVisible'),
  resetSelections: document.getElementById('resetSelections'),
  resetFilters: document.getElementById('resetFilters'),
  showSelectedBtn: document.getElementById('showSelected'),
  showUnselectedBtn: document.getElementById('showUnselected'),
  modeExportButtons: Array.from(document.querySelectorAll('[data-mode-export]'))
};

init();

async function init() {
  state.algorithms = await loadData();
  buildFilters(state.algorithms);
  bindControls();
  render();
}

async function loadData() {
  try {
    const res = await fetch('data/algorithms.json');
    if (!res.ok) throw new Error('无法读取 JSON');
    const data = await res.json();
    return Array.isArray(data) ? data : data.algorithms || FALLBACK_ALGORITHMS;
  } catch (err) {
    console.warn('使用兜底数据：', err);
    const embedded = readEmbeddedData();
    return embedded.length ? embedded : FALLBACK_ALGORITHMS;
  }
}

function readEmbeddedData() {
  try {
    const raw = document.getElementById('fallback-data')?.textContent.trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : parsed.algorithms || [];
  } catch {
    return [];
  }
}

function buildFilters(list) {
  const levels = LEVEL_FILTERS;
  const categories = [...new Set(list.map(a => a.category))];
  const tags = new Set();
  list.forEach(a => {
    a.tags?.forEach(t => tags.add(t));
    if (a.group) tags.add(a.group);
  });

  renderPills(levels, el.levelFilters, 'levels');
  renderPills(categories, el.categoryFilters, 'categories');
  renderPills([...tags].sort(), document.getElementById('tagFilters'), 'tags');
}

function renderPills(values, container, kind) {
  if (!container) return;
  container.innerHTML = '';
  values.forEach(value => {
    const pill = document.createElement('button');
    pill.className = ['pill', pillLevelClass(value, kind), state.filters[kind].has(value) ? 'active' : ''].filter(Boolean).join(' ');
    pill.textContent = value;
    pill.dataset.value = value;
    pill.dataset.kind = kind;
    pill.addEventListener('click', () => {
      toggleFilter(kind, value);
      render();
    });
    container.appendChild(pill);
  });
}

function pillLevelClass(value, kind) {
  if (kind !== 'levels') return '';
  return LEVEL_CLASS[value] || '';
}

function toggleFilter(kind, value) {
  const set = state.filters[kind];
  if (set.has(value)) set.delete(value);
  else set.add(value);
}

function bindControls() {
  el.search.addEventListener('input', (e) => {
    state.filters.search = e.target.value.trim().toLowerCase();
    render();
  });

  el.resetSelections.addEventListener('click', () => {
    state.selections.clear();
    persistSelection();
    render();
  });

  el.selectAllVisible.addEventListener('click', () => {
    const filtered = getFiltered();
    filtered.forEach(item => state.selections.add(item.id));
    persistSelection();
    render();
  });

  el.invertVisible.addEventListener('click', () => {
    const filtered = getFiltered();
    filtered.forEach(item => {
      if (state.selections.has(item.id)) state.selections.delete(item.id);
      else state.selections.add(item.id);
    });
    persistSelection();
    render();
  });

  el.resetFilters.addEventListener('click', () => {
    state.filters.levels.clear();
    state.filters.categories.clear();
    state.filters.tags.clear();
    state.filters.search = '';
    state.filters.view = 'all';
    el.search.value = '';
    buildFilters(state.algorithms);
    render();
  });

  el.modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.viewMode = btn.dataset.mode;
      el.modeButtons.forEach(b => b.classList.toggle('active', b === btn));
      updateModeExportLabels();
      render();
    });
  });

  document.querySelectorAll('[data-export]').forEach(btn => {
    btn.addEventListener('click', () => handleExport(btn.dataset.export));
  });

  document.querySelectorAll('[data-mindmap]').forEach(btn => {
    btn.addEventListener('click', () => handleMindmapExport(btn.dataset.mindmap));
  });

  el.modeExportButtons.forEach(btn => {
    btn.addEventListener('click', () => handleModeExport(btn.dataset.modeExport));
  });

  el.showSelectedBtn.addEventListener('click', () => {
    state.filters.view = 'selected';
    render();
  });

  el.showUnselectedBtn.addEventListener('click', () => {
    state.filters.view = 'unselected';
    render();
  });
}

function render() {
  buildFilters(state.algorithms); // refresh active state
  const filtered = getFiltered();
  if (state.viewMode === 'category') {
    renderMindmap(filtered);
  } else {
    renderLevels(filtered);
  }
  updateModeExportLabels();
  renderStats(filtered);
  toggleViews();
}

function getFiltered() {
  return state.algorithms.filter(a => {
    if (state.filters.levels.size && !matchesLevel(a.level)) return false;
    if (state.filters.categories.size && !state.filters.categories.has(a.category)) return false;
    if (state.filters.tags.size) {
      const allTags = new Set([...(a.tags || []), a.group].filter(Boolean));
      const hit = [...state.filters.tags].some(t => allTags.has(t));
      if (!hit) return false;
    }
    if (state.filters.search) {
      const hay = [a.name, a.category, a.level, a.group, ...(a.tags || [])].join(' ').toLowerCase();
      if (!hay.includes(state.filters.search)) return false;
    }
    if (state.filters.view === 'selected' && !state.selections.has(a.id)) return false;
    if (state.filters.view === 'unselected' && state.selections.has(a.id)) return false;
    return true;
  });
}

function matchesLevel(level) {
  if (!state.filters.levels.size) return true;
  const tokens = level.split('/').map(s => s.trim());
  return [...state.filters.levels].some(lv => tokens.includes(lv));
}

function resolveBaseLevel(level) {
  const tokens = level.split('/').map(s => s.trim());
  for (const lv of LEVEL_FILTERS) {
    if (tokens.includes(lv)) return lv;
  }
  return tokens[0] || level;
}

function renderLevels(list) {
  el.list.innerHTML = '';
  if (!list.length) {
    el.list.innerHTML = '<div class="empty">没有符合筛选的算法</div>';
    return;
  }
  const byLevel = {};
  list.forEach(item => {
    const lvl = resolveBaseLevel(item.level);
    if (!byLevel[lvl]) byLevel[lvl] = {};
    const cat = item.category || '未分类';
    if (!byLevel[lvl][cat]) byLevel[lvl][cat] = [];
    byLevel[lvl][cat].push(item);
  });

  LEVEL_FILTERS.forEach(lvl => {
    if (!byLevel[lvl]) return;
    const block = document.createElement('div');
    block.className = 'level-block';
    block.innerHTML = `<div class="level-title">${lvl} ${renderTag(lvl, LEVEL_CLASS[lvl] || '')}</div>`;

    Object.entries(byLevel[lvl]).forEach(([cat, items]) => {
      const row = document.createElement('div');
      row.className = 'level-cat-row';
      row.innerHTML = `<div class="level-cat-name">${cat}</div>`;
      const itemsWrap = document.createElement('div');
      itemsWrap.className = 'level-items';
      items.forEach(it => {
        const chip = document.createElement('div');
        chip.className = 'level-item' + (state.selections.has(it.id) ? ' selected' : '');
        chip.dataset.id = it.id;
        chip.innerHTML = `<span class="algo-name">${it.name}</span>${renderTag(it.level, LEVEL_CLASS[it.level] || '')}`;
        chip.addEventListener('click', () => {
          toggleSelection(it.id);
          render();
        });
        itemsWrap.appendChild(chip);
      });
      row.appendChild(itemsWrap);
      block.appendChild(row);
    });

    el.list.appendChild(block);
  });
}

function renderTag(label, extraClass = '') {
  const highlight = shouldHighlight(label);
  return `<span class="tag ${extraClass} ${highlight ? 'highlight' : ''}">${label}</span>`;
}

function shouldHighlight(label) {
  if (state.filters.levels.size) {
    const tokens = label.split('/').map(s => s.trim());
    if (tokens.some(t => state.filters.levels.has(t))) return true;
  }
  if (state.filters.categories.has(label)) return true;
  if (state.filters.tags.has(label)) return true;
  return false;
}

function toggleSelection(id) {
  if (state.selections.has(id)) state.selections.delete(id);
  else state.selections.add(id);
  persistSelection();
}

function persistSelection() {
  localStorage.setItem('algomap:selected', JSON.stringify([...state.selections]));
}

function renderStats(filtered) {
  el.statTotal.textContent = state.algorithms.length;
  el.statVisible.textContent = filtered.length;
  el.statSelected.textContent = state.selections.size;
}

function renderMindmap(list) {
  if (!el.mindmap) return;
  el.mindmap.innerHTML = '';
  if (!list.length) {
    el.mindmap.innerHTML = '<div class="empty">没有符合筛选的算法</div>';
    return;
  }
  const grid = document.createElement('div');
  grid.className = 'mindmap-grid';

  const byCat = {};
  list.forEach(item => {
    if (!byCat[item.category]) byCat[item.category] = {};
    const groupName = item.group || '未分组';
    if (!byCat[item.category][groupName]) byCat[item.category][groupName] = [];
    byCat[item.category][groupName].push(item);
  });

  Object.entries(byCat).forEach(([cat, groups]) => {
    const catBox = document.createElement('div');
    catBox.className = 'mindmap-category';
    const catTitle = document.createElement('div');
    catTitle.className = 'cat-title';
    catTitle.textContent = cat;
    catBox.appendChild(catTitle);

    Object.entries(groups).forEach(([grp, items]) => {
      const grpBox = document.createElement('div');
      grpBox.className = 'mindmap-group';
      const gTitle = document.createElement('div');
      gTitle.className = 'group-title';
      gTitle.textContent = grp;
      grpBox.appendChild(gTitle);

      items.forEach(item => {
        const node = document.createElement('div');
        node.className = 'mindmap-node' + (state.selections.has(item.id) ? ' selected' : '');
        node.dataset.id = item.id;
        node.innerHTML = `
          <span class="name">${item.name}</span>
          ${renderTag(item.level, LEVEL_CLASS[item.level] || '')}
        `;
        node.addEventListener('click', () => {
          toggleSelection(item.id);
          render();
        });
        grpBox.appendChild(node);
      });

      catBox.appendChild(grpBox);
    });

    grid.appendChild(catBox);
  });

  el.mindmap.appendChild(grid);
}

function toggleViews() {
  if (!el.mindmap || !el.list) return;
  const isMindmap = state.viewMode === 'category';
  el.mindmap.classList.toggle('hidden', !isMindmap);
  el.list.classList.toggle('hidden', isMindmap);
  el.list.classList.toggle('level-mode', !isMindmap);
  document.getElementById('groupByCategory').disabled = true;
}

function toBadge(item) {
  const levelClass = LEVEL_CLASS[item.level] || '';
  const highlight = shouldHighlight(item.level) || shouldHighlight(item.category) || (item.group && shouldHighlight(item.group));
  return `<span class="export-badge ${levelClass} ${highlight ? 'highlight' : ''}">${item.name}</span>`;
}

async function handleExport(kind) {
  const target = document.getElementById('exportBoard');
  if (!window.html2canvas) {
    alert('html2canvas 加载失败，无法导出。');
    return;
  }
  const canvas = await window.html2canvas(target, { backgroundColor: '#0b1526', scale: 2 });
  const mime = kind === 'jpeg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL(mime, 0.95);

  if (kind === 'pdf') {
    if (!window.jspdf?.jsPDF) {
      alert('jsPDF 未加载，无法导出 PDF。');
      return;
    }
    const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfHeight = imgProps.height * pageWidth / imgProps.width;
    const y = Math.max(10, (pageHeight - pdfHeight) / 2);
    pdf.addImage(dataUrl, 'PNG', 5, y, pageWidth - 10, pdfHeight);
    pdf.save('algomap.pdf');
    return;
  }

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `algomap.${kind === 'jpeg' ? 'jpg' : 'png'}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function handleMindmapExport() {
  if (!window.html2canvas) {
    alert('html2canvas 未加载，无法导出。');
    return;
  }
  const target = document.getElementById('mindMapView');
  if (!target) return;

  const wasHidden = target.classList.contains('hidden');
  if (wasHidden) target.classList.remove('hidden');

  const canvas = await window.html2canvas(target, { backgroundColor: '#0b1526', scale: 2 });
  if (wasHidden) target.classList.add('hidden');

  const dataUrl = canvas.toDataURL('image/png', 0.95);

  // 默认 PNG
  const kind = arguments[0] || 'png';
  if (kind === 'pdf') {
    if (!window.jspdf?.jsPDF) {
      alert('jsPDF 未加载，无法导出 PDF。');
      return;
    }
    const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfHeight = imgProps.height * pageWidth / imgProps.width;
    const y = Math.max(10, (pageHeight - pdfHeight) / 2);
    pdf.addImage(dataUrl, 'PNG', 5, y, pageWidth - 10, pdfHeight);
    pdf.save('algomap-mindmap.pdf');
    return;
  }

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'algomap-mindmap.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function handleModeExport(kind) {
  const isCategory = state.viewMode === 'category';
  const target = isCategory ? document.getElementById('mindMapView') : document.getElementById('algorithmList');
  if (!target) return;
  const wasHidden = target.classList.contains('hidden');
  if (wasHidden) target.classList.remove('hidden');
  const canvas = await window.html2canvas(target, { backgroundColor: '#0b1526', scale: 2 });
  if (wasHidden) target.classList.add('hidden');
  const dataUrl = canvas.toDataURL('image/png', 0.95);
  if (kind === 'pdf') {
    if (!window.jspdf?.jsPDF) {
      alert('jsPDF 未加载，无法导出 PDF。');
      return;
    }
    const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfHeight = imgProps.height * pageWidth / imgProps.width;
    const y = Math.max(10, (pageHeight - pdfHeight) / 2);
    pdf.addImage(dataUrl, 'PNG', 5, y, pageWidth - 10, pdfHeight);
    pdf.save(isCategory ? 'algocard-category.pdf' : 'algocard-levels.pdf');
    return;
  }
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = isCategory ? 'algocard-category.png' : 'algocard-levels.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function updateModeExportLabels() {
  const isCategory = state.viewMode === 'category';
  el.modeExportButtons.forEach(btn => {
    if (isCategory) {
      btn.textContent = btn.dataset.modeExport === 'pdf' ? '导出算法模式PDF' : '导出算法模式图片';
    } else {
      btn.textContent = btn.dataset.modeExport === 'pdf' ? '导出分类模式PDF' : '导出分类模式图片';
    }
  });
}
