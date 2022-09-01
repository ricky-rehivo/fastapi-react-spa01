from lib2to3.pytree import Base
from socket import NI_MAXHOST
from pydantic import BaseModel

class TodoBase(BaseModel):
    content: int

class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    todos = list[Todo] = []

    class Config:
        orm_mode = True