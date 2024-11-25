import Nullstack from 'nullstack'

import React from 'react'
import ReactDomServer from 'react-dom/server'
import { Writable } from 'stream'

class ReactServerWrapper extends Nullstack {

  rootRef = null
  reactRoot = null
  innerHtml = null

  async initiate(context) {
    const { environment, component, attributes } = context

    if (environment.server) {
      this.innerHtml = await renderToPipeableStreamAsync(React.createElement(component, attributes))
    }
  }

  render(context) {
    return <div ref={this.rootRef} html={this.innerHtml} class={context.attributes['data-wrapper-class']} />
  }

}

async function renderToPipeableStreamAsync(vnode) {
  let html = ''
  return new Promise((resolve, reject) => {
    let error
    const stream = ReactDomServer.renderToPipeableStream(vnode, {
      onError(err) {
        error = err
        reject(error)
      },
      onAllReady() {
        stream.pipe(
          new Writable({
            write(chunk, _encoding, callback) {
              html += chunk.toString('utf-8')
              callback()
            },
            destroy() {
              resolve(html)
            },
          }),
        )
      },
    })
  })
}

export default ReactServerWrapper
