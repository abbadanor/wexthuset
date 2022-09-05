<script setup>
import { ref } from 'vue';
const wateringTime = ref(4)
const fanSpeed = ref(50)
const frequencies = [
    {id:0,name:"Dag"},
    {id:0,name:"Timme"},
    {id:0,name:"Minut"},
]
</script>
<template>
    <input type="checkbox" id="my-modal" class="modal-toggle" />
    <div class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Hur ofta vill du vattna?</h3>
            <p class="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!
            </p>
            <div class="form-control">
                <div class="input-group">
                    <span>Var</span>
                    <input type="text" placeholder="10" class="input input-bordered" />
                    <span>:e</span>
                    <select v-model="frequency" class="select select-bordered">
                        <option v-for="f in frequencies" v-bind:value="{id:f.id, text:f.name}">
                        {{f.name}}
                    </option>
                    </select>
                </div>
            </div>
            <div class="modal-action">
                <label for="my-modal" class="btn">Yay!</label>
            </div>
        </div>
    </div>
    <div class="flex flex-col p-3">
        <h1 class="text-4xl font-bold">Wexthuset</h1>
        <div>
            <h1 class="text-3xl">Home</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, tempora alias. Placeat eius qui a fuga
                quisquam, eum enim unde aliquid dolores quaerat inventore voluptatem iure pariatur ab laborum?
                Inventore?</p>
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
</template>
<style>
</style>