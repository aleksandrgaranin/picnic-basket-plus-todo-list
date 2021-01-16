import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../../containers/Checkout/ContactData/ContactData';





const Checkout = props => {        

    const checkoutCanceledHandler = () => {
        props.history.goBack();
    }

    const checkoutContinuedHandler = () => {
        props.history.replace('/checkout/contact-data');
    }

        let summary = <Redirect to="/"/>
        
        if (props.ing) {
            const purchasedRedirect = props.purchased ? <Redirect to="/"/> : null;
            summary =  (
                <div>
                    {purchasedRedirect}
                    <CheckoutSummary 
                        ingredients={props.ing}
                        checkoutCanceled={checkoutCanceledHandler}
                        checkoutContinued={checkoutContinuedHandler}
                    />
                    <Route 
                        path={props.match.path + '/contact-data'} 
                        component={ContactData}
                    />
                </div>               
            )
        }
        return summary;
    
}

const mapStateToProps = state => {
    return {
        ing: state.bbr.ingredients,    
        purchased: state.ordr.purchased    
    }
};




export default connect(mapStateToProps)(Checkout);