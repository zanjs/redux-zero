import * as React from "react"
import { mount } from "enzyme"

import createStore from "../.."
import { Provider, Connect, connect } from ".."

describe("redux-zero - react bindings", () => {
  const listener = jest.fn()
  let store, unsubscribe
  beforeEach(() => {
    store = createStore({})
    listener.mockReset()
    unsubscribe = store.subscribe(listener)
  })

  describe("connect HOC", () => {
    it("should provide the state and subscribe to changes", () => {
      store.setState({ message: "hello" })

      const Comp = ({ message }) => <h1>{message}</h1>

      const mapToProps = ({ message }) => ({ message })

      const ConnectedComp = connect(mapToProps)(Comp)

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      )

      const wrapper = mount(<App />)

      expect(wrapper.html()).toBe("<h1>hello</h1>")

      store.setState({ message: "bye" })

      expect(wrapper.html()).toBe("<h1>bye</h1>")
    })

    it("should provide the actions and subscribe to changes", () => {
      store.setState({ count: 0 })

      const Comp = ({ count, increment }) => (
        <h1 onClick={increment}>{count}</h1>
      )

      const mapToProps = ({ count }) => ({ count })

      const actions = store => ({
        increment: state => ({ count: state.count + 1 })
      })

      const ConnectedComp = connect(mapToProps, actions)(Comp)

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      )

      const wrapper = mount(<App />)

      expect(wrapper.html()).toBe("<h1>0</h1>")

      wrapper.children().simulate("click")
      wrapper.children().simulate("click")

      expect(wrapper.html()).toBe("<h1>2</h1>")
    })

    it("should provide the store as a prop", () => {
      const Comp = ({ store }) => <h1>{String(!!store)}</h1>

      const mapToProps = state => state

      const ConnectedComp = connect(mapToProps)(Comp)

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      )

      const wrapper = mount(<App />)

      expect(wrapper.html()).toBe("<h1>true</h1>")
    })

    it("should connect with nested children", () => {
      store.setState({ message: "hello" })

      const Comp = ({ message, children }) => (
        <div>
          parent {message} {children}
        </div>
      )
      const ChildComponent = ({ message }) => <span>child {message}</span>

      const mapToProps = ({ message }) => ({ message })

      const ConnectedComp = connect(mapToProps)(Comp)
      const ConnectedChildComp = connect(mapToProps)(ChildComponent)

      const App = () => (
        <Provider store={store}>
          <ConnectedComp>
            <ConnectedChildComp />
          </ConnectedComp>
        </Provider>
      )

      const wrapper = mount(<App />)

      expect(wrapper.html()).toBe(
        "<div>parent hello <span>child hello</span></div>"
      )

      store.setState({ message: "bye" })

      expect(wrapper.html()).toBe(
        "<div>parent bye <span>child bye</span></div>"
      )
    })
  })

  describe("Connect component", () => {
    it("should provide the state and subscribe to changes", () => {
      store.setState({ message: "hello" })

      const mapToProps = ({ message }) => ({ message })

      const ConnectedComp = () => (
        <Connect mapToProps={mapToProps}>
          {({ message }) => <h1>{message}</h1>}
        </Connect>
      )

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      )

      const wrapper = mount(<App />)

      expect(wrapper.html()).toBe("<h1>hello</h1>")

      store.setState({ message: "bye" })

      expect(wrapper.html()).toBe("<h1>bye</h1>")
    })

    it("should provide the actions and subscribe to changes", () => {
      store.setState({ count: 0 })

      const mapToProps = ({ count }) => ({ count })

      const actions = store => ({
        increment: state => ({ count: state.count + 1 })
      })

      const ConnectedComp = () => (
        <Connect mapToProps={mapToProps} actions={actions}>
          {({ count, increment }) => <h1 onClick={increment}>{count}</h1>}
        </Connect>
      )

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      )

      const wrapper = mount(<App />)

      expect(wrapper.html()).toBe("<h1>0</h1>")

      wrapper.children().simulate("click")
      wrapper.children().simulate("click")

      expect(wrapper.html()).toBe("<h1>2</h1>")
    })

    it("should provide the store as a prop", () => {
      const mapToProps = state => state

      const ConnectedComp = () => (
        <Connect mapToProps={mapToProps}>
          {({ store }) => <h1>{String(!!store)}</h1>}
        </Connect>
      )

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      )

      const wrapper = mount(<App />)

      expect(wrapper.html()).toBe("<h1>true</h1>")
    })

    it("should connect with nested children", () => {
      store.setState({ message: "hello" })

      const mapToProps = ({ message }) => ({ message })

      const ConnectedComp = ({ children }) => (
        <Connect mapToProps={mapToProps}>
          {({ message }) => (
            <div>
              parent {message} {children}
            </div>
          )}
        </Connect>
      )
      const ConnectedChildComp = () => (
        <Connect mapToProps={mapToProps}>
          {({ message }) => <span>child {message}</span>}
        </Connect>
      )

      const App = () => (
        <Provider store={store}>
          <ConnectedComp>
            <ConnectedChildComp />
          </ConnectedComp>
        </Provider>
      )

      const wrapper = mount(<App />)

      expect(wrapper.html()).toBe(
        "<div>parent hello <span>child hello</span></div>"
      )

      store.setState({ message: "bye" })

      expect(wrapper.html()).toBe(
        "<div>parent bye <span>child bye</span></div>"
      )
    })
  })
})
