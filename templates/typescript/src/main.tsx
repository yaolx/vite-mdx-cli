import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'

import { Provider } from 'mobx-react'

import Router from '@/routes'
import { genMdxRouters } from '@/service/mdx-service'
import globalStore from '@/store/global'
import './asset/styles/index.less'
const stores = {
  globalStore
}
genMdxRouters()
ReactDOM.render(
  <React.StrictMode>
    <Provider stores={stores}>
      <HashRouter>
        <Router />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
