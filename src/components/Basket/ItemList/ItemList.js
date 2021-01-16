import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import axios from "../../../axios-orders";
import withErrorHendler from "../../../hoc/withErrorHandler/withErrorHandler";

import Item from "./Item/Item";
import Spinner from "../../UI/Spinner/Spinner";
import * as actions from "../../../store/actions/index";

import classes from "./ItemList.module.css";

const ItemList = (props) => {
  const [itemList, setItemList] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const queryParams =
      "?auth=" +
      props.token +
      '&orderBy="userId"&equalTo="' +
      props.userId +
      '"';
    axios
      .get("/list.json" + queryParams)
      .then((res) => {
          console.log(res)
          
        const fetchedList = [];
        for (let key in res.data) {
          if (!res.data[key].purchased) {
            fetchedList.push({
              ...res.data[key],
              id: key,
            });
          }
        }
        setItemList(fetchedList);
        setLoading(false);
        setIsChanged(false);
      })
      .catch((error) => {
        setLoading(true);
      });
  }, [isChanged]);

  const deletePostHandler = (id, index) => {
    axios
      .delete(`/list/${id}.json?auth=` + props.token)
      .then((response) => {
        const updatedItems = [...itemList];
        updatedItems.splice(index, 1);
        setItemList(updatedItems);
      })
      .catch((error) => {
        setLoading(true);
      });
  };

  const purchasedHandler = (identifier, index) => {
    setLoading(true);
    let updatedItem = {};
    const updatedItemList = [...itemList];
    for (let id in updatedItemList) {
      if (updatedItemList[id].id === identifier) {
        updatedItem = {
          itemData: updatedItemList[id].itemData,
          purchased: !updatedItemList[id].purchased,
          userId: updatedItemList[id].userId,
        };
      }
    }

    axios
      .put(`/list/${identifier}.json?auth=` + props.token, updatedItem)
      .then((response) => {
        const updatedItems = [...itemList];
        updatedItems.splice(index, 1);
        setItemList(updatedItems);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(true);
      });
  };

  const isChangedHandler = () => {
    setIsChanged(true);
  };

  let list = <Spinner />;
  if (!loading && itemList) {
    list = itemList.map((item, index) => (
      <section className={classes.IngredientList} key={item.id}>
        <ul>
          <li>
            <Item
              key={item.id}
              id={item.id}
              category={item.itemData.category}
              name={item.itemData.name}
              quantity={item.itemData.quantity}
              price={item.itemData.price}
              note={item.itemData.note}
              purchased={item.purchased}
              deletePost={deletePostHandler.bind(this, item.id, index)}
              purchaseItem={purchasedHandler.bind(this, item.id, index)}
              isChanged={isChangedHandler}
            />
          </li>
        </ul>
      </section>
    ));
  }
  let informationOrList = list;
  if (itemList && itemList.length === 0 && !loading) {
    informationOrList = (
      <p style={{ textAlign: "center", color: "blueviolet" }}>List is Empty </p>
    );
  }

  return <div className={classes.ItemList}>{informationOrList}</div>;
};

const mapStateToProps = (state) => {
  return {
    // orders: state.ordr.orders,
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
)(withErrorHendler(ItemList, axios));
