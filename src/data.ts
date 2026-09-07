export const groups = [
 {letter:'أ',name:'Alif',forms:['أ','أ','ـأ','ـأ'],color:'#F9D76D',words:[['lion','أَسَد','Lion','asad','🦁'],['rabbit','أَرْنَب','Rabbit','arnab','🐇']]},
 {letter:'ب',name:'Baa',forms:['ب','بـ','ـبـ','ـب'],color:'#BBDD87',words:[['duck','بَطَّة','Duck','battah','🦆'],['door','بَاب','Door','baab','🚪']]},
 {letter:'ت',name:'Taa',forms:['ت','تـ','ـتـ','ـت'],color:'#F7B19C',words:[['apple','تُفَّاحَة','Apple','tuffaahah','🍎'],['dates','تَمْر','Dates','tamr','🌴']]},
 {letter:'س',name:'Seen',forms:['س','سـ','ـسـ','ـس'],color:'#AADDDD',words:[['fish','سَمَكَة','Fish','samakah','🐟'],['car','سَيَّارَة','Car','sayyaarah','🚗']]},
 {letter:'ق',name:'Qaaf',forms:['ق','قـ','ـقـ','ـق'],color:'#CBBBEA',words:[['moon','قَمَر','Moon','qamar','🌙'],['pencil','قَلَم','Pencil','qalam','✏️']]},
];
export const lessons=groups.flatMap((g,group)=>g.words.map(([id,arabic,english,say,emoji])=>({id,arabic,english,say,emoji,group})));
