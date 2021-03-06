function getCurrentTime() {
  var keep = '';
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var f = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  keep = y + '-' + m + '-' + d + ' ' + h + ':' + f + ':' + s;
  return keep; 
}

function getBehindDate(Mydate,n){
	Mydate = Mydate.replace(/-/g, '/');
  var timestamp = Date.parse(Mydate)
  var date = new Date(timestamp);
	var year,month,day ;
	date.setDate(date.getDate()+n);
	year = date.getFullYear();
	month = date.getMonth()+1;
	day = date.getDate() ;
	let s = year + '-' + ( month < 10 ? ( '0' + month ) : month ) + '-' + ( day < 10 ? ( '0' + day ) : day) ;
	return s ;
} 

function getTimeStamp(Mydate){
  Mydate = Mydate.replace(/-/g, '/');
  return Date.parse(Mydate)
}


function timeToDate(Mydate){
  Mydate = Mydate.replace(/-/g, '/');
  var timestamp = Date.parse(Mydate)
  var date = new Date(timestamp);
  //年  
  var Y = date.getFullYear();
  //月  
  var M = date.getMonth() + 1;
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //小时
  var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  //分钟
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  //秒数
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + '-' + M + '-' + D;
}

function getCurrentDate() {
  var keep = '';
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  keep = y + '-' + m + '-' + d;
  return keep; 
}
//日期转换为几天前
function checkoutDate(time){
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  time = time.replace(/\-/g, "/");
  var sTime = new Date(time).getTime();//把时间pretime的值转为时间戳
  var now = new Date().getTime();//获取当前时间的时间戳
  		
  var diffValue = now - sTime;

  var monthC =diffValue/month;
  var weekC =diffValue/(7*day);
  var dayC =diffValue/day;
  var hourC =diffValue/hour;
  var minC =diffValue/minute;
  if(monthC>3){
    return time;
  }
  if(monthC>=1){
    return parseInt(monthC) + "个月前";
  }
  else if(weekC>=1){
    return parseInt(weekC) + "周前";
  }
  else if(dayC>=1){
    return parseInt(dayC) +"天前";
  }
  else if(hourC>=1){
    return parseInt(hourC) +"个小时前";
  }
  else if(minC>=1){
    return parseInt(minC) +"分钟前";
  }else{
    return "刚刚";
  }
}

//转换帖子列表日期
function checkoutPostTime(data){

    var date = data.toString();
    var year = date.substring(0,4);
    var month = date.substring(5,7);
    var day = date.substring(8,10);
    var d1 = new Date(year+'/'+month+'/'+day);
    var dd = new Date();
    var y= dd.getFullYear();
    var m=dd.getMonth()+1;
    var d=dd.getDate();

    var d2 = new Date(y+'/'+m+'/'+d);
    var iday = parseInt(d2-d1)/1000/60/60/24;

    var Mydate = data.replace(/-/g, '/');
    var timestamp = Date.parse(Mydate)
    var date = new Date(timestamp);
    //年  
    var Y = date.getFullYear();
    //月  
    var M = date.getMonth() + 1;
    //日  
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //小时
    var H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    //分钟
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    //秒数
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    
    if(iday == 0){    //今天
      return '今天'+' '+H + ':' + m;
    }else if(iday == 1){    //昨天
      return '昨天'+' '+H + ':' + m;
    }else{
      return Y + '-' + M + '-' + D+' '+H + ':' + m;
    }

}

function getBeforeDate(n){
	var date = new Date() ;
	var year,month,day ;
	date.setDate(date.getDate()-n);
	year = date.getFullYear();
	month = date.getMonth()+1;
	day = date.getDate() ;
	let s = year + '-' + ( month < 10 ? ( '0' + month ) : month ) + '-' + ( day < 10 ? ( '0' + day ) : day) ;
	return s ;
} 
function timeStampToDate(timestamp){
  var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear();
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
  var D =  date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds()< 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + '年' + M + '月' + D+'日  '+h+':'+m+':'+s;
}
function objLength(input) {
  var type = toString(input);
  var length = 0;
  if (type != "[object Object]") {
    //throw "输入必须为对象{}！"
  } else {
    for (var key in input) {
      if (key != "number") {
        length++;
      }

    }
  }
  return length;
}
//验证是否是手机号码
function vailPhone(number) {
  let flag = false;
  let myreg = /^1[345678]{1}\d{9}$/;
  if (number.length != 11) {
    flag = flag;
  }else if (!myreg.test(number)) {
    flag = flag;
  }else{
    flag = true;
  }
  return flag;
}
//验证是否西班牙手机(6开头 9位数)
function ifSpanish(number) {
  let flag = false;
  let myreg = /^([6|7|9]{1}(\d+){8})$/;
  if (number.length != 9) {
    flag = flag;
  } else if (!myreg.test(number)) {
    flag = flag;
  } else {
    flag = true;
  }
  return flag;
}
//浮点型除法
function div(a, b) {
  var c, d, e = 0,
    f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) { }
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) { }
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}
//浮点型加法函数
function accAdd(arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return ((arg1 * m + arg2 * m) / m).toFixed(2);
}
//浮点型乘法
function mul(a, b) {
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) { }
  try {
    c += e.split(".")[1].length;
  } catch (f) { }
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
//浮点型转换最终结果
function strip(num, precision = 12) {
  return +parseFloat(num.toPrecision(precision)).toFixed(2);
}

// 遍历对象属性和值
function displayProp(obj) {
  var names = "";
  for (var name in obj) {
    names += name + obj[name];
  }
  return names;
}
// 去除字符串所有空格
function sTrim(text) {
  return text.replace(/\s/ig, '')
}
//去除所有:
function replaceMaohao(txt) {
  return txt.replace(/\:/ig, '')
}
//转换星星分数
function convertStarArray(score) {
  //1 全星,0 空星,2半星
  var arr = []
  for (var i = 1; i <= 5; i++) {
    if (score >= i) {
      arr.push(1)
    } else if (score > i-1 && score < i + 1) {
      arr.push(2)
    } else {
      arr.push(0)
    }
  }
  return arr
}
 //浮点型转换最终结果
 function transformDistance(num, precision = 8) {
  let number = num/1000;
  return +parseFloat(number.toPrecision(precision));
}
module.exports = {
  getCurrentTime: getCurrentTime,
  getCurrentDate:getCurrentDate,
  getBeforeDate:getBeforeDate,
  objLength: objLength,
  displayProp: displayProp,
  sTrim: sTrim,
  replaceMaohao: replaceMaohao,
  vailPhone: vailPhone,
  ifSpanish: ifSpanish,
  div: div,
  mul: mul,
  accAdd: accAdd,
  convertStarArray: convertStarArray,
  strip: strip,
  timeStampToDate,
  getBehindDate,
  timeToDate,
  checkoutDate,
  transformDistance,
  checkoutPostTime,
  getTimeStamp
}
