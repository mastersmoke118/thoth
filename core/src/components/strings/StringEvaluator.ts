/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { InputControl } from '../../dataControls/InputControl'
import { EngineContext } from '../../engine'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const fewshot = ``

const info =
  'String Evaluator - options: includes, not includes, equals, not equals, starts with, not starts with, ends with, not ends with'

export class StringEvaluator extends ThothComponent<Promise<void>> {
  constructor() {
    super('String Evaluator')

    this.task = {
      outputs: { true: 'option', false: 'option', output: 'output' },
    }

    this.category = 'Strings'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    node.data.fewshot = fewshot

    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    const operationType = new InputControl({
      dataKey: 'operationType',
      name: 'Operation Type',
      icon: 'moon',
    })

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl).add(operationType)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const action = inputs['string'][0] as string
    const fewshot = (node.data.fewshot as string).trim()
    const operationTypeData = node?.data?.operationType as string
    const operationType =
      operationTypeData !== undefined && operationTypeData.length > 0
        ? operationTypeData.toLowerCase().trim()
        : 'includes'
    let is: boolean = false

    if (operationType === 'includes') {
      is = action.includes(fewshot)
    } else if (operationType === 'not includes') {
      is = !action.includes(fewshot)
    } else if (operationType === 'equals') {
      is = action === fewshot
    } else if (operationType === 'not equals') {
      is = action !== fewshot
    } else if (operationType === 'startsWith') {
      is = action.startsWith(fewshot)
    } else if (operationType === 'not startsWith') {
      is = !action.startsWith(fewshot)
    } else if (operationType === 'endsWith') {
      is = action.endsWith(fewshot)
    } else if (operationType === 'not endsWith') {
      is = !action.endsWith(fewshot)
    }

    this._task.closed = is ? ['false'] : ['true']
  }
}
