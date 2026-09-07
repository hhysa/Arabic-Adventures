import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Language,translate} from './translations';

const storageKey='arabic-adventures-language-v1';
const Context=createContext({language:'sq' as Language,ready:false,error:'',setLanguage:(_language:Language)=>{},t:(key:string,params?:Record<string,string|number>)=>translate('sq',key,params)});

export function LanguageProvider({children}:{children:React.ReactNode}) {
  const [language,setLanguageState]=useState<Language>('sq');
  const [ready,setReady]=useState(false),[error,setError]=useState('');
  const writes=useRef(Promise.resolve());
  useEffect(()=>{let mounted=true;AsyncStorage.getItem(storageKey).then(value=>{if(mounted&&(value==='sq'||value==='en'))setLanguageState(value);}).catch(()=>{if(mounted)setError('Language preference could not be loaded.');}).finally(()=>{if(mounted)setReady(true);});return ()=>{mounted=false;};},[]);
  useEffect(()=>{if(Platform.OS==='web'&&typeof document!=='undefined'){document.documentElement.lang=language;document.title=translate(language,'Arabic Adventures');}},[language]);
  function setLanguage(next:Language){
    if(!ready)return;
    setLanguageState(next);
    writes.current=writes.current.then(()=>AsyncStorage.setItem(storageKey,next)).then(()=>setError('')).catch(()=>setError('Language preference could not be saved.'));
  }
  return <Context.Provider value={{language,ready,error,setLanguage,t:(key,params)=>translate(language,key,params)}}>{children}</Context.Provider>;
}
export const useLanguage=()=>useContext(Context);
