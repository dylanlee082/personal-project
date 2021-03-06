//This is the form for creating a new contact

//Main NPM Imports
import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getContact } from "../../../../ducks/reducers/contactReducer";
import NumberFormat from "react-number-format";

//Material-UI Core Imports
import theme from "../../../../theme";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class ContactForm extends Component {
  state = {
    open: false,
    contact: {
      name: "",
      number: "",
      address: ""
    }
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = e => {
    this.setState({
      contact: { ...this.state.contact, [e.target.name]: e.target.value }
    });
  };

  handleSubmit = () => {
    const { user, getContact } = this.props;
    let regexp = /[0-9+]+/g;
    let num = this.state.contact.number.match(regexp).join("");
    axios
      .post("/api/contact", { ...this.state.contact, id: user.id, number: num })
      .then(res => {
        this.setState({
          contact: {
            name: "",
            number: "",
            address: ""
          }
        });
        this.handleClose();
        getContact(user.id);
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div>
        <Button
          style={{ color: theme.palette.secondary.main }}
          variant="outlined"
          onClick={this.handleClickOpen}
        >
          Create a new Contact
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title" disableTypography={true}>
            Create a new Contact
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              This form is for creating new contacts in your contact book.
            </DialogContentText>
            <TextField
              onChange={e => this.handleChange(e)}
              margin="dense"
              name="name"
              label="Contact Name"
              type="text"
              fullWidth
            />
            <NumberFormat
              customInput={TextField}
              format="+1 (###) ###-####"
              onChange={e => this.handleChange(e)}
              margin="dense"
              name="number"
              label="Contact Number"
              type="text"
              fullWidth
            />
            <TextField
              onChange={e => this.handleChange(e)}
              margin="dense"
              name="address"
              label="Contact Address"
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
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
    user: state.generalReducer.user
  };
};

export default connect(
  mapStateToProps,
  { getContact }
)(ContactForm);
