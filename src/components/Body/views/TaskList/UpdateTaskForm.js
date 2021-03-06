//This is the pop-up form for updating an already created task

//Main NPM Imports
import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
  updateTaskToggle,
  getTask
} from "../../../../ducks/reducers/taskReducer";

//Material-UI Core Imports
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class UpdateTaskForm extends Component {
  constructor() {
    super();
    this.state = {
      task: {
        list_name: "",
        body: ""
      }
    };
  }

  componentDidUpdate = prevProps => {
    if (this.props.task.body !== prevProps.task.body) {
      this.setState({ task: this.props.task });
    }
  };

  handleChange = e => {
    this.setState({
      task: { ...this.state.task, [e.target.name]: e.target.value }
    });
  };

  handleSubmit = () => {
    axios.put("/api/task", this.state.task).then(res => {
      this.props.updateTaskToggle(this.props.open);
      this.props.getTask(this.props.user.id);
    });
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={() => this.props.updateTaskToggle(this.props.open)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title" disableTypography={true}>
            Edit Task
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              To update your task edit it below and press submit.
            </DialogContentText>
            <TextField
              margin="dense"
              label="What is this task?"
              value={this.state.task.body}
              type="string"
              name="body"
              fullWidth
              onChange={e => this.handleChange(e)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.props.updateTaskToggle(this.props.open);
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={() => this.handleSubmit()} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    open: state.taskReducer.updateTaskToggle,
    taskList: state.taskReducer.taskList,
    task: state.taskReducer.task,
    user: state.generalReducer.user
  };
};

export default connect(
  mapStateToProps,
  { updateTaskToggle, getTask }
)(UpdateTaskForm);
