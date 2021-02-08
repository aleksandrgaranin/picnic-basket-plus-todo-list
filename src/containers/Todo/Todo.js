import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import classes from "./Todo.module.css";

import axios from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: "",
        completed: false,
        userId: this.props.userId,
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
        let todoData = [];
        for (let key in res.data) {
          todoData.push({
            ...res.data[key],
            id: key,
          });
        }
        console.log(todoData)
        this.setState({
          todoList: todoData,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    console.log(name, value);
    console.log(this.state.activeItem)

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
    console.log(this.state)
  }

  handleSubmit(event) {
    event.preventDefault();
    let url = `/todolist.json?auth=`;

    if (this.state.editing === true) {
      url = `/todolist/${this.state.activeItem.id}.json?auth=`;
      this.setState({
        editing: false,
      });
      axios
        .put(url + this.props.token, this.state.activeItem)
        .then((res) => {
          this.fetchTasks();
          this.setState({
            activeItem: {
              identifier: null,
              title: "",
              completed: false,
              userId: this.props.userId,
            },
          });
        })
        .catch((err) => console.log("ERROR:", err));
    } else {

      axios
        .post(url + this.props.token, this.state.activeItem)
        .then((res) => {
          this.fetchTasks();
          this.setState({
            activeItem: {
              identifier: null,
              title: "",
              completed: false,
              userId: this.props.userId,
            },
          });
        })
        .catch((err) => console.log("ERROR:", err));
    }

  }

  startEdit(task) {    
    this.setState({
      activeItem: task,
      editing: true,
    });
  }

  deleteItem(task) {
    axios
      .delete(`/todolist/${task.id}.json?auth=` + this.props.token)
      .then((res) => {
        this.fetchTasks();
      })
      .catch((err) => console.log("ERROR:", err));
  }

  strikeUnstrike(task) {
    task.completed = !task.completed;
    console.log("Task:", task);
    axios
      .put(
        `/todolist/${task.id}.json?auth=` + this.props.token,
        JSON.stringify(task)
      )
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
        <div className={classes.TaskContainer}>
          <div className={classes.FormWrapper}>
            <form id="form" onSubmit={this.handleSubmit}>
              <div className={classes.FlexWrapper}>
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
                <div key={index} className={classes.TaskWrapper}>
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
