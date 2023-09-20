import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Dimensions, Image } from 'react-native'
import React from 'react'
import { styles } from '../theme'
import { useNavigation } from '@react-navigation/native';
import { fallbackMoviePoster, image185 } from '../api/moviedb';

var {width, height} = Dimensions.get('window') // cihazın genişlik ve yüksekliğini alır

export default function MovieList({title, data, hideSeeAll}) {

    const navigation = useNavigation(); // farklı bir ekrana yönlendirmek için navigation tanımlanır
    const handleClick = ()=>{
      navigation.navigate('Movie', item); // Film ekranına gönder ve öğeyi duraklat
    }

  return (
    <View className="mb-8 space-y-4">
        <View className="flex-row items-center justify-between mx-4">
            <Text className="text-white text-xl font-bold">{title}</Text>
            {
                !hideSeeAll && ( // Tümünü görü gizle tanımlı değil ya da false ise göster
                    <TouchableOpacity>
                        <Text
                            style={styles.text}
                            className="text-lg font-semibold"
                        >
                            Tümünü gör
                        </Text>
                    </TouchableOpacity>
                )
            }
        </View>
        {/* Film alanı */}
        <ScrollView
            horizontal // yatay listelendi
            showsHorizontalScrollIndicator={false} // kaydırma çubuğu gizlendi
            contentContainerStyle={{paddingHorizontal: 15}} // yatayda iç boşluk verildi
        >
            {
                data.map((item, index)=>{
                    return (
                        <TouchableWithoutFeedback
                            key={index}
                            onPress={()=>navigation.push('Movie', item)}// Film ekranına gönder ve öğeyi duraklat
                        >{/* push ile gönderildiğinde uygulamayı yeniler ve yeni bir ekran gibi açar */}
                            <View className="space-y-1 mr-4">
                                <Image 
                                    // source={require('../assets/images/movie.png')}
                                    source={{uri: image185(item.poster_path) || fallbackMoviePoster}}
                                    className="rounded-xl"
                                    style={{width : width*0.33, height : height*0.22}}
                                />
                                <Text className="text-neutral-300 ml-1">
                                    {
                                        item?.title?.length>14? item.title.slice(0,14)+'...': item.title
                                    }
                                </Text> 
                            </View>
                        </TouchableWithoutFeedback>
                    )
                })
            }
        </ScrollView>
    </View>
  )
}