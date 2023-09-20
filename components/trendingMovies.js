import { View, Text, TouchableWithoutFeedback, Dimensions, Image } from 'react-native'
import React from 'react'
import Carousel from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';
import { image500 } from '../api/moviedb';

var {width, height} = Dimensions.get('window') // cihazın genişlik ve yüksekliğini alır

export default function TrendingMovies({data}) {

  const navigation = useNavigation(); // farklı bir ekrana yönlendirmek için navigation tanımlanır
  const handleClick = (item)=>{
    navigation.navigate('Movie', item); // Film ekranına gönder ve öğeyi duraklat
  }

  return (
    <View className="my-8">
      <Text className="text-white text-xl font-bold mx-4 mb-5">Trend Filmler</Text>
      <Carousel
        data={data} // film listesi
        renderItem={({item})=><MovieCard item={item} handleClick={handleClick}/>} // tüm öğeler gelir
        firstItem={0} // ilk film kartı aktif
        inactiveSlideOpacity={0.60} // aktif olmayan film kartlarının opacity değeri
        sliderWidth={width} // kaydırıcı genişliği, cihaz genişliği verildi
        itemWidth={width*0.62} // film kartı boyutları, cihaz genişliğinin 0.62 oranı
        slideStyle={{display: 'flex', alignItems: 'center'}} // kaydırıcı slider stili
        />
    </View>
  )
}

const MovieCard = ({item, handleClick}) => {
  return (
    <TouchableWithoutFeedback
      onPress={()=> handleClick(item)} // görsele tıklandığında film ekranına yönlenecek
    >
      <Image
        // source={require('../assets/images/movie.png')}
        source={{uri: image500(item.poster_path)}}
        style={{
          width: width*0.6, // cihaz genişliğinin 0.6 oranı
          height: height*0.4 // cihaz yüksekliğinin 0.4 oranı
        }}
        className="rounded-3xl"
      />
    </TouchableWithoutFeedback>
  )
}
