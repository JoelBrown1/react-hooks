import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);
  const [ isLoading, setIsLoading ] = useState( false );
  const [ error , setError ] = useState();

  /** 
   * this hook gets called after and for every render cycle
   * with the [] as a second parameter, useEffect is only run once
   * very similar to 'componentDidMount' in class based components
   * 
   * beause we are fetching ingredients in the search dmoponent, we don't need to fetch them here
   */
   // useEffect(() => {
  //   fetch('https://react-hooks-9a19a.firebaseio.com/ingredients.json')
  //     .then( resp => {
  //       return resp.json();
  //     })
  //     .then(data => {
  //       const ingredientsArray = [];
  //       for( const key in data ) {
  //         ingredientsArray.push({
  //           id: key,
  //           title: data[key].title,
  //           amount: data[key].amount
  //         });
  //       }

  //       setUserIngredients(ingredientsArray);
  //     })
  // }, []);

  // you can have as many 'useEffect' hooks as required
  // adding in a second parameter in the array will
  // make this useEffect run only if that parameter changes
  useEffect( ()=> {
  }, [userIngredients] )

  const addIngredientHandler = (ing) => {
    setIsLoading(true);
    console.log('value of isLoading: ', isLoading);
    fetch('https://react-hooks-9a19a.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ing),
      headers: {'Content-Type': 'application:json'}
    }).then(resp => {
      console.log('value of isLoading: ', isLoading);
      setIsLoading(false);

      return resp.json();
    }).then(responseData => {
      setUserIngredients( prevState  => [ ...prevState, {id : responseData.name, ...ing} ] );
    });
  }

  const removeIngredient = ( ingId ) => {
    console.log('value of isLoading: ', isLoading);
    setIsLoading(true);
    fetch(`https://react-hooks-9a19a.firebaseio.com/ingredients/${ingId}.jon`, {
      method: 'DELETE'
    }).then( ( resp ) => {
      console.log('value of isLoading: ', isLoading);
      setIsLoading(false);
      setUserIngredients( prevState => prevState.filter( ing => ing.id !== ingId));
    }).catch( err => {
      setError(err.message);
      console.log("what was the error: ", err)
    })
  }

  /**
   * remember - [] maked the hook only run once
   */
  const filterIngredients = useCallback(( data ) => {
    setUserIngredients( data );
  }, []);

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  }


  return (
    <div className="App">
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <section>
        <Search onLoadedIngredients={filterIngredients}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredient}/>
      </section>
    </div>
  );
}

export default Ingredients;
