import React from 'react'

import { createPlugin } from './src/createPlugin'
import ReactServerWrapper from './src/ReactServerWrapper'

const transform = createPlugin({
  renderWrapper(component, attributes) {
    return <ReactServerWrapper component={component} attributes={attributes} />
  },
})

export default { transform, client: false, server: true }
