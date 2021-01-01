var ul=document.getElementsByClassName('list-group')[0];
var price = 0;
for(var i=1;i<ul.childNodes.length-2;i+=2){
    price+=parseInt(ul.childNodes[i].childNodes[3].innerText.split('$')[1]);
}
ul.childNodes[ul.childNodes.length-2].childNodes[3].innerText='$'+price;

swal({
        title: "Attention",
        text: "Do you accept that location information is obtained?",
        icon: "info",
        buttons: true,
    }).then((value)=>{
        if(value){
            document.getElementById('address').setAttribute('placeholder','Please wait one minute, location information is being loaded....');
            AMap.plugin('AMap.Geolocation', function() {
            var geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: true,
            // 设置定位超时时间，默认：无穷大
            timeout: 10000
          })
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', onComplete)
          AMap.event.addListener(geolocation, 'error', onError)

          function onComplete (data) {
            // data是具体的定位信息
              document.getElementById('address').value=data.formattedAddress;
          }

          function onError (data) {
            // 定位出错
              console.log(data);
          }
        })
        }else{
            document.getElementById('address').setAttribute('placeholder','Please enter your geographic location.');
        }
    })

document.getElementById('paypal').onclick = function(){
    this.parentNode.parentNode.nextSibling.nextSibling.setAttribute("style","display:none");
}
document.getElementById('credit').onclick = function(){
    this.parentNode.parentNode.nextSibling.nextSibling.removeAttribute("style");
}
document.getElementById('debit').onclick = function(){
    this.parentNode.parentNode.nextSibling.nextSibling.removeAttribute("style");
}


document.getElementById('submit').onclick = function (){
    var first_name = document.getElementById('firstName').value;
    var last_name = document.getElementById('lastName').value;
    var username = document.getElementById('username').value;
    var address = document.getElementById('address').value;
    var email = document.getElementById('email').value;
    var testemail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if(first_name === ''){
        swal({
            title: "Attention!",
            text: "You input for first name is illegal!",
            icon: "warning",
            timer: 3000,
            button: false
            })
            return;
    }
    if(first_name.toString().length>20){
        swal({
            title: "Attention!",
            text: "You input for first name is too long so we only save the first 20 character!",
            icon: "info",
            timer: 3000,
            button: false
            })
        first_name=first_name.toString().substr(0,19);
    }
    if(last_name === ''){
        swal({
            title: "Attention!",
            text: "You input for last name is illegal!",
            icon: "warning",
            timer: 3000,
            button: false
            })
        return;
    }
    if(last_name.toString().length > 20){
        swal({
            title: "Attention!",
            text: "You input for last name is too long so we only save the first 20 character!",
            icon: "info",
            timer: 3000,
            button: false
            })
        last_name=last_name.toString().substr(0,19);
    }
    if(username === ''){
        swal({
            title: "Attention!",
            text: "You input for username is illegal!",
            icon: "warning",
            timer: 3000,
            button: false
            })
        return;
    }
    if(username.toString().length > 20){
        swal({
            title: "Attention!",
            text: "You input for username is too long so we only save the first 20 character!",
            icon: "info",
            timer: 3000,
            button: false
            })
        username=username.toString().substr(0,19);
    }
    if(email === ''  || testemail.test(email) === false){
        swal({
            title: "Attention!",
            text: "You input for email is illegal!",
            icon: "warning",
            timer: 3000,
            button: false
            })
        return;
    }
    if(email.toString().length>49){
        swal({
            title: "Attention!",
            text: "You input for email is too long, please change a new email!",
            icon: "warning",
            timer: 3000,
            button: false
            })
        return;
    }
    if(address === ''){
        swal({
            title: "Attention!",
            text: "Address can't be empty!",
            icon: "warning",
            timer: 3000,
            button: false
            })
        return;
    }
    var temp = document.getElementsByClassName('list-group')[0];
    var total = temp.childNodes[temp.childNodes.length-2].childNodes[3].innerText.split('$')[1];
    var payment;
    let ele = document.getElementsByName('paymentMethod');
    for(var i=0;i<ele.length;i++){
        if(ele[i].checked){
            payment = ele[i].value;
        }
    }
    var arr = document.getElementsByClassName('lh-condensed');
    console.log(arr.length);
    var p = new Array();
    for(var i = 0;i<arr.length;i++){
            p.push(parseInt(arr[i].id));
        }
    var data;
    if(payment === 'credit' || payment === 'debit'){
        var card_name = document.getElementById('cc-name').value;
        var card_num = document.getElementById('cc-number').value;
        var testcardname = /^[A-Za-z0-9]+$/;
        var testcardnum = /^[0-9]*$/
        if(card_name === '' || testcardname.test(card_name)===false){
            swal({
            title: "Attention!",
            text: "You input Card name is illegal!",
            icon: "warning",
            timer: 3000,
            button: false
            })
            return;
        }
        if(card_num === '' || testcardnum.test(card_num)===false){
            swal({
            title: "Attention!",
            text: "You input Card number is illegal!",
            icon: "warning",
            timer: 3000,
            button: false
            })
            return;
        }
        data={
        'firstname':first_name,
        'lastname':last_name,
        'username':username,
        'address':address,
        'payment':payment,
        'total' : parseInt(total),
        'card_name':card_name,
        'card_num' : card_num,
        'email':email,
         'array':p
    }
    }else{
        data={
        'firstname':first_name,
        'lastname':last_name,
        'username':username,
        'address':address,
        'payment':payment,
        'total' : parseInt(total),
        'email' : email,
        'array' : p
    }
    }
    $.ajax({

                url:`http://127.0.0.1:5000/checkout/`,
                type: 'POST',

                dataType: 'json',

                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                contentType: 'application/json; charset=utf-8',

                data: JSON.stringify(data),

                success: function(data) {
                    data['data']='success';
                    console.log(data['arr']);
                    var list=[]
                    for(var i=0;i<data['arr'].length;i++){
                        list.push(parseInt(data['arr'][i]));
                    }
                    window.location.replace(`http://127.0.0.1:5000/invoice/${data['id']}/${list}`)
                },
                error: function(data) {
                    console.log(data);
                }
            });
}

