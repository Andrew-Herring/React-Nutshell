
import { Route, Redirect } from 'react-router-dom'
import React, { Component } from 'react';
import DataManager from '../module/DataManager'
import Login from "./login/LoginForm"
import Register from "./login/RegisterForm"
import NewsList from "./news/newslist"
import NewsForm from "./news/newsForm"
import EventForm from "./events/EventForm"
import EventList from "./events/EventList"
import MessageForm from "./messages/MessageForm"
import MessageList from "./messages/MessageList"
import TodoForm from './todo/TodoForm'
import TodoList from './todo/TodoList'


export default class ApplicationViews extends Component {
  isAuthenticated = () => localStorage.getItem("credentials") !== null

  state = {
    users: [],
    news: [],
    events: [],
    messages: [],
    todos: [],
    isLoaded: false
  }

  addUser = users => DataManager.add("users", users)
  .then(() => DataManager.getAll("users"))
  .then(users => this.setState({
    users: users
  }))

  addMessage = messages => DataManager.add("messages", messages)
  .then(() => DataManager.getAll("messages"))
  .then(messages => this.setState({
    messages: messages
  }))

  deleteMessage = id => DataManager.delete("messages", id)
  .then(() => DataManager.getAll("messages"))
  .then(messages => this.setState({
    messages: messages
  }))

  addEvent = events => DataManager.add("events", events)
  .then(() => DataManager.getAll("events"))
  .then(events => this.setState({
    events: events
  }))

  addNews = (news, item) => DataManager.add(news, item)
  .then(() => DataManager.getAll("news"))
  .then(news => this.setState({
    news: news
  }))

  deleteNews = (news, id) => {
    return DataManager.delete(news, id)
      .then(() => DataManager.getAll("news"))
      .then(news => this.setState({
        news: news
      })
      )
  }

  componentDidMount() {
    const newState = {}

    DataManager.getAll("users")
      .then(allUsers => {
        newState.users = allUsers
      })

    DataManager.getAll("messages")
      .then(allMessages => {
        newState.messages = allMessages
      })

    DataManager.getAll("events")
      .then(allEvents => {
        newState.events = allEvents
      })
    DataManager.getAll("news")
      .then(allNews => {
        newState.news = allNews
      })
      .then(() =>
        this.setState(newState))
  }

  render() {
    return (
      <React.Fragment>

        <Route exact path="/login" component={Login} />
        <Route exact path="/register" render={(props) => {
          return <Register {...props}
            addUser={this.addUser}
            users={this.state.users} />

        }} />
        <Route exact path="/events" render={(props) => {
          return <EventList {...props}
            events={this.state.events} />
        }} />

        < Route path="/events/new" render={(props) => {
          return <EventForm {...props}
            addEvent={this.addEvent} />
        }} />

        <Route exact path="/news" render={(props) => {
          if (this.isAuthenticated()) {
            return <NewsList {...props} deleteNews={this.deleteNews}
              news={this.state.news} />
          }
          else {
            return <Redirect to="/login" />
          }
        }} />

        <Route exact path="/messages" render={(props) => {
          if (this.isAuthenticated()) {
            return <MessageList {...props}
              users={this.state.users}
              editMessage={this.editMessage}
              deleteMessage={this.deleteMessage}
              messages={this.state.messages} />
          } else {
            return <Redirect to="/" />
          }
        }} />
        <Route exact path="/messages/new" render={(props) => {
          if (this.isAuthenticated()) {
            return <MessageForm {...props}
              messages={this.state.messages}
              addMessage={this.addMessage} />
          } else {
            return <Redirect to="/" />
          }
        }} />
        < Route path="/news/new" render={(props) => {
          if (this.isAuthenticated()) {
            return <NewsForm {...props}
              addNews={this.addNews} />
          }
          else {
            return <Redirect to="/login" />
          }
        }} />
        <Route exact path="/todos" render={(props) => {
          return <TodoList {...props} todos={this.state.todos} />
        }} />

        <Route path="/todos/new" render={(props) => {
          return <TodoForm />
        }} />
      </React.Fragment>


    )
  }
}
