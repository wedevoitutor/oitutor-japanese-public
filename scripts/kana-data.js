// scripts/kana-data.js
// Single source of truth for all hiragana character and sentence data.
// Each char tuple: [kana, romaji] or [kana, romaji, acceptAlternatives[]]
// Each sentence: { sentence (romaji with ___), blank, options[4], vocab: [[word, meaning]] }

export const HIRAGANA_ROWS = [
  {
    name: 'vowels',
    title: 'Vowels',
    titleJp: 'あ行',
    chars: [
      ['あ', 'a'],
      ['い', 'i'],
      ['う', 'u'],
      ['え', 'e'],
      ['お', 'o'],
    ],
    sentences: [
      {
        sentence: '___ umi',
        blank: 'aoi',
        options: ['umi', 'aoi', 'eki', 'asa'],
        vocab: [
          ['青い [あおい] (aoi)', 'blue'],
          ['海 [うみ] (umi)', 'sea'],
          ['あおい うみ', 'Blue sea'],
        ],
      },
    ],
  },
  {
    name: 'k',
    title: 'K-row',
    titleJp: 'か行',
    chars: [
      ['か', 'ka'],
      ['き', 'ki'],
      ['く', 'ku'],
      ['け', 'ke'],
      ['こ', 'ko'],
    ],
    sentences: [
      {
        sentence: '___ o taberu',
        blank: 'kaki',
        options: ['kuchi', 'kaki', 'kaze', 'kiku'],
        vocab: [
          ['柿 [かき] (kaki)', 'persimmon'],
          ['口 [くち] (kuchi)', 'mouth'],
          ['を (o)', 'object particle'],
          ['食べる [たべる] (taberu)', 'to eat'],
          ['かきを たべる', 'Eat persimmon'],
        ],
      },
    ],
  },
  {
    name: 's',
    title: 'S-row',
    titleJp: 'さ行',
    chars: [
      ['さ', 'sa'],
      ['し', 'shi', ['si']],
      ['す', 'su'],
      ['せ', 'se'],
      ['そ', 'so'],
    ],
    sentences: [
      {
        sentence: '___ ga suki desu',
        blank: 'sushi',
        options: ['sushi', 'sora', 'sake', 'shio'],
        vocab: [
          ['寿司 [すし] (sushi)', 'sushi'],
          ['が (ga)', 'subject particle'],
          ['好き [すき] (suki)', 'like'],
          ['です (desu)', 'polite copula'],
          ['すしが すきです', 'I like sushi'],
        ],
      },
    ],
  },
  {
    name: 't',
    title: 'T-row',
    titleJp: 'た行',
    chars: [
      ['た', 'ta'],
      ['ち', 'chi', ['ti']],
      ['つ', 'tsu', ['tu']],
      ['て', 'te'],
      ['と', 'to'],
    ],
    sentences: [
      {
        sentence: '___ wa katai',
        blank: 'tetsu',
        options: ['tetsu', 'tsuchi', 'tochi', 'tatsu'],
        vocab: [
          ['鉄 [てつ] (tetsu)', 'iron'],
          ['土 [つち] (tsuchi)', 'earth / soil'],
          ['硬い [かたい] (katai)', 'hard'],
          ['てつは かたい', 'Iron is hard'],
        ],
      },
    ],
  },
  {
    name: 'n',
    title: 'N-row',
    titleJp: 'な行',
    chars: [
      ['な', 'na'],
      ['に', 'ni'],
      ['ぬ', 'nu'],
      ['ね', 'ne'],
      ['の', 'no'],
    ],
    sentences: [
      {
        sentence: '___ ga iru',
        blank: 'neko',
        options: ['neko', 'niku', 'nori', 'natsu'],
        vocab: [
          ['猫 [ねこ] (neko)', 'cat'],
          ['いる (iru)', 'to exist (animate)'],
          ['夏 [なつ] (natsu)', 'summer'],
          ['ねこが いる', 'A cat is here'],
        ],
      },
    ],
  },
  {
    name: 'h',
    title: 'H-row',
    titleJp: 'は行',
    chars: [
      ['は', 'ha'],
      ['ひ', 'hi'],
      ['ふ', 'fu', ['hu']],
      ['へ', 'he'],
      ['ほ', 'ho'],
    ],
    sentences: [
      {
        sentence: '___ ga saite iru',
        blank: 'hana',
        options: ['hana', 'hoshi', 'hito', 'fune'],
        vocab: [
          ['花 [はな] (hana)', 'flower'],
          ['さいている (saite iru)', 'is blooming'],
          ['星 [ほし] (hoshi)', 'star'],
          ['はなが さいている', 'Flowers are blooming'],
        ],
      },
    ],
  },
  {
    name: 'm',
    title: 'M-row',
    titleJp: 'ま行',
    chars: [
      ['ま', 'ma'],
      ['み', 'mi'],
      ['む', 'mu'],
      ['め', 'me'],
      ['も', 'mo'],
    ],
    sentences: [
      {
        sentence: '___ wo nomu',
        blank: 'mizu',
        options: ['mizu', 'machi', 'momo', 'meshi'],
        vocab: [
          ['水 [みず] (mizu)', 'water'],
          ['を (wo)', 'object particle'],
          ['飲む [のむ] (nomu)', 'to drink'],
          ['町 [まち] (machi)', 'town'],
          ['みずを のむ', 'Drink water'],
        ],
      },
    ],
  },
  {
    name: 'y',
    title: 'Y-row',
    titleJp: 'や行',
    chars: [
      ['や', 'ya'],
      ['ゆ', 'yu'],
      ['よ', 'yo'],
    ],
    sentences: [
      {
        sentence: '___ ga shiroi',
        blank: 'yuki',
        options: ['yuki', 'yama', 'yoru', 'yane'],
        vocab: [
          ['雪 [ゆき] (yuki)', 'snow'],
          ['白い [しろい] (shiroi)', 'white'],
          ['山 [やま] (yama)', 'mountain'],
          ['ゆきが しろい', 'Snow is white'],
        ],
      },
    ],
  },
  {
    name: 'r',
    title: 'R-row',
    titleJp: 'ら行',
    chars: [
      ['ら', 'ra'],
      ['り', 'ri'],
      ['る', 'ru'],
      ['れ', 're'],
      ['ろ', 'ro'],
    ],
    sentences: [
      {
        sentence: '___ ga kirei desu',
        blank: 'sakura',
        options: ['sakura', 'ringo', 'kuruma', 'roku'],
        vocab: [
          ['桜 [さくら] (sakura)', 'cherry blossom'],
          ['きれい (kirei)', 'beautiful'],
          ['林檎 [りんご] (ringo)', 'apple'],
          ['さくらが きれいです', 'Cherry blossoms are beautiful'],
        ],
      },
    ],
  },
  {
    name: 'w',
    title: 'W-row + N',
    titleJp: 'わ行',
    chars: [
      ['わ', 'wa'],
      ['を', 'wo', ['o']],
      ['ん', 'n'],
    ],
    sentences: [
      {
        sentence: 'watashi ___ nihon ga suki desu',
        blank: 'wa',
        options: ['wa', 'wo', 'ga', 'no'],
        vocab: [
          ['私 [わたし] (watashi)', 'I / me'],
          ['は (wa)', 'topic particle'],
          ['日本 [にほん] (nihon)', 'Japan'],
          ['好き [すき] (suki)', 'like'],
          ['わたしは にほんが すきです', 'I like Japan'],
        ],
      },
    ],
  },
];

// --- Katakana ---
// Each char tuple: [kana, romaji] or [kana, romaji, acceptAlternatives[]]
// Each sentence: { sentence, blank, options[4], japaneseSentence, vocab, listening, listenAndOrder }

export const KATAKANA_ROWS = [
  {
    name: 'vowels',
    title: 'Vowels',
    titleJp: 'ア行',
    chars: [
      ['ア', 'a'],
      ['イ', 'i'],
      ['ウ', 'u'],
      ['エ', 'e'],
      ['オ', 'o'],
    ],
    sentences: [
      {
        sentence: '___ ga oishii',
        blank: 'aisu',
        options: ['aisu', 'eki', 'ume', 'aoi'],
        japaneseSentence: 'アイスが おいしい',
        vocab: [
          ['アイス (aisu)', 'ice cream'],
          ['おいしい (oishii)', 'delicious'],
          ['アイスが おいしい', 'Ice cream is delicious'],
        ],
        listening: {
          speakText: 'アイス',
          prompt: 'What did you hear?',
          options: ['Ice cream', 'Station', 'Sea', 'Blue'],
          correctIndex: 0,
        },
        listenAndOrder: {
          speakText: 'アイスが おいしい',
          segments: ['アイスが', 'おいしい'],
          correctOrder: [0, 1],
        },
      },
    ],
  },
  {
    name: 'k',
    title: 'K-row',
    titleJp: 'カ行',
    chars: [
      ['カ', 'ka'],
      ['キ', 'ki'],
      ['ク', 'ku'],
      ['ケ', 'ke'],
      ['コ', 'ko'],
    ],
    sentences: [
      {
        sentence: '___ wo nomu',
        blank: 'koohii',
        options: ['koohii', 'keki', 'kure', 'kani'],
        japaneseSentence: 'コーヒーを のむ',
        vocab: [
          ['コーヒー (koohii)', 'coffee'],
          ['を (wo)', 'object particle'],
          ['飲む [のむ] (nomu)', 'to drink'],
          ['コーヒーを のむ', 'Drink coffee'],
        ],
        listening: {
          speakText: 'コーヒー',
          prompt: 'What did you hear?',
          options: ['Coffee', 'Cake', 'Cream', 'Curry'],
          correctIndex: 0,
        },
        listenAndOrder: {
          speakText: 'コーヒーを のむ',
          segments: ['コーヒーを', 'のむ'],
          correctOrder: [0, 1],
        },
      },
    ],
  },
  // Rows 2-9 will be added in a future session
];

export const KATAKANA_PLAN = [
  { type: 'row',        rows: [0]      },  // row-vowels
  { type: 'row',        rows: [1]      },  // row-k
  { type: 'cumulative', rows: [0, 1]   },  // cumulative-vowels-k
  // Remaining 15 entries will be added with rows 2-9
];

// Each plan entry drives one lesson file.
// row → teaches a single new row
// cumulative → mixes two previous rows (no reference chart)
// review → covers all rows so far (larger exercise sets)
// slug field on reviews overrides the auto-generated filename
export const HIRAGANA_PLAN = [
  { type: 'row',        rows: [0]                           }, // 1:  row-vowels
  { type: 'row',        rows: [1]                           }, // 2:  row-k
  { type: 'cumulative', rows: [0, 1]                        }, // 3:  cumulative-vowels-k
  { type: 'row',        rows: [2]                           }, // 4:  row-s
  { type: 'row',        rows: [3]                           }, // 5:  row-t
  { type: 'cumulative', rows: [2, 3]                        }, // 6:  cumulative-s-t
  { type: 'review',     rows: [0, 1, 2, 3],  slug: 'review-1'     }, // 7:  review-1
  { type: 'row',        rows: [4]                           }, // 8:  row-n
  { type: 'row',        rows: [5]                           }, // 9:  row-h
  { type: 'cumulative', rows: [4, 5]                        }, // 10: cumulative-n-h
  { type: 'row',        rows: [6]                           }, // 11: row-m
  { type: 'row',        rows: [7]                           }, // 12: row-y
  { type: 'cumulative', rows: [6, 7]                        }, // 13: cumulative-m-y
  { type: 'review',     rows: [4, 5, 6, 7], slug: 'review-2'     }, // 14: review-2
  { type: 'row',        rows: [8]                           }, // 15: row-r
  { type: 'row',        rows: [9]                           }, // 16: row-w
  { type: 'cumulative', rows: [8, 9]                        }, // 17: cumulative-r-w
  { type: 'review',     rows: [0,1,2,3,4,5,6,7,8,9], slug: 'review-final' }, // 18: review-final
];
