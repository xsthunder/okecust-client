var express =require('express');
var app=express();
app.use('/',express.static(__dirname));
app.use('/acm',express.static('/home/ubuntu/acm'));
app.listen(80);
