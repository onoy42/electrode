// @flow

import React from "react";
import Footer from "./footer";
import AddTodo from "../containers/add-todo";
import VisibleTodoList from "../containers/visible-todo-list";

const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

export default TodoApp;
