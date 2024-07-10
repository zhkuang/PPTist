import { defineStore } from 'pinia'

export interface LanguageKey {
  zh: object,
  yue: object,
  en: object,
  jp: object,
  kor: object,
  fra: object,
  de: object,
  es: object,
  it: object,
  pt: object,
  ru: object,
  ara: object,
}

export const LanguageInfos = [
  // {
  //   'lang': 'zh',
  //   'name': 'Chinese',
  //   'label': '中文'
  // },
  // {
  //   'lang': 'yue',
  //   'name': 'Cantonese',
  //   'label': '粤语'
  // },
  {
    'lang': 'en',
    'name': 'English',
    'label': '英语'
  },
  // {
  //   'lang': 'jp',
  //   'name': 'Japanese',
  //   'label': '日语'
  // },
  // {
  //   'lang': 'kor',
  //   'name': 'Korean',
  //   'label': '韩语'
  // },
  // {
  //   'lang': 'fra',
  //   'name': 'French',
  //   'label': '法语'
  // },
  // {
  //   'lang': 'de',
  //   'name': 'German',
  //   'label': '德语'
  // },
  // {
  //   'lang': 'es',
  //   'name': 'Spanish',
  //   'label': '西班牙语'
  // },
  // {
  //   'lang': 'it',
  //   'name': 'Italian',
  //   'label': '意大利语'
  // },
  // {
  //   'lang': 'pt',
  //   'name': 'Portuguese',
  //   'label': '葡萄牙语'
  // },
  // {
  //   'lang': 'ru',
  //   'name': 'Russian',
  //   'label': '俄语'
  // },
  // {
  //   'lang': 'ara',
  //   'name': 'Arabic',
  //   'label': '阿拉伯语'
  // }
]

export const useDictionaryStore = defineStore('dictionary', {
  state: (): LanguageKey => ({
    zh: {},
    yue: {},
    en: {},
    jp: {},
    kor: {},
    fra: {},
    de: {},
    es: {},
    it: {},
    pt: {},
    ru: {},
    ara: {},
  }),

  getters: {
    state(state) {
      return state
    }
  },

  actions: {
    setDict(lang: string, key: string, value: string) {
      if (!this[lang]) {
        return console.error(`Language ${lang} not found`)
      }
      this[lang][key] = value
    },
    resetDict(dict) {
      Object.keys(dict).forEach(lang => {
        this[lang] = dict[lang]
      })
    }
  },

  persist: true,
})
