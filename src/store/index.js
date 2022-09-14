import {defineStore} from "pinia"

export const useStore = defineStore("store", {
  state: () => {
    return { manualMode: false}
  },
  actions: {
    toggleManualMode() {
      this.manualMode = !this.manualMode
    }
  }
})
