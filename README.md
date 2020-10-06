# :car: Ajax:

## Ajax基础知识

### **Ajax的概念：**

Ajax:Asynchronous JavaScript and XML,意思是异步网络请求,区别于传统web开发中采用的同步方式。

Ajax是浏览器提供的一套方法，可以实现**页面无刷新更新数据**，**提高用户浏览网站的体验**。



### **Ajax的应用场景：**

1.页面上拉加载更多数据
2.列表数据无刷新分页
3.表单项离开焦点数据验证
4.搜索框提示文字下拉列表



### **Ajax的运行原理：**

Ajax相当于浏览器发送请求与接收响应的**代理人**，以实现在不影响用户浏览页面的情况下，局部更新页面数
据,从而提高用户体验。



### **Ajax的实现步骤：**

```JS
//创建Ajax对象
let xhr = new XMLHttpRequest();
//告诉Ajax请求地址以及请求方式
xhr.open('get','http://www.example.com');
//发送请求
xhr.send();
//获取服务器的响应数据
xhr.onload=function(){
    console.log(xhr.responseText)//获取到的值是JSON字符串，需要通过JSON.parse()转换为JSON对象。
    let responseText=JSON.parse(xhr.responseText);
}
```





### **服务器端响应的数据格式：**

在http请求与响应的过程中，无论是请求参数还是响应内容,如果数据是对象类型,最终都会被转换为**对象字符串**进行传输。

所以服务器返回的json对象在客户端接收到的时候已经被转换为了json字符串，此时可以通过window下的JSON属性进行转换，即通过JSON.parse()方法将json字符串转换为json对象。

注意：服务器响应的数据只能是字符串，数字都不行



### **两种请求方式中参数的传递：**

**GET请求：**

```js
//使用Ajax发送get请求时请求参数需要自己拼接。
let url = `http://localhost:3000/first?username=${username.value}&pwd=${pwd.value}`;
let xhr = new XMLHttpRequest();
xhr.open("get", url);
xhr.send();
xhr.onload=function(){}
```

服务器端获取get请求的参数：

```js
app.get('/first',(req,res)=>{
    console.log(req.query)
})
```



**POST请求：**

```js
//post请求中参数可以有两种格式：(注意：客户端发送不同格式的请求参数时，服务端的接收方式是不一样的)

//格式一：x-www-form-urlencoded格式，即属性名称等于属性值的格式
//❤必须在请求报文中明确设置 请求参数的格式类型，即Content-Type属性。否则服务器端接收不到请求参数。
xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
//并且请求参数需通过send方法传递。此操作相当于将该参数放在了请求体中。
xhr.send('name=zhangsan&age=20');


//格式二：JSON数据格式
xhr.setRequestHeader('Content-Type','application/json');
//由于send的参数必须是字符串的形式，所有需要将json对象转换为json字符串的形式
xhr.send(JSON.stringify({name:'zhangsan',age:20}))
```

服务器端获取post请求的参数：

```js
//需要借助第三方模块body-parser
const bodyParser=require('body-parser');

//注意：
//若post请求发送的参数是x-www-form-urlencoded的格式，则需要调用以下方法
app.use(bodyParser.urlencoded());
//若post请求发送的参数是json的格式，则需要调用以下方法
app.use(bodyParser.json())

//然后通过req.body获取post请求的参数
console.log(req.body)
```



注意：get请求和传统表单方式的提交都是不能传递json数据格式的



## :white_check_mark: （面）ajax返回的状态:

```js
let xhr=new XMLHttpRequest();
console.log(xhr.readyState);//0 － 未初始化，还未发送请求
xhr.open('get','http://localhost:3000/first');
consple.log(xhr.readyState);//1 － 正在发送请求
xhr.onreadystatechange=function(){
    // 2 － 载入完成/已经接收到全部响应内容
    // 3 － 正在解析响应内容
    // 4 － 解析完成，客户端可以使用数据了
}
xhr.send();
```



### **获取服务器响应的数据的两种方式：**

方式一：通过xhr.onload事件进行监听。



方法二：通过onreadstatechange事件监听ajax状态码的变化，如果为4则表明客户端已经成功接收了服务端的数据。

该种方法是为了兼容低版本的IE浏览器。



![image-20200913174915020](C:\Users\刘小康\AppData\Roaming\Typora\typora-user-images\image-20200913174915020.png)

### **Ajax的错误处理：**

```js
//服务器端设置响应状态码：
app.get('/error',(req,res)=>{
    res.status(400).send('not ok')
})
```



```js
//客户端获取服务器响应报文的http状态码：xhr.status

xhr.onload = function () {
    //场景1：服务器返回的状态码不是200，表示不是预期结果
    if (xhr.status != 200) {
        console.log("非预期结果");
    }
    //场景2：服务器返回404，表示请求路径有问题
    if (xhr.status == 404) {
        console.log("请求路径有问题");
    }
    //场景3：服务器返回500，表示服务器出错
    if (xhr.status == 500) {
        console.log("服务器错误");
    }
};
//场景4：网络中断时，会触发onerror事件
xhr.onerror = function () {
    console.log("网络出错");
};
```



### Ajax的封装：

实现目标：

```js
ajax({
    type: "post",
    url: "http://localhost:3000/first",
    data: {
        username: "zhangsan",
        age: 20,
    },
    header: {
        "Content-Type": "application/json",
        //   "Content-Type": "application/x-www-form-urlencoded",
    },
    success: function (data) {
        console.log(data);
    },
    error: function (data, xhr) {
        console.log("请求失败");
        console.log(data);
    },
});
```



具体实现：

```js
//步骤一：基本结构的搭建；
//步骤二：解决请求方式的不同以及请求参数格式的不同导致的问题；
//步骤三：http状态码的判断,分别处理成功的情况和失败的情况。
//步骤四：判断服务器响应的数据的格式是否是json字符串格式的，若是则需转换为json对象。
//步骤五：设置一些默认的选项，设置默认的请求方式为get,默认的请求参数的格式为x-www-form-urlencoded。

function ajax(options) {
    let defaults = {
        type: "get",
        url: "",
        data: {},
        header: {
            "Content-Type": "x-www-form-urlencoded",
        },
        success: function () {},
        error: function () {},
    };
    // 6.用optins里的属性覆盖defaults里的属性
    Object.assign(defaults, options);
    let params = "";
    let xhr = new XMLHttpRequest();

    // 1.先将传入的参数转换为字符串拼接的形式
    for (key in defaults.data) {
        params += `${key}=${defaults.data[key]}&`;
    }
    params = params.substr(0, params.length - 1);
    console.log(params);

    // 2.若是get请求，则url需要通过拼接再发送
    if (defaults.type == "get") {
        xhr.open(defaults.type, defaults.url + "?" + params);
        xhr.send();
    }

    // 3.若是post请求，还需判断Content-Type的类型，类型的不同将导致发送请求参数的方式不同
    if (defaults.type == "post") {
        xhr.open(defaults.type, defaults.url);
        let ContentType = defaults.header["Content-Type"];
        xhr.setRequestHeader("Content-Type", ContentType);
        if (ContentType == "application/json") {
            xhr.send(JSON.stringify(defaults.data));
        } else {
            xhr.send(params);
        }
    }

    xhr.onload = function () {
        let responseHeader = xhr.getResponseHeader("Content-Type");
        console.log(responseHeader);
        let responseText = xhr.responseText;
        if (responseHeader.includes("application/json")) {
            responseText = JSON.parse(responseText);
        }
        if (xhr.status == 200) {
            // 4.请求成功的处理：
            // 传递一个成功的回调函数进来，当接受到数据后，通过该回调函数返回至外部。
            defaults.success(responseText, xhr);
        } else {
            // 5.请求失败的处理：
            defaults.error(responseText, xhr);
        }
    };
}
```



### art-template在客户端的使用：

```html
//1.引入art-template：
<script src="https://cdn.staticfile.org/art-template/4.10.0/lib/template-web.min.js"></script>

//2.编写art-template模板
<script type="text/html" id="tep">
    <h1>{{name}}</h1>
	<h2>{{age}}</h2>
</script>

//3.将模板和数据拼接，返回值为拼接好的Html字符串
<script>
    let html = template("tep", { name: "liu", age: 21 });
    document.body.innerHTML = html;
    
    //4.向模板中开发外部变量,使得在模板中也能使用外部变量---实际应用：调用自定义函数转换时间格式
    function dataForm(date){
        ...
    }
    template.defaults.imports.dataFormat=dataForm;
</script>

```

利用art-template的循环语法实现数组的遍历显示：

```html
<script type="text/html" id="tep2">
	{{each arr}}
		<li>{{$value}}</li>
	{{/each}}
</script>
<script>
	let html=template('tep2',{arr:[11,22,33,44,55]})
    ....
</script>
```





### FormData对象的使用：

#### 作用1：简化提交表单的操作

模拟HTML表单,相当于将HTML表单映射成表单对象，自动将表单对象中的数据拼接成请求参数的格式。**省略了单独获取表单控件，再取值，再封装成对象的操作。**

客户端操作：

```js
let form = document.getElementById("form");
//   利用FormData构造函数创建一个表单对象
let formdata = new FormData(form);
...
shr.send(formdata);
//注意：FormData对象只能用于post请求，不能用于get请求。
```

服务器端的处理：

```js
//注意：服务器端的body-parser不能处理传递过来的formdata对象数据格式。
//需要使用第三方模块formidable    
let formidable=require('formidable');

//创建formidable表单解析对象
const form= new formidable.IncomingForm();
//解析客户端传递过来的formdata对象，其中第二个参数表示传递过来的参数，第三个参数表示传递过来的二进制文件信息。
form.parse(req,err.fields,files){
    res.send(fileds);
}
```



formdata对象的实例方法：用于操作表单对象中的数据。

```js
//获取,设置,删除表单属性的值
formdata.get('username');

formdata.set('username','liuxiaokang');//实际应用：为表单中输入的数字添加两位小数

formdata.delete('second-pwd');//实际应用：注册帐号时要求输入两次密码，发送请求时可以删除表单中后一次的密码。

formdata.append('username','liuxiaokang');//向表单追加属性
```



#### 作用2：异步上传二进制文件

二进制文件包括图片，视频，音频。

客户端：

```js
file.onchange = function () {
    let formdata = new FormData();
	//通过file输入框的files属性可以获取文件的信息
    formdata.append("file", file.files[0]);
    let xhr = new XMLHttpRequest();
    xhr.open("post", "http://localhost:3000/upload");
    xhr.send(formdata);
    xhr.onload = function () {
        if (xhr.status == 200) {
            console.log(xhr.responseText);
        }
    };
};
```

服务器端：

```js
// 创建表单解析对象
const form = new formidable.IncomingForm();
// 设置客户端上传文件的存储路径
form.uploadDir = path.join(__dirname, "public", "uploads");
// 保存上传文件的后缀名字
form.keepExtensions = true;
form.parse(req, (err, fields, files) => {
    res.send(files);
});
```



#### 文件上传进度的实现：

细节1：实现上传进度的效果。

细节2：上传完图片后即时展示。

客户端：

```js
file.onchange = function () {
    let formdata = new FormData();
    formdata.append("uploadFile", file.files[0]);
    let xhr = new XMLHttpRequest();
    xhr.open("post", "http://localhost:3000/upload");
    // upload对象中保存了跟上传文件相关的一些事件，在文件上传时会不断的触发onprogress事件
    xhr.upload.onprogress = function (ev) {
        console.log(ev);
        // ev事件对象中存储了上传文件的总大小ev.total，以及已经上传部分的大小ev.loaded
        insideBox.style.width = (ev.loaded / ev.total) * 100 + "%";
        insideBox.innerHTML = (ev.loaded / ev.total) * 100 + "%";
    };
    // 注意：onprogress监听事件必须放在send发送数据之前，否则监听不到数据的发送
    xhr.send(formdata);
    xhr.onload = function () {
        if (xhr.status == 200) {
            // console.log(xhr.responseText);
            let result = JSON.parse(xhr.responseText);
            // 返回的路径为服务器的绝对路径，实际需要的是从public后面的内容
            let path = result.path.split("public")[1];
            let img = document.createElement("img");
            img.src = path;
            // 当图片加载完后再插入到dom中
            img.onload = function () {
                picture.appendChild(img);
            };
        }
    };
};
```

服务器：

```js
app.post("/upload", (req, res) => {
    // 创建表单解析对象
    const form = new formidable.IncomingForm();
    // 设置客户端上传文件的存储路径
    form.uploadDir = path.join(__dirname, "public", "uploads");
    // 保存上传文件的后缀名字
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        // res.send(files);
        // files中保存了所有上传过来的文件信息，每一个文件信息都是files对象中的一个对象属性，该对象属性的属性名即为前端设置的表单元素名。
        res.send({ path: files.uploadFile.path });
    });
});
```





如果在使用Ajax进行跨域请求时携带cookie：

背景：考虑到安全性，在使用Ajax进行跨域访问的时候，请求中不会携带cookie

实现：

1.客户端：将xhr.withCredentials属性设置为true,表示跨域请求时也要携带cookie

2.服务器：设置响应头字段Access-Control-Allow-Credentials为true，表示允许客户端跨域请求时携带cookie





## 如何实现Ajax请求：

```js
//1.创建一个XMLHttpRequest对象
var xhr=new XMLHttpRequest();
//2.设置请求地址和请求方式
xhr.open('get','http://localhost:3000/first');
//3.如果发送的是post请求，还需要设置请求参数的格式
xhr.setRequestHeader("Content-Type","application/json");
//4.设置发送内容并发送该请求
xhr.send(JSON.stringfiy({name:'liu'}));
//5.监听Ajax的请求状态
xhr.onreadystatechange=function(){
    //5.1 判断ajax的请求状态，为4则表明客户端已经拿到并解析出了结果
	if(xhr.readyState=4){
        //5.2 判断响应报文的状态，如果是200,则表明本次请求是成功的
        if(xhr.status==200){
            //6.拿到服务器返回的数据
            var data=xhr.responseText;
        }
    }
}
```



## ajax返回的状态:

```js
let xhr=new XMLHttpRequest();
console.log(xhr.readyState);//0 － 未初始化，还未发送请求
xhr.open('get','http://localhost:3000/first');
consple.log(xhr.readyState);//1 － 正在发送请求
xhr.onreadystatechange=function(){
    // 2 － 载入完成/已经接收到全部响应内容
    // 3 － 正在解析响应内容
    // 4 － 解析完成，客户端可以使用数据了
}
xhr.send();
```



## 如果我想发出两个有顺序的ajax需要怎么做？(原生JS的ajax)

原生js的话可以使用回调函数，在拿到第一个ajax请求后，执行回调函数，并将结果传入该回调函数。然后由

该回调函数执行下一个ajax请求。

除此之外还可以使用promise来封装ajax请求，返回一个promise对象。





## 发送Ajax请求时禁止浏览器的缓存功能：

4种方法：

1. 设置请求头：`xhr.setRequestHeader('If-Modified-since','0')`

2. 设置请求头：`xhr.setRequestHeader('Cache-Control','no-cache')`
3. 在请求路径最后添加一个随机数参数，保证每次请求的路径都不同。`"fresh="+Math.random()`
4. 与方法3类似，添加一个时间参数。`currentTime=Date.now()`



## websocket和ajax的区别是什么:

### [什么是websocket](https://segmentfault.com/a/1190000011450538)：

#### websocket诞生的背景：

HTTP协议是单向的，通信只能由客户端发起，服务器无法主动向客户端发送消息。



#### 在websoket之前服务器推送消息的两种方式：

**轮询：**

- 浏览器隔个几秒就发送一次请求，询问服务器是否有新信息。
- 缺点：浏览器发送请求过于频繁，需要服务器有很快的处理速度和资源。

**长连接方式：**

- 客户端发起连接后，如果没消息，就一直不返回数据给客户端。直到有消息才返回，返回完之后，客户端再次建立连接，周而复始。
- 缺点：需要一直保持连接，需要有很高的并发。



#### websoket的概念：

websocket是HTML5提供的一个支持全双工通信的新协议，支持客户端和服务器端的长连接，**服务端可以向客户端主动发送信息**。

websokit协议的标识符为ws，加密的为wss   ws://example.com:80/some/path



#### WebSocket的应用：

聊天室（用户在发出聊天信息后服务器立马将数据推送到所有的用户的聊天室里）



### websocket和ajax的区别是什么：

1.本质不同

 Ajax是一种异步请求方式；

 WebSocket是HTML5的一种新协议，实现了浏览器与服务器全双工通信。

2.生命周期不同。

websocket建立的是长连接，在一个会话中一直保持连接；而ajax是短连接，数据发送和接受完成后就会断开连接。

3.适用范围不同

websocket一般用于前后端**实时数据**交互，而ajax前后端非实时数据交互。

4.发起人不同

Ajax技术需要客户端发起请求，而WebSocket服务器和客户端可以相互推送信息。

5.跨域方面

Ajax请求存在跨域的问题，而websoket支持跨域请求



##  传统的web请求方式,Ajax,axios,fetch,superagent的比较？



**传统的web请求方式：**

利用表单进行提交，每次提交的时候页面都会被强制刷新一下。



**Ajax:** 

异步网络请求，页面可以无刷新的请求数据。

优点：相比于传统的web请求方式，提升了用户体验

缺点：书写麻烦，暴露了与服务器交互的细节



**axios:** 

axios基于Promise对原生的XHR进行了非常全面的封装，使用方式也非常的优雅。同时支持浏览器和node环境。是网络请求的首选方案。

优点：同时支持浏览器和node环境，可以拦截未执行的请求或响应。

缺点：用起来比较麻烦？？？



**fetch:**

Fetch 是浏览器自带的用于发送请求的 API，旨在替代 XMLHttpRequest。

使用fetch，你不需要再额外加载一个外部资源。但它还没有被浏览器完全支持，所以你仍然需要一个polyfill。



优点：使用 Promise 避免回调地狱，相比原生的ajax，也比较好写。

缺点：不支持服务器使用



**superagent:**

superagent是一个http客户端请求代理模块，使用在NodeJS环境中。

优点：有一个插件生态，通过构建插件可以实现更多功能

缺点：api不符合规范






