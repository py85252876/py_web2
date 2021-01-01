from flask_script import Manager
from app import app,db # 导入app实例对象
from flask_migrate import MigrateCommand, Migrate  # 导入相应类和方法
from model import User,Item,invoice,Booking,Comment,Buying # 导入ORM模型，一定要导入！！！！

manager = Manager(app)
Migrate(app, db)  # 实例化迁移对象，第一个参数为app实例文件，第二个参数为db实例对象

manager.add_command('db', MigrateCommand)  # 给manager添加db迁移命令

if __name__ == '__main__':
    manager.run()