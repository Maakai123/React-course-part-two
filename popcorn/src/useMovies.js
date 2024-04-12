import {useState, useEffect} from 'react'

const KEY = "239749fa";

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    
    //Loading state false from the start

    const [isLoading, setIsLoading] = useState(false)

    //for Errors 
    const [error, setError] = useState("")

    useEffect(function() {

        //clean up function 
  
        const controller = new AbortController()
  
      async function fetchMovies() {
        //add try catch block
        try{
  
        //set isLoading to true  before data fetching
  
        setIsLoading(true)
        //reset the error so it can show response on ui
        setError("")
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
        {signal: controller.signal})
  
        //if res is not ok, bad net work
         if(!res.ok)
         throw new Error("Something went wrong with fetching movies")
  
  
        const data = await res.json();
        //if movie does not exist
  
        if(data.Response === "False") throw new Error
        ("Movie not found")
        //call state 
         setMovies(data.Search);
         setError("")
  
      } catch (err) {
         console.error(err.message)
  
         //fix error abort
         if(err.name !== "AbortError") {
          setError(err.message)
         }
         setError(err.message)
      } finally {
          //set isLoadimg to false when its finish\
        setIsLoading(false)
      }
  
      }
  
      //when we clear the search bar dont show no movie found
      if(query.length < 3) {
        setMovies([]); //Delete everything 
        setError("")
        return 
      }
      //Before fetcg movie, close everything first
      //handleCloseMovie()
      fetchMovies();
  
      //main clean up function, this aborts http request that are not
      // important from running at the same time.
  
  
      return function() {
        controller.abort()
      }
         
      }, [query]); //synch with the state
  
  //return the following

  return { movies, isLoading, error}
}