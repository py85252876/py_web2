function changesum(_this,price,item_id){
    var sum = price*(_this.value);
    _this.parentNode.nextSibling.nextSibling.innerText='$'+sum+'.0';
    let data={
        'num': _this.value,
        'item_id': item_id
    }
    $.ajax({

                url:`http://127.0.0.1:5000/change_item_num/`,
                type: 'POST',

                dataType: 'json',

                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                contentType: 'application/json; charset=utf-8',

                data: JSON.stringify(data),

                success: function(data) {
                    console.log(data);
                },
                error: function(e) {
                    console.log(e);
                }
            });
}

$(document).on("click","a[datatype='delete']",function (event){
    let data={
        'id': this.id
    }
    console.log(this.parentNode.parentNode);
    this.parentNode.parentNode.remove();
    $.ajax({

                url:`http://127.0.0.1:5000/delete_book/`,
                type: 'POST',

                dataType: 'json',

                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                contentType: 'application/json; charset=utf-8',

                data: JSON.stringify(data),

                success: function(data) {
                    console.log(data);
                },
                error: function(e) {
                    console.log(e);
                }
            });

})

document.getElementById('checkout').onclick=function (){
    if(document.getElementsByClassName('table')[0].childNodes[3].childNodes.length<3){
        swal({
        title: "Sorry",
        text: "You cart is empty!",
        icon: "info",
        timer: 3000,
        button: false
        })
        return;
    }
    window.location.replace(`http://127.0.0.1:5000/checkout/`);
}

