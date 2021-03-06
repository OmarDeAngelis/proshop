import React, { useState, useEffect } from "react";
//Custom Component & functions
import CheckoutContainer from "../components/checkout/CheckoutContainer";
import { totalPrice } from "../utils/helpers";
import { createNewOrder } from "../reducers/actions/orderActions";
//React-router-dom
import { Link as RouterLink } from "react-router-dom";
//React-Redux
import { useSelector, useDispatch } from "react-redux";
//Material UI
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "1rem",
  },
  listItem: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  name: {
    color: "var(--color-primary)",
    fontWeight: 700,
  },
  quantity: {
    color: theme.palette.primary.contrastText,
    border: "1px solid var(--extra-lt-black)",
    padding: "0 0.225rem",
    borderRadius: "var(--radius)",
    backgroundColor: "var(--color-primary)",
  },
  datailsSection: {
    display: "grid",
    gap: theme.spacing(1),
  },
  datailsFlex: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  btnSection: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",
  },
  buttons: {
    display: "flex",
    gap: theme.spacing(5),
  },
}));

const PlaceOrderScreen = () => {
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const {
    shipping: { indirizzo1, city, cap, paese },
  } = useSelector((state) => state.getShippingAddress);

  const subTotal = cartItems.length > 0 ? totalPrice(cartItems) : 0;

  const shippingTax =
    cartItems.length > 0 ? (totalPrice(cartItems) / 100).toFixed(2) : 0;
  const total = +subTotal + +shippingTax;

  const handleClick = async (event) => {
    dispatch(createNewOrder());
  };

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }
    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);
  if (message) {
    return (
      <Alert variant="filled" color="info">
        {message}
      </Alert>
    );
  }
  return (
    <CheckoutContainer step={2}>
      <Grid container spacing={8} className={classes.root}>
        <Grid item xs={12} md={6}>
          <div>
            <Typography variant="h6">Carrello</Typography>
            <Divider />
            <List>
              {cartItems.length > 0 &&
                cartItems.map((item) => {
                  return (
                    <ListItem key={item._id}>
                      <ListItemAvatar>
                        <Avatar
                          variant="square"
                          src={item.image}
                          className={classes.avatar}
                        />
                      </ListItemAvatar>
                      <article className={classes.listItem}>
                        <div>
                          <p className={classes.name}>{item.name}</p>
                          <Typography color="textSecondary">
                            {(item.qty * item.price).toFixed(2)} €
                          </Typography>
                        </div>
                        <Typography
                          className={classes.quantity}
                          variant="subtitle2"
                        >
                          {item.qty}
                        </Typography>
                      </article>
                    </ListItem>
                  );
                })}
            </List>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Dettagli</Typography>
          <div className={classes.datailsSection}>
            <div>
              <Divider />
              <div className={classes.datailsFlex}>
                <Typography>Nome</Typography>
                <Typography className={classes.name}>
                  {" "}
                  email@exmple.com
                </Typography>
              </div>
              <Typography>{`${indirizzo1}, ${city}, ${cap}`}</Typography>
              <Typography>{paese}</Typography>
            </div>
            <Divider />
            <section>
              <div className={classes.datailsFlex}>
                <Typography className={classes.name}>Carrello:</Typography>
                <Typography className={classes.name}>{subTotal} €</Typography>
              </div>
              <div className={classes.datailsFlex}>
                <Typography className={classes.name}>Spedizione:</Typography>
                <Typography className={classes.name}>
                  {shippingTax} €
                </Typography>
              </div>
              <div className={classes.datailsFlex}>
                <Typography className={classes.name}>Total:</Typography>
                <Typography className={classes.name}>{total} €</Typography>
              </div>
            </section>
            <div className={classes.btnSection}>
              <div className={classes.buttons}>
                <Button
                  variant="text"
                  component={RouterLink}
                  to="/paymentmethod"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  type="button"
                  id="checkout-button"
                  role="link"
                  onClick={handleClick}
                  color="primary"
                  className={`btn`}
                  fullwidth
                >
                  Crea ordine
                </Button>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </CheckoutContainer>
  );
};

export default PlaceOrderScreen;
