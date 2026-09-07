import {useLanguage} from '../src/language';
import React from 'react';
import {View,Text} from 'react-native';
import {router} from 'expo-router';
import {Shell,Button,s,colors} from '../src/ui';
import {groups} from '../src/data';
import {useProgress,streak} from '../src/progress';
export default function Progress(){const {t}=useLanguage();const p=useProgress();return <Shell><Text style={s.eyebrow}>{t("EVERY LITTLE STEP COUNTS")}</Text><Text style={s.title}>{t("Your adventure so far")}</Text><View style={[s.card,{backgroundColor:'#FFF1C7',alignItems:'center',padding:36}]}><Text style={{fontSize:65}}>🌟</Text><Text style={s.title}>{t('{count} stars collected',{count:p.completed.length*3+p.quizStars})}</Text><Text style={s.sub}>{t('{count} of 10 lessons · {days} day streak',{count:p.completed.length,days:streak(p.days)})}</Text></View><Text style={s.section}>{t("Look what you’ve discovered")}</Text>{groups.map(g=><View key={t(g.name)} style={s.card}><View style={s.row}><Text style={{fontSize:40,color:colors.green}}>{g.letter}</Text><Text style={s.section}>{t(g.name)}</Text></View>{g.words.map(w=><View key={w[0]} style={[s.row,{justifyContent:'space-between'}]}><Text style={{fontSize:17,color:colors.ink}}>{w[4]}  {t(w[2])}  ·  {w[1]}</Text><Button secondary onPress={()=>router.push(`/lesson/${w[0]}`)}>{p.completed.includes(w[0])?t("★ ★ ★  Revisit"):t("Explore →")}</Button></View>)}</View>)}<Text style={s.sub}>{t("Your progress stays on this device. No account needed.")}</Text></Shell>}
