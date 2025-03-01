import { IRunContextEditor } from '../../../types'
import { ThothComponent } from '../../thoth-component'
import { ThothConsole } from './ThothConsole'

function install(
  editor: IRunContextEditor,
  { server = false, throwError }: { server?: boolean; throwError?: Function }
) {
  // const _log = console.log

  // console.log = function (message) {
  //   // if (editor.thoth.sendToDebug) editor.thoth.sendToDebug(message)
  //   console.warn('testing')
  //   return Function.prototype.bind.call(_log, arguments)
  // }

  editor.on('componentregister', (component: ThothComponent<unknown>) => {
    const worker = component.worker

    component.worker = (node: any, inputs, outputs, data, ...args) => {
      const arg = {
        node,
        component,
        editor,
        server,
        throwError,
      }
      node.console = new ThothConsole(arg)

      try {
        const result = worker.apply(component, [
          node,
          inputs,
          outputs,
          data,
          ...args,
        ])

        node.console.log(result)

        return result
      } catch (error: any) {
        node.console.error(error)
        throw error
      }
    }
  })
}

const defaultExport = {
  name: 'debuggerPlugin',
  install,
}

export default defaultExport
