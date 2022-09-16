import {defineStore} from "pinia"

export const useStore = defineStore("store", {
  state: () => {
    return {
      manualMode: false,
      cronString: "0 * * * * *"
    }
  },
  getters: {
    getCronString: (state) => state.cronString
  }
  // actions: {
  //   toggleManualMode() {
  //     this.manualMode = !this.manualMode
  //   }
  // }
})
