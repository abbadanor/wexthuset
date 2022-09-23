import {defineStore} from "pinia"

export const useStore = defineStore("store", {
  state: () => {
    return {
      manualMode: null
    }
  },
  actions: {
    toggleManualMode() {
      this.manualMode = !this.manualMode
    }
  }
})
