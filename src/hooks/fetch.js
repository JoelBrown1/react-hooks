/**
 * custom hooks
 * in this case repeating logical patters
 * that effect the state
 * 
 * building:
 * regular es6 function that is exported
 */

import { useReducer, useCallback } from 'react';

/**
 * reducers don't need to be rebuilt for each render cycle
 * create them outside of the hook function
 */
const fetchReducer = ( httpState, action ) => {
    switch(action.type) {
      case 'SEND':
        console.log('inside send: ', action);
        return { 
          loading: true, 
          error: null, 
          data: null, 
          extraData: null, 
          identifier: action.identifier 
        };
      case 'RESP':
        console.log('resp part - : ', httpState);
        console.log(' resp all the added info: ', action);
        return { 
          ...httpState, 
          loading: false, 
          data: action.resp, 
          extraData: action.extraData 
        };
      case 'ERR': 
        return { 
          loading: false, 
          error: action.errorData 
        };
      case 'CLEAR':
        return { 
          ...httpState, 
          error: null, 
          data: null 
        };
      default:
        throw new Error("errorReducer - we shouldn't get here either");
    }
  }
const useFetch = () => {
  /**
   * http reducer needs to know about the loading state and
   * if there is an error at some point in the http request
   * 
   * don't use "useDispatchFetch" terms here
   * reserved structure for React when using hooks.
   * we are inside a hook
   */
  const [ fetchState, dispatchFetch ] = useReducer(fetchReducer, { 
      loading: false, 
      error: null,
      data: null,
      extraData: null,
      identifier: null
    });

    const sendRequest = useCallback((url, method, body, extraData, requestType) => {
      console.log("(sendRequest params: ", requestType);
        dispatchFetch({type: 'SEND', identifier: requestType})
        fetch(
            url,
            {
              method: method,
              body: body,
              headers: {
                  'Content-Type': 'application/json'
              }
            })
        .then( ( resp ) => {
          // console.log('value of isLoading: ', isLoading);
          // setIsLoading(false);
          return resp.json();
          
        }).then(resp => {
          dispatchFetch({type: 'RESP', resp, extraData});
        }).catch( err => {
          // setError(err.message);
          dispatchFetch({type: 'ERR', errorData: err.message});
        })
    }, []);
    
    return {
        isLoading: fetchState.loading,
        data: fetchState.data,
        error: fetchState.error,
        extraData: fetchState.extraData,
        requestType: fetchState.identifier,
        sendRequest: sendRequest
    }
};

export default useFetch;