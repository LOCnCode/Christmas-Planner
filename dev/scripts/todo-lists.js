import React from "react"; //always need to import this

class showTodosLists extends React.Component { //its a convention in React that all components are Capitalized
	render() {
		const showTodosLists = () => {
			if (this.state.loggedIn === true) {
				return (
					<div className="todosList">
						<form onSubmit = {this.handleSubmit}>
							<input name={"currentTodos"} value={this.state.currentTodos} onChange={this.handleChange} type="text" placeholder="Enter a new Todo"/>
							<input type="submit" value="Add Todo"/>
							</form>
						<ul>
							{this.state.todos.map((todo) => {
								return (<li key={todo.key}>
									{todo.description}
									<button onClick={() => this.removeTodo(todo.key)}> x </button>
									</li>)
							})}
						</ul>
					</div> 
				)
			}
		}

export default todosList;