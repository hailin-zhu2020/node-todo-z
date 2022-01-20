//该文件用于测试文件的读写操作,一般命名为db.spec.js或者db.unit.js
//该测试是单元测试，属于白盒测试，即知道代码怎么写，一般是程序员自己测


const db = require('../db.js');//引入要测试的文件
const fs = require('fs')//导入真fs
jest.mock('fs')//mock之后，变成假fs


describe('db', ()=>{//describe用于描述一个测试任务，name是测什么文件，fn是怎么测
    afterEach(()=>{
        fs.clearMocks();//每完成一个it,清除一下MOCK
    })
    //测试读
    it('can read',  async ()=>{//name是测什么功能，fn是测试该功能是否正常
        const data = [{title:'hi',done:true}];//造假数据
        fs.setReadFileMock('/xxx',null,JSON.stringify(data)) //传假数据
        const list = await db.read('/xxx') //测试,获得测试的结果
        expect(list).toStrictEqual(data);//toStrictEqual测两个对象的内容相等，expect 比较实际结果和预期结果是否相同
    })
    //测试写
    it('can write', async ()=>{
        let fakeFile=''//存数据的变量
        fs.setWriteFileMock('/yyy',(path,data,callback)=>{
            fakeFile=data //将写到文件的数据读出来存到变量中
            callback(null);
        })
        const list = [{title:'见小明',done:true},{title:'见小花',done:true}] //测试数据
        await db.write(list,'/yyy');//测试
        expect(fakeFile).toBe(JSON.stringify(list)+'\n');
    })

})


