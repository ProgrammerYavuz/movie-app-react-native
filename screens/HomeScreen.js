import { View, Text, SafeAreaView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { styles } from '../theme';
import TrendingMovies from '../components/trendingMovies';
import MovieList from '../components/movieList';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/loading';
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from '../api/moviedb';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';

const ios = Platform.OS == 'ios';

const HomeScreen = () => {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // farklı bir ekrana yönlendirmek için navigation tanımlanır

  useEffect(()=>{
    getTrendingMovies(); // trend filmleri almak için
    getUpcomingMovies(); // vizyona girecek filmleri almak için
    getTopRatedMovies(); // çok beğenilen filmleri almak için
  },[])

  const getTrendingMovies = async ()=>{
    const data = await fetchTrendingMovies(); // apiden kayıları getir
    // console.log('trend filmler geldi: ',data); // kayıtların geldiğini kontrol et
    if(data && data.results) setTrending(data.results); // kayıtları setTrende ekle
    setLoading(false); // yükleme animasyonunu durdur
  }

  const getUpcomingMovies = async ()=>{
    const data = await fetchUpcomingMovies(); // apiden kayıları getir
    // console.log('vizyona girecek filmler geldi: ',data); // kayıtların geldiğini kontrol et
    if(data && data.results) setUpcoming(data.results); // kayıtları setUpcominge ekle
  }

  const getTopRatedMovies = async ()=>{
    const data = await fetchTopRatedMovies(); // apiden kayıları getir
    // console.log('çok beğenilen filmler geldi: ',data); // kayıtların geldiğini kontrol et
    if(data && data.results) setTopRated(data.results); // kayıtları setTopRateda ekle
  }

  return (
    <View className="flex-1 bg-slate-900">
      {/* search bar and logo */}
      <SafeAreaView className={ios? "-mb-2": "mb-3"}>
        <ExpoStatusBar style="light" />
        <View className="flex-row justify-between items-center mx-4 pb-4">
            <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white" />
            <Text className="text-white text-3xl font-bold">
                Film<Text style={styles.text}>X</Text>
            </Text>
            <TouchableOpacity
              onPress={()=> navigation.navigate('Search')}
            >
                <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
            </TouchableOpacity>
        </View>
      </SafeAreaView>

      {
        loading? ( // Eğer yüklenme işlemi sürüyorsa
          <Loading />
        ) : ( // Eğer yüklenme işlemi tamamlanmışsa
          <ScrollView
            showsVerticalScrollIndicator={false} // scroll gizlendi
            contentContainerStyle={{paddingBottom: 10}}
          >
            {/* Trend filmler alanı */}
            {
              trending.length>0 && <TrendingMovies data={trending} /> // apiden trend filmler gelirse göster
            }
            
            {/* Yakında gelecek filmler alanı */}
            {
              upcoming.length>0 && <MovieList title="Yakında Vizyonda" data={upcoming} /> // apiden vizyona girecek filmler gelirse göster
            }
            
            {/* En beğenilen filmler alanı */}
            {
              topRated.length>0 && <MovieList title="En Beğenilen" data={topRated} /> // apiden beğenilen filmler gelirse göster
            }

          </ScrollView>
        )
      }
    </View>
  )
}

export default HomeScreen