import React, { Component } from 'react';
import Posts from '../../components/Notes/Posts/Posts';
import { BrowserRouter, Route, NavLink, Switch, Redirect } from 'react-router-dom';
import NewPost from '../../components/Notes/NewPost/NewPost';
import UpdatePost from '../../components/Notes/FullPost/UpdatePost/UpdatePost';

import './Notes.css';

// const NewPost = React.lazy(() => {
//     return import("../../components/Notes/NewPost/NewPost");
//   });

class Notes extends Component {  
    render () { 
        return (
            <div>
                <div className="Blog">
                     <header>
                        <nav>
                            <ul>
                                <li><NavLink 
                                    to="/posts"
                                    exact
                                    activeClassName="my-active"
                                    activeStyle={{
                                        color: '#fa923f',
                                        textDecoration: 'underline'
                                    }}
                                >Notes</NavLink></li>
                                <li><NavLink to={{
                                    pathname: "/new-post",
                                    hash: '#submit',
                                    search: '?quick-submit=true'
                                }}>New Note</NavLink></li>
                            </ul>
                        </nav>
                    </header>  
                    <BrowserRouter>
                        <Switch>
                            <Route path="/new-post" component={NewPost}/>
                            <Route path="/posts"  component={Posts}/>s                            
                            <Redirect from="/" to="/posts"/>
                        </Switch>    
                    </BrowserRouter>                  
                </div> 
            </div>
        );
    }
}

export default Notes;