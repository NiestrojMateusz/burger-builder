import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';


class BurgerBuilder extends Component {
  state = {
    purchasing: false,
  }

  componentDidMount () {
    this.props.onInitIngredients();
  }
  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({purchasing: true})
    } else {
      this.props.history.push('/auth');
    }
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false})
  }

  purchaseContinuelHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push('/checkout')
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
                .map((igKey) => {
                  return ingredients[igKey];
                })
                .reduce((sum, el) => {
                  return sum + el;
                }, 0);
    return sum > 0;
  }

  render () {
    const disabledInfo = {
      ...this.props.ings
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;

    let burger =  this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />
    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
            <BuildControls
              ingredientAdded={this.props.onIngredientAdded}
              ingredientRemove={this.props.onIngredientRemove}
              disabled={disabledInfo}
              purchaseable={this.updatePurchaseState(this.props.ings)}
              ordered={this.purchaseHandler}
              price={this.props.price}
              isAuth={this.props.isAuthenticated}/>
        </Aux>
      );
      orderSummary = <OrderSummary
        ingredients={this.props.ings}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinue={this.purchaseContinuelHandler}
        price={this.props.price}/>;
    }
    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemove: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));