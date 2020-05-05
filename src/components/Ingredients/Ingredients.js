import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

// custom hook for fetching requests
import useFetch from '../../hooks/fetch'

/**
 * create a reducer outside of the component so it 
 * isn't recreated every render cycle
 */
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      const ingsArray = currentIngredients.filter( ing => ing.id !== action.id);
      console.log('new ingsArray: ', ingsArray);
      return ingsArray;
    default:
      throw new Error("ingredientReducer - we should never get here");
  }
}

const Ingredients = () => {
  /**
   * useReducer needs the actual reducer (ingredientReducer defined above)
   * and the initial state - []
   * it returns an array (userIngredients and a dispatch function)
   */
  const [ userIngredients, dispatch ] = useReducer(ingredientReducer, []);
  const {
    isLoading, 
    error, 
    data, 
    extraData, 
    requestType, 
    sendRequest
  } = useFetch();
 
  const addIngredientHandler = useCallback((ing) => {
    /** 
     * adding parts from the customm hook
    */
   const url = 'https://react-hooks-9a19a.firebaseio.com/ingredients.json';
   const method = 'POST';
   const body = JSON.stringify(ing);
   const requestType = 'ADD';
   sendRequest( url, method, body, ing, requestType );

  }, []);

  /**
   * Write code so that it still works without useMemo — and then add it to optimize performance!!!!
   */
  const removeIngredient = useCallback(ingId => {
    /**
     * this is all that is needed when using the useFetch hook
     */
    const url = `https://react-hooks-9a19a.firebaseio.com/ingredients/${ingId}.json`;
    const method = 'DELETE';
    const body = null;
    const id = ingId;
    const requestType = 'REMOVE'
    sendRequest( url, method, body, id, requestType );
  }, [sendRequest]);

  /**
   * remember - [] maked the hook only run once
   */
  const filterIngredients = useCallback(( data ) => {
    // setUserIngredients( data ); - now managed by the rducer
    dispatch({type: 'SET', ingredients: data});
  }, []);

  /** 
   * you can have as many 'useEffect' hooks as required
   * adding in a second parameter in the array will
   * make this useEffect run only if that parameter changes
   * becuase this runs whenever a value changes, some values
   * might be null - which isn't allowed. 
   * make conditions to check if the values required are there BEFORE
   * tyrping to dispatch the action
   */
  useEffect( ()=> {
    if( !isLoading && !error && requestType === 'ADD') {
      dispatch({
        type:'ADD', 
        ingredient: {id: data.name, ...extraData}
      });
    } else if( !isLoading && !error && requestType === 'REMOVE' ) {
      dispatch({
        type: 'DELETE',
        id: extraData
      })
    }
  }, [isLoading, error, data, extraData, requestType] )

  /**
   * useCallback hook works here because the modal 
   * has used the React.memo wrapper to prevent unrequired renderings
   */
  const clearError = useCallback(() => {
    // dispatchHTTP({type: 'CLEAR'});
    // setError(null);
    // setIsLoading(false);
  }, []);

  /**
   * not the typical use for this hook,
   * React.Memo is typical for not recreating a component - see the Error modal
   * useMemo is used to prevent creating a new value of some expenxive computation
   * if the values are the same from one render cycle to another
   */
  const ingredientList = useMemo(() => {
    return (
      <IngredientList 
        ingredients={userIngredients} 
        onRemoveItem={removeIngredient}
      />
    )
  }, [userIngredients, removeIngredient]);


  return (
    <div className="App">
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />
      { error && <ErrorModal onClose={clearError}>{error}</ErrorModal> }
      <section>
        <Search onLoadedIngredients={filterIngredients}/>
        { ingredientList }
      </section>
    </div>
  );
}

export default Ingredients;
