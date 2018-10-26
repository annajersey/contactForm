import React, {Component} from "react";
import axios from "axios";
import loader from "./loader.gif";

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            message: "",
            formErrors: {email: [], message: []},
            isLoading: false,
            success: false
        };
    }

    onChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
    }

    validateFields() {
        const fieldValidationErrors = {email: [], message: []};

        if (!this.state.email.match(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i)) {
            fieldValidationErrors.email.push("Please enter a valid email");
        }
        if (!this.state.message.length) {
            fieldValidationErrors.message.push("Message is a required field");
        }
        if (this.state.message.length > 1000) {
            fieldValidationErrors.message.push("Message max length is 1000");
        }

        this.setState({
            formErrors: fieldValidationErrors,
        });

        if (!fieldValidationErrors.email.length && !fieldValidationErrors.message.length) {
            return true;
        }
        return false;
    }

    submitForm(e) {
        e.preventDefault();
        if (this.validateFields()) {
            this.setState({
                isLoading: true
            });
            axios.post("https://dcodeit.net/oleksii.babich/language-test/public/index.php/api/messages", {
                email: this.state.email,
                text: this.state.message
            })
                .then((response) => {
                    if (response.data.id) {
                        this.setState({
                            isLoading: false,
                            success: true,
                            formErrors: {email: [], message: []}
                        });
                    }
                })
                .catch((error) => {
                    if (error.response.data.errors) {
                        const errors = error.response.data.errors;
                        this.setState({ //show validation errors from server
                            formErrors: {
                                email: errors.email ? errors.email : [],
                                message: errors.text ? errors.text : []
                            }
                        });
                    }
                    this.setState({
                        isLoading: false
                    });
                });
        }
    }

    errorClass(error) {
        return (error.length === 0 ? "" : "has-error");
    }

    render() {
        console.log(this.state.formErrors);
        return (
            <form className="contactForm">
                <h2>Contact Form</h2>
                <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
                    <label htmlFor="email">Email</label>
                    <input type="email" required className="form-control" name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={(e) => this.onChange(e)}/>
                    <small className="form-text text-error">{this.state.formErrors.email.map(e => e)}</small>
                </div>
                <div className={`form-group ${this.errorClass(this.state.formErrors.message)}`}>
                    <label htmlFor="message">Message</label>
                    <textarea rows="10" maxLength="1000" required className="form-control" name="message"
                        placeholder="Your message here"
                        value={this.state.message}
                        onChange={(e) => this.onChange(e)}/>
                    <small className="form-text text-error">{this.state.formErrors.message.map(e => e)}</small>
                </div>
                <button type="submit" className="btn btn-primary" onClick={(e) => this.submitForm(e)}>Submit
                </button>
                <div className="result">
                    {this.state.isLoading && <img src={loader} alt="loader" className="loader"/>}
                    {this.state.success && <span>Your message was sent</span>}
                </div>
            </form>
        );
    }
}

export default Form;
