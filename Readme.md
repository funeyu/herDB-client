## herDB的nodejs客户端
## 使用范例：
``` javascript
var cl = new Client('127.0.0.1', 8888);
var authed = cl.init().then(function(cl) {
  return cl.auth('funer');
})

authed.then(function(cli) {
  cli.put('e', 'javadfasfaf');
});

authed.then(function(cli) {
  cli.get('e').then(function(data) {
    console.log('data');
    console.log(data);
  })
});
authed.then(function(cli) {
  cli.stopServer();
});
```
