/*
不同类型放置在不同的父节点(这里对这些不同的父节点统一用a表述，方便)上，这些父节点的父节点都是Canvas
统一设置a为Canvas的左下角，Anchor（0.5，0.5），Scale(1,1)
在a的子节点下，X取值范围为（0~950），Y取值范围为（0~530），注意实际物品的宽高
实际上，不可能存在钩子钩不到的地方，故
X取值范围为（80~880），Y取值范围为（90~430）

数组的第一维表示关卡
每个数组的内容是JSON格式的，num表示数量

第二维表示内容，从最初价值高到低排序

测试的时候采用numth/a/内容
*/

//left为基础，随机生成right的个数
function getRandomNum(left, right) {
    return Math.ceil(left + Math.random() * right)
}



/*
黄金的类型是根据scale区分大小的，取值为10，7，2，1
只需要记录10和7的即可，其他根据随机获取
*/
const Gold = [
    [
        {
            Type: 10,
            Num: getRandomNum(1, 2),
            Position: [
                { X: 158, Y: 147 },
                { X: 742, Y: 124 },
                { X: 436, Y: 101 },
            ]
        },
        {
            Type: 7,
            Num: getRandomNum(1, 1),
            Position: [
                { X: 317, Y: 238 },
                { X: 588, Y: 228 },
            ]
        },
        {
            Type: 2,
            Num: getRandomNum(1, 3),
            Position: [
                { X: 874, Y: 364 },
                { X: 66, Y: 312 },
                { X: 403, Y: 365 },
            ]
        },
        {
            Type: 1,
            Num: getRandomNum(1, 3),
            Position: [
                { X: 800, Y: 380 },
                { X: 90, Y: 320 },
                { X: 350, Y: 360 },
                { X: 222, Y: 222 },
            ]
        },

    ]
]

/*
钻石在第一关第二关基本没有，测试的时候第一关有
*/
const Diamond = [
    [
        {
            Num: getRandomNum(1, 0),
            Position: [
                { X: 554, Y: 340 },
            ]
        },

    ]
]
/*
石头基本每一关都有,后台数据使用1，2分别代表小，大石头，与前台生成的是根据‘SmallTone’和'Tone'，！！！！
*/
const Stone = [
    [
        {
            Type: 1,
            Num: getRandomNum(2, 6),
            Position: [
                { X: 297, Y: 393 },
                { X: 732, Y: 397 },
                { X: 450, Y: 285 },
                { X: 708, Y: 289 },
                { X: 744, Y: 317 },
                { X: 135, Y: 398 },
                { X: 188, Y: 274 },
                { X: 890, Y: 209 },
            ]
        },
        {
            Type: 2,
            Num: getRandomNum(1, 3),
            Position: [
                { X: 833, Y: 275 },
                { X: 189, Y: 369 },
                { X: 796, Y: 445 },
                { X: 40, Y: 418 },
            ]
        },
    ]
]

/*
幸运袋基本都有,随机袋的类型是根据随机袋的脚本自己生成的
*/

const LuckyBox = [
    [
        {
            Num: getRandomNum(0, 1),
            Position: [
                { X: 638, Y: 344 },
            ]
        },
    ]
]

/*
羊在有炸弹，钻石的时候一定有，其他情况随机生成很少几个
根据0，1分别生成无钻石，有钻石的羊，前台是通过节点名字操作相关数据的！！！！
*/
const Sheep = [
    [
        {
            Type: 0,
            Num: getRandomNum(1, 1),
            Position: [
                { X: 740, Y: 419 },
                { X: 226, Y: 371 },
            ]
        },
        {
            Type: 1,
            Num: getRandomNum(1, 0),
            Position: [
                { X: 375, Y: 420 },
            ]
        },
    ],
]

/*
炸弹在第一关没有，测试的时候有
*/
const BombBox = [
    [
        {
            Num: getRandomNum(1, 0),
            Position: [
                { X: 639, Y: 423 },
            ]
        },
    ],
]


/*
第三维表示游戏，第二维表示关卡，地三维表示不同内容，下标分别对应着
Gold   Diamond   Stone   LuckyBox  Sheep   BombBox
钻石是Type，随机袋也是没有Type，BombBox也是没有的 
*/
const mission = [
    // firstMission % 7
    [
        [
            { Type: 10, Num: getRandomNum(1, 1), Position: [{ X: 254, Y: 118 }, { X: 762, Y: 132 }] },
            { Type: 7, Num: getRandomNum(0, 1), Position: [{ X: 531, Y: 196 },] },
            { Type: 2, Num: getRandomNum(1, 2), Position: [{ X: 324, Y: 345 }, { X: 375, Y: 279 }, { X: 611, Y: 311 }] },
            { Type: 1, Num: getRandomNum(1, 1), Position: [{ X: 373, Y: 363 }, { X: 731, Y: 405 },] },
        ],
        [
        ],
        [
            { Type: 1, Num: getRandomNum(1, 1), Position: [{ X: 259, Y: 312 }, { X: 602, Y: 363 },] },
            { Type: 2, Num: getRandomNum(0, 1), Position: [{ X: 163, Y: 379 },] },
        ],
        [
            { Num: getRandomNum(0, 1), Position: [{ X: 135, Y: 285 },] },
        ],
        [],
        [],
    ]
    ,
    //secondMission % 7
    [
        [
            { Type: 10, Num: getRandomNum(1, 2), Position: [{ X: 158, Y: 147 }, { X: 742, Y: 124 }, { X: 436, Y: 101 },] },
            { Type: 7, Num: getRandomNum(1, 1), Position: [{ X: 317, Y: 238 }, { X: 588, Y: 228 },] },
            { Type: 2, Num: getRandomNum(1, 3), Position: [{ X: 674, Y: 364 }, { X: 66, Y: 312 }, { X: 329, Y: 385 }, { X: 373, Y: 365 }] },
            { Type: 1, Num: getRandomNum(1, 3), Position: [{ X: 800, Y: 380 }, { X: 126, Y: 377 }, { X: 200, Y: 462 }, { X: 247, Y: 347 },] },
        ],
        [
            { Num: getRandomNum(0, 2), Position: [{ X: 293, Y: 340 }, { X: 554, Y: 340 },] },
        ],
        [
            { Type: 1, Num: getRandomNum(2, 2), Position: [{ X: 297, Y: 393 }, { X: 732, Y: 397 }, { X: 450, Y: 285 }, { X: 708, Y: 289 }, { X: 744, Y: 317 }, { X: 135, Y: 398 }, { X: 188, Y: 274 }, { X: 890, Y: 209 },] },
            { Type: 2, Num: getRandomNum(1, 2), Position: [{ X: 833, Y: 275 }, { X: 189, Y: 369 }, { X: 796, Y: 445 }, { X: 40, Y: 418 },] },
        ],
        [
            { Num: getRandomNum(0, 3), Position: [{ X: 719, Y: 262 }, { X: 135, Y: 285 }, { X: 55, Y: 386 },] },
        ],
        [
            { Type: 0, Num: getRandomNum(1, 2), Position: [{ X: 740, Y: 419 }, { X: 226, Y: 371 }, { X: 817, Y: 389 },] },
            { Type: 1, Num: getRandomNum(1, 0), Position: [{ X: 831, Y: 249 },] },
        ],
        [
            { Num: getRandomNum(1, 0), Position: [{ X: 639, Y: 423 },] }
        ],
    ],
    //thirdMission % 7
    [
        [
            { Type: 10, Num: getRandomNum(0, 1), Position: [{ X: 455, Y: 61 }, { X: 779, Y: 63 },] },
            { Type: 7, Num: getRandomNum(0, 1), Position: [{ X: 755, Y: 68 }, { X: 588, Y: 228 },] },
            { Type: 2, Num: getRandomNum(3, 2), Position: [{ X: 799, Y: 350 }, { X: 685, Y: 274 }, { X: 674, Y: 364 }, { X: 286, Y: 230 }, { X: 174, Y: 236 }] },
            { Type: 1, Num: getRandomNum(1, 1), Position: [{ X: 221, Y: 206 }, { X: 731, Y: 405 },] },
        ],
        [
            { Num: getRandomNum(1, 0), Position: [{ X: 133, Y: 172 },] },
        ],
        [
            { Type: 1, Num: getRandomNum(1, 0), Position: [{ X: 259, Y: 312 },] },
            { Type: 2, Num: getRandomNum(1, 0), Position: [{ X: 753, Y: 226 },] },
        ],
        [
            { Num: getRandomNum(0, 1), Position: [{ X: 106, Y: 303 },] },
        ],
        [
            { Type: 0, Num: getRandomNum(2, 0), Position: [{ X: 468, Y: 336 }, { X: 395, Y: 256 }, { X: 226, Y: 371 },] },
            { Type: 1, Num: getRandomNum(2, 1), Position: [{ X: 817, Y: 272 }, { X: 849, Y: 158 }, { X: 241, Y: 117 },] },
        ],
        [
            { Num: getRandomNum(1, 0), Position: [{ X: 871, Y: 349 },] }
        ],
    ],
    //forthMission % 7    gold diamond stone luckyBox sheep bombbox
    [
        [
        ],
        [
            { Num: getRandomNum(1, 0), Position: [{ X: 454, Y: 201 },] },
        ],
        [],
        [],
        [
            {
                Type: 0, Num: getRandomNum(2, 0),
                Position: [
                    { X: 220, Y: 447 }, { X: 426, Y: 311 }, { X: 595, Y: 344 },
                    { X: 618, Y: 274 }, { X: 753, Y: 336 }, { X: 306, Y: 189 },
                    { X: 825, Y: 240 }, { X: 168, Y: 246 }, { X: 494, Y: 237 },
                    { X: 692, Y: 157 }, { X: 257, Y: 86 },
                ]
            },
            {
                Type: 1, Num: getRandomNum(2, 1), Position: [
                    { X: 617, Y: 213 }, { X: 793, Y: 143 }, { X: 237, Y: 149 },
                    { X: 370, Y: 102 }, { X: 678, Y: 93 }, { X: 137, Y: 105 },
                    { X: 495, Y: 45 }, { X: 752, Y: 66 }, { X: 533, Y: 122 },
                ]
            },
        ],
        [
            { Num: getRandomNum(1, 1), Position: [{ X: 871, Y: 349 }, { X: 227, Y: 219 },] }
        ],
    ],
    //fifthMission % 7
    [
        [
            {
                Type: 10, Num: getRandomNum(4, 1), Position: [
                    { X: 48, Y: 185 }, { X: 322, Y: 207 }, { X: 450, Y: 84 }, { X: 666, Y: 93 },
                    { X: 876, Y: 93 },
                ]
            },
            {
                Type: 7, Num: getRandomNum(4, 1), Position: [
                    { X: 170, Y: 307 }, { X: 209, Y: 64 }, { X: 487, Y: 245 }, { X: 676, Y: 265 },
                    { X: 878, Y: 316 },
                ]
            },
            {
                Type: 2, Num: getRandomNum(3, 2), Position: [
                    { X: 291, Y: 351 }, { X: 355, Y: 346 }, { X: 427, Y: 325 }, { X: 566, Y: 285 },
                    { X: 777, Y: 347 }
                ]
            },
            {
                Type: 1, Num: getRandomNum(1, 1), Position: [
                    { X: 72, Y: 430 }, { X: 116, Y: 393 }, { X: 706, Y: 352 },
                ]
            },
        ],
        [],
        [],
        [],
        [],
        [],
    ],
    //sixthMission % 7   gold diamond stone luckyBox sheep bombbox
    [
        [

        ],
        [
            {
                Num: getRandomNum(7, 0), Position: [
                    { X: 472, Y: 419 }, { X: 357, Y: 367 }, { X: 245, Y: 269 }, { X: 157, Y: 180 },
                    { X: 555, Y: 360 }, { X: 675, Y: 263 }, { X: 793, Y: 177 },
                ]
            },
        ],
        [],
        [],
        [
            {
                Type: 0, Num: getRandomNum(2, 0), Position: [
                    { X: 473, Y: 193 }, { X: 537, Y: 57 },
                ]
            },
            {
                Type: 1, Num: getRandomNum(7, 0), Position: [
                    { X: 477, Y: 106 }, { X: 294, Y: 307 }, { X: 218, Y: 201 },
                    { X: 641, Y: 325 }, { X: 754, Y: 218 }, { X: 294, Y: 307 }, { X: 218, Y: 201 },
                ]
            },
        ],
        [
            {
                Num: getRandomNum(1, 0), Position: [
                    { X: 464, Y: 369 }, { X: 352, Y: 271 }, { X: 261, Y: 194 }, { X: 172, Y: 100 },
                    { X: 579, Y: 279 }, { X: 694, Y: 179 }, { X: 782, Y: 91 },
                ]
            }
        ],
    ],
]

function getMission() {
    // console.log(`MissionSet:getMission  ${mission[0][0][0].Type}`)
    return mission;
}


export { getMission }