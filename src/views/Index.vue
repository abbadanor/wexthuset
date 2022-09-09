<script setup>
import { ref, onMounted } from 'vue';
import { CronJob } from 'cron'
 import axios from 'axios'
 import {dayjs} from 'dayjs'
 import {relativeTime} from 'dayjs/plugin/relativeTime'

const cronTimeParser = (ct) => {
    const intervalDictionary = { 1: "minut", 2: "timme", 3: "dag" }
    if (ct.includes('/')) {
        const intervalArray = ct.split(' ')
        for (let i in intervalArray) {
            if (intervalArray[i].includes('/')) {
                const timeInterval = intervalArray[i].split('/')[1]
                return { interval: intervalDictionary[i], time: timeInterval }
            }
        }
    }
}

const dataIsLoaded = ref(false)
const latestdata = ref(null)
const fanSpeed = ref(50)
const frequencies = ['minut', 'timme', 'dag']
const cronTime = ref("0 */2 * * * *")
const userTime = ref(cronTimeParser(cronTime.value).time)
const userInterval = ref(cronTimeParser(cronTime.value).interval)
const job = new CronJob(
    cronTime.value,
    function () {
        console.log('You will see this message every second');
    },
    null,
    true,
    'Europe/Stockholm'
);

const generateCronTime = (time, interval) => {
    switch (interval) {
        case 'minut':
            return `0 */${time} * * * *`
        case 'timme':
            return `0 0 */${time} * * *`
        case 'dag':
            return `0 0 0 */${time} * *`
    }
}

const parseCronTime = () => {
    console.log(cronTimeParser(cronTime.value))
}

const logNextDates = () => {
    console.log(job.nextDates().c)
    const { year, month, day, hour, minute,second } = job.nextDates().c
     dayjs.extend(relativeTime)
    print(dayjs(year, month, day, hour, minute, second).fromNow())
}

const callApi = async () => {
     try {
        const resp = await axios.get('https://api.simsva.se/wexteras/data?id=1');
        console.log(resp.data);
        latestdata.value = (resp.data).pop()
        dataIsLoaded.value = true
        // console.log(latestdata.temp,'hej')
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
}
onMounted(() => {
     callApi()
 })
</script>

<template>
        <div class="flex justify-center">
            <input type="checkbox" id="my-modal" class="modal-toggle" />
            <div class="flex flex-col p-3">
                <h1 class="text-4xl font-bold">Wexthuset</h1>
                <div>
                </div>
                <div class="flex flex-col">
                    <div class="card w-full bg-base-200 shadow-xl mt-3">
                        <div class="card-body">
                            <h2 class="card-title">Bevattning</h2>
                            <div class="input-group">
                                <span>Var</span>
                                <input id="time" v-model="userTime" type="text" placeholder="10"
                                    class="input input-bordered" />
                                <span>:e</span>
                                <select id="interval" v-model="userInterval" class="select select-bordered">
                                    <option v-for="f in frequencies" v-bind:value="f">
                                        {{f}}
                                    </option>
                                </select>
                                <button @click="cronTime = generateCronTime(userTime, userInterval)"
                                    class="btn">Go</button>
                            </div>
                            <p>{{cronTime}}</p>
                            <button @click="logNextDates" class="btn">Get next dates</button>
                            <button @click="parseCronTime" class="btn">Crontime parser</button>
                        </div>
                    </div>
                    <div class="card w-full bg-base-200 shadow-xl mt-3">
                        <div class="card-body">
                            <h2 class="card-title">Styr fläkten</h2>
                            <div class="flex">
                                <input type="range" v-model="fanSpeed" min="0" max="100" class="range range-primary" />
                                <span class="font-bold ml-4 whitespace-nowrap">{{ fanSpeed * 100 }} RPM</span>
                            </div>
                        </div>
                    </div>
                    <div class="card w-full bg-base-200 shadow-xl mt-3">
                        <div class="card-body">
                            <h2 class="card-title">Mätvärden</h2>
                            <p>Temperature / Humidity</p>
                            <div class="flex">
                                <div class="radial-progress text-sky-600" style="--value:100;" v-if="dataIsLoaded">{{ latestdata.temp }}°</div>
                                <div class="radial-progress text-fuchsia-700" style="--value:100; margin-left:10px;" v-if="dataIsLoaded">{{ latestdata.humidity }}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
