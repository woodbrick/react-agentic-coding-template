import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from '../App'

/**
 * SSR服务端入口
 * @param url 请求URL
 */
export function render(url: string) {
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
  
  return { html }
}