import React, { Component } from 'react';
import Post from './Post/Post';
import { Route } from 'react-router-dom';
import FullPost from '../FullPost/FullPost';
import axios from '../../../axios-posts';
import './Posts.css';

import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";

import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";

class Posts extends Component {
    state = {
        posts: []        
    }

    componentDidMount(){
        console.log(this.props);
        axios.get('/posts')
            .then(response => {
                const posts =response.data.slice(0, 4);
                const updatedPosts = posts.map(post =>{
                    return {
                        ...post,
                        author: 'Max'
                    }
                });
                this.setState({posts:updatedPosts});
                //console.log(updatedPosts);
            }).catch(error => {
                console.log(error);
                // this.setState({error: true});
            });
        
    }

    postSelectedHandler = (id)=> {
        this.props.history.push({pathname: '/posts/' + id});
        // this.props.history.push('/' + id);
    }

    render(){
        let posts = <p style={{textAlign:'center'}}>Something went wrong!</p>;
        if (!this.state.error){
            posts = this.state.posts.map(post => {
                return (
                // <Link to={'/posts/' + post.id} >
                <Post     
                    key={post.id}                    
                    title={post.title} 
                    author={post.author}
                    clicked={()=> this.postSelectedHandler(post.id)
                }
                />
                // </Link>
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
