import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadedIngredients } = props;
  const [ searchFilter, setSearchFilter ] = useState('');

  useEffect( () => {
    const query = searchFilter.length === 0 ? '': `?orderBy="title"&&equalTo="${searchFilter}"`;
    fetch('https://react-hooks-9a19a.firebaseio.com/ingredients.json'+query)
      .then( resp => {
        return resp.json();
      })
      .then(data => {
        const ingredientsArray = [];
        for( const key in data ) {
          
            ingredientsArray.push({
              id: key,
              title: data[key].title,
              amount: data[key].amount
            });
          
        }
        onLoadedIngredients(ingredientsArray);
      })
  }, [searchFilter, onLoadedIngredients]);

  const handleSearchChange = (data) => {
    setSearchFilter(data);
  }

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={searchFilter} onChange={ event => {
            handleSearchChange(event.target.value)
          }}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
