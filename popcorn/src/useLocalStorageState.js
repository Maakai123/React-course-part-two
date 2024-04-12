import { useState, useEffect} from "react";

//initial value initialState = []
export function useLocalStorage (initialState, key) {
    const [value, setValue] = useState(function () {
        const storedValue = localStorage.getItem(key);
        //storeValue = null, so check first
        return storedValue ?  JSON.parse(storedValue) :
        initialState;
      });


      //Store data in local storage

useEffect(function () {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue] 
}