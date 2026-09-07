import React from 'react';
import {Stack} from 'expo-router';
import {SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context';
import {ProgressProvider} from '../src/progress';
import {LanguageProvider} from '../src/language';
export default function Layout(){return <SafeAreaProvider><SafeAreaView style={{flex:1,backgroundColor:'#F5F7EB'}}><LanguageProvider><ProgressProvider><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:'#F5F7EB'}}}/></ProgressProvider></LanguageProvider></SafeAreaView></SafeAreaProvider>}
