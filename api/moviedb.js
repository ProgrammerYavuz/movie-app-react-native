import axios from "axios";
// import { apiKey } from "../constants";

const apiKey = ''; // Api anahtarı

// endpoints
const apiBaseUrl = 'https://api.themoviedb.org/3'
const trendingMoviesEndpoint = `${apiBaseUrl}/trending/movie/day?api_key=${apiKey}`
const upcomingMoviesEndpoint = `${apiBaseUrl}/movie/upcoming?api_key=${apiKey}`
const topRatedMoviesEndpoint = `${apiBaseUrl}/movie/top_rated?api_key=${apiKey}`

//dynamic endpoints
const movieDetailsEndpoint  = id => `${apiBaseUrl}/movie/${id}?api_key=${apiKey}` // film detayları
const movieCreditsEndpoint  = id => `${apiBaseUrl}/movie/${id}/credits?api_key=${apiKey}` // film oyuncuları
const similarMoviesEndpoint = id => `${apiBaseUrl}/movie/${id}/similar?api_key=${apiKey}` // benzer filmler

const searchMoviesEndpoint  = `${apiBaseUrl}/search/movie?api_key=${apiKey}` // film arama

const personDetailsEndpoint = id => `${apiBaseUrl}/person/${id}?api_key=${apiKey}` // oyuncu bilgileri
const personMoviesEndpoint  = id => `${apiBaseUrl}/person/${id}/movie_credits?api_key=${apiKey}` // oyuncunun rol aldığı filmler

export const image500 = path=> path? `https://image.tmdb.org/t/p/w500/${path}` : null; // 500 width değerine sahip görselleri almak için
export const image342 = path=> path? `https://image.tmdb.org/t/p/w342/${path}` : null; // 342 width değerine sahip görselleri almak için
export const image185 = path=> path? `https://image.tmdb.org/t/p/w185/${path}` : null; // 185 width değerine sahip görselleri almak için

// yedek görseller eğer apiden görsel boş gelirse bu görseller gösterilecek
export const fallbackMoviePoster = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/660px-No-Image-Placeholder.svg.png?20200912122019'
export const fallbackPersonImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmUiF-YGjavA63_Au8jQj7zxnFxS_Ay9xc6pxleMqCxH92SzeNSjBTwZ0l61E4B3KTS7o&usqp=CAU';


const apiCall = async (endpoint, params)=>{
    const options = {
        method: 'GET', // method yöntem
        url: endpoint, // api url
        params: params? params: {} // parametre olup olmadığı kontrol edilecek
    }

    try {
        const response = await axios.request(options); // apiyi çağırdık
        return response.data; // verileri döndür
    } catch (error) {
        console.log('hat: ', error);
        return {}
    }
}

export const fetchTrendingMovies = () => { // trend filmleri getir
    return apiCall(trendingMoviesEndpoint,{language: 'tr-TR'});
}

export const fetchUpcomingMovies = () => { // vizyona girecek filmleri getir
    return apiCall(upcomingMoviesEndpoint,{language: 'tr-TR'});
}

export const fetchTopRatedMovies = () => { // beğenilen filmleri getir
    return apiCall(topRatedMoviesEndpoint,{language: 'tr-TR'});
}

export const fetchMovieDetails = id => {
    return apiCall(movieDetailsEndpoint(id),{language: 'tr-TR'}); // film detaylarını getir
}

export const fetchMovieCredits = id => {
    return apiCall(movieCreditsEndpoint(id),{language: 'tr-TR'}); // film oyuncularını getir
}

export const fetchSimilarMovies = id => {
    return apiCall(similarMoviesEndpoint(id),{language: 'tr-TR'}); // benzer filmleri getir
}

export const fetchPersonDetails = id => {
    return apiCall(personDetailsEndpoint(id),{language: 'tr-TR'}); // benzer filmleri getir
}

export const fetchPersonMovies = id => {
    return apiCall(personMoviesEndpoint(id),{language: 'tr-TR'}); // benzer filmleri getir
}

export const searchMovies = params => {
    return apiCall(searchMoviesEndpoint, params); // film arama sonuçlarını getir
}