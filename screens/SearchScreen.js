import { View, Text, Dimensions, SafeAreaView, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { XMarkIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/loading';
import { debounce } from 'lodash'
import { fallbackMoviePoster, image185, searchMovies } from '../api/moviedb';

var {width, height} = Dimensions.get('window'); // cihazın genişlik ve yüksekliğini alır

export default function SearchScreen() {
    const navigation = useNavigation(); // farklı bir ekrana yönlendirmek için navigation tanımlanır
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleSearch = value=>{
        // console.log('value :', value); // inputa yazılan değer geliyor mu kontrol edilir
        if(value && value.length>2){ // arama yapmak için inputa en az 2 karakter girilmelidir
            setLoading(true); // arama yapılırken yükleme animasyonu çalıştırılır
            searchMovies({ // apiden kayıları getir
                query: value, // aranan kelime
                include_adult: 'false',
                language: 'tr-TR',
                page: '1'
            }).then(data=>{ // apiden verileri alırız
                setLoading(false); // animasyonu durdur
                //console.log('Arama sonuçları :', data); // arama sonuçları kontrol edildi
                if(data && data.results) setResults(data.results) // gelen kayıtları setResultsa ekle
            })
        }else{
            setLoading(false);
            setResults([]);
        }
    }
    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []); // arama değerini 400 mili saniye geçiktirerek apiye sürekli istek atmayı önleriz
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
        {/* Arama alanı */}
        <View className="flex-row items-center justify-between mx-4 mb-3 border border-slate-500 rounded-full">
            <TextInput 
                onChangeText={handleTextDebounce} // input alanı değiştikçe apiden kayıtlar gelecek
                placeholder='Hangi filmi izleyeceksin?'
                placeholderTextColor={'lightgray'}
                className="flex-1 pb-1 pl-6 text-base text-white font-semibold tracking-wide"
            />
            <TouchableOpacity
                onPress={()=> navigation.navigate('Home')}
                className="rounded-full p-3 m-1 bg-slate-500"
            >
                <XMarkIcon size="25" color="white"/>
            </TouchableOpacity>
        </View>

        {/* Arama sonuçları */}

        {
            loading? ( // Eğer yüklenme işlemi sürüyorsa
                <Loading />
            ) : 
            results.length>0? ( // Arama sonucu kayıt varsa
                <ScrollView
                    showsVerticalScrollIndicator={false} // scroll gizlendi
                    contentContainerStyle={{paddingHorizontal: 15}}
                    className="space-y-3"
                >
                    <Text className="text-white text-right text-base font-semibold mx-2">
                        ({results.length}) adet film bulundu 
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                        {
                            results.map((item, index)=>{
                                return( // Filmler
                                    <TouchableWithoutFeedback
                                        key={index}
                                        onPress={()=> navigation.push("Movie", item)}
                                    >
                                        <View className="mb-6 space-y-2">
                                            <Image 
                                                className="rounded-xl"
                                                // source={require('../assets/images/movie.png')}
                                                source={{uri: image185(item?.poster_path) || fallbackMoviePoster}} // arama sonucu film görseli
                                                style={{width: width*0.44, height: height*0.3}}
                                            />
                                            <Text className="text-white font-semibold text-base ml-1">
                                                {
                                                    item?.title.length>20? item?.title.slice(0,20)+'...' : item?.title
                                                }
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            ):( // Arama sonucu kayıt yoksa
                <View className="flex-col items-center justify-center">
                    <Image
                        source={require('../assets/images/search.png')}
                        className="h-96 w-96"
                    />
                    <Text className="text-white text-2xl font-bold text-center">Popcornlar hazırsa aramaya başla</Text>
                </View>
            )
        }
    </SafeAreaView>
  )
}