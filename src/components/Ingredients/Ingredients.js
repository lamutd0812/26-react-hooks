import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ingr => ingr.id !== action.ingrId);
    default:
      throw new Error('Should not get there!');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []); //[]: initial state
  const {
    isLoading,
    error,
    data,
    reqExtra,
    reqIdentifier,
    sendRequest,
    clear } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', ingrId: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({ type: 'ADD', ingredient: { id: data.name, ...reqExtra } });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  //#region Handler
  const addIngredientHandler = useCallback(ingredient => {
    sendRequest('https://react-hooks-abe70.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
  }, [sendRequest]);

  const loadIngredientsHandler = useCallback((loadedIngredients) => {
    //setUserIngredients(loadedIngredients);
    dispatch({ type: 'SET', ingredients: loadedIngredients });
  }, []);

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(`https://react-hooks-abe70.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE',
      null,
      ingredientId,
      'REMOVE_INGREDIENT');
  }, [sendRequest]);
  //#endregion

  const ingredientList = useMemo(() => {
    return <IngredientList
      ingredients={userIngredients}
      onRemoveItem={removeIngredientHandler} />
  }, [userIngredients, removeIngredientHandler]); // only re-render when depedencies in [..] change

  return (
    <div className="App">
      {error ? <ErrorModal onClose={clear}>{error}</ErrorModal> : null}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading} />

      <section>
        <Search onLoadIngredients={loadIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
