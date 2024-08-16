import type { Plugin } from 'vite'

const ID = '/virtual-changelog'

export function ChangeLog(data: any[]): Plugin {
  return {
    name: 'reactjs-tiptap-editor-changelog',
    resolveId(id) {
      return id === ID ? ID : null
    },
    load(id) {
      if (id !== ID)
        return null
      return `export default ${JSON.stringify(data)}`
    },
  }
}
