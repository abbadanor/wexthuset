<template>
    <div class="flex justify-center">
        <div class="flex flex-col p-3 w-full md:max-w-5xl">
            <div class="flex flex-col">
    <div class="card w-full bg-base-200 shadow-xl mt-3">
        <div class="card-body">
            <h2 class="card-title">Temperatur</h2>
            <apexchart class="w-full" height=300 type="area" :options="chartOptions" :series="series"></apexchart>
        </div>
        <div class="card-body">
            <h2 class="card-title">Luftfuktighet</h2>
            <apexchart class="w-full" height=300 type="area" :options="chartOptions" :series="series"></apexchart>
        </div>
    </div>
    </div>
    </div>
    </div>
</template>

<script setup>
const series = [{
    name: 'series1',
    data: [31, 40, 28, 51, 42, 109, 100]
}]
const chartOptions = {
    chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
          type: 'datetime',
          categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
          tickAmount: undefined,
          tickPlacement: 'between',
          min: undefined,
          max: undefined,
          range: undefined,
          floating: false,
          decimalsInFloat: undefined,
          overwriteCategories: undefined,
          position: 'bottom',
          labels: {
              show: true,
              rotate: -45,
              rotateAlways: false,
              hideOverlappingLabels: true,
              showDuplicates: false,
              trim: false,
              minHeight: undefined,
              maxHeight: 120,
              style: {
                  colors: [function(opts) {return '#fff'}],
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                  cssClass: 'apexcharts-xaxis-label',
              },
              offsetX: 0,
              offsetY: 0,
              format: undefined,
              formatter: undefined,
              datetimeUTC: true,
              datetimeFormatter: {
                  year: 'yyyy',
                  month: "MMM 'yy",
                  day: 'dd MMM',
                  hour: 'HH:mm',
              },
          },
          axisBorder: {
              show: true,
              color: '#78909C',
              height: 1,
              width: '100%',
              offsetX: 0,
              offsetY: 0
          },
          axisTicks: {
              show: true,
              borderType: 'solid',
              color: '#78909C',
              height: 6,
              offsetX: 0,
              offsetY: 0
          },

          title: {
              text: undefined,
              offsetX: 0,
              offsetY: 0,
              style: {
                  color: undefined,
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  cssClass: 'apexcharts-xaxis-title',
              },
          },
          crosshairs: {
              show: true,
              width: 1,
              position: 'back',
              opacity: 0.9,
              stroke: {
                  color: '#b6b6b6',
                  width: 0,
                  dashArray: 0,
              },
              fill: {
                  type: 'solid',
                  color: '#B1B9C4',
                  gradient: {
                      colorFrom: '#D8E3F0',
                      colorTo: '#BED1E6',
                      stops: [0, 100],
                      opacityFrom: 0.4,
                      opacityTo: 0.5,
                  },
              },
              dropShadow: {
                  enabled: false,
                  top: 0,
                  left: 0,
                  blur: 1,
                  opacity: 0.4,
              },
          },
          tooltip: {
              enabled: true,
              formatter: undefined,
              offsetY: 0,
              style: {
                fontSize: 0,
                fontFamily: 0,
              },
          },
      },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    grid: {
          show: true,      // you can either change hear to disable all grids
          xaxis: {
            lines: {
              show: false  //or just here to disable only x axis grids
            }
          },
          yaxis: {
            lines: {
              show: false  //or just here to disable only y axis
            }
          },
        },
   legend: {
     show:false,
   },
   theme: {
      mode: 'light',
      palette: 'palette1',
      monochrome: {
          enabled: false,
          color: '#255aee',
          shadeTo: 'light',
          shadeIntensity: 0.65
      },
  }
}

</script>
