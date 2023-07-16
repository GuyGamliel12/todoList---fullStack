import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = () => {
    axios
      .get("/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.error("Error: ", err));
  };

  const completeTodo = async (id) => {
    try {
      const response = await axios.get("/todo/complete/" + id);
      const data = response.data;

      setTodos((todos) =>
        todos.map((todo) => {
          if (todo._id === data._id) {
            todo.complete = data.complete;
          }
          return todo;
        })
      );
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const addTodo = async () => {
    try {
      const response = await axios.post("/todo/new", {
        text: newTodo,
      });
      const data = response.data;

      setTodos([...todos, data]);
      setPopupActive(false);
      setNewTodo("");
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete("/todo/delete/" + id);
      setTodos((todos) => todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error: ", err);
    }
  };
  return (
    <div className="App">
      <h1>Welcome Back</h1>
      <h4>Your tasks</h4>

      <div className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div
              className={"todo" + (todo.complete ? " is-complete" : "")}
              key={todo._id}
            >
              <div
                className="checkbox"
                onClick={() => completeTodo(todo._id)}
              ></div>

              <div className="text">{todo.text}</div>

              <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
                x
              </div>
            </div>
          ))
        ) : (
          <p>You currently have no tasks</p>
        )}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            X
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
