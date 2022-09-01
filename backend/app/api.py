from fastapi import FastAPI, Depends, Path, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .databass import SessionLocal, engine
import datetime

app = FastAPI()
models.Base.metadata.create_all(bind=True)


origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

todos = []


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your utility list."}

@app.get("/todo", tags=["todos"])
async def get_todos() -> dict:
    return { "data": todos }

@app.post("/todo", tags=["todos"])
async def add_todo(todo: dict) -> dict:
    todos.append(todo)
    return {
        "data": { "Todo added." }
    }

@app.put("/todo/{id}", tags=["todos"])
async def update_todo(id: int, body: dict) -> dict:
    for todo in todos:
        if int(todo["id"]) == id:
            todo["item"] = body["item"]
            return {
                "data": f"Todo with id {id} has been updated."
            }

    return {
        "data": f"Todo with id {id} not found."
    }

@app.delete("/todo/{id}", tags=["todos"])
async def delete_todo(id: int) -> dict:
    for todo in todos:
        if int(todo["id"]) == id:
            todos.remove(todo)
            return {
                "data": f"Todo with id {id} has been removed."
            }

    return {
        "data": f"Todo with id {id} not found."
    }



events = []

@app.get("/event", tags=["events"])
async def get_events() -> dict:
    return { "data": events }

@app.post("/event", tags=["events"])
async def add_event(event: dict) -> dict:
    events.append(event)
    return {
        "data": { "Event added." }
    }

@app.put("/event/{id}", tags=["events"])
async def update_event(id: int, body: dict) -> dict:
    for event in events:
        if int(event["id"]) == id:
            event["title"] = body["title"]
            event["start"] = body["start"]
            event["end"] = body["end"]
            return {
                "data": f"Event with id {id} has been updated."
            }

    return {
        "data": f"Event with id {id} not found."
    }

@app.delete("/event/{id}", tags=["events"])
async def delete_event(id: int) -> dict:
    for event in events:
        if int(event["id"]) == id:
            events.remove(event)
            return {
                "data": f"Event with id {id} has been removed."
            }

    return {
        "data": f"Event with id {id} not found."
    }



# ----- database ----- #
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/users/{user_id}/todos/", response_model=schemas.Todo)
def create_item_for_user(
    user_id: int, todo: schemas.TodoCreate, db: Session = Depends(get_db)
):
    return crud.create_user_item(db=db, todo=todo, user_id=user_id)


@app.get("/todos/", response_model=list[schemas.Todo])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_todos(db, skip=skip, limit=limit)
    return todos