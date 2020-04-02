import React from 'react';

import './IngredientList.css';

const IngredientList = props => {
  console.log('RENDERING INGREDIENT LIST');
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map(ig => (
          <li key={ig.id}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
            <button onClick={props.onRemoveItem.bind(this, ig.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
