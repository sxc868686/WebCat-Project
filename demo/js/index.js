function id(obj) {
    return document.getElementById(obj);
}
function bind(obj, ev, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}
function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}
function addClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
};

function removeClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
};
window.onload=function () {


    var pli=id('picList').getElementsByTagName('li');
    id('picList').style.width=pli.length+'00%';
    for(var i=0;i<pli.length;i++){
      pli[i].style.width=view().w+'px';
    };
    //欢迎页动画执行完成后切换
    function fnLoad() {
        var wel=id('welcome');
        var time=new Date().getTime();//得到开始的时间
        var bTime=false;//判断动画是否执行完
        var otimer=0;
        bind(wel,'webkitTransitionEnd',end)
        bind(wel,'transitionend',end)
        otimer=setInterval(function () {
            if(new Date().getTime()-time>=5000){//当动画时间执行超过5秒时进行操作
                bTime=true;
            };
            if(bTime){
                clearInterval(otimer);
                wel.style.opacity=0;

            };
        },1000);
        function end() {
            removeClass(wel,"pageShow");
            fnTab();
        }

    };
    
    //tab切换功能
    function fnTab(){
        var tab=id('tabPic');
        var tList=id('picList');
        var tNav=tab.getElementsByTagName('nav')[0].children;
        var tNow=0;//当前显示的图片，默认第0个
        var iX=0; //记录translateX需要移动的值
        var iW=view().w; //记录屏幕的宽度
        var oTimer=null;//定时器
        var iStartTouchX=0;//记录开始时的x轴坐标
        var iTouchX=0;//记录手指按下的x轴坐标

        //自动播放tab
        function auto() {
            oTimer=setInterval(function () {
                tNow++;
                tNow=tNow%tNav.length;
                Tab();
            },2000);
        }

        //执行代码
        function Tab() {
            iX=-tNow*iW; //每次移动一个屏幕
            tList.style.transform=tList.style.WebkitTransform='translateX('+iX+'px)';
            tList.style.transition=tList.style.WebkitTransition='0.5s';
            for(var i=0;i<tNav.length;i++){
                removeClass(tNav[i],'active');
            };
            addClass(tNav[tNow],'active');
        };
        //因为on不一定支持animation,使用自定义的方法替代
        bind(tab,'touchstart',fnStart);
        bind(tab,'touchmove',fnMove);
        bind(tab,'touchend',fnEnd);
        auto();
        //手指滑动开始事件
        function fnStart(ev) {
            clearInterval(oTimer);
            tList.style.transition=tList.style.WebkitTransition='none';//清除延迟，否则滑动如同生锈一般
            var ev=ev || window.event;
            ev=ev.changedTouches[0];
            //console.log(ev); 得到changedTouches的参数列表
            iStartTouchX=ev.pageX;
            iTouchX=iX;
        };
        //滑动事件
        function fnMove(ev) {
            var ev=ev || window.event;

            ev=ev.changedTouches[0];
            var iDis=ev.pageX-iStartTouchX;//得到出发点和移动后的终点距离的差值
            iX=iTouchX+iDis;
            tList.style.transform=tList.style.WebkitTransform='translateX('+iX+'px)';
        };
        //滑动结束事件
        function fnEnd() {
            //得到移动后该显示哪个图片的值
            tNow=iX/iW;
            tNow=-Math.round(tNow);
            if(tNow<0){
                tNow=0;
            }else if(tNow>tNav.length-1){
                tNow=tNav.length-1;
            }
            tNow=tNow%tNav.length;
            Tab();
            auto();
        }

    };

    //评分组件
    function fnScore(){
        var oScore=id('score');
        var sLi=oScore.getElementsByTagName('li');
        var arr=['很差','较差','一般','良好','很棒'];//评分对应的文字
        for(var i=0;i<sLi.length;i++){
            fn(sLi[i]);
        };
        function fn(oLi) {
            var aNav=oLi.getElementsByTagName('a');
            var oInput=oLi.getElementsByTagName("input")[0];
            for(var i=0;i<aNav.length; i++){
                aNav[i].index=i;
                bind(aNav[i],'touchstart',function (ev) {
                    //点击之后判断点击的是哪一个星，然后进行打分操作
                    for(var i=0;i<aNav.length; i++){
                        if(i<=this.index){
                            addClass(aNav[i],'active');
                        }else {
                            removeClass(aNav[i],'active');
                        }
                    };
                    oInput.value=arr[this.index];
                });
            };
        }
    };
    //当验证不通过时所提示的信息
    function fnInfo(oInfo,sInfo) {//oInfo为元素，sInfo为需要提示的信息
        oInfo.innerHTML=sInfo;
        oInfo.style.transform=oInfo.style.WebkitTransform='scale(1)';
        oInfo.style.opacity=1;
        setTimeout(function () {//让提示信息展示半秒钟后消失
            oInfo.style.transform=oInfo.style.WebkitTransform='scale(0)';
            oInfo.style.opacity=0;
        },1000)
    }
    
    //提交按钮
    function fnIndex() {
        var oIndex=id("index");
        var oBtn=oIndex.getElementsByClassName('btn')[0];
        var pf=false;//判断是否评分
        var oInfo=oIndex.getElementsByClassName('info')[0];
        bind(oBtn,'touchend',fnEnd);
        function fnEnd() {
            pf=fnScoreChecked();
            if(pf){//如果验证通过，则判断是否选择标签
                if(bTag()){//验证通过，执行弹出层
                    fnIndexOut();
                }else {
                    fnInfo(oInfo,"请给景区添加标签");
                }
            }else{
                 fnInfo(oInfo,"请给景区评分");
            };
        };
        //判断用户是否评分
        function fnScoreChecked() {
            var oScore=id('score');
            var oInput=oScore.getElementsByTagName('input');
            for (var i=0; i<oInput.length; i++){
                if(oInput[i].value==0){
                    return false;
                }
            };
            return true;
        };
        //判断用户是否选择tag
        function bTag() {
            var oTag=id('indexTag');
            var oInput=oTag.getElementsByTagName('input');
            for (var i=0; i<oInput.length; i++){
                if(oInput[i].checked){//如果有一项被选择了就为true
                    return true;
                }
            };
            return false;
        };
    };
    //首页跳出方法
    function fnIndexOut() {
        var oMask=id('mask');
        var oIndex=id('index');
        var news=id('news');
        addClass(oMask,'pageShow');
        addClass(news,'pageShow');
        fnNews();
       setTimeout(function () {
            oMask.style.opacity=1;
            oIndex.style.filter=oIndex.style.WebkitFiter="blur(5px)";//当弹窗时背景变模糊
        },10);
        setTimeout(function () {//3秒钟后结束并跳转
            oMask.style.opacity=0;
            oIndex.style.filter=oIndex.style.WebkitFiter="blur(0px)";//当弹窗时背景变模糊
            news.style.opacity=1;
        },3000)

 };
    
    //新闻页上传文件
    function fnNews() {
        var oNews=id('news');
        var oInfo=oNews.getElementsByClassName('info')[0];
        var aInput=oNews.getElementsByTagName('input');
        aInput[0].onchange=function () {
            //console.log(this.files);
            if(this.files[0].type.split("/")[0]=='video'){
                fnNewOut();
            }else {
                fnInfo(oInfo,'请上传视频')
            }
        };
        aInput[1].onchange=function () {
            if(this.files[0].type.split("/")[0]=='image'){
                fnNewOut();
            }else {
                fnInfo(oInfo,'请上传图片')
            }
        };
    };

    //评价完成后跳转到表单页
    function fnNewOut() {
        var oNews=id('news');
        var form=id('form');
        var mask=id('mask');
        removeClass(oNews,'pageShow');
        removeClass(id('index'),'pageShow');
        removeClass(mask,'pageShow');
        oNews.style.cssText='';
        addClass(form,'pageShow');
    }

    //表单页上传
    function formIn() {
        var oForm=id('form');
        var over=id('over');
        var aFormTag=id('formTag').getElementsByTagName('label');
        var oBtn=oForm.getElementsByClassName('btn')[0];
        var bOff=false;
        for(var i=0;i<aFormTag.length;i++){
            bind(aFormTag[i],'touchend',function () {
                bOff=true;
                addClass(oBtn,'submit');
            });
        };
        bind(oBtn,'touchend',function () {
            if(bOff){
                addClass(over,'pageShow');
                removeClass(oForm,'pageShow');
                Fnover();
            };
        });
    };
    //上传成功
    function Fnover(){
        var oOver=id("over");
        var oBtn=oOver.getElementsByClassName("btn")[0];
        bind(oBtn,"touchend",function(){
            removeClass(oOver,"pageShow");
            addClass(id('index'),'pageShow');
        });
    }
    formIn();
    fnLoad();
    fnScore();
    fnIndex();
    document.body.style.height=view().h+'px';
};
