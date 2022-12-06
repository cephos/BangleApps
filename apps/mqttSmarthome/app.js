var Layout = require("Layout");

var menu={
  tab1:{label:"D",title:"Dach",buttons:[
    {label:"fan",type:"toggle",onCommand:"fanOn",offCommand:"fanOff"},
    {label:"light",type:"toggle",onCommand:"dachOn",offCommand:"dachOff"},
    {label:"blue",type:"toggle",onCommand:"dBlue",offCommand:"dWhite"},
    {label:"lalelu",type:"toggle",onCommand:"dlale",offCommand:"pause"},
  ]},
  tab2:{label:"2",title:"2.OG",buttons:[
    {label:"kind",type:"toggle",onCommand:"kOn",offCommand:"kOff"},
    {label:"schlZ",type:"toggle",onCommand:"szOn",offCommand:"szOff",longCommand:"szWhite"},
    {label:"blue",type:"toggle",onCommand:"dBlue",offCommand:"dWhite"},
    {label:"lalelu",type:"toggle",onCommand:"dlale",offCommand:"dpause"},
  ]},
  tab3:{label:"M",title:"Musik",buttons:[
    {label:"FM1",type:"toggle",onCommand:"pFM1",offCommand:"pause"},
    {label:"Kind",type:"toggle",onCommand:"pKind",offCommand:"pause"},
    {label:"blue",type:"toggle",onCommand:"dBlue",offCommand:"dWhite"},
    {label:"lalelu",type:"toggle",onCommand:"dlale",offCommand:"dpause"},
  ]}
};

var buttons = [];
var firstTabKey;
var layout;

Object.keys(menu).forEach(key => {
  if(firstTabKey===undefined){
    firstTabKey=key;
  }
  var button = {};
  button.label=menu[key].label;
  button.cb=function(){loadTab(key);};
  buttons.push(button);
});

function loadTab(key){
  var layoutContent={};
  layoutContent.type="v";
  layoutContent.c=[];
  layoutContent.c.push({type:"txt", font:"6x8:2", label: menu[key].title, id:"label" });
  var innerContent={type:"h", c:[]};
  layoutContent.c.push(innerContent);
  var innerCol1={type:"v", fillx:2, c:[]};
  var innerCol2={type:"v", fillx:2, c:[]};
  innerContent.c.push(innerCol1);
  innerContent.c.push(innerCol2);
  
  var c1=0;
  var numberOfRows=Math.floor(menu[key].buttons.length/2);
  menu[key].buttons.forEach(btn => {
    var buttonContent;
    var btnid="b"+c1;
    if(btn.type=="toggle"){
       buttonContent={type:"btn", filly:numberOfRows, font:"6x8:2", pad:3, label:btn.label, id:btnid, cb: l=>toggleButton(btn.onCommand,btn.offCommand,btnid) };
    }else{
       buttonContent={type:"btn", filly:numberOfRows, font:"6x8:2", pad:3, label:btn.label, id:btnid, cb: l=>command(btn.command) };
    }
    //buttonContent=JSON.parse(JSON.stringify(buttonContent));
    if(c1<numberOfRows){
       innerCol1.c.push(buttonContent);
    }else{
       innerCol2.c.push(buttonContent);
    }
    c1++;
  });
  print(JSON.stringify(layoutContent));
  Bangle.loadWidgets();
  layout=new Layout( layoutContent, {btns:buttons, lazy:false});
  g.clear();
  layout.render();
}

function toggleButton(onCommand,offCommand,id){
  print(JSON.stringify(layout));
  print("id ="+id);
  if(layout[id].bgCol=='#f00'){
    command(offCommand);
  }else{
    command(onCommand);
  }
  layout.render();
}

function command(com){
  Bluetooth.println(JSON.stringify({t:"mqtt",qos:0, topic:"bangles/1/cmd", data:com}));
}

loadTab(firstTabKey);