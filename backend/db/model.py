# -*- coding: utf-8 -*-
# モデルの定義
from sqlalchemy import Column, Integer, String
from pydantic import BaseModel
from db import Base
from db import ENGINE


# userテーブルのモデルUserTableを定義
class UserTable(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username: Column('username', String(256))
    password: Column('username', String(256))


# POSTやPUTのとき受け取るRequest Bodyのモデルを定義
class Event(BaseModel):
    id: int
    title = Column(String, nullable=False)
    start = Column(String, nullable=False)
    end = Column(String, nullable=False)


def main():
    # テーブルが存在しなければ、テーブルを作成
    Base.metadata.create_all(bind=ENGINE)

if __name__ == "__main__":
    main()