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

async function translateText(text) {
  const response = await fetch(`http://fc-mp-c7689e52-ece3-48ec-b94f-86f95c332d50.next.bspapp.com/translate?text=${encodeURIComponent(text)}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const resp = await response.json();
  return resp.data.result.trans_result[0].dst;
}

export async function translateHTML(elements) {

  const textNodes = [];
  elements.forEach(element => {
    element.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
        textNodes.push(node);
      }
    });
  });

  const maxConcurrency = 5; // 最大并发量
  const pool = new PromisePool(maxConcurrency);

  const translateTasks = textNodes.map(node =>
    pool.enqueue(() => translateText(node.nodeValue).then(translatedText => {
      node.nodeValue = translatedText;
    }))
  );

  await Promise.all(translateTasks);
}
