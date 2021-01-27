import React, { useState, useEffect } from 'react';

import { connect } from "react-redux";
import withErrorHandler from '../../../../hoc/withErrorHandler/withErrorHandler';
import { NavLink } from 'react-router-dom';

import { updateObject, checkValidity } from "../../../../shared/utility";

import Input from "../../../../components/UI/Input/Input";
import Button from "../../../../components/UI/Button/Button";
import Spinner from "../../../../components/UI/Spinner/Spinner";

import classes from './UpdatePost.module.css';
import axios from '../../../../axios-orders';

const UpdatePost = (props) => {
    const [controls, setControls] = useState({
        title: {
            elementType: "input",
            elementConfig: {
              type: "name",
              placeholder: "Title",
            },
            value: props.title,
            validation: {
              required: true,
              minLength: 3,
              maxLength: 100,
            },
            valid: true,
            touched: true,
          },
        content: {
            elementType: "textarea",
            elementConfig: {
              type: "textarea",
              placeholder: "Content",
            },
            value: props.content,
            validation: {
              required: true,
              minLength: 6,
              maxLength: 1000,
            },
            valid: true,
            touched: true,
        },        
        
    })        
    const [formIsValid, setFormIsValid] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(false);
        // console.log(props.renderList)
    }, []);

    const submitHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        const ItemFormData = {};
        for (let formElementIdentifier in controls) {
          ItemFormData[formElementIdentifier] =
            controls[formElementIdentifier].value;
        }
        const item = {
          content: ItemFormData,
          userId: props.userId,
        };
        
        axios
          .put(`/posts/${props.id}.json?auth=` + props.token, item)
          .then((response) => {
            // props.closed()
            setLoading(true);
            props.updateInfo();
            props.updateToggle();
            props.renderList()
          })
          .catch((error) => {
            console.log(error)
            setLoading(true);
          });
      };
    const inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(controls, {
          [controlName]: updateObject(controls[controlName], {
            value: event.target.value,
            valid: checkValidity(
              event.target.value,
              controls[controlName].validation
            ),
            touched: true,
          }),
        });
        let formIsValid = true; // Over all validation
        for (let inputIdentifier in updatedControls) {
          formIsValid = updatedControls[inputIdentifier].valid && formIsValid;
        }
    
        setControls(updatedControls);
        setFormIsValid(formIsValid);
      };

      const formElementsArrey = [];
      for (let key in controls) {
        formElementsArrey.push({
          id: key,
          config: controls[key],
        });
      }

      let form = formElementsArrey.map((formElement) => (
        <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          changed={(event) => inputChangedHandler(event, formElement.id)}
        />
      ));
    
      if (props.loading) {
        form = <Spinner />;
      }
    
      return (
        <div className={classes.AddItemModal}>
         
          <p style={{ color: "blueviolet" }}>Update the Note</p>
          <form className={classes.Form} onSubmit={submitHandler}>
            {form}
            <Button btnType="Success" disabled={!formIsValid}>
              Submit
            </Button>
          </form>
        </div>
      );
}

const mapStateToProps = (state) => {
    return {
      token: state.auth.token,
      loading: state.auth.loading,
      error: state.auth.error,
      isAuthenticated: state.auth.token !== null,
      userId: state.auth.userId,
    };
  };
  
  export default connect(
    mapStateToProps,
    null
  )(withErrorHandler(UpdatePost, axios));