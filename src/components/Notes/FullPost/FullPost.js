import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import './FullPost.css';
import UpdatePost from './UpdatePost/UpdatePost';



const FullPost = (props) => {
  const [loadedPost, setLoadedPost] = useState(null);
  const [updatePost, setUpdatePost] = useState(false);

  const queryParams =
    "?auth=" +
    props.token +
    '&orderBy="userId"&equalTo="' +
    props.userId +
    '"';

  useEffect(() => {
    if (props.match.params.id) {
      if (loadedPost === null || (loadedPost && loadedPost.id !== props.match.params.id)) {
        axios.get(`/posts/${props.match.params.id}.json?auth=` + props.token)
          .then(response => {
            console.log(response)

            setLoadedPost({
              data: response.data,
              id: props.match.params.id
            })
          })
          .catch(error => {
            console.log(error);
          });
      }

    }
    console.log(props)
  }, [props.match.params.id]);


  const deletePostHandler = () => {
    axios.delete(`/posts/${props.match.params.id}.json?auth=` + props.token)
      .then(response => {
        props.history.push('/');
      });
  }
  const editPostHandler = () => {
    setUpdatePost(!updatePost)
  }


  let post = <p style={{ textAlign: 'center' }}>Please select a Post!</p>;
  if (props.match.params.id) {
    post = <p style={{ textAlign: 'center' }}>Loading...</p>;
  }
  if (loadedPost) {
    post = (
      <div className="FullPost">
        <h4>{loadedPost.data.content.title}</h4>
        <p>{loadedPost.data.content.content}</p>
        <div className="Edit">
          <button className="Edit" onClick={editPostHandler}>Edit</button>
          <button className="Delete" onClick={deletePostHandler}>Delete</button>
        </div>
      </div>

    );
    if (updatePost && loadedPost) {
      post = (
        <UpdatePost
          id={props.match.params.id}
          title={loadedPost.data.content.title}
          content={loadedPost.data.content.content}
          updateToggle={editPostHandler}
          renderList={props.isChanged}

        />
      );
    }
  }
  return post;

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