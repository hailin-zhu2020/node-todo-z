#!/usr/bin/env node
//声明program全局变量
const  program = require('commander');

//导入指令对应的函数
const api = require('./index.js')
//导入package.json文件
const pkg = require('./package.json');
const {version} = require("commander");

// 定义选项，选项就是指令，同一个选项可有多个短选项和一个长选项，短选项和长选项之间用、空格或者|分隔
program
    .version(pkg.version) //可用--version读取版本号
    .option('-x, --xxx', 'what the x')

//定义子命令
//新增子命令
program
    .command('add')
    .description('add a task')
    .action((...args) => {
        let words = args.slice(0,args.length-1).join(' '); //最后一个参数是commander对象，要去掉;join是为了将一个数组变成一个有分隔符的字符串
        api.add(words).then(()=>{console.log("添加成功")},()=>{console.log('添加失败')});
    });

//清空子命令
program
    .command('clear')
    .description('clear all tasks')
    .action(() => {
        api.clear().then(()=>{console.log("清除成功")},()=>{console.log("清除失败")});
    });

//process.argv是进程的参数,program.parse对进程的参数进行处理
program.parse(process.argv);

//展示所有的数据
if(process.argv.length===2){
    //用户直接运行node cli.js时展示所有数据
    void api.showAll(); //有了void,就不用处理then函数
}

