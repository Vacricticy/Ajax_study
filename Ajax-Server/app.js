const express = require("express");
// 路径处理模块
const path = require("path");

// 用语言解析客户端传递的参数
const bodyParser = require("body-parser");
const formidable = require("formidable");

// 用于实现服务器向另一台服务器发送请求
const superagent = require("superagent");

// 创建web服务器
const app = express();
// 开启静态资源访问服务功能？？？？
app.use(express.static(path.join(__dirname, "public")));

// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// 添加一个路由，供浏览器发送对应的请求
app.get("/first", (req, res) => {
  //   res.send("hello this is the first data");
  // res.send({ name: "liuxiaokang" });
  console.log(typeof req.query);
  res.send(req.query);
  // res.send("hahaha");
});
app.post("/first", (req, res) => {
  console.log(typeof req.body);
  // res.send(req.body);
  res.status(404).send(req.body);
  // res.send({ name: "liuxiaokang", age: 21 });
});
app.post("/json", (req, res) => {
  res.send(req.body);
});
app.get("/error", (req, res) => {
  console.log(aaa);
  res.status(400).send("not not ok");
});
app.post("/formdata", (req, res) => {
  const form = new formidable.IncomingForm();
  console.log(form);
  form.parse(req, (err, fields, files) => {
    res.send(fields);
  });
});
app.post("/upload", (req, res) => {
  // 创建表单解析对象
  const form = new formidable.IncomingForm();
  // 设置客户端上传文件的存储路径
  form.uploadDir = path.join(__dirname, "public", "uploads");
  // 保存上传文件的后缀名字
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    // res.send(files);
    // files中保存了所有上传过来的文件信息，每一个文件信息是以对象的形式保存的，键名即为前端设置的表单元素名。
    res.send({ path: files.uploadFile.path });
  });
});

app.get("/server", (req, res) => {
  superagent.get("http://localhost:3001/server").end((err, result) => {
    console.log(result);
    console.log(typeof result);
    console.log(typeof result.text);
    // 响应的内容保存在text属性中
    res.send(JSON.stringify(result.text));
  });
});

app.get("/student/:id", (req, res) => {
  let id = req.params.id;
  res.send(`这是第${id}个学生的信息`);
});
// 监听端口
app.listen(3000);
console.log("服务器启动成功," + "http://localhost:3000");
