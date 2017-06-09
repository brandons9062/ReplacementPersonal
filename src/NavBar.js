import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './index.css';

class NavBar extends Component {
    render(){
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
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;