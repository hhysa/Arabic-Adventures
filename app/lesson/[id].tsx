import React,{useState} from 'react';
import {View,Text,Pressable,ScrollView,useWindowDimensions} from 'react-native';
import {router,useLocalSearchParams} from 'expo-router';
import {useAudioPlayer} from 'expo-audio';
import {Button,s,colors} from '../../src/ui';
import {groups,lessons} from '../../src/data';
import {useProgress} from '../../src/progress';
import {useLanguage} from '../../src/language';
import {audio} from '../../src/audio';
import {LessonBoard,BoardWord} from '../../src/LessonBoard';
export function generateStaticParams(){return lessons.map(l=>({id:l.id}));}
export default function Lesson(){
 const {t,language,setLanguage,ready:languageReady,error:languageError}=useLanguage();
 const {id}=useLocalSearchParams<{id:string}>(),lesson=lessons.find(l=>l.id===id),p=useProgress();
 const {width}=useWindowDimensions(),[error,setError]=useState('');
 const player=useAudioPlayer(null);
 if(!lesson)return <View style={[s.card,{margin:24}]}><Text style={s.title}>{t('Let’s find your lesson')}</Text><Button onPress={()=>router.replace('/')}>{t('Go to learning trail')}</Button></View>;
 const g=groups[lesson.group],done=p.completed.includes(lesson.id),next=lessons[(lessons.indexOf(lesson)+1)%lessons.length];
 const groupWords=lessons.filter(word=>word.group===lesson.group);
 const orange:BoardWord={id:'orange',arabic:'بُرْتُقَال',english:'Orange',emoji:'🍊'};
 const words=g.letter==='ب'?[lesson.id==='door'?lesson:groupWords[0],orange]:groupWords;
 const boardWidth=Math.min(width-20,780);
 function play(wordId:string){try{player.pause();player.replace(audio[wordId]);player.play();setError('');}catch{setError('Audio could not play. Please try again.');}}
 return <View style={{flex:1,backgroundColor:'#E2E7DC'}}>
  <ScrollView contentContainerStyle={{alignItems:'center',paddingBottom:36}}>
   <View style={{width:boardWidth,paddingVertical:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,flexWrap:'wrap'}}>
    <Pressable accessibilityRole="button" onPress={()=>router.push('/')} style={{paddingVertical:12}}><Text style={s.back}>{t('← Your learning trail')}</Text></Pressable>
    <View accessibilityRole="radiogroup" accessibilityLabel={t('Language')} style={{flexDirection:'row',gap:4}}>
     {([['sq','Shqip'],['en','English']] as const).map(([code,label])=><Pressable key={code} accessibilityRole="radio" accessibilityState={{checked:language===code,disabled:!languageReady}} disabled={!languageReady} onPress={()=>setLanguage(code)} style={{paddingHorizontal:14,paddingVertical:12,borderRadius:12,backgroundColor:language===code?'#447D45':'#F4F7EB'}}><Text style={{fontSize:14,fontWeight:'700',color:language===code?'#FFF':colors.ink}}>{label}</Text></Pressable>)}
    </View>
   </View>
   <LessonBoard group={lesson.group} words={words} width={boardWidth} onPlay={play}/>
   <View style={{width:boardWidth,gap:16,paddingTop:20,paddingHorizontal:8}}>
    <Text style={[s.sub,{textAlign:'center'}]}>{t('Tap a picture or word to hear it in Arabic.')}</Text>
    {error||p.error||languageError?<Text accessibilityRole="alert">{t(error||p.error||languageError)}</Text>:null}
    <View style={[s.row,{justifyContent:'center'}]}>{g.words.map(w=><Button key={w[0]} secondary={lesson.id!==w[0]} onPress={()=>router.replace(`/lesson/${w[0]}`)}>{t(w[2])} {p.completed.includes(w[0])?'✓':''}</Button>)}</View>
    {'أدذرزو'.includes(g.letter)&&<Text style={s.sub}>{t('This letter joins to the letter before it, but never to the letter after it.')}</Text>}
    <View style={[s.row,{justifyContent:'center'}]}>
     <Button secondary onPress={()=>play(lesson.id)}>{t('♫  Listen to the word')}</Button>
     <Button secondary onPress={()=>router.push(`/coloring?id=${lesson.id}`)}>{t('✎  Let’s color')}</Button>
    </View>
    <Text accessibilityRole="alert" style={[s.sub,{textAlign:'center'}]}>{done?t('Your three stars are saved.'):t('Finish this lesson to collect three stars.')}</Text>
    <Button disabled={!p.ready} onPress={()=>{if(!done)p.complete(lesson.id);else router.replace(`/lesson/${next.id}`);}}>{done?t('Next word →'):t('I learned this word!  ★ +3')}</Button>
   </View>
  </ScrollView>
 </View>;
}
