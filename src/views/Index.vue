<script setup>
import { GlobeEuropeAfricaIcon, CloudIcon, RocketLaunchIcon, BoltIcon, QuestionMarkCircleIcon, FunnelIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import { useStore } from "../store"
import router from '../router'
const store = useStore()
const fanSpeed = ref(100)
const fanEnabled = ref(true)
const doorOpen = ref(true)
const airFlow = ref(100)
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
                                <div class="stat-value">27°C</div>
                                <div class="stat-desc">Klicka för mer information</div>
                            </div>
                            <div @click="router.push('/measurements')"
                                class="stat mt-3 sm:mt-0 cursor-pointer hover:bg-base-300">
                                <div class="stat-figure text-secondary">
                                    <CloudIcon class="inline-block w-8 h-8 stroke-current"></CloudIcon>
                                </div>
                                <div class="stat-title">Luftfuktighet</div>
                                <div class="stat-value">32.3%</div>
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
                                <div class="stat-desc">Hastigheten mäts i RPM</div>
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
                            <div class="stat hover:bg-base-300">
                                <div class="stat-figure text-secondary">
                                    <FunnelIcon class="inline-block w-8 h-8 stroke-current">
                                    </FunnelIcon>
                                </div>
                                <div class="stat-title">Luftflöde</div>
                                <div class="stat-value">{{doorOpen ? airFlow : '0'}}%</div>
                                <div class="stat-desc">Hur öppen luckan är</div>
                            </div>
                            <div class="stat mt-3 sm:mt-0 hover:bg-base-300">
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
                        <div class="stats shadow">
                            <div class="stat hover:bg-base-300 cursor-pointer">
                                <div class="stat-figure text-secondary">
                                    <CloudIcon class="inline-block w-8 h-8 stroke-current">
                                    </CloudIcon>
                                </div>
                                <div class="stat-title">Tid till nästa vattning</div>
                                <div class="stat-value text-sm">

                                    <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
                                        <div class="flex">
                                            <span class="countdown font-mono text-5xl">
                                            <span style="--value:10;"></span>
                                            </span>
                                            hours
                                        </div>
                                        <div class="flex">
                                            <span class="countdown font-mono text-5xl">
                                            <span style="--value:24;"></span>
                                            </span>
                                            min
                                        </div>
                                        <div class="flex">
                                            <span class="countdown font-mono text-5xl">
                                            <span style="--value:29;"></span>
                                            </span>
                                            sec
                                        </div>
                                    </div>
                                    </div>
                                <div class="stat-desc">Klicka för att styra vattningen</div>
                            </div>
                        </div>
                        <h5 class="text-lg font-bold">Tidigare vattningar</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
