'use strict';



//在用户选择提交信息后，对于提交的信息依次判断是否合法
let button = document.getElementsByClassName("submit_button");
button[0].onclick=function(){
    var username = document.getElementById('username').value;
    var email = document.getElementById('emailaddress').value;
    var password = document.getElementById('password').value;
    console.log(password);
    var testemail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if(testemail.test(email) === false || email.toString().length>39){
        swal({
        title: "Attention!",
        text: "You input format for email is illegal!",
        icon: "warning",
        timer: 3000,
        button: false
        })
        return;
    }
    if(username.toString().length>23 || username.toString().length<1){
        swal({
        title: "Attention!",
        text: "You input format for username is illegal!",
        icon: "warning",
        timer: 3000,
        button: false
        })
        return;
    }
    if(password.toString().length>23 || password.toString().length<1){
        swal({
        title: "Attention!",
        text: "You input format for username is illegal!",
        icon: "warning",
        timer: 3000,
        button: false
        })
        return;
    }
    swal({
        title: "Attention",
        text: "You cookie will be saved!",
        icon: "info",
        buttons: true,
    }).then((value)=>{
        if(value){
            console.log(username);
            console.log(password);
            console.log(email);
            var data1={
                "username": username,
                "password": password,
                "email" : email
            }
            $.ajax({

                url:`http://127.0.0.1:5000/login/`,
                type: 'POST',

                dataType: 'json',

                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                contentType: 'application/json; charset=utf-8',

                data: JSON.stringify(data1),

                success: function(e) {
                    if(e['data']==="fail"){
                        swal({
                            title: "Warning!",
                            text: "You input is not correct. Plaese try again!",
                            icon: "warning",
                            timer: 3000,
                            button: false
                            })
                        return;
                    }
                    window.location.replace("http://127.0.0.1:5000/show_item/");
                },
                error: function(e) {
                    console.log(e);
                }
            });
        }
    })
}

//用来对于用户输入用户名的确认
document.getElementById('username').onkeypress=function (){
    if (this.value.toString().length > 23){
        swal({
        title: "Sorry",
        text: "You have already input more than 24 chars, extra characters will be ignored!",
        icon: "info",
        timer: 3000,
        button: false
        })
    }
}

//对于用户在email处的输出超出范围进行提示
document.getElementById('emailaddress').onkeypress=function (){
    if (this.value.toString().length > 39){
        swal({
        title: "Sorry",
        text: "You have already input more than 40 chars, extra characters will be ignored",
        icon: "info",
        timer: 3000,
        button: false
        })
    }
}


//实时验证用户的密码是否符合要求
document.getElementById('password').onkeypress=function (){
    if (this.value.toString().length > 23){
        swal({
        title: "Sorry",
        text: "You have already input more than 24 chars, extra characters will be ignored",
        icon: "info",
        timer: 3000,
        button: false
        })
    }
}

document.getElementById('forget_password').onclick=function(){
    window.location.replace(`http://127.0.0.1:5000/forget_password`);
}

