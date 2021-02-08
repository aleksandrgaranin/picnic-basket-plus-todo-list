import React, { useState } from "react";
import classes from "./Item.module.css";
import ItemDetail from "../ItemDetail/ItemDetail";
import Aux from "../../../../hoc/Auxx/Auxx";
import Button from "../../../UI/Button/Button";
import axios from "../../../../axios-orders";

import { connect } from "react-redux";
import withErrorHendler from "../../../../hoc/withErrorHandler/withErrorHandler";

const Item = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [updateItem, setUpdateItem] = useState(false);

  const showDetatilsHandler = () => {
    setShowDetails(!showDetails);
    setUpdateItem(false);
  };

  const itemUpdateHandler = () => {
    setUpdateItem(!updateItem);
  };

  return (
    <Aux>
      <div className={showDetails ? classes.ItemCol : classes.ItemRow}>
        <ItemDetail
          key={props.id}
          {...props}
          show={showDetails}
          updateItem={updateItem}
          isChanged={props.isChanged}
          delete={props.deletePost}
          update={itemUpdateHandler}
        />
        <div className={!showDetails?classes.ItemButtonShort : classes.ItemButtonLong}>
          <Button btnType="Success" clicked={showDetatilsHandler}>
            {!showDetails ? <p>MORE</p> : <p>LESS </p>}
          </Button>
        </div>
      </div>
    </Aux>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.ordr.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

export default connect(mapStateToProps, null)(withErrorHendler(Item, axios));
