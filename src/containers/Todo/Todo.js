import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import axios from "../../axios-orders";
import "./Todo.css";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        title: "",
        completed: false,
      },
      editing: false,
    };
    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.strikeUnstrike = this.strikeUnstrike.bind(this);
    this.queryParams =
      "?auth=" +
      this.props.token +
      '&orderBy="userId"&equalTo="' +
      this.props.userId +
      '"';
  }

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  componentWillMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    console.log("Fetching ...");

    axios
      .get(`/todolist.json` + this.queryParams)
      .then((res) => {
        console.log(res);
        let todoData = [];
        for (let key in res.data) {
          todoData.push({
            ...res.data[key],
            id: key,
          });
        }
        this.setState({
          todoList: todoData,
        });
        console.log("todoList:", this.state.todoList);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    console.log(name, value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("Item:", this.state.activeItem);

    let csrftoken = this.getCookie("csrftoken");
    let url = `/todolist/`;

    if (this.state.editing === true) {
      url = `/todolist/${this.state.activeItem.id}.json?auth=`;
      this.setState({
        editing: false,
      });
    }
    console.log(JSON.stringify(this.state.activeItem));
    const task = {
      taskData: this.state.activeItem.name,
      completed: this.state.activeItem.completed,
      userId: this.props.userId,
    };
    axios
      .post(
        url + this.props.token,
        task
        //   {
        //   method: "POST",
        //   headers: {
        //     "Content-type": "application/json",
        //     "X-CSRFToken": csrftoken,
        //   },
        //   body: JSON.stringify(this.state.activeItem),
        // }
      )
      .then((res) => {
        this.fetchTasks();
        this.setState({
          activeItem: {
            title: "",
            completed: false,
          },
        });
      })
      .catch((err) => console.log("ERROR:", err));
  }

  startEdit(task) {
    this.setState({
      activeItem: task,
      editing: true,
    });
  }

  deleteItem(task) {
    const csrftoken = this.getCookie("csrftoken");
    console.log(task);

    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    })
      .then((res) => {
        this.fetchTasks();
      })
      .catch((err) => console.log("ERROR:", err));
  }

  strikeUnstrike(task) {
    task.completed = !task.completed;
    console.log("Task:", task.completed);
    const csrftoken = this.getCookie("csrftoken");
    fetch(`http://127.0.0.1:8000/api/task-update/${task.id}/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(task),
    })
      .then((res) => {
        this.fetchTasks();
      })
      .catch((err) => console.log("ERROR:", err));
  }

  render() {
    const tasks = this.state.todoList;
    const self = this;

    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form if="form" onSubmit={this.handleSubmit}>
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    onChange={this.handleChange}
                    value={this.state.activeItem.title}
                    className="form-control"
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Add task"
                  ></input>
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    id="submit"
                    className="btn btn-warning"
                    type="submit"
                    name="Add"
                  ></input>
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper">
            {tasks.map((task, index) => {
              return (
                <div key={index} className="task-wrapper flex-wrapper">
                  <div
                    onClick={() => self.strikeUnstrike(task)}
                    style={{ flex: 7 }}
                  >
                    {!task.completed ? (
                      <span>{task.title}</span>
                    ) : (
                      <strike>{task.title}</strike>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => self.startEdit(task)}
                      className="btn btn-sm btn-outline-info"
                    >
                      Edit
                    </button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <button
                      onClick={() => self.deleteItem(task)}
                      className="btn btn-sm btn-outline-danger delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.ordr.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrder: (token, userId) =>
      dispatch(actions.fetchOrders(token, userId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Todo, axios));
