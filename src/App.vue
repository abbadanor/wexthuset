<script setup>
import { ref } from 'vue';
import { CronJob } from 'cron'
const wateringTime = ref(4)
const fanSpeed = ref(50)
const frequencies = ['dag', 'timme', 'minut']
const cronString = ref('*/10 * * * * *')
const userCronString = ref(cronString.value)
const job = new CronJob(
    cronString.value,
    function () {
        console.log('You will see this message every second');
    },
    null,
    true,
    'Europe/Stockholm'
);
const lastDate = () => {
    console.log(job.lastDate())
}
const nextDates = () => {
    console.log(job.nextDates())
}
</script>

<template>
    <div class="min-h-screen w-full">
        <div class="flex justify-center">
            <input type="checkbox" id="my-modal" class="modal-toggle" />
            <div class="modal">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Hur ofta vill du vattna?</h3>
                    <div class="form-control">
                        <div class="input-group">
                            <span>Var</span>
                            <input type="text" placeholder="10" class="input input-bordered" />
                            <span>:e</span>
                            <select v-model="frequency" class="select select-bordered">
                                <option v-for="f in frequencies" v-bind:value="f">
                                    {{f}}
                                </option>
                            </select>
                        </div>
                    </div>
                    <p>{{cronString}}</p>
                    <div class="modal-action">
                        <label @click="lastDate()" for="my-modal" class="btn">Get new cronjob</label>
                        <label @click="nextDates()" for="my-modal" class="btn">Get next cronjobs</label>
                        <label for="my-modal" class="btn">Ok</label>
                    </div>
                </div>
            </div>
            <div class="flex flex-col p-3">
                <h1 class="text-4xl font-bold">Wexthuset</h1>
                <div>
                </div>
                <div class="flex flex-col">
                    <div class="card w-full bg-base-200 shadow-xl mt-3">
                        <div class="card-body">
                            <h2 class="card-title">Bevattning</h2>
                            <p>Växthuset kommer vattnas om {{ wateringTime }} minuter</p>
                        </div>
                        <div class="card-actions justify-end">
                            <label for="my-modal" class="btn modal-button">open modal</label>
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
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                            <div class="flex">
                                <div class="radial-progress text-sky-600" style="--value:70;">70%</div>
                                <div class="radial-progress text-fuchsia-700" style="--value:70;">70%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
