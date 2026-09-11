import {groups,lessons} from './data';
export function makeQuiz(random= Math.random) {
 const shuffled=groups.map((_,i)=>i);
 for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
 return shuffled.slice(0,5).map(group=>{
  const words=lessons.filter(l=>l.group===group);
  const word=words[Math.floor(random()*words.length)];
  const distractors=shuffled.filter(i=>i!==group).slice(0,3);
  const options=[...distractors,group];
  for(let i=options.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[options[i],options[j]]=[options[j],options[i]];}
  return {word,options};
 });
}
