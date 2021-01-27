import React, { useState, useEffect } from 'react';
import Post from './Post/Post';
import { Route } from 'react-router-dom';
import FullPost from '../FullPost/FullPost';
import Spinner from '../../UI/Spinner/Spinner';
import axios from '../../../axios-orders';
import './Posts.css';

import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";

import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";

const Posts = (props) => {
  const [postList, setPostList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);


  

  useEffect(() => {
    const queryParams =
    "?auth=" +
    props.token +
    '&orderBy="userId"&equalTo="' +
    props.userId +
    '"';
    console.log(props);
    axios.get('/posts.json' + queryParams)
      .then(res => {
        console.log(res)
        let fetchedList = [];
        for (let key in res.data) {
          fetchedList.push({
            ...res.data[key],
            id: key,
          });
        }
        setPostList(fetchedList);
        setLoading(false);
        setIsChanged(false);
        // console.log(isChanged);
      }).catch(error => {
        setLoading(true);
        console.log(error);
      });
  }, [isChanged]);


  const postSelectedHandler = (id) => {
    props.history.push({ pathname: '/posts/' + id });
  };

  const isChangedHandler = () => {
    setIsChanged(true);
  };


  let posts = <Spinner />
  if (!loading && postList) {
    posts = postList.map(post => {
      return (
        <Post
          key={post.id}
          title={post.content.title}
          isChanged={isChangedHandler}
          clicked={() => postSelectedHandler(post.id)          
          }
        />
      );
    })
  }
  return (
    <div>
      <section className="Posts">
        {posts}
      </section>
      <Route path={props.match.url + '/:id'} exact render={props => (<FullPost {...props} isChanged={isChangedHandler}/>)} />
        
    </div>
  );
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
