import React, {Component} from 'react';
import {connect} from 'react-redux';



class Stats extends Component {
    render(){
        return (
            <div>
                <div>
                    <h1>My Stats</h1>
                </div>
                <ul>
                    <li>My Top Score: {this.props.users.highscore}</li>
                    <li>My Total Coins: {this.props.users.totalcoins}</li>
                </ul>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {users: state.users}
}

export default connect(mapStateToProps, null)(Stats);