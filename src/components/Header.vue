<script setup>
import { useStore } from "../store";
import { QuestionMarkCircleIcon, ChevronDownIcon } from "@heroicons/vue/24/solid";
import { ref, onMounted, watch } from "vue";
import ThemeButton from "../components/ThemeButton.vue"
import axios from "axios";
import debounce from "lodash.debounce";
const store = useStore();
const userManualMode = ref(null);

const getManualMode = async () => {
  try {
    const res = await axios.get("https://api.simsva.se/wexteras/settings", {
      params: { id: 1, limit: 1, fields: "master" },
    });
    store.manualMode = res.data.master;
    userManualMode.value = res.data.master;
  } catch (err) {
    console.error(err);
  }
};

const patchManualMode = async (value) => {
  store.manualMode = null;
  try {
    const res = await axios.patch(
      "https://api.simsva.se/wexteras/settings",
      { master: value },
      { params: { id: 1 } }
    );
    switch (res.status) {
      case 400:
        console.error("Bad request");
        break;
      case 404:
        console.error("Non-existant parameter");
        break;
      case 200:
        console.log("Successful request");
        store.manualMode = value;
        break;
      default:
        console.error("Unknown error, status: " + res.status);
    }
  } catch (err) {
    console.error(err);
  }
};

watch(userManualMode, (newValue, oldValue) => {
  debounceInput(newValue, oldValue);
});

const debounceInput = debounce((newValue, oldValue) => {
  if (newValue === null || oldValue === null) return;
  patchManualMode(newValue);
}, 250);

onMounted(() => {
  getManualMode();
});
</script>

<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn gap-2 btn-ghost">
          Tema
          <ChevronDownIcon class="inline-block w-6 h-6 stroke-current"></ChevronDownIcon>
        </label>
        <div tabindex="0" class="dropdown-content menu shadow min-w-max">
          <ThemeButton theme="dark" position="first"></ThemeButton>
          <ThemeButton theme="light"></ThemeButton>
          <ThemeButton theme="corporate"></ThemeButton>
          <ThemeButton theme="retro"></ThemeButton>
          <ThemeButton theme="valentine"></ThemeButton>
          <ThemeButton theme="lofi"></ThemeButton>
          <ThemeButton theme="black"></ThemeButton>
          <ThemeButton theme="dracula"></ThemeButton>
          <ThemeButton theme="night" position="last"></ThemeButton>
        </div>
      </div>
    </div>
    <div class="navbar-center">
      <router-link to="/" class="btn btn-ghost normal-case text-xl hidden sm:flex">Wexthüset</router-link>
    </div>
    <div class="navbar-end">
      <div class="form-control">
        <label class="label">
          <div
            class="leading-3 tooltip tooltip-bottom hidden sm:block"
            data-tip="Manuellt läge låter dig styra växthuset"
          >
            <QuestionMarkCircleIcon class="inline-block w-5 h-5 stroke-current mr-2 cursor-pointer"></QuestionMarkCircleIcon>
          </div>
          <span
            v-if="store.manualMode !== null"
            class="label-text whitespace-nowrap"
          >{{store.manualMode ? "Manuellt läge" : "Automatiskt läge"}}</span>
          <input
            :indeterminate="userManualMode === null"
            v-model="userManualMode"
            type="checkbox"
            class="ml-4 toggle"
          />
        </label>
      </div>
    </div>
  </div>
</template>
