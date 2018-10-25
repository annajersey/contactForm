import React, {Component} from 'react';
import axios from "axios";

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            message: '',
            formErrors: {email: [], message: []}
        }
    }

    onChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});

    }

    validateFields() {
        let fieldValidationErrors = {email: [], message: []};

        if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) fieldValidationErrors.email.push('Please enter a valid email');
        if (!this.state.message.length) fieldValidationErrors.message.push('Message is required field');
        if (this.state.message.length >= 10) fieldValidationErrors.message.push('Message max length is 1000');

        this.setState({
            formErrors: fieldValidationErrors,
        });

    }

    submitForm(e) {
        e.preventDefault();
        this.validateFields();
        console.log('send')
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

    render() {
        return (
            <form className="contactForm">
                <h2>Contact Form</h2>
                <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
                    <label htmlFor="email">Email</label>
                    <input type="email" required className="form-control" name="email"
                           placeholder="Email"
                           value={this.state.email}
                           onChange={(e) => this.onChange(e)}/>
                    <small className="form-text text-muted">{this.state.formErrors.email.map(e => e)}</small>
                </div>
                <div className={`form-group ${this.errorClass(this.state.formErrors.message)}`}>
                    <label htmlFor="message">Message</label>
                    <textarea maxLength="1000" required className="form-control" name="message"
                              placeholder="Your message here"
                              value={this.state.message}
                              onChange={(e) => this.onChange(e)}/>
                    <small className="form-text text-muted">{this.state.formErrors.message.map(e => e)}</small>
                </div>
                <button type="submit" className="btn btn-primary" onClick={(e) => this.submitForm(e)}>Submit</button>
            </form>
        )
    }
}

export default Form;
