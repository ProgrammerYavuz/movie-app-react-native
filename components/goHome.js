import { Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme'

export default function GoHome() {
    const navigation = useNavigation(); // farklı bir ekrana yönlendirmek için navigation tanımlanır
  return (
    <SafeAreaView className="absolute bottom-0 bg-transparent z-20 ml-4">
        <TouchableOpacity 
              onPress={()=> navigation.navigate('Home')}
            className="h-14 w-14 rounded-xl items-center justify-center" 
            style={{backgroundColor: theme.background}}
        >
            <Text className="text-3xl text-white font-bold">X</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}