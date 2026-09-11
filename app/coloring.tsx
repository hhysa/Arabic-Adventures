import {useLanguage} from '../src/language';
import React,{useRef,useState} from 'react';
import {View,Text,Pressable,PanResponder,Platform} from 'react-native';
import Svg,{Path} from 'react-native-svg';
import {router,useLocalSearchParams} from 'expo-router';
import {Shell,Button,s} from '../src/ui';
import {lessons} from '../src/data';
import {beginStroke,moveStroke,DrawingGesture,Stroke} from '../src/drawing';
const paintNames:Record<string,string>={'#E98B38':'Orange color','#D55B5B':'Red','#78A857':'Green','#55A6CE':'Blue','#A581C5':'Purple','#F0C94C':'Yellow','#354C3B':'Dark green'};
export default function Coloring(){const {t}=useLanguage();const {id}=useLocalSearchParams<{id:string}>(),lesson=lessons.find(l=>l.id===id)??lessons[0],[color,setColor]=useState('#E98B38'),[strokes,setStrokes]=useState<Stroke[]>([]),[drawing,setDrawing]=useState(false),active=useRef<DrawingGesture|null>(null),chosen=useRef(color);chosen.current=color;const finish=()=>{active.current=null;setDrawing(false);};
const responder=useRef(PanResponder.create({
 onStartShouldSetPanResponder:()=>true,
 onMoveShouldSetPanResponder:()=>active.current!==null,
 onPanResponderTerminationRequest:()=>false,
 onShouldBlockNativeResponder:()=>true,
 onPanResponderGrant:e=>{
  const {locationX:x,locationY:y}=e.nativeEvent;
  const gesture=beginStroke(x,y,chosen.current);
  active.current=gesture;
  // Capture this snapshot before React queues the update. Release may clear the ref.
  const stroke=gesture.stroke;
  setStrokes(previous=>[...previous,stroke]);
  setDrawing(true);
 },
 onPanResponderMove:(_event,gestureState)=>{
  if(!active.current)return;
  // Stop a stroke when another finger joins, avoiding centroid jumps.
  if(gestureState.numberActiveTouches>1){finish();return;}
  const gesture=moveStroke(active.current,gestureState.dx,gestureState.dy);
  active.current=gesture;
  const stroke=gesture.stroke;
  setStrokes(previous=>[...previous.slice(0,-1),stroke]);
 },
 onPanResponderRelease:finish,
 onPanResponderTerminate:finish,
})).current;
return <Shell scrollEnabled={Platform.OS==='web'||!drawing}><Pressable onPress={()=>router.back()}><Text style={s.back}>{t("← Back to your word")}</Text></Pressable><Text style={s.title}>{t("A splash of imagination")}</Text><Text style={s.sub}>{t('Draw around your {word} and trace the Arabic word. Drag your finger or mouse to paint.',{word:t(lesson.english).toLocaleLowerCase()})}</Text><View style={{backgroundColor:'#FFF',borderRadius:25,overflow:'hidden',borderWidth:2,borderColor:'#DEE7D0',height:420}}><View testID="coloring-canvas" pointerEvents="box-only" collapsable={false} style={{flex:1,touchAction:'none',userSelect:'none'} as any} {...responder.panHandlers}><View pointerEvents="none" style={{position:'absolute',inset:0,alignItems:'center',justifyContent:'center',opacity:.3}}><Text style={{fontSize:140}}>{lesson.emoji}</Text><Text style={[s.arabic,{fontSize:80}]}>{lesson.arabic}</Text></View><Svg pointerEvents="none" width="100%" height="100%">{strokes.map((stroke,i)=><Path key={i} d={stroke.points} stroke={stroke.color} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none"/>)}</Svg></View></View><View style={[s.row,{justifyContent:'center'}]}>{['#E98B38','#D55B5B','#78A857','#55A6CE','#A581C5','#F0C94C','#354C3B'].map(c=><Pressable key={c} accessibilityRole="button" accessibilityLabel={t('Paint {color}',{color:t(paintNames[c])})} accessibilityState={{selected:c===color}} onPress={()=>setColor(c)} style={{width:44,height:44,borderRadius:22,backgroundColor:c,borderWidth:color===c?4:0,borderColor:'#263E32'}}/>)}</View><View style={[s.row,{justifyContent:'center'}]}><Button secondary disabled={!strokes.length||drawing} onPress={()=>setStrokes(v=>v.slice(0,-1))}>{t("Undo")}</Button><Button secondary disabled={!strokes.length||drawing} onPress={()=>setStrokes([])}>{t("Start over")}</Button><Button onPress={()=>router.back()}>{t("All done ✓")}</Button></View></Shell>}

