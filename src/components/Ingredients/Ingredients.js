import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

//#region reducers
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

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...currentHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...currentHttpState, error: null };
    default:
      throw new Error('Should not be reached!');
  }
};
//#endregion

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []); //[]: initial state
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
    // second argument: [userIngredients]: executed when userIngredients change
  }, [userIngredients]);

  //#region Handler
  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({ type: 'SEND' });
    fetch('https://react-hooks-abe70.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application.json' }
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });
      return response.json();
    }).then(responseData => {
      // setUserIngredients(prevIngredients => [...prevIngredients,
      // { id: responseData.name, ...ingredient }]);
      dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } });
    });
  }, []);

  const loadIngredientsHandler = useCallback((loadedIngredients) => {
    //setUserIngredients(loadedIngredients);
    dispatch({ type: 'SET', ingredients: loadedIngredients });
  }, []);

  const removeIngredientHandler = useCallback(ingredientId => {
    dispatchHttp({ type: 'SEND' });
    fetch(`https://react-hooks-abe70.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });
      // setUserIngredients(prevIngredients =>
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      // );
      dispatch({ type: 'DELETE', ingrId: ingredientId });
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', errorMessage: error.message });
    });
  }, []);

  const clearErrorHandler = useCallback( () => {
    dispatchHttp({ type: 'CLEAR' });
  }, []);
  //#endregion

  const ingredientList = useMemo(() => {
    return <IngredientList
      ingredients={userIngredients}
      onRemoveItem={removeIngredientHandler} />
  }, [userIngredients, removeIngredientHandler]); // only re-render when depedencies in [..] change

  return (
    <div className="App">
      {httpState.error ? <ErrorModal onClose={clearErrorHandler}>{httpState.error}</ErrorModal> : null}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={loadIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
