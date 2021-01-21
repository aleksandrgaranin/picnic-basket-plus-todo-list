import React from 'react';

import './Post.css';

const post = (props) => {
    
    return(
        <article className="Post" onClick={props.clicked}>
            <div>{props.title}</div>            
        </article>
    )
};

export default post;