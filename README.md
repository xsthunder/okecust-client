# 就叫课堂
就叫课堂客户端代码库
## 开发环境
1. 使用[Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)直接打开index.html
或者使用别的办法,特别注意缓存
2. 装函数库
`npm install`
3. 本地开服务器
`npm start`
## 开发注意
1. 导入.min版本的js和css
2. 绝对不要在服务器上写代码
3. 绝对不要把库放到node_modules,node_modules里只能用npm装,如果不能用npm装，就放到src里
4. 绝对不要写全局css
## TODO
- 删除多余分支，dev分支用于开发，master分支是dev分支检查无误的分支，不要超过3个分支
- 把不明所以的oldchrome分支改成master分支
- Debug,看下库装的有没有问题
