<template>
    <div class="flex justify-center">
        <div class="flex flex-col p-3 w-full md:max-w-5xl">
            <div class="flex flex-col">
                <div class="card w-full bg-base-200 shadow-xl mt-3">
                    <div class="card-body">
                        <div class="flex justify-between">
                            <h2 class="card-title">Temperatur</h2>
                            <div class="flex items-center">
                                <button @click="getTemperatureFromDatabase" class="btn ml-2 btn-circle">
                                    <ArrowPathIcon class="inline-block w-5 h-5 stroke-current cursor-pointer">
                                    </ArrowPathIcon>
                                </button>
                            </div>
                        </div>
                        <apexchart class="w-full" height=300 type="area" :options="temperatureChartOptions"
                            :series="temperatureSeries">
                        </apexchart>
                        <h2 class="card-title">Luftfuktighet</h2>
                        <apexchart class="w-full" height=300 type="area" :options="humidityChartOptions"
                            :series="humiditySeries">
                        </apexchart>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import axios from 'axios'
import { ArrowPathIcon } from "@heroicons/vue/24/solid";

const limit = 10

const temperatureSeries = ref([{
    name: 'Temperature',
    data: []
}])

const humiditySeries = ref([{
    name: 'Humidity',
    data: []
}])


const getTemperatureFromDatabase = async () => {
    try {
        const res = await axios.get('https://api.simsva.se/wexteras/data', { params: { id: 1, limit: limit } })
        const tempArray = res.data.map((i) => i.temp)
        const humidArray = res.data.map((i) => i.humidity)
        const timeArray = res.data.map((i) => new Date(i.t).toISOString())

        temperatureSeries.value[0].data = tempArray
        humiditySeries.value[0].data = humidArray
        updateChart({ xaxis: { categories: timeArray } }, temperatureChartOptions)
        updateChart({ xaxis: { categories: timeArray } }, humidityChartOptions)
    } catch (err) {
        console.error(err);
    }
};

// ok lite jobbigt
function updateChart(option, chart) {
    chart.value = { ...chart.value, ...option }
}

const chartOptions = {
    chart: {
        toolbar: {
            show: false
        },
        zoom: {
            enabled:
                false
        }
    },
    xaxis: {
        type: 'datetime',
        categories: []
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    grid: {
        show: true,
        borderColor: 'rgba(255,255,255,0.1)',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: true
            }
        },
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
    },
    dataLabels: {
        enabled: false
    }
}

const temperatureChartOptions = ref({ ...chartOptions })
const humidityChartOptions = ref({ ...chartOptions })

onMounted(() => {
    getTemperatureFromDatabase()
})

</script>
