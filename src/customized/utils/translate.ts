import axios from 'axios';
import { useDictionaryStore } from '@/customized/store/dictionary';
import { LanguageInfos } from '@/customized/store/dictionary';

class PromisePool {
  private maxConcurrency: any;
  private currentConcurrency: number;
  private queue: any[];

  constructor(maxConcurrency) {
    this.maxConcurrency = maxConcurrency;
    this.currentConcurrency = 0;
    this.queue = [];
  }

  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({task, resolve, reject});
      this.dequeue();
    });
  }

  dequeue() {
    if (this.queue.length === 0 || this.currentConcurrency >= this.maxConcurrency) {
      return;
    }

    const {task, resolve, reject} = this.queue.shift();
    this.currentConcurrency++;
    task()
      .then(resolve, reject)
      .finally(() => {
        this.currentConcurrency--;
        this.dequeue();
      });
  }
}

async function translateText(text, lang) {
  if (!text || !lang) {
    return '';
  }
  const dictionaryStore = useDictionaryStore();
  const langDict = dictionaryStore.state[lang];
  if (langDict && langDict[text]) {
    return langDict[text];
  }

  try {
    const response = await axios.get(`http://fc-mp-c7689e52-ece3-48ec-b94f-86f95c332d50.next.bspapp.com/translate`, {
      params: {
        to: lang,
        text: encodeURIComponent(text)
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const rsl = response.data.data.result.trans_result[0]?.dst;
    if (rsl) {
      dictionaryStore.setDict(lang, text, rsl);
    } else {
      console.error(`Failed to translate text: ${text}`);
    }
    return rsl;
  } catch (error) {
    console.error(error);
    return '';
  }
}

async function translateWithAi(text) {
  const url = 'http://localhost:3000/proxy';
  const apiKey = 'sk-6e067eafbf724d0eaeea7747b31da960'; // 请替换为你的实际 API 密钥
  const headers = {
    'Content-Type': 'application/json'
  };
  const data = {
    apiKey,
    prompt: text
  };

  try {
    const response = await axios.post(url, data, { headers, timeout: 60000 });
    return response.data?.output?.text || '';
  } catch (error) {
    throw error;
  }
}

const pool = new PromisePool(5);

export async function translates(texts, lang) {
  const results = await Promise.all(texts.map(text => pool.enqueue(() => translateText(text, lang))));
  return results;
}

const poolForAi = new PromisePool(1);

export async function translatesWithAi(texts, lang) {
  const langInfo = LanguageInfos.find(info => info.lang === lang);
  const prompts = texts.map(text => {
    return `翻译为${langInfo.label}，内容如下：${text}`;
  });
  return await Promise.all(prompts.map(text => poolForAi.enqueue(() => translateWithAi(text))));
}
