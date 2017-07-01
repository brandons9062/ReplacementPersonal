import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
//import PropTypes from 'prop-types';
import './index.css';
//import Auth from './Auth/Auth';
import {logoutUser} from './actions';

class NavBar extends Component {
//    goTo(route){
//        this.props.history.replace(`/${route}`)
//    }
//    
    
//    
//    login(){
//        console.log(this.props.auth)
//        this.props.auth.login()
//    }
//    
//    logout(){
//        this.props.auth.logout()
//    }   
    
    render(){
//        const {isAuthenticated} = this.props.auth
//        
//        
        const guestLinks = (
            <li>
                <a href='http://localhost:8080/auth'>
                    <h4>Login</h4>
                </a>
            </li>
        );
//        
        const userLinks = (
            <li>
                <a onClick={this.props.logoutUser} href='http://localhost:8080/auth/logout'>
                    <h4>Logout</h4>
                </a>
            </li>
        );
        
        return (
            <nav id="myNav" className="navbar navbar-inverse myNav sticky-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar1">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link to="/" className="navbar-left">
                            <div className="navbarLogoContainer">
                                <img className="navbarLogo" src="https://cynet-web.com/wp-content/uploads/2015/05/SEO-SPACESHIP-ICON-CYNET-white-250px.png" alt="" />
                            </div>
                        </Link>
                    </div>
                    <div className="collapse navbar-collapse" id="navbar1">
                        <ul className="nav navbar-nav">
                            <li>
                                <Link to="/">
                                    <h4 className="active">Game Screen</h4>
                                </Link>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <Link to="/stats">
                                    <h4>Your Stats</h4>
                                </Link>
                            </li>
                            {this.props.users.id ? userLinks : guestLinks}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
//
//
function mapStateToProps(state){
    return {users: state.users};
}


export default connect(mapStateToProps, {logoutUser})(NavBar);