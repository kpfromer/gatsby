import normalize from "normalize-path"
import {
  IGatsbyState,
  IDeleteCacheAction,
  ICreatePageAction,
  IDeletePageAction,
} from "../types"

export const pagesReducer = (
  state: IGatsbyState["pages"] = new Map(),
  action: IDeleteCacheAction | ICreatePageAction | IDeletePageAction
): IGatsbyState["pages"] => {
  switch (action.type) {
    case `DELETE_CACHE`:
      return new Map()
    case `CREATE_PAGE`: {
      action.payload.component = normalize(action.payload.component)
      if (!action.plugin || !action.plugin.name) {
        console.log(``)
        console.error(JSON.stringify(action, null, 4))
        console.log(``)
        throw new Error(
          `Pages can only be created by plugins. There wasn't a plugin set
        when creating this page.`
        )
      }
      // Link page to its plugin.
      action.payload.pluginCreator__NODE = action.plugin.id
      action.payload.pluginCreatorId = action.plugin.id

      state.set(action.payload.path, action.payload)
      return state
    }
    case `DELETE_PAGE`: {
      state.delete(action.payload.path)
      return state
    }
    default:
      return state
  }
}
