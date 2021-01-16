import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import Spinner from '../../../UI/Spinner/Spinner';
import classes from './AddItemModal.module.css';
import * as actions from '../../../../store/actions/index';
import { updateObject, checkValidity } from '../../../../shared/utility';
import axios from '../../../../axios-orders';

const AddItemModal = props => {
    const [controls, setControls] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'name',
                placeholder: 'Item Name'
            },
            value: '',
            validation: {
                required: true,
                minLength: 3,
                maxLength: 100
            },
            valid: false,
            touched: false
        },           
        quantity: {
            elementType: 'input',
            elementConfig: {
                type: 'quantity',
                placeholder: 'Quantity'
            },
            value: '',
            validation: {
                required: true,
                minLength: 1,
                maxLength: 100
            },
            valid: false,
            touched: false,            
        },
        price: {
            elementType: 'input',
            elementConfig: {
                type: 'price',
                placeholder: 'Possible Price'
            },
            value: '',
            validation: {
                required: true,
                minLength: 2,
                maxLength: 100
            },
            valid: false,
            touched: false,            
        },
        note: {
            elementType: 'textarea',
            elementConfig: {
                type: 'textarea',
                placeholder: 'Some Notes'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6,
                maxLength: 300
            },
            valid: false,
            touched: false,            
        },
    }); 

    const [formIsValid, setFormIsValid] = useState(false);
    const [purchased, setPurchased] = useState(false);
    const [loading, setLoading] = useState(true)
    
    useEffect(()=> {
        setLoading(false)
    },[])
    
    const submitHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        const ItemFormData = {}
        for (let formElementIdentifier in controls){
            ItemFormData[formElementIdentifier] = controls[formElementIdentifier].value
        }        
        const item = {
            itemData: ItemFormData,
            userId: props.userId,
            purchased: purchased
        }
        axios.post('/list.json?auth=' + props.token, item)
            .then(response => {      
                // props.closed()          
                setLoading(false);
                props.history.push("/")
            })
            .catch(error => {
                setLoading(true);
            });
                   
    }    
 
   

    const inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(controls, {
            [controlName]: updateObject(controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, controls[controlName].validation),
                touched: true
            })
        });
        let formIsValid = true; // Over all validation
        for (let inputIdentifier in updatedControls) {
            formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
        }


        setControls(updatedControls);
        setFormIsValid(formIsValid);
    }   
    
        const formElementsArrey = [];
        for (let key in controls){
            formElementsArrey.push({
                id: key,
                config: controls[key]
            });
        }

        let form = formElementsArrey.map(formElement => (           
                <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event)=> inputChangedHandler(event, formElement.id)}/>  
        ))

        if (props.loading) {
            form = <Spinner/>
        }

        return(
            <div className={classes.AddItemModal}>
                <p style={{color:"blueviolet"}}>ADD ITEM</p>
                <form className={classes.Form} onSubmit={submitHandler} >
                    {form}
                    <Button btnType="Success" disabled={!formIsValid} >Submit</Button>
                </form>                
            </div>
        );
    
};

const mapStateToProps = state => {
    return{
        token: state.auth.token,
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.bbr.building,
        authRedirectPath: state.auth.authRedirectPath,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return{ 
        onAuth:(email, password, isSingup) => dispatch(actions.auth(email, password, isSingup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( AddItemModal );