import Nullstack from 'nullstack'

import React from 'react'
import ReactDomClient from 'react-dom/client'

class ReactClientWrapper extends Nullstack {

  rootRef = null
  reactRoot = null
  innerHtml = null
  serverRendered = false

  async initiate(context) {
    const { environment, component, attributes } = context

    if (environment.server) {
      this.serverRendered = true
    } else {
      this.reactRoot = ReactDomClient.createRoot(this.rootRef)
      this.reactRoot.render(React.createElement(component, attributes))
    }
  }

  update({ component, attributes }) {
    if (this.reactRoot) {
      this.reactRoot.render(React.createElement(component, attributes))
    } else {
      this.reactRoot = ReactDomClient.hydrateRoot(this.rootRef, React.createElement(component, attributes))
    }
  }

  terminate() {
    if (this.reactRoot) {
      this.reactRoot.unmount()
      this.reactRoot = null
    }
  }

  render(context) {
    return <div ref={this.rootRef} class={context.attributes['data-wrapper-class']} />
  }

}

export default ReactClientWrapper
