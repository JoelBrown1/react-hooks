import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);

  const addIngredientHandler = (ing) => {
    fetch('https://react-hooks-9a19a.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ing),
      headers: {'Content-Type': 'application:json'}
    }).then(resp => {
      console.log("what is in the resp: ", resp);
      return resp.json();
    }).then(responseData => {
      console.log('what is in the responseData of fetch response: ', responseData);
      setUserIngredients( prevState  => [ ...prevState, {id : responseData.name, ...ing} ] );
    });
  }

  const removeIngredient = (ingId) => {
    setUserIngredients( prevState => prevState.filter( ing => ing.id !== ingId));
  }


  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredient}/>
      </section>
    </div>
  );
}

export default Ingredients;
