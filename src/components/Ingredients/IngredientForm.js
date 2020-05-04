import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  const [ inputState, setInputState ] = useState({title: '', amount: ''});
  
  const submitHandler = event => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={inputState.title} onChange={ event => {
              const titleValue = event.target.value;
              /**
               * this is the closure way of doing updates.
               * event.target.value is only good for a single iteration of the onChange function
               * the event.target.value needs to be new every time the onChange funciton is called.
               * and passed into the inputState[1] update function
               */
              setInputState( prevState => ({ title: titleValue, amount: prevState.value }))
            }}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={inputState.amount}  onChange={ event => {
              /**
               * this is the closure way of doing updates.
               * the event.target.value needs to be new every time the onChange funciton is called.
               * event.target.value is only good for a single iteration of the onChange function
               * and passed into the inputState[1] update function
               */
              const amountValue = event.target.value;
              setInputState( prevState => ({ title: prevState.title, amount: amountValue }) )
            }}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
