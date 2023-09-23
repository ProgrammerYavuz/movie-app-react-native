import { View, Text, Dimensions, Platform, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { HeartIcon } from 'react-native-heroicons/solid'
import { useNavigation, useRoute } from '@react-navigation/native'
import { styles, theme } from '../theme'
import MovieList from '../components/movieList';
import Loading from '../components/loading'
import { fallbackPersonImage, fetchPersonDetails, fetchPersonMovies, image342 } from '../api/moviedb'
import GoHome from '../components/goHome'

var {width, height} = Dimensions.get('window'); // cihazın genişlik ve yüksekliğini alır
const ios = Platform.OS == 'ios';
const verticalMargin = ios? '': ' my-3';

export default function PersonScreen() {
    const {params: item} = useRoute(); // sayfalar arasında geçiş yaparken gelen parametreleri almak için
    const navigation = useNavigation(); // farklı bir ekrana yönlendirmek için navigation tanımlanır
    const [isFavourite, toggleFavourite] = useState(false); // içerik favoriye eklenmişse kalp ikonunun rengi değişir
    const [person, setPerson] = useState({})
    const [personMovies, setPersonMovies] = useState([])
    const [loading, setLoading] = useState(false);
    useEffect(()=>{ // güncellenmiş kişi verilerini almak için
        // console.log('kişi:  ',item); // kayıtların gelip gelmediği kontrol edildi
        setLoading(true); // id ile kayıt alacağımız için önce yükleniyor animasyonunu başlatalım
        getPersonDetails(item.id); // oyuncu bilgilerini almak için
        getPersonMovies(item.id); // oyuncunun yer aldığı filmleri almak için
    }, [item])

    const getPersonDetails = async id => {
        const data = await fetchPersonDetails(id); // apiden kayıları getir
        // console.log('oyuncu bilgileri geldi: ',data); // kayıtların geldiğini kontrol et
        if(data) setPerson(data); // kayıtları setPersona ekle
        setLoading(false); // yükleme animasyonunu durdur
    }

    const getPersonMovies = async id => {
        const data = await fetchPersonMovies(id); // apiden kayıları getir
        // console.log('oyuncunun filmleri geldi: ',data); // kayıtların geldiğini kontrol et
        if(data && data.cast) setPersonMovies(data.cast); // kayıtları setPersonMovies ekle
    }

  return (
    <View 
        className="flex-1 bg-slate-900"
        contentContainerStyle={{paddingBottom: 20}}
    >
    <GoHome/>
    <ScrollView>
        {/* Geri butonu ve kalp ikonu */}
 
        <SafeAreaView 
            className={"flex-row items-center justify-between mx-4 z-20 "+verticalMargin}
        >
            <TouchableOpacity 
                onPress={()=> navigation.goBack()} // önceki ekrana dön
                style={styles.background} 
                className="p-1 rounded-xl" 
            >
                <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
            </TouchableOpacity>
            {
                !loading && ( // Eğer yüklenme işlemi yapılmıyorsa göster
                    <TouchableOpacity 
                        onPress={()=> toggleFavourite(!isFavourite)} // tıklandığında favori işlemini değiştirecek
                    >
                        <HeartIcon size="35" color={isFavourite? theme.background : 'white'} />
                    </TouchableOpacity>
                )
            }


        </SafeAreaView>
        {
            loading? ( // Eğer yüklenme işlemi sürüyorsa
                <Loading />
            ) : ( // Eğer yüklenme işlemi tamamlanmışsa
                <View>{/* Oyuncu bilgileri */}
                    {/* Oyuncu resmi */}
                    <View 
                        className="flex-row justify-center"
                        style={{ // gölge alanı
                            shadowColor: theme.background,
                            shadowRadius: 40,
                            shadowOffset: {width: 0, height: 5},
                            shadowOpacity: 1
                        }}
                    >
                        <View className="h-72 w-72 items-center overflow-hidden rounded-full border-2"
                            style={{borderColor:theme.background}}
                        >
                            <Image 
                                // source={require('../assets/images/movie.png')}
                                source={{uri: image342(person?.profile_path) || fallbackPersonImage}}
                                style={{width: width*0.74, height: height*0.43}} // görsel stillendirmesi
                            />
                        </View>
                    </View>
                    
                    {/* Oyuncu ismi ve doğum yeri */}
                    <View className="mt-6">
                        <Text className="text-3xl text-white font-bold text-center">
                            {
                                person?.name
                            }
                        </Text>
                        <Text className="text-base text-neutral-500 text-center">
                            {
                                person?.place_of_birth
                            }
                        </Text>
                    </View>
        
                    {/* Oyuncu istatistikleri */}
                    <View className="flex-row items-center justify-center mx-3 mt-6 p-4 space-x-4 bg-slate-800 rounded-full">
                        <View className="items-center px-2">
                            <Text className="font-semibold" style={{color:theme.text}}>Cinsiyet</Text>
                            <Text className="text-neutral-300 text-sm">
                                {
                                    person?.gender==1? 'Kadın' : 'Erkek'
                                }
                            </Text>
                        </View>
                        <View className="items-center px-4 border-r-2 border-l-2 border-neutral-400">
                            <Text className="font-semibold" style={{color:theme.text}}>Doğum</Text>
                            {
                                person?.birthday ? ( // Tarih değeri yyyy-mm-dd şeklinde geliyorken Türkçe formata çevrildi
                                    <Text className="text-neutral-300 text-sm">
                                        {new Date(person.birthday).toLocaleDateString('tr-TR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </Text>
                                ) : (
                                    <Text className="text-neutral-300 text-sm">Bilinmiyor</Text>
                                )
                            }
                        </View>
                        <View className="items-center px-2">
                            <Text className="font-semibold" style={{color:theme.text}}>Popülerlik</Text>
                            <Text className="text-neutral-300 text-sm">
                                {
                                    person?.popularity?.toFixed(1)+'%' // noktadan sonra 1 sayı gösterir (örnek 92.423 => 92.4)
                                }
                            </Text>
                        </View>
                    </View>
        
                    {/* Oyuncu biyografisi */}
                    <View className="my-6 mx-4 space-y-2">
                        <Text className="text-white text-lg font-bold">Biyografi</Text>

                        {person?.biography ? ( // oyuncu biyografi yazısı varsa
                            <Text className="text-neutral-400 text-sm tracking-wide">
                                {
                                    person?.biography
                                }
                            </Text>
                        ):( // oyuncu biyografi yazısı yoksa
                            <Text className="mx-4 pt-10 text-2xl text-center tracking-wide" style={styles.text}>
                                Bu oyuncunun biyografisi bulunmamaktadır!
                            </Text>
                        )}
                    </View>
        
                    {/* Filmleri */}
                    <MovieList title="Filmler" hideSeeAll={true} data={personMovies} />
                </View>
            )
        }

        </ScrollView>
    </View>
  )
}