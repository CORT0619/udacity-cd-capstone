// import dateFormat from 'dateformat'
import { History } from 'history'
import './Gradebook.css';
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createGradebookItem, deleteGradebookItem, getGradebookItems, patchGradebookItem } from '../api/gradebook-api'
import Auth from '../auth/Auth'
import { GradebookItem } from '../types/GradebookItem'

interface GradebookItemsProps {
  auth: Auth
  history: History
}

interface GradebookState {
  items: GradebookItem[];
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  finalGrade: string;
  loadingGradebook: boolean;
}

export class GradebookItems extends React.PureComponent<GradebookItemsProps, GradebookState> {
  state: GradebookState = {
    items: [],
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    finalGrade: '',
    loadingGradebook: true
  }

  handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ firstName: event.target.value });
  }

  handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ lastName: event.target.value });
  }

  handleDOBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ dateOfBirth: event.target.value });
  }

  handleFinalGradeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ finalGrade: event.target.value });
  }

  onEditButtonClick = (studentId: string) => {
    this.props.history.push(`/gradebook/${studentId}/edit`)
  }

  onItemCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newItem = await createGradebookItem(this.props.auth.getIdToken(), {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        dateOfBirth: this.state.dateOfBirth
      });
      this.setState({
        items: [...this.state.items, newItem],
        firstName: '',
        lastName: '',
        dateOfBirth: ''
      });
    } catch {
      alert('GradebookItem creation failed')
    }
  }

  onItemDelete = async (studentId: string) => {
    try {
      await deleteGradebookItem(this.props.auth.getIdToken(), studentId);
      this.setState({
        items: this.state.items.filter(item => item.studentId != studentId)
      });
    } catch {
      alert('Todo deletion failed')
    }
  }
/*
  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }*/

  async componentDidMount() {
    try {
      const items = await getGradebookItems(this.props.auth.getIdToken())
      console.log('items ', items);
      this.setState({
        items,
        loadingGradebook: false
      })
    } catch (e) {
      alert(`Failed to fetch items: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Gradebook</Header>

        {this.renderCreateGradebookItemsInput()}

        {this.renderGradebookItems()}
      </div>
    )
  }

  renderCreateGradebookItemsInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <div>
            <Input
              className="ginputs"
              fluid
              placeholder="First Name"
              onChange={this.handleFirstNameChange}
            />
          </div>

          <div>
            <Input
              className="ginputs"
              fluid
              placeholder="Last Name"
              onChange={this.handleLastNameChange}
            />
          </div>

          <div>
            <Input
              className="ginputs"
              fluid
              placeholder="Date Of Birth"
              onChange={this.handleDOBChange}
            />
          </div>

          <div>
            <Input
              className="ginputs"
              fluid
              placeholder="A, B, C, D, F"
              onChange={this.handleFinalGradeChange}
            />  
          </div>

          <Button className="ui primary button">Add Student</Button>
                       
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderGradebookItems() {
    if (this.state.loadingGradebook) {
      return this.renderLoading()
    }

    return this.renderGradebookItemsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Gradebook Items
        </Loader>
      </Grid.Row>
    )
  }

  renderGradebookItemsList() {
    console.log('this.state.items ', this.state.items);
    return (
      <Grid padded>
          {this.state.items.map((item, pos) => {
            return (
              <Grid.Row key={item.studentId}>
                {/* <Grid.Column width={1} verticalAlign="middle">
                  <Checkbox
                    onChange={() => this.onTodoCheck(pos)}
                    checked={item.done}
                  />
                </Grid.Column> */}
                <Grid.Column width={10} verticalAlign="middle">
                  {item.firstName}
                </Grid.Column>
                <Grid.Column width={10} verticalAlign="middle">
                  {item.lastName}
                </Grid.Column>                  
                <Grid.Column width={3} floated="right">
                  {item.dateOfBirth}
                </Grid.Column>
                <Grid.Column width={3} floated="right">
                  {item.finalGrade}
                </Grid.Column>                  
                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(item.studentId)}
                  >
                    <Icon name="pencil" />
                  </Button>
                </Grid.Column>
                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="red"
                    onClick={() => this.onItemDelete(item.studentId)}
                  >
                    <Icon name="delete" />
                  </Button>
                </Grid.Column>
                {item.photoUrl && (
                  <Image src={item.photoUrl} size="small" wrapped />
                )}
                <Grid.Column width={16}>
                  <Divider />
                </Grid.Column>
              </Grid.Row>
            )
          })}
      </Grid>
    )
  }
}
