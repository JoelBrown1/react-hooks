import React, { useState } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator'
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  const [ title, setTitle ] = useState('');
  const [ amount, setAmount ] = useState('');
  
  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({title, amount});
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={title} onChange={ event => {
              /**
               * with multiple uses of setState, we don't need to capture 
               * the previous state and update multiple values
               * We don't need to use full closure functions either as 
               * event.target.value is always refreshed for us and is available to update
               * the state with
               */
              setTitle( event.target.value );
            }}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={amount}  onChange={ event => {
              setAmount( event.target.value )
            }}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
      
    </section>
  );
});

export default IngredientForm;
