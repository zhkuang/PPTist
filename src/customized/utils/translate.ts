import { useDictionaryStore } from '@/customized/store/dictionary'

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

  const response = await fetch(`http://fc-mp-c7689e52-ece3-48ec-b94f-86f95c332d50.next.bspapp.com/translate?to=${lang}&text=${encodeURIComponent(text)}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const resp = await response.json();
  const rsl = resp.data.result.trans_result[0]?.dst;
  if (rsl) {
    dictionaryStore.setDict(lang, text, rsl);
  } else {
    console.error(`Failed to translate text: ${text}`);
  }
  return rsl;
}

export async function translates(texts, lang) {
  const pool = new PromisePool(5);
  const results = await Promise.all(texts.map(text => pool.enqueue(() => translateText(text, lang))));
  return results;
}
