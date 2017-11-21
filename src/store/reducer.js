import * as actionTypes from './actions';

const initialState = {
  ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
  }, // temporary
  totalPrice: 4
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] + 1 //es6 way to dynamicly choose property to update
        }
      }
    case actionTypes.REMOVE_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] - 1 //es6 way to dynamicly choose property to update
        }
      }
    default:
      return state;
  }
};

export default reducer;