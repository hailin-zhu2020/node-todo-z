/*该文件用于定义指令对应的函数*/


//引入具体的代码文件
const db = require('./db.js')

//引入inquirer库，用于在控制台显示好看的列表
const inquirer = require('inquirer');


//添加任务
//面向接口编程
module.exports.add= async (title)=>{
    //读取之前的任务到内存中
    const list = await db.read() ;//获取异步操作成功的结果
    //往内存中的任务末尾添加一个任务
    list.push({title,done:false});
    //将内存中的数据存入文件中
    await db.write(list);
}

//清除所有的任务
//所有的文件操作都是异步的
module.exports.clear = async ()=>{
    //用空数据替换文件中的原数据
    await db.write([]);
}

//设置标记成功
function markAsDone(list,index){
    list[index].done=true;
    void db.write(list);
}

//设置标记失败
function markAsUndone(list,index){
    list[index].done=false;
    void db.write(list);
}

//更新标题
function updateTitle(list,index){
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: "新的标题",
        default:list[index].title,//默认为旧的标题
    }).then((answer) => {
        console.log(answer.title)
        list[index].title=answer.title;
        void db.write(list);
    });
}

//删除任务
function remove(list,index){
    list.splice(index,1);
    void db.write(list);
}

//询问操作
function askForAction(list,index){
    //条件判断的代码可以考虑表驱动编程重构
    const actions = {
        markAsDone,
        markAsUndone,
        remove,
        updateTitle,
    }//键值同名，可缩写成同一个
    inquirer
        .prompt({
            type:'list',
            name:'action',
            message:'请选择操作',
            choices:[
                {name:'退出',value:'quit'},
                {name:'已完成',value:'markAsDone'},
                {name:'未完成',value:'markAsUndone'},
                {name:'删除',value:'remove'},
                {name:'改标题',value:'updateTitle'},
            ]
        })
        .then((answer)=>{
            const action = actions[answer.action];
            action && action(list,index);//函数存在，函数才执行
        })
}

//询问创建一个任务
function askForCreateTask(list){
    //创建一个新的任务
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: "输入任务标题",
    }).then((answer) => {
        list.push({title:answer.title,done:false});
        void db.write(list);
    });
}

//打印数据到控制台
function printTasks(list){
    inquirer
        .prompt({
            type: 'list',
            name: 'index', //选中项的值
            message: '请选择你想操作的任务',
            choices: [{name:'退出',value:'-1'},...list.map((task, index)=>{
                //记得添加一个退出的选项，value的值是字符串才正确
                return {name:`${task.done ? '[x]': '[-]'} ${index + 1} - ${task.title}`,value:index.toString()}//反引号可定义多行字符串以及在字符串中嵌入变量
            }),{name:"+ 创建任务" , value:"-2"}]

        })
        .then((answer) => { //answer是所有选中的一个任务,then是Promise的then方法
            const index = parseInt(answer.index);//answer.index是选中的任务的值，转成Int型便于判断
            if(index>=0){
                //对选中的任务进行操作
                askForAction(list,index);
            }else if(index===-2){
                //创建新的任务
                askForCreateTask(list);
            }
        });
}
//展示所有数据
module.exports.showAll = async ()=>{
    //读取文件中的所有数据到内存
    let list = await db.read();
    //打印内存中的数据到控制台
    printTasks(list)
}