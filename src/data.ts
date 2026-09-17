export type VocabularyWord = {
  id: string;
  arabic: string;
  english: string;
  say: string;
  emoji: string;
};
export type LetterGroup = {
  letter: string;
  name: string;
  // Isolated, beginning, middle, ending. Keep this order for the lesson board.
  forms: [string, string, string, string];
  color: string;
  words: [VocabularyWord, VocabularyWord];
};
export type Lesson = VocabularyWord & { group: number };

export const groups: LetterGroup[] = [
  {
    letter: 'أ',
    name: 'Alif',
    forms: ['أ', 'أ', 'ـأ', 'ـأ'],
    color: '#F9D76D',
    words: [
      {
        id: 'lion',
        arabic: 'أَسَد',
        english: 'Lion',
        say: 'asad',
        emoji: '🦁',
      },
      {
        id: 'rabbit',
        arabic: 'أَرْنَب',
        english: 'Rabbit',
        say: 'arnab',
        emoji: '🐇',
      },
    ],
  },
  {
    letter: 'ب',
    name: 'Baa',
    forms: ['ب', 'بـ', 'ـبـ', 'ـب'],
    color: '#BBDD87',
    words: [
      {
        id: 'duck',
        arabic: 'بَطَّة',
        english: 'Duck',
        say: 'battah',
        emoji: '🦆',
      },
      {
        id: 'orange',
        arabic: 'بُرْتُقَال',
        english: 'Orange',
        say: 'burtuqaal',
        emoji: '🍊',
      },
    ],
  },
  {
    letter: 'ت',
    name: 'Taa',
    forms: ['ت', 'تـ', 'ـتـ', 'ـت'],
    color: '#F7B19C',
    words: [
      {
        id: 'apple',
        arabic: 'تُفَّاحَة',
        english: 'Apple',
        say: 'tuffaahah',
        emoji: '🍎',
      },
      {
        id: 'dates',
        arabic: 'تَمْر',
        english: 'Dates',
        say: 'tamr',
        emoji: '🌴',
      },
    ],
  },
  {
    letter: 'ث',
    name: 'Thaa',
    forms: ['ث', 'ثـ', 'ـثـ', 'ـث'],
    color: '#AADDDD',
    words: [
      {
        id: 'fox',
        arabic: 'ثَعْلَب',
        english: 'Fox',
        say: 'tha‘lab',
        emoji: '🦊',
      },
      {
        id: 'robe',
        arabic: 'ثَوْب',
        english: 'Robe',
        say: 'thawb',
        emoji: '🥼',
      },
    ],
  },
  {
    letter: 'ج',
    name: 'Jeem',
    forms: ['ج', 'جـ', 'ـجـ', 'ـج'],
    color: '#CBBBEA',
    words: [
      {
        id: 'camel',
        arabic: 'جَمَل',
        english: 'Camel',
        say: 'jamal',
        emoji: '🐪',
      },
      {
        id: 'cheese',
        arabic: 'جُبْن',
        english: 'Cheese',
        say: 'jubn',
        emoji: '🧀',
      },
    ],
  },
  {
    letter: 'ح',
    name: 'Haa',
    forms: ['ح', 'حـ', 'ـحـ', 'ـح'],
    color: '#F9D76D',
    words: [
      {
        id: 'horse',
        arabic: 'حِصَان',
        english: 'Horse',
        say: 'hisaan',
        emoji: '🐎',
      },
      {
        id: 'whale',
        arabic: 'حُوت',
        english: 'Whale',
        say: 'hoot',
        emoji: '🐋',
      },
    ],
  },
  {
    letter: 'خ',
    name: 'Khaa',
    forms: ['خ', 'خـ', 'ـخـ', 'ـخ'],
    color: '#BBDD87',
    words: [
      {
        id: 'bread',
        arabic: 'خُبْز',
        english: 'Bread',
        say: 'khubz',
        emoji: '🍞',
      },
      {
        id: 'sheep',
        arabic: 'خَرُوف',
        english: 'Sheep',
        say: 'kharoof',
        emoji: '🐑',
      },
    ],
  },
  {
    letter: 'د',
    name: 'Daal',
    forms: ['د', 'د', 'ـد', 'ـد'],
    color: '#F7B19C',
    words: [
      {
        id: 'bear',
        arabic: 'دُبّ',
        english: 'Bear',
        say: 'dubb',
        emoji: '🐻',
      },
      {
        id: 'chicken',
        arabic: 'دَجَاجَة',
        english: 'Chicken',
        say: 'dajaajah',
        emoji: '🐔',
      },
    ],
  },
  {
    letter: 'ذ',
    name: 'Dhaal',
    forms: ['ذ', 'ذ', 'ـذ', 'ـذ'],
    color: '#AADDDD',
    words: [
      {
        id: 'corn',
        arabic: 'ذُرَة',
        english: 'Corn',
        say: 'dhurah',
        emoji: '🌽',
      },
      {
        id: 'wolf',
        arabic: 'ذِئْب',
        english: 'Wolf',
        say: 'dhi’b',
        emoji: '🐺',
      },
    ],
  },
  {
    letter: 'ر',
    name: 'Raa',
    forms: ['ر', 'ر', 'ـر', 'ـر'],
    color: '#CBBBEA',
    words: [
      {
        id: 'robot',
        arabic: 'رُوبُوت',
        english: 'Robot',
        say: 'rooboot',
        emoji: '🤖',
      },
      {
        id: 'feather',
        arabic: 'رِيشَة',
        english: 'Feather',
        say: 'reeshah',
        emoji: '🪶',
      },
    ],
  },
  {
    letter: 'ز',
    name: 'Zaay',
    forms: ['ز', 'ز', 'ـز', 'ـز'],
    color: '#F9D76D',
    words: [
      {
        id: 'flower',
        arabic: 'زَهْرَة',
        english: 'Flower',
        say: 'zahrah',
        emoji: '🌸',
      },
      {
        id: 'giraffe',
        arabic: 'زَرَافَة',
        english: 'Giraffe',
        say: 'zaraafah',
        emoji: '🦒',
      },
    ],
  },
  {
    letter: 'س',
    name: 'Seen',
    forms: ['س', 'سـ', 'ـسـ', 'ـس'],
    color: '#BBDD87',
    words: [
      {
        id: 'fish',
        arabic: 'سَمَكَة',
        english: 'Fish',
        say: 'samakah',
        emoji: '🐟',
      },
      {
        id: 'car',
        arabic: 'سَيَّارَة',
        english: 'Car',
        say: 'sayyaarah',
        emoji: '🚗',
      },
    ],
  },
  {
    letter: 'ش',
    name: 'Sheen',
    forms: ['ش', 'شـ', 'ـشـ', 'ـش'],
    color: '#F7B19C',
    words: [
      {
        id: 'sun',
        arabic: 'شَمْس',
        english: 'Sun',
        say: 'shams',
        emoji: '☀️',
      },
      {
        id: 'tree',
        arabic: 'شَجَرَة',
        english: 'Tree',
        say: 'shajarah',
        emoji: '🌳',
      },
    ],
  },
  {
    letter: 'ص',
    name: 'Saad',
    forms: ['ص', 'صـ', 'ـصـ', 'ـص'],
    color: '#AADDDD',
    words: [
      {
        id: 'falcon',
        arabic: 'صَقْر',
        english: 'Falcon',
        say: 'saqr',
        emoji: '🦅',
      },
      {
        id: 'soap',
        arabic: 'صَابُون',
        english: 'Soap',
        say: 'saaboon',
        emoji: '🧼',
      },
    ],
  },
  {
    letter: 'ض',
    name: 'Daad',
    forms: ['ض', 'ضـ', 'ـضـ', 'ـض'],
    color: '#CBBBEA',
    words: [
      {
        id: 'frog',
        arabic: 'ضِفْدَع',
        english: 'Frog',
        say: 'difda‘',
        emoji: '🐸',
      },
      {
        id: 'molar',
        arabic: 'ضِرْس',
        english: 'Molar',
        say: 'dirs',
        emoji: '🦷',
      },
    ],
  },
  {
    letter: 'ط',
    name: 'Taa emphatic',
    forms: ['ط', 'طـ', 'ـطـ', 'ـط'],
    color: '#F9D76D',
    words: [
      {
        id: 'airplane',
        arabic: 'طَائِرَة',
        english: 'Airplane',
        say: 'taa’irah',
        emoji: '✈️',
      },
      {
        id: 'drum',
        arabic: 'طَبْل',
        english: 'Drum',
        say: 'tabl',
        emoji: '🥁',
      },
    ],
  },
  {
    letter: 'ظ',
    name: 'Dhaa emphatic',
    forms: ['ظ', 'ظـ', 'ـظـ', 'ـظ'],
    color: '#BBDD87',
    words: [
      {
        id: 'envelope',
        arabic: 'ظَرْف',
        english: 'Envelope',
        say: 'zarf',
        emoji: '✉️',
      },
      {
        id: 'zaby',
        arabic: 'ظَبْي',
        english: 'Gazelle',
        say: 'zaby',
        emoji: '🦌',
      },
    ],
  },
  {
    letter: 'ع',
    name: 'Ayn',
    forms: ['ع', 'عـ', 'ـعـ', 'ـع'],
    color: '#F7B19C',
    words: [
      {
        id: 'eye',
        arabic: 'عَيْن',
        english: 'Eye',
        say: '‘ayn',
        emoji: '👁️',
      },
      {
        id: 'grapes',
        arabic: 'عِنَب',
        english: 'Grapes',
        say: '‘inab',
        emoji: '🍇',
      },
    ],
  },
  {
    letter: 'غ',
    name: 'Ghayn',
    forms: ['غ', 'غـ', 'ـغـ', 'ـغ'],
    color: '#AADDDD',
    words: [
      {
        id: 'gazelle',
        arabic: 'غَزَال',
        english: 'Gazelle',
        say: 'ghazaal',
        emoji: '🦌',
      },
      {
        id: 'cloud',
        arabic: 'غَيْمَة',
        english: 'Cloud',
        say: 'ghaymah',
        emoji: '☁️',
      },
    ],
  },
  {
    letter: 'ف',
    name: 'Faa',
    forms: ['ف', 'فـ', 'ـفـ', 'ـف'],
    color: '#CBBBEA',
    words: [
      {
        id: 'elephant',
        arabic: 'فِيل',
        english: 'Elephant',
        say: 'feel',
        emoji: '🐘',
      },
      {
        id: 'strawberry',
        arabic: 'فَرَاوِلَة',
        english: 'Strawberry',
        say: 'faraawilah',
        emoji: '🍓',
      },
    ],
  },
  {
    letter: 'ق',
    name: 'Qaaf',
    forms: ['ق', 'قـ', 'ـقـ', 'ـق'],
    color: '#F9D76D',
    words: [
      {
        id: 'moon',
        arabic: 'قَمَر',
        english: 'Moon',
        say: 'qamar',
        emoji: '🌙',
      },
      {
        id: 'pencil',
        arabic: 'قَلَم',
        english: 'Pencil',
        say: 'qalam',
        emoji: '✏️',
      },
    ],
  },
  {
    letter: 'ك',
    name: 'Kaaf',
    forms: ['ك', 'كـ', 'ـكـ', 'ـك'],
    color: '#BBDD87',
    words: [
      {
        id: 'dog',
        arabic: 'كَلْب',
        english: 'Dog',
        say: 'kalb',
        emoji: '🐕',
      },
      {
        id: 'book',
        arabic: 'كِتَاب',
        english: 'Book',
        say: 'kitaab',
        emoji: '📖',
      },
    ],
  },
  {
    letter: 'ل',
    name: 'Laam',
    forms: ['ل', 'لـ', 'ـلـ', 'ـل'],
    color: '#F7B19C',
    words: [
      {
        id: 'lemon',
        arabic: 'لَيْمُون',
        english: 'Lemon',
        say: 'laymoon',
        emoji: '🍋',
      },
      {
        id: 'tongue',
        arabic: 'لِسَان',
        english: 'Tongue',
        say: 'lisaan',
        emoji: '👅',
      },
    ],
  },
  {
    letter: 'م',
    name: 'Meem',
    forms: ['م', 'مـ', 'ـمـ', 'ـم'],
    color: '#AADDDD',
    words: [
      {
        id: 'banana',
        arabic: 'مَوْز',
        english: 'Banana',
        say: 'mawz',
        emoji: '🍌',
      },
      {
        id: 'key',
        arabic: 'مِفْتَاح',
        english: 'Key',
        say: 'miftaah',
        emoji: '🔑',
      },
    ],
  },
  {
    letter: 'ن',
    name: 'Noon',
    forms: ['ن', 'نـ', 'ـنـ', 'ـن'],
    color: '#CBBBEA',
    words: [
      {
        id: 'star',
        arabic: 'نَجْم',
        english: 'Star',
        say: 'najm',
        emoji: '⭐',
      },
      {
        id: 'bee',
        arabic: 'نَحْلَة',
        english: 'Bee',
        say: 'nahlah',
        emoji: '🐝',
      },
    ],
  },
  {
    letter: 'ه',
    name: 'Haa (هـ)',
    forms: ['ه', 'هـ', 'ـهـ', 'ـه'],
    color: '#F9D76D',
    words: [
      {
        id: 'crescent',
        arabic: 'هِلَال',
        english: 'Crescent',
        say: 'hilaal',
        emoji: '🌙',
      },
      {
        id: 'gift',
        arabic: 'هَدِيَّة',
        english: 'Gift',
        say: 'hadiyyah',
        emoji: '🎁',
      },
    ],
  },
  {
    letter: 'و',
    name: 'Waaw',
    forms: ['و', 'و', 'ـو', 'ـو'],
    color: '#BBDD87',
    words: [
      {
        id: 'rose',
        arabic: 'وَرْدَة',
        english: 'Rose',
        say: 'wardah',
        emoji: '🌹',
      },
      {
        id: 'face',
        arabic: 'وَجْه',
        english: 'Face',
        say: 'wajh',
        emoji: '🙂',
      },
    ],
  },
  {
    letter: 'ي',
    name: 'Yaa',
    forms: ['ي', 'يـ', 'ـيـ', 'ـي'],
    color: '#F7B19C',
    words: [
      {
        id: 'hand',
        arabic: 'يَد',
        english: 'Hand',
        say: 'yad',
        emoji: '✋',
      },
      {
        id: 'dove',
        arabic: 'يَمَامَة',
        english: 'Dove',
        say: 'yamaamah',
        emoji: '🕊️',
      },
    ],
  },
];
export const lessons: Lesson[] = groups.flatMap((g, group) =>
  g.words.map((word) => ({ ...word, group })),
);
