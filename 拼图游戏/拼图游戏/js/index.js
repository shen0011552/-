window.onload = function () {

    // 获取元素
    // 通过id  返回一个元素
    // var box = document.getElementById("box");
    // console.log(box)
    // // 通过类名  返回的是一个元素列表
    // var boxs = document.getElementsByClassName("content")[0];
    // console.log(boxs)

    // // 通过标签名
    // var div = document.getElementsByTagName("div")[0];
    // console.log(div)

    // // 通过css选择器
    // // 返回的是一个元素
    // var qBox = document.querySelector(".btn");
    // console.log(qBox)
    // // 返回一个元素列表
    // var qBoxs = document.querySelectorAll(".btn");
    // console.log(qBoxs)

    var initBox = document.querySelector(".initBox"); // 初始化盒子
    var gameBg = document.querySelector(".gameBg");   // 游戏盒子
    var pulList = document.querySelector(".pulList")  // 装小方块的ul
    var targeImg = document.querySelector(".targeImg")  // 目标图 
    var passBox = document.querySelector(".passBox")   // 通关盒子
    var gameTime = document.querySelector(".gameTime") // 游戏时间盒子
    var passTime = document.querySelector(".passTime span")  // 通关时间
    var passGrade = document.querySelector(".passGrade")   // 通过等级
    var gradeBox = document.querySelector(".gradeBox")   // 难度盒子
    var gradeList = document.querySelectorAll(".gradeList")  // 难度列表
    var imgBox = document.querySelector(".imgBox")        // 图片列表
    var imgList = document.querySelectorAll(".imgList li")  // 所有图片


    var startBtn = document.querySelector(".startBtn"); // 开始游戏按钮
    var outBtn = document.querySelector(".outBtn");    // 退出游戏按钮
    var stopBtn = document.querySelector(".stopBtn")   // 暂停启动游戏按钮
    var restartBtn = document.querySelector('.restartBtn')  // 重新挑战按钮
    var nextBtn = document.querySelector(".nextBtn")       // 下一关按钮
    var gradeBtn = document.querySelector('.gradeBtn')    // 更改难度按钮
    var imgBtn = document.querySelector(".imgBtn")   // 更换图片按钮

    // 声明所需变量
    var pulImg = "1.jpg";   // 默认拼图图片
    var gradeNum = 1;  // 游戏难度系数  1 -->3*3    2--> 4*4
    var gradeText = "初级"  // 游戏等级
    var arrDef = [];  // 默认坐标数组
    var arrBg = []   // 随机坐标数组
    var lis = null;    // 获取li
    var w = 0;        // li的宽度
    var gameM = 0;    // 游戏时间  分钟
    var gameS = 0;    // 游戏时间  秒钟
    var timer = null  // 定时器变量
    var clickNum = 0  // 点击暂停按钮的次数
    var isMove  = true  // 是否可以移动


    // 开始游戏按钮的点击事件
    startBtn.onclick = function () {
        initBox.style.display = "none";
        gameBg.style.display = "block";
        init();  // 调用函数
    }

    // 退出游戏按钮的点击事件
    outBtn.onclick = function () {
        initBox.style.display = "block";
        gameBg.style.display = "none";
    }

    // 暂停启动游戏按钮的点击事件
    stopBtn.onclick = function () {
        clickNum++

        if (clickNum % 2 == 0) {
            clearInterval(timer)  // 重启定时器前先清除定时器
            // 启动定时器
            gameTimeFn()
            isMove = true
            this.textContent = "暂停"
        } else {
            isMove = false
            clearInterval(timer)  // 暂停游戏时间
            this.textContent = "启动"
        }


    }

    //重新挑战按钮的点击事件
    restartBtn.onclick = function(){
        init()
        passBox.style.display = "none"
    }

    // 下一关按钮的点击事件
    nextBtn.onclick = function(){
        gradeNum++
        if(gradeNum > 5){
            gradeNum = 1
        }
        passBox.style.display = "none"
        init()
    }

    // 更改难度点击事件
    gradeBtn.onclick = function(){
        gradeBox.style.display = "block"
    }

    // 难度等级列表
    for(var i = 0; i < gradeList.length; i++){

        gradeList[i].onclick = function(){
            // 获取data-num 的值
            // console.log(this.dataset.num)
            gradeNum = parseInt(this.dataset.num) // 重新赋值给难度系数
            gradeBox.style.display = "none"
        }
    }
    // 更换图片点击事件
    imgBtn.onclick = function(){
        imgBox.style.display = "block"
    }

    // 图片列表的点击
    for(var j = 0; j < imgList.length; j++){

        imgList[j].onclick = function(){
            // 获取data-img 的值
            // console.log(this.dataset.img)
            pulImg = this.dataset.img  // 更改图片路径
            imgBox.style.display = "none"
        }
    }



    // 游戏初始化函数
    function init() {
        isMove = true
        pulList.innerHTML = ""  // 确保ul里面是空的，没有任何元素，之后再添加
        gameM = 0
        gameS = 0
        clearInterval(timer)
        gameTime.textContent = '00 ：00'
        initArrDef()
        // console.log(123)
        var _rang = gradeNum + 2;   // 行列数
        w = Math.floor(pulList.offsetWidth / _rang);  //li的宽高
        // console.log(w)
        for (var i = 0; i < _rang * _rang; i++) {
            // 创建元素 小方块
            var node = document.createElement("li");  // 创建元素
            node.classList.add('lis');  // 添加类名
            node.style.width = w + "px";
            node.style.height = w + "px";
            node.style.backgroundImage = "url(./img/" + pulImg + ")";               // 设置背景图片
            node.style.backgroundSize = w * _rang + "px " + w * _rang + "px";   // 设置背景图片的大小，值与ul的宽高一致
            // 将小方块添加到ul上
            pulList.appendChild(node);

        }

        // 更改目标图背景图片路径
        targeImg.style.backgroundImage = "url(./img/" + pulImg + ")";

        // 重新更改ul的宽高，将多余的宽高去掉
        pulList.style.width = w * _rang + "px";
        pulList.style.height = w * _rang + "px";

        //获取所有的li小方块
        lis = document.getElementsByClassName("lis");
        console.log(lis)




        do{
             // 绘制之前打乱arrBg 的排序 
            arrBg.sort(function(){
                // Math.random()   0- 1 的随机数，且不包含1
                return Math.random() - 0.5   // -0.5  到 0.5 的随机数
            })
        }while(!hasPass())   // 不可解返回false ，结果取反再次打乱数组

        // console.log(arrBg)

        // console.log(Math.random())
        // 调用绘制背景图片定位函数
        drawLiBg(arrBg, w)
        liOnclick()  // 绘制完毕之后才调用小方块点击函数
        gameTimeFn()  // 游戏时间函数

    }

    // arrDef = ["0,0","0,1","0,2","1,0","1,1","1,2","2,0","2,1","2,2"]
    // ["X,X", "0,1", "1,0", "0,2", "0,0", "1,1", "1,2", "2,0", "2,1"]
    // 生成小方块的默认坐标
    function initArrDef() {
        arrDef = []
        arrBg = []
        var _rang = gradeNum + 2;   // 行列数
        console.log(_rang)
        for (var i = 0; i < _rang * _rang; i++) {
            var x = Math.floor(i / _rang)   // 生成3个0，3个1，3个2  0 /3 =0   1 / 3 = 0   2 /3 = 0  3 /3 = 1  4/3 = 1  5 / 3 = 1  6 /3 = 2....
            var y = i % _rang             // 生成3个 0，1，2
            arrDef[i] = x + "," + y
            arrBg[i] = x + "," + y
            // console.log(arrDef)

        }
        // 对数组最后一个值做标识
        arrBg[arrBg.length - 1] = "X,X"
        console.log(arrBg)
    }


    // 绘制小方块背景图片定位
    function drawLiBg(arr, w) {
        // console.log(arr)
        for (var i = 0; i < lis.length; i++) {

            // console.log(arr)
            // 字符串截取 字符.charAt()
            var x = arr[i].charAt(0)
            var y = arr[i].charAt(2)
            // console.log(x,y)
            if (x == "X" || y == "X") {
                lis[i].style.backgroundPosition = "1000px 1000px"
            } else {
                lis[i].style.backgroundPosition = -w * y + "px " + -w * x + "px"
            }

        }
    }

    // li小方块的点击事件
    function liOnclick() {
        for (var i = 0; i < lis.length; i++) {
            // 自定义属性绑定
            lis[i].index = i    // lis[0].index = 0   lis[1].index = 1  
            lis[i].onclick = function () {
                // console.log(this.index)
                // 判断是否是空白方块，如果是则不执行以下代码
                if (!isWhite(this.index) && isMove == true) {

                    var rang = gradeNum + 2;   // 行列数
                    // 获取当前点击方块的上下左右方块的下标，然后进行判断他们是否是空白方块
                    // console.log(this.index)  // 当前点击的方块下标
                    // console.log(this.index - rang)  // 当前点击的方块的上边方块的下标
                    // console.log(this.index + rang)  // 当前点击的方块的下边方块的下标
                    // console.log(this.index + 1)   // 当前点击的方块的右边方块的下标
                    // console.log(this.index - 1)  // 当前点击的方块的左边方块的下标
                    liMove(this.index, this.index - rang, this.index + 1, this.index + rang, this.index - 1)
                }
            }
        }
    }

    // 方块移动函数
    function liMove() {
        // 实参数组
        // console.log(arguments)
        // 九宫格：
        // 如果当前点击的方块下标是 2 或者 5，右边方块的下标要重新赋值 -1
        // 如果当前点击的方块下标是 3 或者 6，左边方块的下标要重新赋值 -1
        var rang = gradeNum + 2; // 行列数
        for (var j = 1; j < rang; j++) {
            if (arguments[0] == j * rang - 1) {
                arguments[2] = -1
            }
            if (arguments[0] == j * rang) {
                arguments[4] = -1
            }
        }
        // console.log(arguments)
        for (var i = 1; i < arguments.length; i++) {

            if (arguments[i] >= 0 && arguments[i] < lis.length && isWhite(arguments[i])) {
                // console.log(arguments[i])  // 空白方块的下标
                // console.log(arguments[0])  // 当前点击方块的下标

                // 互换背景
                var curBg = lis[arguments[0]].style.backgroundPosition    // 保存当前点击方块的背景定位
                lis[arguments[0]].style.backgroundPosition = "1000px 1000px"  // 更改当前点击方块的背景定位为空白方块
                lis[arguments[i]].style.backgroundPosition = curBg         // 更改空白方块的背景定位为保存的背景定位


                // 相应的方块坐标进行互换 
                var curAct = arrBg[arguments[0]]
                arrBg[arguments[0]] = "X,X"
                arrBg[arguments[i]] = curAct
                // console.log(arrBg)
            }
        }

        // 游戏通关
        if (isPass()) {
            // console.log("通关成功")

            drawLiBg(arrDef, w)
            setTimeout(function () {
                passBox.style.display = "block"  //显示通关盒子
                clearInterval(timer)   // 停止游戏时间
                passTime.textContent = gameTime.textContent

                switch (gradeNum) {
                    case 1:
                        gradeText = "初级"
                        break;
                    case 2:
                        gradeText = "中级"
                        break;
                    case 3:
                        gradeText = "高级"
                        break;
                    case 4:
                        gradeText = "终极"
                        break;
                    case 5:
                        gradeText = "精英"
                        break;
                }
                passGrade.innerHTML = "通关等级："+gradeText+"<br/>难度系数： "+ gradeNum

            }, 300)

        }

    }

    // 判断是否是空白方块
    function isWhite(id) {
        // console.log(lis[id].style.backgroundPosition == "1000px 1000px")
        if (lis[id].style.backgroundPosition == "1000px 1000px") {
            return true
        }
        return false

    }

    // 判断是否通关
    function isPass() {
        // arrDef = ["0,0", "0,1", "0,2", "1,0", "1,1", "1,2", "2,0", "2,1", "2,2"]
        //   arrB = ["0,0", "0,1", "0,2", "1,0", "1,1", "1,2", "2,0", "2,1", "X,X"]
        for (var i = 0; i < arrBg.length - 1; i++) {
            // 假设arrBg[i] 和 arrDef[i] 一直相等，for循环则一直在跳出，return false没有执行，则意味拼图恢复原图
            // 假设arrBg[i] 和 arrDef[i] 存在不相同的情况，则if判断没有成立，continue没有执行，则return false执行，并且终止了代码，return true没有执行，则意味拼图没有恢复原图
            if (arrBg[i] == arrDef[i]) {
                continue  // 跳出本次循环
            }
            // 不通关
            return false   // return 可以返回函数的某个值，终止代码
        }

        // 通关
        return true

    }

    // 游戏时间函数
    function gameTimeFn() {
        timer = setInterval(function () {
            gameS++

            if (gameS > 59) {
                gameM++
                gameS = 0
            }
            var S = gameS < 10 ? "0" + gameS : gameS
            var M = gameM < 10 ? "0" + gameM : gameM
            gameTime.textContent = M + " : " + S
        }, 1000)
    }

    // 逆序： 大的数在小的数前面
    // [0,1,2,3,4,5,7,6]
    // 逆序个数为偶数的时候，拼图为可解
    // 逆序个数为奇数的时候，拼图不可解
    function hasPass() {

        var backNum = 0  // 逆序个数
        var _rang = gradeNum + 2;   // 行列数

        for (var i = 0; i < arrBg.length; i++) {

            if (arrBg[i] == "X,X") {
                continue  // 跳出本次循环
            }
            // 将坐标转化为数字，方便进行比大小
            var indexDef = parseInt(arrBg[i].charAt(0) * _rang) + parseInt(arrBg[i].charAt(2))
            // console.log("indexDef---->",indexDef)

            for (var j = i + 1; j < arrBg.length; j++) {

                if (arrBg[j] == "X,X") {
                    continue  // 跳出本次循环
                }
                var indexAft = parseInt(arrBg[j].charAt(0) * _rang) + parseInt(arrBg[j].charAt(2))


                // console.log("indexAft-->",indexAft)




                if (indexDef > indexAft) {
                    backNum++
                }
            }

        }

        // console.log(backNum)

        if (backNum % 2 == 0) {
            return true   // 可解
        }
        return false   // 不可解



    }



}