import React, { Component } from 'react';
import Post from './Post/Post';
import { Route } from 'react-router-dom';
import FullPost from '../FullPost/FullPost';
import axios from '../../../axios-orders';
import './Posts.css';

import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";

import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";

class Posts extends Component {
    state = {
        posts: []        
    }
    queryParams =
      "?auth=" +
      this.props.token +
      '&orderBy="userId"&equalTo="' +
      this.props.userId +
      '"';

    componentDidMount(){
        console.log(this.props);
        axios.get('/posts.json' + this.queryParams)
            .then(res => {
                console.log(res)
                let posts = [];
                for (let key in res.data) {
                    posts.push({
                        ...res.data[key],
                        id: key,
                    });
                }
                this.setState({posts:posts});
            }).catch(error => {
                console.log(error);
            });
        
    }

    postSelectedHandler = (id)=> {
        this.props.history.push({pathname: '/posts/' + id});
    }

    render(){
        let posts = <p style={{textAlign:'center'}}>Something went wrong!</p>;
        if (!this.state.error){
            posts = this.state.posts.map(post => {
                return (
                <Post     
                    key={post.id}                    
                    title={post.content.title}
                    clicked={()=> this.postSelectedHandler(post.id)
                }
                />
            );
        })
        }
        return(
            <div>
                <section className="Posts">
                    {posts}
                </section>
                <Route path={this.props.match.url + '/:id'} exact component={FullPost}/>      
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
  )(withErrorHandler(Posts, axios));
