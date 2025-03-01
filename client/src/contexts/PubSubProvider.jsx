/* eslint-disable @typescript-eslint/no-unused-vars */
import PubSub from 'pubsub-js'
import { useContext, createContext } from 'react'

const Context = createContext({
  publish: (_event, _data) => { },
  subscribe: (_event, _callback) => { },
  PubSub: () => { },
  events: {},
})

export const usePubSub = () => useContext(Context)

export { PubSub }

// Might want to namespace these
export const events = {
  ADD_SUBSPELL: 'addSubspell',
  UPDATE_SUBSPELL: 'updateSubspell',
  DELETE_SUBSPELL: 'deleteSubspell',
  $SUBSPELL_UPDATED: spellId => `subspellUpdated:${spellId}`,
  $PLAYTEST_INPUT: tabId => `playtestInput:${tabId}`,
  $PLAYTEST_PRINT: tabId => `playtestPrint:${tabId}`,
  $DEBUG_PRINT: tabId => `debugPrint:${tabId}`,
  $DEBUG_INPUT: tabId => `debugInput:${tabId}`,
  $INSPECTOR_SET: tabId => `inspectorSet:${tabId}`,
  $TEXT_EDITOR_SET: tabId => `textEditorSet:${tabId}`,
  $TEXT_EDITOR_CLEAR: tabId => `textEditorClear:${tabId}`,
  $CLOSE_EDITOR: tabId => `closeEditor:${tabId}`,
  $NODE_SET: (tabId, nodeId) => `nodeSet:${tabId}:${nodeId}`,
  $SAVE_SPELL: tabId => `saveSpell:${tabId}`,
  $CREATE_STATE_MANAGER: tabId => `createStateManage:${tabId}`,
  $CREATE_PLAYTEST: tabId => `createPlaytest:${tabId}`,
  $CREATE_INSPECTOR: tabId => `createInspector:${tabId}`,
  $CREATE_TEXT_EDITOR: tabId => `createTextEditor:${tabId}`,
  $CREATE_ENT_MANAGER: tabId => `createEntManager:${tabId}`,
  $CREATE_SEARCH_CORPUS: tabId => `createSearchCorpus:${tabId}`,
  $CREATE_DEBUG_CONSOLE: tabId => `createDebugConsole:${tabId}`,
  $SERIALIZE: tabId => `serialize:${tabId}`,
  $PROCESS: tabId => `process:${tabId}`,
  $EXPORT: tabId => `export:${tabId}`,
  $UNDO: tabId => `undo:${tabId}`,
  $REDO: tabId => `redo:${tabId}`,
  $DELETE: tabId => `delete:${tabId}`,
}

const PubSubProvider = ({ children }) => {
  const publish = (event, data) => {
    return PubSub.publish(event, data)
  }

  const subscribe = (event, callback) => {
    const token = PubSub.subscribe(event, callback)

    return () => {
      PubSub.unsubscribe(token)
    }
  }

  const publicInterface = {
    publish,
    subscribe,
    events,
    PubSub,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default PubSubProvider
