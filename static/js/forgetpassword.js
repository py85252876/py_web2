document.getElementById('submit').onclick=function (){
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var re_email = document.getElementById('receive_email').value;
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
    if(testemail.test(re_email) === false){
        swal({
        title: "Attention!",
        text: "You input format for receive email is illegal!",
        icon: "warning",
        timer: 3000,
        button: false
        })
        return;
    }
    var data={
        'username':username,
        'email':email,
        're_email':re_email
    }
    $.ajax({

                url:`http://127.0.0.1:5000/forget_password/`,
                type: 'POST',

                dataType: 'json',

                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                contentType: 'application/json; charset=utf-8',

                data: JSON.stringify(data),

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
                    }else{
                        swal({
                            title: "Success!",
                            text: "You new password had been send to your receive email",
                            icon: "success",
                            timer: 3000,
                            button: false
                            })
                    }
                    setTimeout(function(){ window.location.replace(`http://127.0.0.1:5000/login/`) }, 3000);
                },
                error: function(e) {
                    console.log(e);
                }
            });
}