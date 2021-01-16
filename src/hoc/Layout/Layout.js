import React, { useState } from 'react';
import { connect } from 'react-redux';

import classes from './Layout.module.css';
import Aux from '../Auxx/Auxx';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';




const Layout = (props) =>{
    const [showSideDrawer, setShowSideDrawer] = useState(false)
    
    const sideDrawerClosedHandler =()=>{
        setShowSideDrawer(false);
    }

    const sideDrawerToggleHandler = () =>{
        setShowSideDrawer(!showSideDrawer);
    }

    
        return(
            <Aux>                
                <Toolbar  
                    isAuth = {props.isAuthenticated}
                    open={sideDrawerToggleHandler}/>
                <SideDrawer 
                    isAuth = {props.isAuthenticated}
                    open={showSideDrawer} 
                    closed={sideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    {props.children}
                </main>
            </Aux>
        );
    
} 

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Layout);