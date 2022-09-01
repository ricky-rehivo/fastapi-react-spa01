# -*- encodingg: utf-8 -*-
import datetime
import uuid
import sys
from sqlalchemy import (Column, String, Text, ForeignKey, CHAR, VARCHAR, Integer, \
                        create_engine, MetaData, DECIMAL, DATETIME, exc, event, Index, and_)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

sys.dont_write_bytecode

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(VARCHAR(255))
    hashed_password = Column(String)
    create_date_time = Column(DATETIME)
    update_date_time = (Column(DATETIME))
    status = Column(VARCHAR(255))
    todos = relationship("Todo", back_populates="owner")

    def __init__(self):
        self.id = str(uuid.uuid4())
        now_data_time = str(datetime.datetime.now().strftime("%Y%m%d%H%M%S"))
        self.create_date_time = now_data_time
        self.update_date_time = now_data_time
        
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))