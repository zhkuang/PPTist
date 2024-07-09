import workerUrl from 'modern-screenshot/worker?url'
import { createContext, destroyContext, domToPng } from 'modern-screenshot'

async function screenshotsPerSecond() {
  const context = await createContext(document.querySelector('#app'), {
    workerUrl,
    workerNumber: 1,
  })
  for (let i = 0; i < 10; i++) {
    domToPng(context).then(dataUrl => {
      const link = document.createElement('a')
      link.download = `screenshot-${ i + 1 }.png`
      link.href = dataUrl
      link.click()
      if (i + 1 === 10) {
        destroyContext(context)
      }
    })
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

screenshotsPerSecond()
