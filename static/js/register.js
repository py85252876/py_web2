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

document.getElementsByClassName('sign_button')[0].onclick=function (){
    var username = document.getElementById('username').value;
    var email = document.getElementById('emailaddress').value;
    var password = document.getElementById('password').value;
    var check = document.getElementById('checkbox-signup').checked;
    var testemail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
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
    if(password.toString().length>23 || password.toString().length<1){
        swal({
        title: "Attention!",
        text: "You input format for password is illegal!",
        icon: "warning",
        timer: 3000,
        button: false
        })
        return;
    }
    if(check === false){
        swal({
        title: "Attention!",
        text: "You didn't check the confirmation box!",
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
            var data={
                "username": username,
                "password": password,
                "email" : email
            }
            $.ajax({

                url:`http://127.0.0.1:5000/register/`,
                type: 'POST',

                dataType: 'json',

                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                contentType: 'application/json; charset=utf-8',

                data: JSON.stringify(data),

                success: function(e) {
                    if(e['data']==="Fail"){
                        swal({
                            title: "Warning!",
                            text: "You register Failed. Plaese try again!",
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