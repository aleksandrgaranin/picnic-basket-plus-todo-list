import React from "react";
import NavigationItem from "./NavigationItem/NavigationItem";
import classes from "./NavigationItems.module.css";

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    {props.isAuthenticated ? (
      <NavigationItem link="/add">Add Item</NavigationItem>
    ) : null}
    {props.isAuthenticated ? (
      <NavigationItem link="/" exact>
        Basket
      </NavigationItem>
    ) : null}
    {props.isAuthenticated ? (
      <NavigationItem link="/purchased">Purchased Items</NavigationItem>
    ) : null}
    {props.isAuthenticated ? (
      <NavigationItem link="/todo">Todo List</NavigationItem>
    ) : null}

    {!props.isAuthenticated ? (
      <NavigationItem link="/auth">Authenticate</NavigationItem>
    ) : (
      <NavigationItem link="/logout">Logout</NavigationItem>
    )}
  </ul>
);

export default navigationItems;
