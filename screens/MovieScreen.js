import { View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { HeartIcon } from 'react-native-heroicons/solid'
import { styles, theme } from '../theme'
import Cast from '../components/cast'
import MovieList from '../components/movieList';
import Loading from '../components/loading';
import { fallbackMoviePoster, fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, image500 } from '../api/moviedb'
import GoHome from '../components/goHome'


var {width, height} = Dimensions.get('window') // cihazın genişlik ve yüksekliğini alır
const ios = Platform.OS == 'ios';
const topMargin = ios? '': ' mt-3'; // android cihazlarda margin top verildi

export default function MovieScreen() {
    const {params: item} = useRoute();
    const [isFavourite, toggleFavourite] = useState(false); // içerik favoriye eklenmişse kalp ikonunun rengi değişir
    const navigation = useNavigation(); // farklı bir ekrana yönlendirmek için navigation tanımlanır
    const [cast, setCast] = useState([]);
    const [movie, setMovie] = useState({});
    const [similarMovies, setSimilarMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{// film ayrıntılarını buraya getirmek için apiyi çağırıyoruz
        // console.log('itemid: ',item.id); // film idsinin gelip gelmediği kontrol edildi
        setLoading(true); // id ile kayıt alacağımız için önce yükleniyor animasyonunu başlatalım
        getMovieDetails(item.id); // film detayını almak için
        getMovieCredits(item.id); // film oyuncularını almak için
        getSimilarMovies(item.id); // benzer filmleri almak için
    },[item]);

    const getMovieDetails = async id => {
        const data = await fetchMovieDetails(id); // apiden kayıları getir
        // console.log('film detayı geldi: ',data); // kayıtların geldiğini kontrol et
        if(data) setMovie(data); // kayıtları setMovie ekle
        setLoading(false); // yükleme animasyonunu durdur
    }

    const getMovieCredits = async id => {
        const data = await fetchMovieCredits(id); // apiden kayıları getir
        // console.log('film oyuncusu geldi: ',data); // kayıtların geldiğini kontrol et
        if(data && data.cast) setCast(data.cast); // kayıtları setCasta ekle
    }

    const getSimilarMovies = async id => {
        const data = await fetchSimilarMovies(id); // apiden kayıları getir
        // console.log('benzer filmler geldi: ',data); // kayıtların geldiğini kontrol et
        if(data && data.results) setSimilarMovies(data.results); // kayıtları setSimilarMoviese ekle
    }

  return (
    <View
        contentContainerStyle={{paddingBottom: 20}}
        className="flex-1 bg-slate-900 relative"
    >
        <GoHome/>
        <ScrollView>
            {/* Geri butonu ve film afişi */}
            <View className="w-full">
                <SafeAreaView className={"absolute flex-row items-center justify-between w-full z-20 px-4"+ topMargin}>
                    <TouchableOpacity 
                        onPress={()=> navigation.goBack()} // önceki ekrana dön
                        style={styles.background} 
                        className="p-1 rounded-xl"
                    >
                        <ChevronLeftIcon size="28" strokeWidth={2.5} color="white"/>
                    </TouchableOpacity>

                    {
                        !loading && ( // Eğer yüklenme işlemi yapılmıyorsa göster
                            <TouchableOpacity 
                                onPress={()=> toggleFavourite(!isFavourite)} // tıklandığında favori işlemini değiştirecek
                            >
                                <HeartIcon size="35" color={isFavourite? theme.background: "white"} />
                            </TouchableOpacity>
                        )
                    }

                </SafeAreaView>
                {
                    loading? ( // Eğer yüklenme işlemi sürüyorsa
                        <Loading />
                    ) : ( // Eğer yüklenme işlemi tamamlanmışsa

                        // Film posteri alanı/
                        <View>
                            <Image 
                                // source={require('../assets/images/movie.png')} // film görseli getirildi
                                source={{uri: image500(movie?.poster_path) || fallbackMoviePoster}}
                                style={{width, height: height*0.55}}
                            />
                            <LinearGradient 
                                colors={['transparent', 'rgba(15,23,42,0.8)', 'rgba(15,23,42,1)']}
                                style={{width, height: height*0.40}}
                                start={{x: 0.5, y: 0}} // başlangıç noktası
                                end={{x: 0.5, y: 1}} // bitiş noktası
                                className="absolute bottom-0"
                            />
                        </View>
                    )
                }
            </View>

            {
                !loading && ( // Eğer yüklenme işlemi yapılmıyorsa göster
                    <View>
                        {/* Film ayrıntıları */}
                        <View style={{marginTop: -(height*0.09)}} className="space-y-3">
                
                            {/* Film başlığı */}
                            <Text className="text-white text-center text-3xl font-bold mx-4 tracking-wide">
                                {
                                    // movie && movie.title && movie.title.length > 20 ? movie.title.slice(0, 20) + '...' : movie.title
                                    movie?.title
                                }
                            </Text>
                
                            {/* Film durumu, çıkış tarihi ve süresi */}
                            <Text className="text-neutral-400 font-semibold text-base text-center">
                                {movie?.status === 'Released' ? 'Yayında' : movie?.status} • {/* Film durumu */}
                                {movie.release_date?.split('-')[0] || 'N/A'} • {/* 2023-01-02 şeklinde gelen tarihi sadece yılı alındı */}
                                {movie?.runtime} dk
                            </Text>
                
                            {/* Türler */}
                            <View className="flex-row justify-center mx-4 space-x-1">
                                {
                                    movie?.genres?.map((genre, index)=>{
                                        return (
                                            <Text key={index} className="text-neutral-400 font-semibold text-base text-center">
                                                {genre?.name}
                                                {index !== movie?.genres?.length - 1 &&  "  •"} {/* son etikete • ifadesini ekleme */}
                                            </Text>
                                        )
                                    })
                                }
                            </View>
                
                            {/* Film açıklaması */}
                            {
                                movie?.overview ? ( // filmin tanıtım yazısı varsa
                                    <Text className="text-neutral-400 text-sm mx-4 tracking-wide">
                                        {
                                            movie?.overview
                                        }
                                    </Text>
                                ):( // filmin tanıtım yazısı yoksa
                                    <Text className="mx-4 pt-10 text-2xl text-center tracking-wide" style={styles.text}>
                                        Bu filmin detay yazısı bulunmamaktadır!
                                    </Text>
                                )
                            }
                        </View>

                        {/* Oyuncular */}
                        {
                            cast.length>0 && <Cast navigation={navigation} cast={cast}/>
                        }

                        {/* Benzer Filmler */}
                        {
                            similarMovies.length>0 && <MovieList title="Benzer Filmler" hideSeeAll={true} data={similarMovies} />
                        }
                    </View>
                )
            }
        </ScrollView>
    </View>
  )
}