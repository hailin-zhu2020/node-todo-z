//该文件是模拟fs的文件

const fs = jest.genMockFromModule('fs'); //假fs
const _fs = jest.requireActual('fs');//真fs
Object.assign(fs,_fs);//假fs复制真fs的所有属性

let readMocks={}


//定义一个组装读文件操作的数据的函数
fs.setReadFileMock = (path, error, data)=>{
   readMocks[path]=[error,data];
}

//区分mock数据和真实数据
fs.readFile=(path,options,callback)=>{
    if(callback === undefined) {
        callback = options; //fs.readFile(path,callback)
    }
    if(path in readMocks){
        callback(...readMocks[path]);//模拟过的路径,
    }else{
        _fs.readFile(path,options,callback);//没有mock过的路径用真fs来读
    }
}

//写
let writeMocks={};

fs.setWriteFileMock = (path,fn)=>{
    writeMocks[path]=fn
}
fs.writeFile=(path,data,options,callback)=>{
    if(path in writeMocks){
        writeMocks[path](path,data,options,callback);
    }else{
        _fs.writeFile(path,data,options,callback)
    }
}

//清楚所有的Mocks
fs.clearMocks=()=>{
    readMocks={},
    writeMocks={}
}

//导出模拟文件
module.exports = fs;