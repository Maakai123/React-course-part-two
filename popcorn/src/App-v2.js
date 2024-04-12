
import React, { useState, useEffect } from 'react';
import StarRating from  "./StarRating.js";

const KEY = "239749fa";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];



const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


  export default function App() {
    const [query, setQuery ] = useState("")
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    //Loading state false from the start

    const [isLoading, setIsLoading] = useState(false)

    //for Errors 
    const [error, setError] = useState("")
    //state to get id
    const [selectedId, setSelectedId] = useState(null)
    


    /*
    Exp1 
    useEffect(function() {
      console.log("After initial render")
    }, [])

     Exp2
    useEffect(function() {
      console.log("After every render")
    })


     Exp13
    useEffect(function() {
      console.log("D")
    },
    [query]   the state is in synch with this, so it will always render
    )
    */

    

    function handleSelectMovies(id) {
      //when i click on the same id close
      setSelectedId(selectedId => (id ===selectedId? null : id) )
    }

    //close the movie details

    function handleCloseMovie() {
      setSelectedId(null)
    }
    

    //add new item to arrays 

    function handleAddWatched(movie) {
      setWatched((watched) => [...watched, movie])
    }

    //Delete Movie
    //FILTER OUT MOVIE !== ID
function handleDeleteWatched(id) {
  setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
}
 

    //How to fecth data in React  use useEffect which regiaters this function 

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
    handleCloseMovie()
    fetchMovies();

    //main clean up function, this aborts http request that are not
    // important from running at the same time.


    return function() {
      controller.abort()
    }
       
    }, [query]); //synch with the state




   /*
    useEffect(() => {
      fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // Update state with fetched data
          setMovies(data.Search); // Assuming Search contains an array of movie objects
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, []);
   */
  
    return (
      <>
       <NavBar>
       <Logo />
      <Search  query={query} setQuery={setQuery} />
      <NumResults movies={movies}/>
       </NavBar>


       <Main>
      
       <Box>
        {/*isLoading ? <Loader/> : <MovieList  movies={movies}/>
        1,. if its loading display loader
        2. if their is no loading and no error display movie list
        3.if is error display error message*/}
        {isLoading && <Loader />}
        {!isLoading && !error && <MovieList movies=
        {movies} onSelectMovie={handleSelectMovies}/>}
        {error && <ErrorMessage message={error} />}
        </Box>
       
       <Box>
          {selectedId ? (
            < MovieDetails selectedId={selectedId} 
            onCloseMovie={handleCloseMovie}
            onAddWatched={handleAddWatched}
            watched={watched}/>
          ) : (
            <>
            < WatchedSummary watched={watched} />
          < WatchedMoviesList watched={watched}
          onDeleWatched ={handleDeleteWatched} />
            </>
          )}
          
          
       </Box>
       </Main>
     
      </>
    );
  }


function Loader() {
  return <p className="loader">Loading...</p>
}


function ErrorMessage({message}) {
  return (
    <p className="error">
      <span>💥</span> {message}
    </p>
  )
}
function NavBar({children}) {
  
 return (
  <nav className="nav-bar">{children}</nav>
 )
}


function Logo() {
  return(
    <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
  )
}


function NumResults({movies}) {
return (
  <p className="num-results">
  Found <strong>{movies.length}</strong> results
</p>
)
}
function Search({query, setQuery}) {
  return(

    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  )
}


function Main({children}) {
    
  return (
    <main className="main">{children}</main>)
}


function MovieList({movies, onSelectMovie}) {
  
 return (
  <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID}
        onSelectMovie={onSelectMovie} />
      ))}
    </ul>
 )
}


function Movie({movie, onSelectMovie}) {
  return (
    <li onClick = {() => onSelectMovie(movie.imdbID)} >
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
  )
}
function Box({children}) {
  const [isOpen, setIsOpen] = useState(true);


  return (

  <div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen((open) => !open)}
  >
    {isOpen ? "–" : "+"}
  </button>
  {isOpen && children}
</div>
 )
}


/*

function WatchBox() {
  const [isOpen2, setIsOpen2] = useState(true);
 
  
  return (

    <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen2((open) => !open)}
          >
            {isOpen2 ? "–" : "+"}
          </button>
          {isOpen2 && (
            <>
              < WatchedSummary watched={watched} />
              < WatchedMoviesList watched={watched} />

              
            </>
          )}
        </div>
  )
}
*/



//display id there is a selected movie

function MovieDetails({ selectedId, onCloseMovie,onAddWatched, watched }) {
const [movie, setMovie] = useState({}) //empty obj from api call
  //to make movie show inside box by your left

  const [isLoading, setIsLoading] = useState(false) //for loading Api

   // Rating 
   const [userRating, setUserRating] = useState("")

   //Rate only movies that has not been rated
   const isWatched = watched.map((movie) => movie.imdbID).
   includes(selectedId)

   const  watchedUserRating = watched.find((
    movie) => movie.imbID === selectedId)?.userRating
    //? if it does not exist dont return anything

//destructure object,
  const {
    Title: title,
    Year:year, 
    Poster:poster, 
  Runtime: runtime, 
  imdbRating, 
  Plot:plot, 
  Released: released,
  Actors:actors, 
  Director: director, 
  Genre:genre
} = movie

function handleAdd() {
  const newWatchedMovie = {
    imdbID: selectedId,
    title,
    year,
    poster,
    imdbRating:Number(imdbRating),
    runtime: Number(runtime.split("").at(0)),

    //add rating when hover or clicked
    userRating,
  }

  onAddWatched(newWatchedMovie)
  //close a movie
  onCloseMovie()
}

//for using excape key on keyboard to exit selected movies
//use useEffect since we are interacting with Dom which outside of component ie side effects


useEffect(

  function () {
    function callback(e) {
      if(e.code === "Escape") {
        onCloseMovie()
        console.log('press')

      }
    }

    document.addEventListener("keydown", callback);

    //clean up function, so closeMovie wont execute any time we press close

    return function () {
      document.removeEventListener("keydown", callback)
    };
  },

  [onCloseMovie]
)

useEffect(function () {
  async function getMovieDetails() {
    setIsLoading(true) //set it before fecthing
    try {
      //select a corresponding movie Id each time the component renders,
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch movie details');
      }
      const data = await res.json();
      setMovie(data)
      setIsLoading(false) //after feeching set back to false
      //console.log(data)
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  }

  getMovieDetails();
}, [selectedId]); // Make sure to include selectedId in dependency array if it's used inside useEffect



//since we interacting with the outside world to change title in tab use useEffect

useEffect(
  function () {
    if(! title) return;
   document.title = `Movie | ${title}`;

   /*Clean up function, a function we return from an effect 
    i can press the back btn, it wil go all back but remeber the initial title\

   */

    return function () {
      document.title = "usePopcorn";
      console.log(`Clean up effect for movie ${title}`)
    }

  },
  [title]  //put title since the initial render or first mount is usually an empty obj

)

//use  its Loading componet
  return <div className="details">
  {isLoading ? 
  (<Loader />
  ) : (

  <>
  {""}
  <header>
      <button className="btn-back" onClick={onCloseMovie}>
        &larr;
      </button>
       <img src={poster} alt={`Poster of ${movie} movie`} />
       <div className="details-overview">
        <h2>{title}</h2>
        <p>{released} &bull; {runtime}
        </p>
        <p>{genre}</p>
        <p><span>⭐{imdbRating}IMDb rating</span></p>
       </div>
      </header>

      <section>
        <div className="rating">
       { !isWatched ? (
       <>
       <StarRating  maxRating={10} size={24}
        onSetRating={setUserRating}/>
 
       {/*only show button if user rates the movie */}
        {userRating > 0 && (<button className="btn-add" 
        onClick={handleAdd}>+ Add to list</button>
        )}
        </>
       ): (
        <p>You rated this movie
          {watchedUserRating}
          <span>⭐ </span>
        </p>
        )}
        </div>
        <p>
          <em>{plot}</em>
        </p>

        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
      {/*selectedId*/}
      </>
     )} 
    </div>
  
}

function WatchedSummary({watched}) {

  
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));


  return (
    <div className="summary">
                <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(2)}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(2)}</span> 
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                  </p>
                </div>
              </div>
  )
}



function WatchedMoviesList ({watched, onDeleWatched}) {
  return (
    <ul className="list">
                {watched.map((movie) => (
                  <WatchedMovie movie={movie}  key={movie.imdbID}
                  onDeleWatched={onDeleWatched}/>
                ))}
              </ul>
  )
}

function WatchedMovie({movie, onDeleWatched}) {
  return (
    <li key={movie.imdbID}>
                    <img src={movie.poster} alt={`${movie.title} poster`} />
                    <h3>{movie.title}</h3>
                    <div>
                      <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating}</span>
                      </p>
                      <p>
                        <span>🌟</span>
                         <span>{movie.userRating}</span>
                      </p>
                      <p>
                        <span>⏳</span>
                        <span>{movie.runtime} min</span>
                      </p>
                       
                       <button className="btn-delete"
                        onClick={() => onDeleWatched(movie.imdbID)}>
                        X
                       </button>

                    </div>
                  </li>
  )
}

