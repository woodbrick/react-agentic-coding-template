import { renderToString } from 'react-dom/server'

/**
 * 简易SSR实现 - 仅用于演示目的
 * 在实际生产环境中，建议使用成熟的SSR框架如Next.js
 */

export function simpleSSR(component: React.ReactElement): string {
  return renderToString(component)
}

export function generateHTML(content: string, title: string = 'React Agentic Coding Template'): string {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
        #root { min-height: 100vh; }
    </style>
</head>
<body>
    <div id="root">${content}</div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`
}