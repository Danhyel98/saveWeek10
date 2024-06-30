
new Swiper(".mySwiper", {
    loop: true,
    slidesPerView: 4, // Always show 4 slides per view
    spaceBetween: 20,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        clickable: true,
    },
});

document.addEventListener('DOMContentLoaded', function () {
    // Modal User Login/Register
    const loginLink = document.querySelector('.register-link');
    const signinLink = document.querySelector('.signin-link');
    const modalUser = document.querySelector('.modal-login');
    const closeModalUser = document.querySelector('#close-btn-modal');
    const registerForm = document.querySelector('.register-form');
    const loginForm = document.querySelector('.login-form');

    // Tab Signin
    const signupButton = document.querySelector('.signup-btn');
    // Tab login
    const loginButton = document.querySelector('.login-btn');

    // Open the User Modal with register link
    loginLink.addEventListener('click', function () {
        modalUser.style.display = 'block';
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
        loginButton.classList.remove('selected-tab');
        signupButton.classList.add('selected-tab');
    });

    // Open the user Modal with signin link
    signinLink.addEventListener('click', function () {
        modalUser.style.display = 'block';
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        loginButton.classList.add('selected-tab');
        signupButton.classList.remove('selected-tab');
    });

    // login tab 
    loginButton.addEventListener('click', function () {
        signupButton.classList.remove('selected-tab');
        loginButton.classList.add('selected-tab');
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // signup tab
    signupButton.addEventListener('click', function () {
        signupButton.classList.add('selected-tab');
        loginButton.classList.remove('selected-tab');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });

    // To close the user modal with the cross
    closeModalUser.addEventListener('click', function () {
        modalUser.style.display = 'none';
    });

    // To get the search result or input
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.movie-search');
    searchBtn.addEventListener('click', function () {
        let searchKeyword = searchInput.value;
        console.log(searchKeyword);
        searchMovieByKeyword(searchKeyword);
    });

    // Add keypress event listener to search input for Enter key
    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            let searchKeyword = searchInput.value;
            console.log(searchKeyword);
            searchMovieByKeyword(searchKeyword);
        }
    });

    // Function to fetch data from API
    function searchMovieByKeyword(keyword) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZmU5MTJjMWE1MjY2YmVmMTBiYWRhM2EzYWYyMWU3ZSIsIm5iZiI6MTcxOTMxMjM3My4xMjI4MzgsInN1YiI6IjY2NzNmOGVhMDU0ZjMzN2Y1Nzc3ZGVjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UsQLuCtgjqg9qGiPYQcDoL1dPBEJaBGmEf8RJgsNHPM'
            }
        };

        fetch(`https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=en-US&page=1`, options)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                displayResults(response.results, keyword);
            })
            .catch(err => console.error(err));
    }

    // Function to display results in the results container
    function displayResults(movies, keyword) {
        const resultsContainer = document.querySelector('.results-container');
        const resultsWrapper = document.querySelector('.swiper-wrapper');
        const searchP = document.querySelector('.search-p');

        resultsWrapper.innerHTML = ''; // Clear previous results
        searchP.textContent = `Results for "${keyword}"`;

        if (movies.length > 0) {
            movies.forEach(movie => {
                const movieSlide = document.createElement('div');
                movieSlide.classList.add('swiper-slide');
                movieSlide.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="movie-poster">
                    <div class="info">
                        <h3 class="hover-title">${movie.title}</h3>
                        <h4 class="hover-year">${new Date(movie.release_date).getFullYear()}</h4>
                        <p class="hover-genre">${movie.genre_ids.map(id => getGenreName(id)).join(' / ')}</p>
                        <img class="hover-star" src="img/star.svg" alt="star" />
                        <p class="hover-score">${movie.vote_average.toFixed(1)}</p>
                    </div>
                `;
                resultsWrapper.appendChild(movieSlide);
            });

            // Show the results container
            resultsContainer.classList.remove('hidden');

            // Initialize Swiper again to reflect the new slides
            new Swiper(".mySwiper", {
                loop: true,
                slidesPerView: 4, // Always show 4 slides per view
                spaceBetween: 20,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                    clickable: true,
                },
            });
        } else {
            resultsWrapper.innerHTML = '<p>No results found</p>';
        }
    }

    // Function to get genre name by ID
    function getGenreName(id) {
        const genres = {
            28: 'Action',
            12: 'Adventure',
            16: 'Animation',
            35: 'Comedy',
            80: 'Crime',
            99: 'Documentary',
            18: 'Drama',
            10751: 'Family',
            14: 'Fantasy',
            36: 'History',
            27: 'Horror',
            10402: 'Music',
            9648: 'Mystery',
            10749: 'Romance',
            878: 'Science Fiction',
            10770: 'TV Movie',
            53: 'Thriller',
            10752: 'War',
            37: 'Western'
        };
        return genres[id] || 'Unknown';
    }



     // Function to fetch and display latest movies
     function fetchAndDisplayLatestMovies() {
        const latestReleasesWrapper = document.querySelector('.latest-releases-container .swiper-wrapper');
        const apiKey = '1fe912c1a5266bef10bada3a3af21e7e'; // Replace with your TMDb API key
        const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&release_date.gte=2024-06-25&sort_by=popularity.desc&api_key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data); // Log the API response for debugging
                displayLatestMovies(data.results);
            })
            .catch(error => console.error('Error fetching latest movies:', error));
    }

    // Call fetchAndDisplayLatestMovies when the DOM content is loaded
    fetchAndDisplayLatestMovies();

    // Function to display latest movies in the swiper container
    function displayLatestMovies(movies) {
        const latestReleasesWrapper = document.querySelector('.latest-releases-container .swiper-wrapper');

        movies.forEach(movie => {
            const movieSlide = document.createElement('div');
            movieSlide.classList.add('swiper-slide');
            movieSlide.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="movie-poster">
                <div class="info">
                    <h3 class="hover-title">${movie.title}</h3>
                    <h4 class="hover-year">${new Date(movie.release_date).getFullYear()}</h4>
                    <p class="hover-genre">${movie.genre_ids.map(id => getGenreName(id)).join(' / ')}</p>
                    <img class="hover-star" src="img/star.svg" alt="star" />
                    <p class="hover-score">${movie.vote_average.toFixed(1)}</p>
                </div>
            `;
            latestReleasesWrapper.appendChild(movieSlide);
        });

        // Initialize Swiper for latest releases after updating the DOM
        new Swiper(".latest-releases-swiper", {
            loop: true,
            slidesPerView: 4,
            spaceBetween: 20,
            navigation: {
                nextEl: ".latest-releases-container .swiper-button-next",
                prevEl: ".latest-releases-container .swiper-button-prev",
            },
        });
    }

    // Function to get genre name by ID
    function getGenreName(id) {
        const genres = {
            28: 'Action',
            12: 'Adventure',
            16: 'Animation',
            35: 'Comedy',
            80: 'Crime',
            99: 'Documentary',
            18: 'Drama',
            10751: 'Family',
            14: 'Fantasy',
            36: 'History',
            27: 'Horror',
            10402: 'Music',
            9648: 'Mystery',
            10749: 'Romance',
            878: 'Science Fiction',
            10770: 'TV Movie',
            53: 'Thriller',
            10752: 'War',
            37: 'Western'
        };
        return genres[id] || 'Unknown';
    }

    const apiKey = '1fe912c1a5266bef10bada3a3af21e7e'; // Replace with your TMDb API key

    // Define the specific genres you want to include in the desired order
    const allowedGenres = ['Comedy', 'Drama', 'Action', 'Romance', 'Fantasy', 'Animation'];

    // Fetch genres from TMDb and set Comedy as default
    fetchGenres();

    function fetchGenres() {
        const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

        fetch(genreUrl)
            .then(response => response.json())
            .then(data => {
                console.log('Genres:', data);
                // Filter genres based on allowedGenres and their order
                const filteredGenres = data.genres.filter(genre => allowedGenres.includes(genre.name));
                displayGenres(filteredGenres);
            })
            .catch(error => console.error('Error fetching genres:', error));
    }

    function displayGenres(genres) {
        const genreList = document.querySelector('.genre-list');

        // Iterate over allowedGenres to maintain order
        allowedGenres.forEach(genreName => {
            const genre = genres.find(genre => genre.name === genreName);
            if (genre) {
                const li = document.createElement('li');
                li.textContent = genre.name;
                li.dataset.genreId = genre.id;
                li.classList.add('genre-list-item');

                li.addEventListener('click', function () {
                    const genreId = genre.id;
                    console.log('Clicked genre ID:', genreId);

                    // Remove 'selected' class from all genre list items
                    document.querySelectorAll('.genre-list-item').forEach(item => item.classList.remove('selected'));
                    // Add 'selected' class to the clicked genre list item
                    li.classList.add('selected');

                    // Update genre title
                    updateGenreTitle(genreName);

                    // Fetch movies based on genre ID
                    fetchMoviesByGenre(genreId);
                });

                genreList.appendChild(li);
            }
        });

        // By default, select the first genre in the list (Comedy)
        const defaultGenre = genreList.querySelector('.genre-list-item');
        if (defaultGenre) {
            defaultGenre.classList.add('selected');
            const defaultGenreId = defaultGenre.dataset.genreId;
            updateGenreTitle(allowedGenres[0]); // Set default genre title
            fetchMoviesByGenre(defaultGenreId);
        }
    }

    function updateGenreTitle(genreName) {
        const genreTitle = document.querySelector('.genre-p');
        // Capitalize the first letter and keep the rest as lowercase
        genreTitle.textContent = genreName.charAt(0).toUpperCase() + genreName.slice(1).toLowerCase();
    }

    function fetchMoviesByGenre(genreId) {
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Movies by genre:', data);
                displayGenreMovies(data.results);
            })
            .catch(error => console.error('Error fetching movies by genre:', error));
    }

    function displayGenreMovies(movies) {
        const genreSwiperWrapper = document.querySelector('.genre-swiper .swiper-wrapper');
        genreSwiperWrapper.innerHTML = ''; // Clear previous movies

        movies.forEach(movie => {
            const movieSlide = document.createElement('div');
            movieSlide.classList.add('swiper-slide');
            movieSlide.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="movie-poster">
                <div class="info">
                    <h3 class="hover-title">${movie.title}</h3>
                    <h4 class="hover-year">${new Date(movie.release_date).getFullYear()}</h4>
                    <p class="hover-genre">${movie.genre_ids.map(id => getGenreName(id)).join(' / ')}</p>
                    <img class="hover-star" src="img/star.svg" alt="star" />
                    <p class="hover-score">${movie.vote_average.toFixed(1)}</p>
                </div>
            `;
            genreSwiperWrapper.appendChild(movieSlide);
        });

        // Initialize Swiper for genre movies after updating the DOM
        new Swiper(".genre-swiper", {
            loop: true,
            slidesPerView: 4,
            spaceBetween: 20,
            navigation: {
                nextEl: ".genre-swiper .swiper-button-next",
                prevEl: ".genre-swiper .swiper-button-prev",
            },
        });
    }

    // Helper function to get genre name by ID
    function getGenreName(id) {
        const genres = {
            28: 'Action',
            12: 'Adventure',
            16: 'Animation',
            35: 'Comedy',
            80: 'Crime',
            99: 'Documentary',
            18: 'Drama',
            10751: 'Family',
            14: 'Fantasy',
            36: 'History',
            27: 'Horror',
            10402: 'Music',
            9648: 'Mystery',
            10749: 'Romance',
            878: 'Science Fiction',
            10770: 'TV Movie',
            53: 'Thriller',
            10752: 'War',
            37: 'Western'
        };
        return genres[id] || 'Unknown';
    }





//ICI COMMENCE POUR LE BIG MODAL
    

});



