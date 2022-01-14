//这个文件用于定义数据库的读写操作

//引入home目录
const homedir = require('os').homedir(); //有下划线是因为require是nodejs的内容，目前WebStorm不能识别nodejs的内容
//优先使用home变量
const home = process.env.HOME||homedir;

//path.join 拼路径，这个函数会自动考虑不同系统的路径字符串的差异性
const p = require('path');
const dbPath = p.join(home,'.todo');

//引入fs文件模块
const fs = require('fs');

//定义方法对象
const db = {
    read(path=dbPath){ //默认dbPath
        return new Promise((resolve,reject)=>{ //异步变同步，异步操作做完了才返回结果，从里面往上面抛结果
            fs.readFile(path,{flag:'a+'},(error,data)=>{
                //'a+'是文件存在就只读，不存在就创建
                if(error) return reject(error)//如果异步操作出错，就将错误信息返回出去并且退出
                let list;
                try{
                    //没有toString()就是Buffer二进制数据
                    list = JSON.parse(data.toString()) //JSON.parse用于将JSON字符串变成对象
                }catch(error2){
                    list=[]; //如果data为空，就变成空数组
                }
                resolve(list)//如果异步操作成功，将成功的结果返回去
            })
        })

    },
    write(list,path=dbPath){
        const string = JSON.stringify(list);//JSON.stringify将JSON对象转换成JSON字符串,因为文件中只能存字符串
        return new Promise((resolve,reject)=>{ //写操作也是异步操作，异步操作都要用回调函数或者是Promise封装
            fs.writeFile(path,string+'\n',(error)=>{
                //加个'\n',在控制台会换行
                if(error) return  reject(error)//有错就退出
                resolve() //成功了什么都不做
            })
        })

    }
}


//导出db对象
module.exports=db;