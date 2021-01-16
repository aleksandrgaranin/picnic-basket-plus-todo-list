import React, { useEffect } from 'react';
import { connect } from 'react-redux'

import axios from '../../axios-orders';
import withErrorHendler from '../../hoc/withErrorHandler/withErrorHandler';

import Order from '../../components/Order/Order';
import Spinner from '../../components/UI/Spinner/Spinner'
import * as actions from '../../store/actions/index';


const Orders = props => {  
    const { onFetchOrder } = props 
    useEffect(() => {
        onFetchOrder(props.token, props.userId);
    }, [onFetchOrder])

        let orders = <Spinner />;
        if (!props.loading) {
            orders = props.orders.map(order => (
                <Order                         
                    key={order.id}
                    ingredients={order.ingredients}
                    price={order.price} />
            ))
        }
        return (
            <div>
                {orders}
            </div>
        );
    
}

const mapStateToProps = state => {
    return{
        orders: state.ordr.orders,
        loading: state.ordr.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrder: (token, userId) => dispatch(actions.fetchOrders(token, userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHendler(Orders, axios));