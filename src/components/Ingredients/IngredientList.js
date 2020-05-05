import React from 'react';

import './IngredientList.css';

/**
 * React.memo( props => { function body logic goes here }
 * React.memo - define "memo"
 * 
 * must be used along with useCallback hook where the data is changed
 * (in this case, delete an ingredient)
 */
const IngredientList = props => {
  console.log("building the ingredient list");
  debugger;

  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map(ig => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
