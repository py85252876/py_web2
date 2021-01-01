$(document).on("click","a[datatype='picture']",function (event){
    window.location.replace(`http://127.0.0.1:5000/show_detail/${this.id}`);
})

$(document).on("click","a[datatype='add_cart']",function (event){
    console.log(this.parentNode.parentNode.firstChild.nextSibling.id);
    let data={
        'id': this.parentNode.parentNode.firstChild.nextSibling.id
    }
    console.log(data)
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

document.getElementById('search_button').onclick=function (){
    var search_text = this.previousSibling.previousSibling.value;
    if(search_text === ''){
        window.location.replace(`http://127.0.0.1:5000/show_item/`);
        return;
    }
    var data={
        'name':search_text
    }
    $.ajax({

                url:`http://127.0.0.1:5000/search_item/`,
                type: 'POST',

                dataType: 'json',

                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                contentType: 'application/json; charset=utf-8',

                data: JSON.stringify(data),

                success: function(data) {
                    var parent=document.getElementById('contain_row');
                    parent.innerHTML='';
                    for(var i=0;i<data.length;i++){
                        var temp = document.createElement('div');
                        temp.setAttribute('class','col-md-6 col-lg-4 col-xl-3');
                        var inner=`<div class="single-product-item mb-30">
                                    <div class="product-card">
                                        <a class="product-thumb" datatype="picture" id = "${data[i][0]}"><img src="../static/img/${data[i][0]}.jpg" alt="Product"></a>
                                        <h3 class="product font-13 mb-0">${data[i][3]}</h3>
                                        <h3 class="product-title"><a href="product-details.html">${data[i][4]}</a></h3>
                                        <p>${data[i][1]}</p>
                                        <h4 class="product-price">$${data[i][2]}</h4>
                                        <div class="product-buttons">
                                            <a class="btn btn-primary mt-20" href="javascript: void(0);" datatype="add_cart">Add to Cart</a>
                                        </div>
                                    </div>
                                </div>`
                        temp.innerHTML=inner;
                    parent.appendChild(temp);
                    }
                    document.getElementById('search_button').previousSibling.previousSibling.value='';
                },
                error: function(e) {
                    console.log(e);
                }
            });
}