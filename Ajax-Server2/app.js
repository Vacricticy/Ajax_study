const express = require("express");

const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // 1.设置允许访问的客户端
  res.header("Access-Control-Allow-Origin", "*");
  // 2.设置允许客户端发送的请求方式
  res.header("Access-Control-Allow-Methods", "get,post");
  next();
});
app.listen(3001);

app.get("/test", (req, res) => {
  res.send("ok");
});

app.get("/jsonpBasic", (req, res) => {
  res.send('fn({name:"zhangsan",age:20})');
});
app.get("/jsonp", (req, res) => {
  //1.由于script标签的原理是一加载就会执行里面的代码，故服务器端响应的数据只能是一个函数，这样客户端才能拿到想要的数据。
  //2.注意：通过script标签发送的请求都是get请求。
  // let functionName = req.query.callback;
  // // let data = 'fn({username:"zhangsan",age:20})';
  // let data = `${functionName}({username:"zhangsan",age:20})`;
  // res.send(data);

  // 3.使用res.jsonp({})可以代替所有的步骤
  res.jsonp({ username: "zhangsan", age: 20 });
});

app.get("/cors", (req, res) => {
  // // 1.设置允许访问的客户端
  // res.header("Access-Control-Allow-Origin", "*");
  // // 2.设置允许客户端发送的请求方式
  // res.header("Access-Control-Allow-Methods", "get,post");
  res.send({ name: "zhangsan" });
});

app.get("/server", (req, res) => {
  res.send("ok");
});

app.get("/iframe", (req, res) => {
  res.send("ok");
});
console.log("server 3001 is running");
