from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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