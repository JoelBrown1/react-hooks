import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadedIngredients } = props;
  const [ searchFilter, setSearchFilter ] = useState('');

  const inputRef = useRef();

  useEffect( () => {
    /**
     * limiting the number of requests to the database for the search
     * this is a closure function
     * it captures an instance of the searchFilter which doesn't update
     * so that we can compare it to the inputRef value 
     * which is another hook that creates a variable that points to the 
     * value in the input field
     */
    const timer = setTimeout(() => {
      if(searchFilter === inputRef.current.value) {
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
      }
    }, 500);
    
    /**
     * this is a clean up function that is run right before the useEffect function 
     * is run the next time
     */
    return () => {
      clearTimeout(timer);
    }

  }, [searchFilter, onLoadedIngredients, inputRef]);

  const handleSearchChange = (data) => {
    setSearchFilter(data);
  }

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            ref={inputRef}
            type="text" 
            value={searchFilter} 
            onChange={ event => {
              handleSearchChange(event.target.value)
          }}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
