import { usePubSub } from '@/contexts/PubSubProvider'
import { useGetSpellQuery, useSaveSpellMutation } from '@/state/api/spells'
import { InspectorData } from '@latitudegames/thoth-core/types'
import { createContext, useContext, useEffect, useState } from 'react'

export type TextEditorData = {
  options?: Record<string, any> | undefined
  data?: string
  control?: Record<string, any> | undefined
  name?: string
}

type InspectorContext = {
  inspectorData: InspectorData | null
  textEditorData: TextEditorData | null
  saveTextEditor: Function
  saveInspector: Function
}

const Context = createContext<InspectorContext>(undefined!)

export const useInspector = () => useContext(Context)

const InspectorProvider = ({ children, tab }) => {
  const { subscribe, publish, events } = usePubSub()

  const [saveSpell] = useSaveSpellMutation()
  const { data: spell } = useGetSpellQuery(tab.spellId, {
    skip: !tab.spellId,
  })

  const [inspectorData, setInspectorData] = useState<InspectorData | null>(null)

  const [textEditorData, setTextEditorData] = useState({})

  const SET_INSPECTOR = events.$INSPECTOR_SET(tab.id)

  // inspector subscription
  useEffect(() => {
    return subscribe(SET_INSPECTOR, (_, data: InspectorData) => {
      // If the incoming data and existing data are at odds, clear inspector data
      if (data?.nodeId !== inspectorData?.nodeId) setInspectorData(null)

      // Set the inspector
      setInspectorData(data)

      if (!data.dataControls) return

      // Handle components in a special way here.  Could probaby abstract this better

      Object.entries(data.dataControls).forEach(([, control]) => {
        if (control?.options?.editor) {
          // we relay data to the text editor component for display here as well.
          const textData = {
            data: data.data[control.dataKey],
            nodeId: data.nodeId,
            name: data.name,
            control: control,
            options: control.options,
          }

          setTextEditorData(textData)
        }
      })
    })
  }, [events, subscribe, publish])

  // text editor subscription
  useEffect(() => {
    return subscribe(events.$TEXT_EDITOR_SET(tab.id), (event, data) => {
      setTextEditorData(data)
    })
  }, [events, subscribe, publish])

  // clear text editor subscription
  useEffect(() => {
    return subscribe(events.$TEXT_EDITOR_CLEAR(tab.id), () => {
      setTextEditorData({})
    })
  }, [events, subscribe, publish])

  //
  const saveTextEditor = textData => {
    const textUpdate = {
      [textData.control.dataKey]: textData.data,
    }

    if (!inspectorData) return

    const update = {
      ...inspectorData,
      data: {
        ...inspectorData.data,
        ...textUpdate,
      },
    }

    publish(events.$NODE_SET(tab.id, textData.nodeId), update)
    if (inspectorData) {
      setInspectorData(update)
    }
    spell && saveSpell(spell)
  }

  const saveInspector = inspectorData => {
    setInspectorData(inspectorData)
    publish(events.$NODE_SET(tab.id, inspectorData.nodeId), inspectorData)
    spell && saveSpell(spell)
  }

  const publicInterface: InspectorContext = {
    inspectorData,
    textEditorData,
    saveTextEditor,
    saveInspector,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default InspectorProvider
