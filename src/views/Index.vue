<script setup>
import {
  GlobeEuropeAfricaIcon,
  CloudIcon,
  RocketLaunchIcon,
  BoltIcon,
  QuestionMarkCircleIcon,
  FunnelIcon,
} from "@heroicons/vue/24/solid";
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useStore } from "../store";
import router from "../router";
import axios from "axios";
import debounce from "lodash.debounce";
const store = useStore();
const debug = false;

const data = reactive({
  temperature: null,
  humidity: null,
});

const settings = reactive({
  rpm: null,
  door: null,
  water: null,
});

const userSettings = reactive({
  rpm: null,
  door: null,
  water: null,
});

const memorySettings = reactive({
  rpm: null,
  door: null,
});

const fanEnabled = ref(null);
const doorOpen = ref(null);

const userSettingsComputed = computed(() => Object.assign({}, userSettings));

const getDataValues = async () => {
  try {
    const res = await axios.get("https://api.simsva.se/wexteras/data", {
      params: { id: 1, limit: 1 },
    });
    data.temperature = res.data[0].temp;
    data.humidity = res.data[0].humidity;
  } catch (err) {
    console.error(err);
  }
};

const getSettingValues = async () => {
  try {
    const res = await axios.get("https://api.simsva.se/wexteras/settings", {
      params: { id: 1 },
    });
    console.log("request successful");
    const apiSettings = {
      rpm: res.data.rpm,
      door: res.data.door,
      water: res.data.water,
    };
    Object.assign(settings, apiSettings);
    Object.assign(userSettings, apiSettings);
    Object.assign(memorySettings, apiSettings);
    if (res.data.rpm === 0) {
      fanEnabled.value = false;
    } else {
      fanEnabled.value = true;
    }
    if (res.data.door === 0) {
      doorOpen.value = false;
    } else {
      doorOpen.value = true;
    }
  } catch (err) {
    console.error(err);
  }
};

const patchSettings = async (body, assign = true) => {
  try {
    const res = await axios.patch(
      "https://api.simsva.se/wexteras/settings",
      body,
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
        Object.assign(settings, body);
        if (Number(body.rpm) === 0) {
          fanEnabled.value = false;
        } else {
          fanEnabled.value = true;
        }
        if (Number(body.door) === 0) {
          doorOpen.value = false;
        } else {
          doorOpen.value = true;
        }
        if (assign) {
          Object.assign(memorySettings, body);
        }
        break;
      default:
        console.error("Unknown error, status: " + res.status);
    }
  } catch (err) {
    console.error(err);
  }
};

const patchWater = async () => {
  try {
    const res = await axios.patch(
      "https://api.simsva.se/wexteras/settings",
      { water: userSettings.water },
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
        break;
      default:
        console.error("Unknown error, status: " + res.status);
    }
  } catch (err) {
    console.error(err);
  }
};

watch(userSettingsComputed, (newValue, oldValue) => {
  debounceInput(newValue, oldValue);
});

watch(fanEnabled, (newValue, oldValue) => {
  if (newValue == null || oldValue == null) return;
  if (newValue) {
    if (memorySettings.rpm === 0) {
      patchSettings({ rpm: 1023 }, false);
      userSettings.rpm = 1023;
    } else {
      patchSettings({ rpm: memorySettings.rpm }, false);
    }
  } else {
    patchSettings({ rpm: 0 }, false);
  }
});

watch(doorOpen, (newValue, oldValue) => {
  if (newValue == null || oldValue == null) return;
  if (newValue) {
    if (memorySettings.door === 0) {
      patchSettings({ door: 180 }, false);
      userSettings.door = 180;
    } else {
      patchSettings({ door: memorySettings.door }, false);
    }
  } else {
    patchSettings({ door: 0 }, false);
  }
});

const debounceInput = debounce((newValue, oldValue) => {
  if (
    Object.values(newValue).includes(null) ||
    Object.values(oldValue).includes(null)
  )
    return;
  patchSettings(newValue);
}, 250);

const isPositiveInt = (str) => Number.isInteger(Number(str)) && Number(str) > 0;

onMounted(() => {
  getDataValues();
  getSettingValues();

  window.setInterval(() => {
    if (store.manualMode) {
      getDataValues();
    }
  }, 2 * 1000);

  window.setInterval(() => {
    if (store.manualMode) {
      getSettingValues();
    }
  }, 30 * 1000);
});
</script>

<template>
  <div class="flex justify-center">
    <div class="flex flex-col p-3 w-full md:max-w-5xl">
      <div class="flex flex-col">
        <div class="card w-full bg-base-200 shadow-xl mt-3">
          <div class="card-body">
            <h2 class="card-title">M??tv??rden</h2>
            <div class="block stats shadow md:flex">
              <div
                @click="router.push('/measurements')"
                class="stat cursor-pointer hover:bg-base-300"
              >
                <div class="stat-figure text-primary">
                  <GlobeEuropeAfricaIcon class="inline-block w-8 h-8 stroke-current"></GlobeEuropeAfricaIcon>
                </div>
                <div class="stat-title">Temperatur</div>
                <div class="stat-value">{{data.temperature || '-'}}??C</div>
                <div class="stat-desc">Klicka f??r mer information</div>
              </div>
              <div
                @click="router.push('/measurements')"
                class="stat mt-3 md:mt-0 cursor-pointer hover:bg-base-300"
              >
                <div class="stat-figure text-primary">
                  <CloudIcon class="inline-block w-8 h-8 stroke-current"></CloudIcon>
                </div>
                <div class="stat-title">Luftfuktighet</div>
                <div class="stat-value">{{data.humidity || '-'}}%</div>
                <div class="stat-desc">Klicka f??r mer information</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card w-full bg-base-200 shadow-xl mt-3" v-if="userSettings.rpm !== null">
          <div class="card-body">
            <div class="card-title flex justify-between">
              <h2>Fl??kt</h2>
              <input
                v-model="fanEnabled"
                type="checkbox"
                class="ml-4 toggle"
                :disabled="!store.manualMode"
              />
            </div>
            <div class="block stats shadow md:flex">
              <div @click="router.push('/measurements')" class="stat">
                <div class="stat-figure text-primary">
                  <RocketLaunchIcon class="inline-block w-8 h-8 stroke-current"></RocketLaunchIcon>
                </div>
                <div class="stat-title">Hastighet</div>
                <div class="stat-value">{{Math.floor(settings.rpm * 1.369)}} RPM</div>
                <div class="stat-desc">Faktiskt v??rde p?? frekvensen</div>
              </div>
              <div @click="router.push('/measurements')" class="stat mt-3 md:mt-0">
                <div class="stat-figure text-primary">
                  <BoltIcon class="inline-block w-8 h-8 stroke-current"></BoltIcon>
                </div>
                <div class="stat-title">Status</div>
                <div class="stat-value">{{fanEnabled ? 'P??' : 'AV'}}</div>
                <div
                  class="stat-desc"
                >{{fanEnabled ? 'St??ng av' : 'S??tt p??'}} fl??kten med switchen ovan</div>
              </div>
            </div>
            <p v-if="!store.manualMode" class="text-primary">
              <QuestionMarkCircleIcon class="inline-block w-5 h-5 stroke-current"></QuestionMarkCircleIcon>V??xla till manuellt l??ge f??r att styra fl??kten
            </p>
            <div v-if="store.manualMode && fanEnabled" class="flex">
              <span class="font-bold mr-4 whitespace-nowrap">Styr fl??kten</span>
              <input type="range" v-model="userSettings.rpm" min="0" max="1023" class="range" />
            </div>
          </div>
        </div>
        <div class="card w-full bg-base-200 shadow-xl mt-3" v-if="userSettings.door !== null">
          <div class="card-body">
            <div class="card-title flex justify-between">
              <h2>Lucka</h2>
              <input
                v-model="doorOpen"
                type="checkbox"
                class="ml-4 toggle"
                :disabled="!store.manualMode"
              />
            </div>
            <div class="block stats shadow sm:flex">
              <div class="stat">
                <div class="stat-figure text-primary">
                  <FunnelIcon class="inline-block w-8 h-8 stroke-current"></FunnelIcon>
                </div>
                <div class="stat-title">Luftfl??de</div>
                <div class="stat-value">{{Math.floor(settings.door / 1.8)}}%</div>
                <div class="stat-desc">Faktiskt v??rde p?? hur ??ppen luckan ??r</div>
              </div>
              <div class="stat mt-3 sm:mt-0">
                <div class="stat-figure text-primary">
                  <BoltIcon class="inline-block w-8 h-8 stroke-current"></BoltIcon>
                </div>
                <div class="stat-title">Status</div>
                <div class="stat-value">{{doorOpen ? '??PPEN' : 'ST??NGD'}}</div>
                <div class="stat-desc">{{fanEnabled ? 'St??ng' : '??ppna'}} luckan med switchen ovan</div>
              </div>
            </div>

            <p v-if="!store.manualMode" class="text-primary">
              <QuestionMarkCircleIcon class="inline-block w-5 h-5 stroke-current"></QuestionMarkCircleIcon>V??xla till manuellt l??ge f??r att styra luckan
            </p>
            <div v-if="store.manualMode && doorOpen" class="flex">
              <span class="font-bold mr-4 whitespace-nowrap">Styr luckan</span>
              <input type="range" v-model="userSettings.door" min="0" max="180" class="range" />
            </div>
          </div>
        </div>
        <div class="card w-full bg-base-200 shadow-xl mt-3">
          <div class="card-body">
            <h2 class="card-title">Bevattning</h2>
            <p>Nuvarande bevattningsintervall: {{settings.water}}</p>
            <h4 class="font-bold text-lg">??ndra bevattningsintervall</h4>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Bevattningsintervall i sekunder</span>
              </label>
              <label class="input-group">
                <input
                  v-model="userSettings.water"
                  type="text"
                  class="input input-bordered"
                  :class="isPositiveInt(userSettings.water) ? '' : 'input-error'"
                />
                <button
                  @click="patchWater"
                  class="btn"
                  :class="isPositiveInt(userSettings.water) ? '' : 'btn-disabled'"
                >Submit</button>
              </label>
            </div>
          </div>
        </div>
        <div v-if="debug" class="card w-full bg-base-200 shadow-xl mt-3">
          <div class="card-body">
            <h2 class="card-title">Debug</h2>
            <h4 class="text-xl font-bold">settings</h4>
            <p>RPM: {{settings.rpm}}</p>
            <p>door: {{settings.door}}</p>
            <p>water: {{settings.water}}</p>
            <h4 class="text-xl font-bold">userSettings</h4>
            <p>RPM: {{userSettings.rpm}}</p>
            <p>door: {{userSettings.door}}</p>
            <p>water: {{userSettings.water}}</p>
            <h4 class="text-xl font-bold">memorySettings</h4>
            <p>RPM: {{memorySettings.rpm}}</p>
            <p>door: {{memorySettings.door}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
