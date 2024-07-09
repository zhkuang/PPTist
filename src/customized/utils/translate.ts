// 简历多语言的持久化缓存，以HTML中的文本为索引，将翻译结果存储在localStorage中
const languages = [{
  lang: 'en',
  name: 'English',
  label: '英语'
}, {
  lang: 'jp',
  name: 'Japanese',
  label: '日语'
}, {
  lang: 'kor',
  name: 'Korean',
  label: '韩语'
}, {
  lang: 'fra',
  name: 'French',
  label: '法语'
}];

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
  const response = await fetch(`http://fc-mp-c7689e52-ece3-48ec-b94f-86f95c332d50.next.bspapp.com/translate?to=${lang}&text=${encodeURIComponent(text)}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const resp = await response.json();
  return resp.data.result.trans_result[0].dst;
}

export async function translates(texts, lang) {
  const pool = new PromisePool(5);
  const results = await Promise.all(texts.map(text => pool.enqueue(() => translateText(text, lang))));
  return results;
}
