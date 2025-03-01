import Rete from 'rete'

import {
  ThothNode,
  NodeData,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { EngineContext } from '../../engine'
import { triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = `The State Write component allows you to define any number of inputs, and to write values to the state manager which correspond to the names of those inputs.  If the value does not exist in the state, it will be written.

Note here that there are a few assumptions made, which will be changed once we have selectable socket types when generating inputs. If the key already exists in the state and it is an array, whatever value you insert will be added to the array. If the existing value is an object, the object will be updated by the incoming value.`

export class StateWrite extends ThothComponent<void> {
  constructor() {
    // Name of the component
    super('State Write')

    this.task = {
      outputs: {},
    }

    this.workspaceType = 'spell'
    this.category = 'State'
    this.info = info
  }

  builder(node: ThothNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      ignored: ['trigger'],
      name: 'Input Sockets',
    })

    node.inspector.add(inputGenerator)
    node.addInput(dataInput)

    return node
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { thoth }: { thoth: EngineContext }
  ) {
    const { getCurrentGameState, updateCurrentGameState } = thoth

    try {
      const gameState = (await getCurrentGameState()) as Record<string, any>
      let value

      const updates = Object.entries(inputs).reduce((acc, [key, val]) => {
        // Check here what type of data structure the gameState for the key is
        switch (typeof gameState[key]) {
          case 'object':
            // if we have an array, add the value to the array and reassign to the state
            if (Array.isArray(gameState[key])) {
              value = [...gameState[key], val[0]]
              break
            }

            // if it is an object, we assume that the incoming data is an object update
            value = { ...gameState[key], ...(val[0] as unknown[]) }

            break
          default:
            // default is to just overwrite whatever value is there with a new one.
            value = val[0]
        }

        acc[key] = value

        return acc
      }, {} as Record<string, any>)

      await updateCurrentGameState(updates)
    } catch (err) {
      throw new Error('Error in State Write component')
    }
  }
}
