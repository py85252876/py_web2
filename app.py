import functools
import json
from flask import Flask, render_template, request, session, redirect, url_for, g, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import os
from werkzeug.utils import secure_filename
from flask_mail import Mail,Message
import random,string
from abc import ABC
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
import config
from html.parser import HTMLParser
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_


app = Flask(__name__)
app.config.from_object(config)
app.config['SECRET_KEY'] = os.urandom(24)
db = SQLAlchemy(app)

app.config.update(
    SECRET_KEY = "SECRET KEY",
    MAIL_SERVER = 'smtp.163.com',
    MAIL_PORT = 465,
    MAIL_USE_SSL = True,
    MAIL_USERNAME = 'py_web@163.com',
    MAIL_PASSWORD = 'WSLKGLTKYEVOYQFF',
    MAIL_DEFAULT_SENDER = ('py_web@163.com')
)
mail=Mail(app)
from model import User,Item,Booking,Buying,Comment

db.create_all()


@app.route('/')
def hello():
    return redirect(url_for('login'))


def login_required(func):
    @functools.wraps(func)#修饰内层函数，防止当前装饰器去修改被装饰函数__name__的属性
    def inner(*args,**kwargs):
        username = session.get('username')
        if not  username:
            return redirect(url_for('login'))
        else:
            g.username=username
            return func(*args,**kwargs)
    return inner



@app.route('/login/',methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    else:
        data = json.loads(request.get_data(as_text=True))
        username = data['username']
        email = data['email']
        password = data['password']
        user = User.query.filter(User.username == username , User.mailbox == email).first()
        if user and check_password_hash(user.password,password):
            session['username'] = username
            session['email'] = email
            session['password'] = user.password
            return jsonify({'data':"success"})
        else:
            return jsonify({'data':"fail"})


@app.route('/register/',methods=['GET','POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    else:
        data = json.loads(request.get_data(as_text=True))
        username = data['username']
        email = data['email']
        password = data['password']
        password = generate_password_hash(password)
        user = User.query.filter(User.username == username).first()
        if user:
            return jsonify({'data': "Fail"})
        else:
            user = User(username=username, email=email, password = password)
            db.session.add(user)
            db.session.commit()
            session['username'] = username
            session['email'] = email
            session['password']=password
            g.username = username
            g.email = email
            g.password = password
        return jsonify({'data': "success"})


@app.route('/show_item/', methods=['GET','POST'])
@login_required
def show_item():
    if request.method == 'GET':
        list=Item.query.all()
        return render_template('show_item.html',list=list,username=session.get('username'))


@app.route('/show_detail/<id>',methods=['GET','POST'])
@login_required
def show_details(id):
    if request.method == 'GET':
        list = Item.query.filter(Item.id == id).first()
        all = Item.query.all()
        comments=Comment.query.filter(Comment.item_id==id).all()
        return render_template('product-details.html',list=list, all=all,username=session.get('username'),comments=comments)


@app.route('/add_cart/',methods=['GET','POST'])
@login_required
def add_cart():
    if request.method == 'GET':
        return render_template('my_chart.html',username=session.get('username'))
    else:
        data = json.loads(request.get_data(as_text=True))
        username = session.get('username')
        email = session.get('email')
        password = session.get('password')
        user = User.query.filter(User.username == username,User.mailbox == email, User.password == password).first()
        item = Item.query.filter(Item.id == data['id']).first()
        book = Booking(user_id=user.id,item_id=data['id'])
        book.item_name = item.name
        if 'item_num' in data:
            book.item_num = data['item_num']
        if 'size' in data:
            book.size = data['size']
        if 'color' in data:
            book.color = data['color']
        db.session.add(book)
        db.session.commit()
        return jsonify({'data':"Added to cart successfully!"})


@app.route('/cart/',methods=['GET','POST'])
@login_required
def show_cart():
    if request.method == 'GET':
        user = User.query.filter(User.username == session.get('username'), User.mailbox == session.get('email'), User.password== session.get('password')).first()
        id = user.id
        item_list = Item.query.filter().all()
        list = Booking.query.filter(Booking.user_id == id, Booking.paied == 0).all()
        return render_template('cart.html', list = list, item_list = item_list,username=session.get('username'))
    else:
        return u'ok'


@app.route('/change_item_num/',methods=['GET','POST'])
@login_required
def change_item_num():
    if request.method == 'POST':
        data = json.loads(request.get_data(as_text=True))
        item_id = data['item_id']
        num = data['num']
        booking = Booking.query.filter(Booking.book_id == item_id).first()
        booking.item_num=num
        db.session.commit()
        return jsonify({'data':"success"})



@app.route('/delete_book/',methods=['GET','POST'])
@login_required
def delete_book():
    if request.method == 'POST':
        data = json.loads(request.get_data(as_text=True))
        id = data['id']
        booking = Booking.query.filter(Booking.book_id == id).first()
        db.session.delete(booking)
        db.session.commit()
    return jsonify({'data':"ok"})


@app.route('/checkout/',methods=['GET','POST'])
@login_required
def checkout():
    if request.method == 'GET':
        user = User.query.filter(User.username == session.get('username'), User.mailbox == session.get('email'),
                                 User.password == session.get('password')).first()
        id = user.id
        list = Booking.query.filter(Booking.user_id == id, Booking.paied == 0).all()
        num = Booking.query.filter(Booking.user_id == id, Booking.paied == 0).count()
        item_list = Item.query.filter().all()
        return render_template('checkout.html',list=list,num=num,item_list=item_list,username=session.get('username'))
    else:
        data = json.loads(request.get_data(as_text=True))
        user = User.query.filter(User.username == session.get('username'), User.mailbox == session.get('email'),
                                 User.password == session.get('password')).first()
        id = user.id
        buying = Buying(First_name=data['firstname'],Last_name=data['lastname'],buier_id=id,total=data['total'],address=data['address'],email=data['email'],username=data['username'],payment=data['payment'])
        if 'card_name' in data:
            buying.card_name = data['card_name']
        if 'card_num' in data:
            buying.card_num = data['card_num']
        if data['payment'] == 'balance' and data['total'] > user.balance:
            return jsonify({'data':"fail"})
        user.balance=user.balance-data['total']
        arr = data['array']
        for i in arr:
            book = Booking.query.filter(Booking.book_id==i).first()
            book.paied = 1
        db.session.add(buying)
        db.session.commit()
        book = Buying.query[-1]
        id = book.buy_id
        return jsonify({'data':"success",
                        'id': id ,
                        'arr': arr})


@app.route('/invoice/<id>/<arr>',methods=['GET','POST'])
@login_required
def invoice(id, arr):
    if request.method == 'GET':
        buy = Buying.query.filter(Buying.buy_id == id).first()
        list_book=[]
        list_item=[]
        arr=arr.split(',')
        for i in arr:
            i=int(i)
            book=Booking.query.filter(Booking.book_id==i).first()
            list_book.append(book)
        for i in list_book:
            item = Item.query.filter(Item.id==i.item_id).first()
            list_item.append(item)
        num = len(arr)
        return render_template('invoice.html',item = buy, list = list_book,list_item=list_item,len=num,username=session.get('username'))


@app.route('/signout/',methods=['GET','POST'])
def signout():
    session.clear()
    return redirect(url_for('login'))


@app.route('/profile/',methods=['GET','POST'])
@login_required
def profile():
    if request.method == 'GET':
        user = User.query.filter(User.username == session.get('username'), User.mailbox == session.get('email'),
                                 User.password == session.get('password')).first()
        price=0
        num=0
        for i in user.buys:
            price=price+i.total
            num=num+1
        return render_template('profile.html',price=price,num=num,user=user)
    else:
        f = request.files['file']
        basepath = os.path.dirname(__file__)
        upload_path = os.path.join(basepath, 'static\\img', secure_filename(f.filename))
        if f.filename=='':
            return redirect(url_for('profile'))
        if f.filename!='py.png':
            f.save(upload_path)
        path ='..\\static\\img\\'+f.filename
        user = User.query.filter(User.username == session.get('username'), User.mailbox == session.get('email'),
                                 User.password == session.get('password')).first()
        if user.p_address != '..\\static\\img\\py.png':
            temp=user.p_address
            temp=temp.split('\\')
            delete_path=os.path.join(basepath,'static\\img',temp[len(temp)-1])
            os.remove(delete_path)
        user.p_address=path
        db.session.commit()
        return redirect(url_for('profile'))


@app.route('/changeinfo/',methods=['GET','POST'])
@login_required
def changeinfo():
    data = json.loads(request.get_data(as_text=True))
    user = User.query.filter(User.username == session.get('username'), User.mailbox == session.get('email'),
                             User.password == session.get('password')).first()
    user.info=data['new_data']
    db.session.commit()
    return jsonify({'data':"success"})


@app.route('/add_comment/',methods=['GET','POST'])
@login_required
def add_comment():
    data = json.loads(request.get_data(as_text=True))
    user = User.query.filter(User.username == session.get('username'), User.mailbox == session.get('email'),
                             User.password == session.get('password')).first()
    username=user.username
    content=data['content']
    comment=Comment(item_id=data['id'],username=username,content=content)
    db.session.add(comment)
    db.session.commit()
    comment=Comment.query.filter().order_by(Comment.time.desc()).first()
    time=comment.time
    return jsonify({'content':content,
                    'username':username,
                    'time':time})


@app.route('/changepassword/',methods=['GET','POST'])
@login_required
def changepassword():
    if request.method=='GET':
        return render_template('changepassword.html')
    else:
        data = json.loads(request.get_data(as_text=True))
        user = User.query.filter(User.username == session.get('username'), User.mailbox == session.get('email'),
                                 User.password == session.get('password')).first()
        if data['username']!=user.username or data['email']!=user.mailbox or check_password_hash(user.password,data['oldpassword'])!=True:
            return jsonify({
                'data':"Fail"
            })
        password = generate_password_hash(data['newpassword'])
        user.password=password
        db.session.commit()
        session['password']=password
        g.password = password
        return jsonify({'data':'success'})


@app.route('/show_record/',methods=['GET','POST'])
@login_required
def show_record():
    if request.method == 'GET':
        user = User.query.filter(User.username == session.get('username'), User.mailbox == session.get('email'),
                                 User.password == session.get('password')).first()
        buying = Buying.query.filter(Buying.buier_id==user.id).all()
        return render_template('record.html',buying=buying)


@app.route('/search_item/',methods=['GET','POST'])
@login_required
def search_item():
    if request.method == 'POST':
        data = json.loads(request.get_data(as_text=True))
        name = data['name']
        items=Item.query.filter(or_(Item.name.like("%" + name + "%"),Item.category.like("%" + name + "%"))).all()
        list=[]
        for item in items:
            list.append([item.id,item.content,item.price,item.category,item.name])
        return jsonify(list)
    return u'ok'


@app.route('/forget_password/',methods=['GET','POST'])
def forget_password():
    if request.method == 'GET':
        return render_template('forgetpassword.html')
    else:
        data = json.loads(request.get_data(as_text=True))
        user = User.query.filter(User.username==data['username'],User.mailbox==data['email']).first()
        if not user:
            return jsonify({'data':"fail"})
        new_password = ''.join(random.sample(string.ascii_letters + string.digits, 8))
        data_password = generate_password_hash(new_password)
        user.password=data_password
        db.session.commit()
        msg = Message('text', sender='py_web@163.com', recipients=[data['re_email']])
        msg.body = 'You new password is '+ new_password
        mail.send(msg)
        return jsonify({'data':"success"})


if __name__ == '__main__':
    app.run()
