document.getElementById('submit').onclick=function (){
    var email = document.getElementById('email').value;
    var username = document.getElementById('username').value;
    var oldpassword = document.getElementById('old_password').value;
    var newpassword = document.getElementById('new_password').value;
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
    if(oldpassword.toString().length>23 || oldpassword.toString().length<1){
        swal({
        title: "Attention!",
        text: "You input format for oldpassword is illegal!",
        icon: "warning",
        timer: 3000,
        button: false
        })
        return;
    }
    if(newpassword.toString().length>23 || newpassword.toString().length<1){
        console.log(123);
        swal({
        title: "Attention!",
        text: "You input format for newpassword is illegal!",
        icon: "warning",
        timer: 3000,
        button: false
        })
        return;
    }
    swal({
        title: "Attention",
        text: "You password will changed!",
        icon: "info",
        buttons: true,
    }).then((value)=>{
        if(value){
            var data={
                'username': username,
                'newpassword': newpassword,
                'email' : email,
                'oldpassword' : oldpassword
            }
            $.ajax({

                url:`http://127.0.0.1:5000/changepassword/`,
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
                            text: "You Failed to change your password.Plaese try again!",
                            icon: "warning",
                            timer: 3000,
                            button: false
                            })
                        return;
                    }else{
                        swal({
                            title: "Success!",
                            text: "You have already change your password!",
                            icon: "success",
                            timer: 3000,
                            button: false
                            })
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            });
        }
    })
}