import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);

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
    fetch('https://react-hooks-9a19a.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ing),
      headers: {'Content-Type': 'application:json'}
    }).then(resp => {
      return resp.json();
    }).then(responseData => {
      setUserIngredients( prevState  => [ ...prevState, {id : responseData.name, ...ing} ] );
    });
  }

  const removeIngredient = ( ingId ) => {
    setUserIngredients( prevState => prevState.filter( ing => ing.id !== ingId));
  }

  /**
   * remember - [] maked the hook only run once
   */
  const filterIngredients = useCallback(( data ) => {
    setUserIngredients( data );
  }, []);


  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search onLoadedIngredients={filterIngredients}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredient}/>
      </section>
    </div>
  );
}

export default Ingredients;
