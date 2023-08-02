import React from 'react'

import { createPlugin } from './src/createPlugin'
import ReactClientWrapper from './src/ReactClientWrapper'

const transform = createPlugin({
  renderWrapper(component, attributes) {
    return <ReactClientWrapper component={component} attributes={attributes} />
  },
})

export default { transform, client: true, server: false }
