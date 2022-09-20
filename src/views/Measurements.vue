<template>
    <div class="flex justify-center">
        <div class="flex flex-col p-3 w-full md:max-w-5xl">
            <div class="flex flex-col">
                <div class="card w-full bg-base-200 shadow-xl mt-3">
                    <div class="card-body">
                        <h2 class="card-title">Temperatur</h2>
                        <apexchart class="w-full" height=300 type="area" :options="chartOptionsTemperature" :series="temperatureSeries">
                        </apexchart>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const temperatureSeries = [{
    name: 'Temperature',
    data: [31, 40, 28, 51, 42, 109, 100]
}]

const chartOptionsTemperature = {
    chart: {
        toolbar: {
            show: false
        },
        zoom: {
            enabled:
                false
        }
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

</script>
