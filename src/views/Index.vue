<script setup>
import { GlobeEuropeAfricaIcon, CloudIcon, RocketLaunchIcon, BoltIcon, QuestionMarkCircleIcon, FunnelIcon, ClockIcon } from '@heroicons/vue/24/solid'
import { ref, onMounted } from 'vue'
import { useStore } from "../store"
import { CronJob } from 'cron'
import router from '../router'
import axios from 'axios'
const timeSincePreviousJob = ref({hours: 0, minutes: 0, seconds: 0})
const timeToNextJob = ref({hours: 0, minutes: 0, seconds: 0})
const store = useStore()
const job = new CronJob(
    store.cronString,
    function () {
        // console.log('Medelande')
    },
    null,
    true,
    'Europe/Stockholm'
)
const fanSpeed = ref(100)
const fanEnabled = ref(true)
const doorOpen = ref(true)
const airFlow = ref(100)
const temperature = ref(null)
const humidity = ref(null)

function dateDifferenceToNowInMillis(dateThen) {
    if (dateThen === undefined) {
        return 0
    }
    const dateNow = new Date()
    return Math.abs(dateThen.getTime() - dateNow.getTime())
}

function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;
  return {hours, minutes, seconds}
}

function getTimeSincePreviousJob() {
    const millis = dateDifferenceToNowInMillis(job.lastDate())
    const time = convertMsToTime(millis)
    return time
}

function getNextDate() {
     const nextDateObject = job.nextDates()
     const {year, month, day, hour, minute, second, millisecond} = nextDateObject.c
     // Jävla skit, sämsta jag har anv'nt
     const nextDate = new Date(year, month - 1, day, hour - 2, minute, second, millisecond)
     return nextDate
 }

function getTimeToNextJob() {
    const millis = dateDifferenceToNowInMillis(getNextDate())
    const time = convertMsToTime(millis)
    return time
}

function logLastExecution() {
     console.log(job.lastExecution)
 }

setInterval(() => {
  timeSincePreviousJob.value = getTimeSincePreviousJob()
  timeToNextJob.value = getTimeToNextJob()
 }, 1000)
job.start()

const getApiValues = async () => {
    try {
        const resp = await axios.get('https://api.simsva.se/wexteras/data', {params: {id: 1, limit: 1}});
        console.log(resp.data);
        temperature.value = resp.data[0].temp
        humidity.value = resp.data[0].humidity
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
}

onMounted(() => {
    getApiValues()
})
</script>

<template>
    <div class="flex justify-center">
        <div class="flex flex-col p-3 w-full md:max-w-5xl">
            <div class="flex flex-col">
                <div class="card w-full bg-base-200 shadow-xl mt-3">
                    <div class="card-body">
                        <h2 class="card-title">Mätvärden</h2>
                        <div class="block stats shadow sm:flex">
                            <div @click="router.push('/measurements')" class="stat cursor-pointer hover:bg-base-300">
                                <div class="stat-figure text-secondary">
                                    <GlobeEuropeAfricaIcon class="inline-block w-8 h-8 stroke-current">
                                    </GlobeEuropeAfricaIcon>
                                </div>
                                <div class="stat-title">Temperatur</div>
                                <div class="stat-value">{{temperature || '-'}}°C</div>
                                <div class="stat-desc">Klicka för mer information</div>
                            </div>
                            <div @click="router.push('/measurements')"
                                class="stat mt-3 sm:mt-0 cursor-pointer hover:bg-base-300">
                                <div class="stat-figure text-secondary">
                                    <CloudIcon class="inline-block w-8 h-8 stroke-current"></CloudIcon>
                                </div>
                                <div class="stat-title">Luftfuktighet</div>
                                <div class="stat-value">{{humidity || '-'}}%</div>
                                <div class="stat-desc">Klicka för mer information</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card w-full bg-base-200 shadow-xl mt-3">
                    <div class="card-body">
                        <div class="card-title flex justify-between">
                            <h2>Fläkt</h2>
                            <input v-model="fanEnabled" type="checkbox" class="ml-4 toggle "
                                :disabled="!store.manualMode">
                        </div>
                        <div class="block stats shadow sm:flex">
                            <div @click="router.push('/measurements')" class="stat">
                                <div class="stat-figure text-secondary">
                                    <RocketLaunchIcon class="inline-block w-8 h-8 stroke-current">
                                    </RocketLaunchIcon>
                                </div>
                                <div class="stat-title">Hastighet</div>
                                <div class="stat-value">{{fanEnabled ? (fanSpeed * 35) : '0'}} RPM</div>
                                <div class="stat-desc">Faktiskt värde på frekvensen</div>
                            </div>
                            <div @click="router.push('/measurements')" class="stat mt-3 sm:mt-0">
                                <div class="stat-figure text-secondary">
                                    <BoltIcon class="inline-block w-8 h-8 stroke-current"></BoltIcon>
                                </div>
                                <div class="stat-title">Status</div>
                                <div class="stat-value">{{fanEnabled ? 'PÅ' : 'AV'}}</div>
                                <div class="stat-desc">{{fanEnabled ? 'Stäng av' : 'Sätt på'}} fläkten med switchen ovan
                                </div>
                            </div>
                        </div>
                        <p v-if="!store.manualMode" class="text-secondary">
                            <QuestionMarkCircleIcon class="inline-block w-5 h-5 stroke-current cursor-pointer">
                            </QuestionMarkCircleIcon>
                            Växla till manuellt läge för att styra fläkten
                        </p>
                        <div v-if="store.manualMode && fanEnabled" class="flex">
                            <span class="font-bold mr-4 whitespace-nowrap">Styr fläkten</span>
                            <input type="range" v-model="fanSpeed" min="0" max="100" class="range" />
                        </div>
                    </div>
                </div>
                <div class="card w-full bg-base-200 shadow-xl mt-3">
                    <div class="card-body">
                        <div class="card-title flex justify-between">
                            <h2>Lucka</h2>
                            <input v-model="doorOpen" type="checkbox" class="ml-4 toggle "
                                :disabled="!store.manualMode">
                        </div>
                        <div class="block stats shadow sm:flex">
                            <div class="stat">
                                <div class="stat-figure text-secondary">
                                    <FunnelIcon class="inline-block w-8 h-8 stroke-current">
                                    </FunnelIcon>
                                </div>
                                <div class="stat-title">Luftflöde</div>
                                <div class="stat-value">{{doorOpen ? airFlow : '0'}}%</div>
                                <div class="stat-desc">Faktiskt värde på hur öppen luckan är</div>
                            </div>
                            <div class="stat mt-3 sm:mt-0">
                                <div class="stat-figure text-secondary">
                                    <BoltIcon class="inline-block w-8 h-8 stroke-current"></BoltIcon>
                                </div>
                                <div class="stat-title">Status</div>
                                <div class="stat-value">{{doorOpen ? 'ÖPPEN' : 'STÄNGD'}}</div>
                            </div>
                        </div>

                        <p v-if="!store.manualMode" class="text-secondary">
                            <QuestionMarkCircleIcon class="inline-block w-5 h-5 stroke-current cursor-pointer">
                            </QuestionMarkCircleIcon>
                            Växla till manuellt läge för att styra luckan
                        </p>
                        <div v-if="store.manualMode && doorOpen" class="flex">
                            <span class="font-bold mr-4 whitespace-nowrap">Styr luckan</span>
                            <input type="range" v-model="airFlow" min="0" max="100" class="range" />
                        </div>
                    </div>
                </div>

                <div class="card w-full bg-base-200 shadow-xl mt-3">
                    <div class="card-body">
                        <h2 class="card-title">Bevattning</h2>
                        <div v-if="!store.manualMode" class="stats shadow">
                            <div @click="router.push('/configure')" class="stat hover:bg-base-300 cursor-pointer">
                                <div class="stat-figure text-secondary">
                                    <ClockIcon class="inline-block w-8 h-8 stroke-current">
                                    </ClockIcon>
                                </div>
                                <div class="stat-title">Tid till nästa vattning</div>
                                <div class="stat-value text-sm">

                                    <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
                                        <div class="flex">
                                            <span class="countdown font-mono text-5xl">
                                                <span :style="'--value:' + timeToNextJob.hours + ';'"></span>
                                            </span>
                                            hours
                                        </div>
                                        <div class="flex">
                                            <span class="countdown font-mono text-5xl">
                                                <span :style="'--value:' + timeToNextJob.minutes + ';'"></span>
                                            </span>
                                            min
                                        </div>
                                        <div class="flex">
                                            <span class="countdown font-mono text-5xl">
                                                <span :style="'--value:' + timeToNextJob.seconds + ';'"></span>
                                            </span>
                                            sec
                                        </div>
                                    </div>
                                </div>
                                <div class="stat-desc">Klicka för att styra vattningen</div>
                            </div>
                        </div>

                        <div class="stats shadow">
                            <div class="stat">
                                <div class="stat-figure text-secondary">
                                    <ClockIcon class="inline-block w-8 h-8 stroke-current">
                                    </ClockIcon>
                                </div>
                                <div class="stat-title">Tid sedan senast vattningen</div>
                                <div class="stat-value text-sm">

                                    <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
                                        <div class="flex">
                                            <span class="countdown font-mono text-5xl">
                                                <span :style="'--value:' + timeSincePreviousJob.hours + ';'"></span>
                                            </span>
                                            hours
                                        </div>
                                        <div class="flex">
                                            <span class="countdown font-mono text-5xl">
                                                <span :style="'--value:' + timeSincePreviousJob.minutes + ';'"></span>
                                            </span>
                                            min
                                        </div>
                                        <div class="flex">
                                            <span class="countdown font-mono text-5xl">
                                                <span :style="'--value:' + timeSincePreviousJob.seconds + ';'"></span>
                                            </span>
                                            sec
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <p> </p> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
