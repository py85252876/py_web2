from app import db
from datetime import datetime

invoice = db.Table('invoice',
                   db.Column('user_id',db.Integer,db.ForeignKey('user.id')),
                   db.Column('item_id',db.Integer,db.ForeignKey('item.id')))


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    username = db.Column(db.String(24), nullable=False)
    mailbox = db.Column(db.String(40),nullable=False)
    password = db.Column(db.String(100), nullable=False)
    balance = db.Column(db.Integer,nullable=False,default=9999999)
    info = db.Column(db.String(50),nullable=False,default='The user has not yet added a self-introduction')
    p_address = db.Column(db.String(50), nullable=False, default='../static/img/py.png')


    items = db.relationship('Item',
                            secondary=invoice,
                            backref="user")

    buys = db.relationship('Buying',backref='user')

    def __init__(self, username, password, email):
        self.username = username
        self.mailbox = email
        self.password = password


class Item(db.Model):
    __tablename__ = 'item'
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    name = db.Column(db.String(20),default="none",nullable=False)
    category = db.Column(db.String(10),nullable=False)
    content = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)


class Booking(db.Model):
    __tablename__ = 'booking'
    book_id=db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id= db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    item_id = db.Column(db.Integer,db.ForeignKey('item.id'),nullable=False)
    item_name = db.Column(db.String(20),nullable=False)
    item_num = db.Column(db.Integer, nullable=False, default=1)
    size = db.Column(db.String(10), default='Normal', nullable=False)
    color=db.Column(db.String(10), default='Black', nullable=False)
    paied=db.Column(db.Integer, default=0, nullable=False)

    def __init__(self, user_id, item_id):
        self.user_id = user_id
        self.item_id = item_id

    owner = db.relationship('User', backref=db.backref('books'))


class Buying(db.Model):
    __tablename__ = 'buying'
    buy_id = db.Column(db.Integer,primary_key=True,nullable=False,autoincrement=True)
    First_name = db.Column(db.String(20),nullable = False)
    Last_name = db.Column(db.String(20),nullable=False)
    username = db.Column(db.String(20),nullable=False)
    email = db.Column(db.String(50),nullable=False)
    buier_id = db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    total = db.Column(db.Integer,nullable=False)
    time = db.Column(db.DateTime,default=datetime.now)
    address = db.Column(db.String(100),nullable=False)
    payment = db.Column(db.String(15),nullable=False)
    card_name = db.Column(db.String(20))
    card_num = db.Column(db.String(20))


class Comment(db.Model):
    __tablename__= 'comment'
    comment_id=db.Column(db.Integer,primary_key=True,autoincrement=True)
    item_id = db.Column(db.Integer,db.ForeignKey('item.id'))
    username = db.Column(db.String(24))
    content = db.Column(db.String(100))
    time = db.Column(db.DateTime, default=datetime.now)
