import React, { Component } from 'react';
import axios from '../../../axios-orders';

import { connect } from "react-redux";
import * as actions from '../../../store/actions/index';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';


import './FullPost.css';

class FullPost extends Component {
    state = {
        loadedPost: null
    }

    queryParams =
      "?auth=" +
      this.props.token +
      '&orderBy="userId"&equalTo="' +
      this.props.userId +
      '"';

    componentDidMount(){
        // console.log(this.props);
        this.loadData()
    }

    componentDidUpdate(){
        this.loadData()
        
    }

    loadData(){
        if(this.props.match.params.id){
            if(this.state.loadedPost === null || (this.state.loadedPost && this.state.loadedPost.id !== this.props.match.params.id)){
                axios.get(`/posts/${this.props.match.params.id}.json?auth=` + this.props.token)
                    .then(response=>{
                        console.log(response)
                        this.setState({loadedPost:{
                            data: response.data,
                            id: this.props.match.params.id}})
                    }
                    ).catch(error => {
                        console.log(error);
                    // this.setState({error: true});
                    });
            }
            
        }       
    }

    deletePostHandler =()=> {
        axios.delete(`/posts/${this.props.match.params.id}.json?auth=` + this.props.token)
        .then(response => { 
            this.props.history.push('/');
        });
    }

    render () {
        let post = <p style={{textAlign:'center'}}>Please select a Post!</p>;
        if(this.props.match.params.id){
            post=<p style={{textAlign:'center'}}>Loading...</p>;
        }
        if(this.state.loadedPost){ post = (
            <div className="FullPost">
                <h1>{this.state.loadedPost.data.content.title}</h1>
                <p>{this.state.loadedPost.data.content.content}</p>
                <div className="Edit">
                    <button className="Delete" onClick={this.deletePostHandler}>Delete</button>
                </div>
            </div>

        );
    }       
        return post;
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
  )(withErrorHandler(FullPost, axios));