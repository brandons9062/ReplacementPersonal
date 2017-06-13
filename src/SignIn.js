import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getUsers, getUser, loginUser} from './actions';

class SignIn extends Component{
    
//    componentDidMount(){
//        this.props.getUsers();
//    }
    
    renderField(field){
        const {meta : {touched, error}} = field;
        
        const className = `form-group ${touched && error ? 'has-danger' : ''}`;
        return (
            <div className="form-group">
                <label>{field.label}</label>
                <input
                    className="form-control"
                    type={field.type}
                    {...field.input}
                />
                <div className="text-help">
                    {touched ? error : ''}
                </div>
            </div>
        );
    }
    
    onSubmit(values){
        var un = values.username;
        var up = values.password;
//        for(var key in this.props.users){
//            if(this.props.users[key].username === un){
//                if(this.props.users[key].password === up){
//                    this.props.getUser(this.props.users[key].id);
//                    this.props.history.push('/');
//                    return;
//                }
//            }
//        }
        this.props.loginUser(un, up);
        if(!this.props.users){
            alert("username or password is incorrect")
        } else {
            this.props.history.push('/');
        }
        
    }
    
    
    render(){
        const {handleSubmit} = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <Field
                    name="username"
                    label="Username"
                    type="text"
                    component={this.renderField}
                 />
                <Field
                    name="password"
                    label="Password"
                    type="text"
                    component={this.renderField}
                 />
                <button type='submit' className="btn btn-primary">Sign In</button>
                <Link to='/' className="btn btn-danger">Cancel</Link>
                <button className="btn btn-primary">Sign Up</button>
            </form>
        );
    }
}

function validate(values) {
    const errors = {};
    
    if(!values.username){
        errors.username = "Please enter a Username";
    }
    if(!values.password){
        errors.password = "Please enter your password";
    }
    return errors;
}

function mapStateToProps(state){
    return {users: state.users};
}


export default reduxForm({
    form: 'SignIn',
    validate
})(connect(mapStateToProps, {getUsers, getUser, loginUser})(SignIn));