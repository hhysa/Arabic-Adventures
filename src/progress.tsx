import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {lessons} from './data';
type Progress={completed:string[];days:string[];quizStars:number};
const empty:Progress={completed:[],days:[],quizStars:0};
const Context=createContext({ ...empty,ready:false,error:'',complete:(id:string)=>{},reward:()=>{} });
const today=()=>new Date().toLocaleDateString('en-CA');
export function ProgressProvider({children}:{children:React.ReactNode}){
 const [state,setState]=useState<Progress>(empty),[ready,setReady]=useState(false),[error,setError]=useState('');
 const queue=useRef(Promise.resolve());
 useEffect(()=>{AsyncStorage.getItem('arabic-adventures-v1').then(raw=>{if(raw){const s=JSON.parse(raw);setState({completed:Array.isArray(s.completed)?s.completed.filter((id:string)=>lessons.some(l=>l.id===id)):[],days:Array.isArray(s.days)?s.days:[],quizStars:Number.isFinite(s.quizStars)?s.quizStars:0});}}).catch(()=>setError('Your saved progress could not be loaded.')).finally(()=>setReady(true));},[]);
 useEffect(()=>{if(ready){queue.current=queue.current.then(()=>AsyncStorage.setItem('arabic-adventures-v1',JSON.stringify(state))).catch(()=>setError('Progress could not be saved on this device.'));}},[state,ready]);
 const update=(id?:string)=>{if(!ready)return;setState(s=>({...s,completed:id?Array.from(new Set([...s.completed,id])):s.completed,quizStars:s.quizStars+(id?0:1),days:Array.from(new Set([...s.days,today()]))}));};
 return <Context.Provider value={{...state,ready,error,complete:update,reward:()=>update()}}>{children}</Context.Provider>;
}
export const useProgress=()=>useContext(Context);
export function streak(days:string[]){let n=0,d=new Date();if(!days.includes(d.toLocaleDateString('en-CA')))d.setDate(d.getDate()-1);while(days.includes(d.toLocaleDateString('en-CA'))){n++;d.setDate(d.getDate()-1);}return n;}
