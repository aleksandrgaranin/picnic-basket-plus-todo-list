import React, { Component } from 'react';

import { connect } from "react-redux";
import * as actions from '../../../store/actions/index';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import { NavLink, Redirect } from 'react-router-dom';

import './NewPost.css';
import axios from '../../../axios-orders';

class NewPost extends Component {
    state = {
        title: '',
        content: '',        
        submitted: false,
        userId: ''
        
    };

    queryParams =
      "?auth=" +
      this.props.token +
      '&orderBy="userId"&equalTo="' +
      this.props.userId +
      '"';

    componentDidMount(){
        console.log(this.props);
    }

    postDadaHandler=()=>{
        const data ={
            title: this.state.title,
            body: this.state.content,
            userId: this.props.userId
        }
        axios.post('/posts.json?auth=' + this.props.token, data)
            .then(responce=> {
                console.log(responce);
                // this.props.history.push('/posts');
                this.setState({submitted: true});
            });
    }
    
    render () {
        let redirect = null;
        if (this.state.submitted){
            redirect = <Redirect to="/posts" />
        }
        return (
            <div>

                <header>
                        <nav className="Nav">
                            <ul>
                                <li><NavLink 
                                    to="/posts"
                                    exact
                                    activeClassName="my-active"
                                    activeStyle={{
                                        color: '#fa923f',
                                        textDecoration: 'underline'
                                    }}
                                >Posts</NavLink></li>
                            </ul>
                        </nav>
                    </header>  
            <div className="NewPost">
                {redirect}
                <h1>Add a Post</h1>
                <label>Title</label>
                <input type="text" value={this.state.title} onChange={(event) => this.setState({title: event.target.value})} />
                <label>Content</label>
                <textarea rows="4" value={this.state.content} onChange={(event) => this.setState({content: event.target.value})} />
                <button onClick={this.postDadaHandler}>Add Post</button>
            </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      loading: state.ordr.loading,
      token: state.auth.token,
      userId: state.auth.userId,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      onFetchOrder: (token, userId) =>
        dispatch(actions.fetchOrders(token, userId)),
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withErrorHandler(NewPost, axios));