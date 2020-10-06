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
  // 用optins里的属性覆盖defaults里的属性
  Object.assign(defaults, options);
  let params = "";
  let xhr = new XMLHttpRequest();

  // 先将传入的参数转换为字符串拼接的形式
  for (key in defaults.data) {
    params += `${key}=${defaults.data[key]}&`;
  }
  params = params.substr(0, params.length - 1);
  console.log(params);

  // 若是get请求，则url需要通过拼接再发送
  if (defaults.type == "get") {
    xhr.open(defaults.type, defaults.url + "?" + params);
    xhr.send();
  }

  // 若是post请求，还需判断Content-Type的类型，类型的不同将导致发送请求参数的方式不同
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
      // 请求成功的处理：
      // 传递一个成功的回调函数进来，当接受到数据后，通过该回调函数返回至外部。
      defaults.success(responseText, xhr);
    } else {
      // 请求失败的处理：
      defaults.error(responseText, xhr);
    }
  };
}
