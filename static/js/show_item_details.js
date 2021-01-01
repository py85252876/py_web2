document.getElementsByClassName('add_cart')[0].onclick=function (){
    var item_id = document.getElementsByClassName('img-fluid')[0].id;
    if(item_id === "1"){
        var size = this.parentNode.parentNode.parentNode.parentNode[0].value;
        if(size === 'Chooze size'){
            swal({
                title: "Attention!",
                text: "Please choose your size!",
                icon: "info",
                timer: 3000,
                button: false
                })
            return;
        }
        var color = this.parentNode.parentNode.parentNode.parentNode[1].value;
        var num = this.parentNode.parentNode.parentNode.parentNode[2].value;
        var data={
            'id' : item_id,
            'color' : color,
            'item_num': num,
            'size' : size
        }
        console.log(data);
        $.ajax({

                url:`http://127.0.0.1:5000/add_cart/`,
                type: 'POST',

                dataType: 'json',

                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                contentType: 'application/json; charset=utf-8',

                data: JSON.stringify(data),

                success: function(data) {
                    swal({
                        title: "Success!",
                        text: data['data'],
                        icon: "success",
                        timer: 3000,
                        button: false
                        })
                },
                error: function(e) {
                    console.log(e);
                }
            });
    }else{
        var color = this.parentNode.parentNode.parentNode.parentNode[0].value;
        var num = this.parentNode.parentNode.parentNode.parentNode[1].value;
        var data ={
            'id' : item_id,
            'color' : color,
            'item_num': num
        }
        $.ajax({

                url:`http://127.0.0.1:5000/add_cart/`,
                type: 'POST',

                dataType: 'json',

                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                contentType: 'application/json; charset=utf-8',

                data: JSON.stringify(data),

                success: function(data) {
                    swal({
                        title: "Success!",
                        text: data['data'],
                        icon: "success",
                        timer: 3000,
                        button: false
                        })
                },
                error: function(e) {
                    console.log(e);
                }
            });
    }

}

$(document).on("click","a[datatype='add_cart']",function (event){
    let data={
        'id': this.parentNode.parentNode.childNodes[1].id-7
    }
    $.ajax({

                url:`http://127.0.0.1:5000/add_cart/`,
                type: 'POST',

                dataType: 'json',

                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                contentType: 'application/json; charset=utf-8',

                data: JSON.stringify(data),

                success: function(data) {
                    swal({
                        title: "Success!",
                        text: data['data'],
                        icon: "success",
                        timer: 3000,
                        button: false
                        })
                },
                error: function(e) {
                    console.log(e);
                }
            });
})

$(document).on("click","a[datatype='picture']",function (event){
    window.location.replace(`http://127.0.0.1:5000/show_detail/${this.id-7}`);
})

$(document).on("click","a[datatype='small-picture']",function (event){
    window.location.replace(`http://127.0.0.1:5000/show_detail/${this.childNodes[1].id-18}`);
    })

document.getElementById('new_comment').onblur=function (){
    var text = this.value;
    var id=document.getElementsByClassName('img-fluid')[0].id;
    if(text===''){
        return;
    }
    if(text.toString().length>100){
        swal({
            title: "Attention!",
            text: 'You content is too long to save!',
            icon: "warning",
            timer: 3000,
            button: false
            })
        return;
    }
    var data={
        'content':text,
        'id':id
    }
    $.ajax({

                url:`http://127.0.0.1:5000/add_comment/`,
                type: 'POST',

                dataType: 'json',

                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                contentType: 'application/json; charset=utf-8',

                data: JSON.stringify(data),

                success: function(e) {
                    var li=document.createElement('li');
                    li.setAttribute('class','clearfix');
                    var inner=`<div class="message-data text-right"><span class="message-data-time">${e.time}</span><span class="message-data-time pl-2">${e.username}</span></div><div class="message other-message float-right">${e.content}</div>`;
                    li.innerHTML=inner;
                    document.getElementById('chat-conversation').childNodes[1].appendChild(li);
                    document.getElementById('new_comment').value='';
                },
                error: function(e) {
                    console.log(e);
                }
            });
}
document.getElementById('new_comment').onkeyup=function (){
    document.getElementById('current').innerText=document.getElementById('new_comment').value.length+'/100';
}