import React from 'react';
import basketLogo from '../../assets/images/basket-logo.png'
import classes from './Logo.module.css';


const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={basketLogo} alt="MyBasket"></img>
    </div>
);

export default logo;