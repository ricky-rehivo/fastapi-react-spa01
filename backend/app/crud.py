import sys
from . import models, schemas

from sqlalchemy.orm import Session

sys.dont_write_bytecode = True
def select_all_user(db: Session, skip: int = 0, limit: int = 100):
    session = db.create_new_session()
    user_list = session.query(models.User).\
                offset(skip).\
                all()
    if user_list == None:
        user_list = []
    return user_list


def create_user(db: Session, user: schemas.UserCreate):
    session = db.create_new_session()
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh()
    return db_user


def select_user(db: Session, user_id: int):
    session = db.cerate_new_session()
    user = session.query(models.User).\
            filter(models.User.id == user_id).\
            first()
    if user == None:
        user = ""
    return user

def select_todos(db: Session, skip: int = 0, limit: int = 100):
    session = db.create_new_session()
    todo_list = session.query(models.Todo).\
                offset(skip).\
                limit(limit).\
                all()
    if todo_list == None:
        todo_list = []
    return todo_list

def create_user_todo(db: Session, todo: schemas.TodoCreate, user_id: int):
    db_todo = models.Todo(**todo.dict(), owner_id=user_id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo