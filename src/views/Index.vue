<script setup>
import {
  GlobeEuropeAfricaIcon,
  CloudIcon,
  RocketLaunchIcon,
  BoltIcon,
  QuestionMarkCircleIcon,
  FunnelIcon,
  ClockIcon,
} from "@heroicons/vue/24/solid";
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useStore } from "../store";
import axios from "axios";
import debounce from "lodash.debounce";
const store = useStore();

const data = reactive({
  temperature: null,
  humidity: null,
});

const settings = reactive({
  rpm: null,
  door: null,
});

const userSettings = reactive({
  rpm: null,
  door: null,
});

const fanEnabled = ref(null);
const doorOpen = ref(null);

const userSettingsComputed = computed(() => Object.assign({}, userSettings));

const getDataValues = async () => {
  try {
    const resp = await axios.get("https://api.simsva.se/wexteras/data", {
      params: { id: 1, limit: 1 },
    });
    data.temperature = resp.data[0].temp;
    data.humidity = resp.data[0].humidity;
  } catch (err) {
    console.error(err);
  }
};

const getSettingValues = async () => {
  try {
    const res = await axios.get("https://api.simsva.se/wexteras/settings", {
      params: { id: 1 },
    });
    const apiSettings = { rpm: res.data.rpm, door: res.data.door };
    Object.assign(userSettings, apiSettings);
    Object.assign(settings, apiSettings);
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
const patchSettings = async (body) => {
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

watch(fanEnabled, (value) => {
  if(value) {
    patchSettings({rpm: settings.rpm})
  } else {
    patchSettings({rpm: 0})
  }
})

const debounceInput = debounce((newValue, oldValue) => {
  if (
    Object.values(newValue).includes(null) ||
    Object.values(oldValue).includes(null)
  )
    return;
  patchSettings(newValue);
}, 250);

onMounted(() => {
  getDataValues();
  getSettingValues();
});
</script>

<template>
  <div class="flex justify-center">
    <div class="flex flex-col p-3 w-full md:max-w-5xl">
      <div class="flex flex-col">
        <div class="card w-full bg-base-200 shadow-xl mt-3">
          <div class="card-body">
            <h2 class="card-title">Mätvärden</h2>
            <div class="block stats shadow sm:flex">
              <div
                @click="router.push('/measurements')"
                class="stat cursor-pointer hover:bg-base-300"
              >
                <div class="stat-figure text-secondary">
                  <GlobeEuropeAfricaIcon class="inline-block w-8 h-8 stroke-current"></GlobeEuropeAfricaIcon>
                </div>
                <div class="stat-title">Temperatur</div>
                <div class="stat-value">{{data.temperature || '-'}}°C</div>
                <div class="stat-desc">Klicka för mer information</div>
              </div>
              <div
                @click="router.push('/measurements')"
                class="stat mt-3 sm:mt-0 cursor-pointer hover:bg-base-300"
              >
                <div class="stat-figure text-secondary">
                  <CloudIcon class="inline-block w-8 h-8 stroke-current"></CloudIcon>
                </div>
                <div class="stat-title">Luftfuktighet</div>
                <div class="stat-value">{{data.humidity || '-'}}%</div>
                <div class="stat-desc">Klicka för mer information</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card w-full bg-base-200 shadow-xl mt-3" v-if="userSettings.rpm !== null">
          <div class="card-body">
            <div class="card-title flex justify-between">
              <h2>Fläkt</h2>
              <input
                v-model="fanEnabled"
                type="checkbox"
                class="ml-4 toggle"
                :disabled="!store.manualMode"
              />
            </div>
            <div class="block stats shadow sm:flex">
              <div @click="router.push('/measurements')" class="stat">
                <div class="stat-figure text-secondary">
                  <RocketLaunchIcon class="inline-block w-8 h-8 stroke-current"></RocketLaunchIcon>
                </div>
                <div class="stat-title">Hastighet</div>
                <div class="stat-value">{{Math.floor(settings.rpm * 1.369)}} RPM</div>
                <div class="stat-desc">Faktiskt värde på frekvensen</div>
              </div>
              <div @click="router.push('/measurements')" class="stat mt-3 sm:mt-0">
                <div class="stat-figure text-secondary">
                  <BoltIcon class="inline-block w-8 h-8 stroke-current"></BoltIcon>
                </div>
                <div class="stat-title">Status</div>
                <div class="stat-value">{{fanEnabled ? 'PÅ' : 'AV'}}</div>
                <div class="stat-desc">Stäng av fläkten med switchen ovan</div>
              </div>
            </div>
            <p v-if="!store.manualMode" class="text-secondary">
              <QuestionMarkCircleIcon class="inline-block w-5 h-5 stroke-current cursor-pointer"></QuestionMarkCircleIcon>Växla till manuellt läge för att styra fläkten
            </p>
            <div v-if="store.manualMode" class="flex">
              <span class="font-bold mr-4 whitespace-nowrap">Styr fläkten</span>
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
                <div class="stat-figure text-secondary">
                  <FunnelIcon class="inline-block w-8 h-8 stroke-current"></FunnelIcon>
                </div>
                <div class="stat-title">Luftflöde</div>
                <div class="stat-value">{{Math.floor(settings.door / 1.8)}}%</div>
                <div class="stat-desc">Faktiskt värde på hur öppen luckan är</div>
              </div>
              <div class="stat mt-3 sm:mt-0">
                <div class="stat-figure text-secondary">
                  <BoltIcon class="inline-block w-8 h-8 stroke-current"></BoltIcon>
                </div>
                <div class="stat-title">Status</div>
                <div class="stat-value">ÖPPEN</div>
              </div>
            </div>

            <p v-if="!store.manualMode" class="text-secondary">
              <QuestionMarkCircleIcon class="inline-block w-5 h-5 stroke-current cursor-pointer"></QuestionMarkCircleIcon>Växla till manuellt läge för att styra luckan
            </p>
            <div v-if="store.manualMode" class="flex">
              <span class="font-bold mr-4 whitespace-nowrap">Styr luckan</span>
              <input type="range" v-model="userSettings.door" min="0" max="180" class="range" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
