document.getElementById('info').ondblclick=function (){
    var oldhtml=this.innerHTML;
    console.log(oldhtml)
    var temp=this;
    var newhtml=document.createElement('input');
    newhtml.type='text'
    newhtml.value=oldhtml;
    newhtml.onblur=function(){
        console.log(123);
    temp.innerHTML = this.value===oldhtml?oldhtml:this.value;
        var data={
            'new_data': this.value
        }
        $.ajax({

                url:`http://127.0.0.1:5000/changeinfo/`,
                type: 'POST',

                dataType: 'json',

                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                contentType: 'application/json; charset=utf-8',

                data: JSON.stringify(data),

                success: function(e) {
                    console.log(e);
                },
                error: function(e) {
                    console.log(e);
                }
            });
    }
    this.innerHTML='';
    this.appendChild(newhtml)
    newhtml.setSelectionRange(0, oldhtml.length);
    newhtml.focus();
}

console.log(document.getElementById('pic'));
document.getElementById('pic').onclick=function (){
    var newinput = document.createElement('input');
    newinput.type='file';
    newinput.style='display:none';
    newinput.accept='.png, .jpg, .jpeg';
    newinput.name='file';
    newinput.click();
    console.log(this.parentNode);
    this.parentNode.appendChild(newinput);
    newinput.onchange=function (){
        document.getElementById('new_pic').submit();
    }
}