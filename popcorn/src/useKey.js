
import { useEffect } from "react";


//for using excape key on keyboard to exit selected movies
//use useEffect since we are interacting with Dom which outside of component ie side effects

export function useKey(key,action) {
    

useEffect(

    function () {
      function callback(e) {
        //ESCAPE.lowerCase()
        if(e.code.toLowerCase() === key.toLowerCase()) {
          //onCloseMovie()
          action()
          console.log('press')
  
        }
      }
  
      document.addEventListener("keydown", callback);
  
      //clean up function, so closeMovie wont execute any time we press close
  
      return function () {
        document.removeEventListener("keydown", callback)
      };
    },
  
    [action, key]
  )
  
}