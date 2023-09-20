import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { fallbackPersonImage, image185 } from '../api/moviedb';
import { theme } from '../theme';

export default function Cast({cast, navigation}) {

  return (
    <View className="my-6">
      <Text className="text-white text-lg font-bold mx-4 mb-5">Oyuncular</Text>
      <ScrollView
        horizontal // yatay listelendi
        showsHorizontalScrollIndicator={false} // kaydırma çubuğu gizlendi
        contentContainerStyle={{paddingHorizontal: 15}}
      >
      {
        cast && cast.map((person, index)=>{
            return (
                <TouchableOpacity
                    key={index}
                    className="mr-4 items-center"
                    onPress={()=> navigation.navigate('Person', person)} // Oyuncu detay sayfasına gider ve oyuncu nesnesini de göndeririz
                >
                    <View
                        className="h-20 w-20 items-center overflow-hidden rounded-full border"
                        style={{borderColor:theme.background}}
                    >
                        <Image 
                            className="h-24 w-20 rounded-2xl"
                            // source={require('../assets/images/actor.png')}
                            source={{uri: image185(person?.profile_path) || fallbackPersonImage}}
                        />
                    </View>
                    <Text className="text-white text-xs mt-1">
                        {
                            person?.character.length>10? person?.character.slice(0,10)+'...' : person?.character
                        }
                    </Text>
                    <Text className="text-neutral-400 text-xs mt-1">
                        {
                            person?.original_name.length>10? person?.original_name.slice(0,10)+'...' : person?.original_name
                        }
                    </Text>
                </TouchableOpacity>
            )
        })
      }
      </ScrollView>
    </View>
  )
}