<script lang="ts">
  import Chart from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  import { onMount } from 'svelte';
  
  // Vitamin d rates
  const VITAMIN_D_RATES: any = {
    'skin1': {
      "index1": 2634.57,
      "index2": 3371.25,
      "index3": 3763.67,
      "index4": 3951.85,
      "index5": 4064.76,
      "index6": 4159.84,
      "index7": 4190.48,
      "index8": 4234.13,
      "index9": 4272.27,
      "index10": 4311.11,
      "index11": 4311.11,
      "index12": 4311.11,
      "index13": 4377.44,
      "index14": 4324.21,
      "index15": 4411.37,
    },
    'skin2': {
      "index1": 2544.99,
      "index2": 3256.63,
      "index3": 3635.70,
      "index4": 3817.49,
      "index5": 3926.56,
      "index6": 4018.41,
      "index7": 4048.00,
      "index8": 4090.17,
      "index9": 4127.02,
      "index10": 4164.53,
      "index11": 4164.53,
      "index12": 4164.53,
      "index13": 4228.60,
      "index14": 4177.19,
      "index15": 4261.38,
    },
    'skin3': {
      "index1": 2464.05,
      "index2": 3153.05,
      "index3": 3520.08,
      "index4": 3696.08,
      "index5": 3801.68,
      "index6": 3890.61,
      "index7": 3919.26,
      "index8": 3960.09,
      "index9": 3995.76,
      "index10": 4032.09,
      "index11": 4032.09,
      "index12": 4032.09,
      "index13": 4094.12,
      "index14": 4044.34,
      "index15": 4125.86,
    },
    'skin4': {
      "index1": 2388.16,
      "index2": 3055.94,
      "index3": 3411.66,
      "index4": 3582.24,
      "index5": 3684.59,
      "index6": 3770.78,
      "index7": 3798.55,
      "index8": 3838.12,
      "index9": 3872.70,
      "index10": 3907.90,
      "index11": 3907.90,
      "index12": 3907.90,
      "index13": 3968.02,
      "index14": 3919.78,
      "index15": 3998.78,
    },
    'skin5': {
      "index1": 2316.94,
      "index2": 2964.81,
      "index3": 3309.92,
      "index4": 3475.41,
      "index5": 3574.71,
      "index6": 3658.33,
      "index7": 3685.27,
      "index8": 3723.66,
      "index9": 3757.20,
      "index10": 3791.36,
      "index11": 3791.36,
      "index12": 3791.36,
      "index13": 3849.69,
      "index14": 3802.88,
      "index15": 3879.53,
    },
    'skin6': {
      "index1": 2249.96,
      "index2": 2879.09,
      "index3": 3214.22,
      "index4": 3374.93,
      "index5": 3471.36,
      "index6": 3552.56,
      "index7": 3578.72,
      "index8": 3616.00,
      "index9": 3648.58,
      "index10": 3681.75,
      "index11": 3681.75,
      "index12": 3681.75,
      "index13": 3738.39,
      "index14": 3692.94,
      "index15": 3767.37,
    },
  }

  const RADIANCE_RATES: any = {
    "index1": 0.025,
    "index2": 0.050,
    "index3": 0.075,
    "index4": 0.100,
    "index5": 0.125,
    "index6": 0.150,
    "index7": 0.175,
    "index8": 0.200,
    "index9": 0.225,
    "index10": 0.250,
    "index11": 0.275,
    "index12": 0.300,
    "index13": 0.325,
    "index14": 0.350,
    "index15": 0.375
  }
  
  // factors
  let skin: number = $state(1)
  let age: number = $state(1)
  let height: number = $state(0)
  let weight: number = $state(0)
  let bsa: number | null = $derived.by(() => {
    if (height > 0 && weight > 0) {
      localStorage.setItem('height', String(height))
      localStorage.setItem('weight', String(weight))
      let num =  0.007184 * (height**0.725) * (weight**0.425) //du bois formula
      return Math.round(num * 100) / 100
    }
    return null
  })

  let exposure: number = $state(1)
  let unilateral: boolean = $state(true)
  let final_bsa: number | undefined = $derived.by(() => {
    let agePer = 1
    switch(age) {
      case 1:
        agePer = 1
        break
      case 2:
        agePer = 0.83
        break
      case 3:
        agePer = 0.66
        break
      case 4:
        agePer = 0.49
        break
    }

    if (bsa) {
      let per: number = 1
      switch(exposure) {
        case 1:
          per = 0.12
          break
        case 2:
          per = 0.26
          break
        case 3:
          per = 0.46
          break
        case 4:
          per = 0.72
          break
        case 5:
          per = 0.95
          break
      }
      if (unilateral) {
        return bsa * per * 0.5 * agePer
      }
      return bsa * per * agePer
    }
  })
  let totalVitD: number = $derived.by(() => {
    let total = 0
    for (let i = 0; i < totalChartData.datasets[0].data.length; i++) {
      total += totalChartData.datasets[0].data[i]
    } 
    return total
  })
  //factors

  let {
    latitude,
    longitude,
    data,
  }: {
    latitude: number;
    longitude: number;
    data: any
  } = $props();

  let UVIChartData = $derived.by(() => {
    let formatData: any = {}
    for (let key in data.hourly.uvIndex) {
      if (data.hourly.uvIndex.hasOwnProperty(key)) {
        if (Number(key) < 12) {
          if (key === '0') {
            formatData['12 AM'] = data.hourly.uvIndex[key]
          } else {
            formatData[key + " AM"] = data.hourly.uvIndex[key]
          }
        }

        if (Number(key) > 11) {
          if (key === '12') {
            formatData['12 PM'] = data.hourly.uvIndex[key]
          } else {
            let num = Number(key) - 12
            formatData[num + " PM"] = data.hourly.uvIndex[key]
          }
        }
      }
    }

    return {
      labels: [],
      datasets: [
        {
          label: 'UV Index',
          data: formatData,
          borderColor: 'rgb(255, 159, 64)',
          fill: false,
          stepped: true,
        }
      ]
    }
  })

  function buildUVIChart() {
    let chartStatus = Chart.getChart("lineChart")
    if (chartStatus != undefined) {
      chartStatus.destroy();
      console.log('dest')
    }

    var ctx: any = document.getElementById('lineChart');
    
    new Chart(ctx, {
      type: 'line',
      data: UVIChartData,
      options: {
        responsive: true,
        interaction: {
          intersect: false,
          axis: 'x'
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: new Date().toLocaleDateString(),
          }
        },
      }
    });
  }

  let rateChartData = $derived.by(() => {
    let labels: Array<string> = []
    let values: Array<number> = []

    for (let key in UVIChartData.datasets[0].data) {
      let uv = Math.round(UVIChartData.datasets[0].data[key])
      if (uv > 0) {
        let keySkin: string = 'skin' + String(skin)
        let keyIndex: string = 'index' + String(uv)
        if (final_bsa) {
          values.push(Math.round(VITAMIN_D_RATES[keySkin][keyIndex] * final_bsa * RADIANCE_RATES[keyIndex]))
          labels.push(key)
        } else {
          values.push(0)
          labels.push(key)
        }
      }
    }

    return {
      labels: labels,
      datasets: [
        {
          label: 'Rate',
          data: values,
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgb(255, 159, 64)',
          fill: true,
        }
      ]
    }
  })

  function buildRateChart() {
    let chartStatus = Chart.getChart("barChart")
    if (chartStatus != undefined) {
      chartStatus.destroy();
      console.log('dest')
    }

    var ctx: any = document.getElementById('barChart');
    new Chart(ctx, {
      type: 'bar',
      data: rateChartData,
      options: {
        responsive: true,
        interaction: {
          intersect: false,
          axis: 'x'
        },
        plugins: {
          datalabels: {
            rotation: 0,
            anchor: 'end',
            align: 'end',
            labels: {
                value: {
                  color: 'black'
                }
              }
          },
          legend: {
            display: false
          },
          title: {
            display: true,
          },
        },
      }
    });
  }

  let totalChartData = $derived.by(() => {
    let labels: Array<string> = []
    let values: Array<number> = []

    for (let i = 0; i < rateChartData.labels.length; i++) {
      let sunDuration = 1 - (data.hourly.sunshineDuration[i] / 3600)
      let value = Math.round(rateChartData.datasets[0].data[i] * 60 * sunDuration)
      if (value > 0) {
        labels.push(rateChartData.labels[i])
        values.push(value)
      }
    }

    return {
      labels: labels,
      datasets: [
        {
          label: 'Total Vit. D',
          data: values,
          backgroundColor: ['rgb(255, 159, 64)', 'rgb(255, 205, 86)',],
          fill: true,
        }
      ],
    } 

  })

  function buildTotalChart() {
    let chartStatus = Chart.getChart("polarChart")
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    var ctx: any = document.getElementById('polarChart');
    new Chart(ctx, {
      type: 'polarArea',
      data: totalChartData,
      options: {
        responsive: true,
        scales: {
          r: {
            ticks: {
              display:false
            },
            startAngle: 180,
            pointLabels: {
              display: true,
              centerPointLabels: true,
              font: {
                size: 12,
              }
            }
          }
        },
        interaction: {
          intersect: false,
          axis: 'x'
        },
        plugins: {
          datalabels: {
            rotation: -45,
            anchor: 'center',
            align: 'end',
            labels: {
                value: {
                  color: 'black'
                }
              }
          },
          legend: {
            display: false
          },
        },
      }
    });
  }

  function setSkin(this: any) {
    let num = Number(this.value)
    switch(num) {
      case 1:
        skin = 1
        localStorage.setItem('skin', String(skin))
        break
      case 2:
        skin = 2
        localStorage.setItem('skin', String(skin))
        break
      case 3:
        skin = 3
        localStorage.setItem('skin', String(skin))
        break
      case 4:
        skin = 4
        localStorage.setItem('skin', String(skin))
        break
      case 5:
        skin = 5
        localStorage.setItem('skin', String(skin))
        break
      case 6:
        skin = 6
        localStorage.setItem('skin', String(skin))
        break
    }
  }

  function setAge(this: any) {
    let num = Number(this.value)
    switch(num) {
      case 1:
        age = 1
        localStorage.setItem('age', String(age))
        break
      case 2:
        age = 2
        localStorage.setItem('age', String(age))
        break
      case 3:
        age = 3
        localStorage.setItem('age', String(age))
        break
      case 4:
        age = 4
        localStorage.setItem('age', String(age))
        break
    }
  }

  function setExposure(this: any) {
    let num = Number(this.value)
    switch(num) {
      case 1:
        exposure = 1
        localStorage.setItem('exposure', String(exposure))
        break
      case 2:
        exposure = 2
        localStorage.setItem('exposure', String(exposure))
        break
      case 3:
        exposure = 3
        localStorage.setItem('exposure', String(exposure))
        break
      case 4:
        exposure = 4
        localStorage.setItem('exposure', String(exposure))
        break
      case 5:
        exposure = 5
        localStorage.setItem('exposure', String(exposure))
        break
    }
  }

  let goal: number = $state(600)
  let optimalMsg: string = $derived.by(() => {
    interface OptimalRates {
      time: string,
      rate: number,
    }
    let rates: Array<OptimalRates> = []

    for (let i = 0; i < rateChartData.labels.length; i++) {
      if (rates.length === 0) {
        rates.push({'time': rateChartData.labels[i], 'rate': rateChartData.datasets[0].data[i]})
      } else {
        if (rateChartData.datasets[0].data[i] === rates[0]['rate']) {
          rates.push({'time': rateChartData.labels[i], 'rate': rateChartData.datasets[0].data[i]})
        }

        if (rateChartData.datasets[0].data[i] > rates[0]['rate']) {
          rates = []
          rates.push({'time': rateChartData.labels[i], 'rate': rateChartData.datasets[0].data[i]})
        } 
      }
    }

    let finalString: string = ''
    let hoursStr: string = ''
    let total: number = 0
    let timeStr: string = ''

    rates.forEach((e, i, arr) => {
      if (arr.length > 1) {
        if (i === arr.length - 1) {
          hoursStr += `and/or ${e.time}`
        } else {
          hoursStr += `${e.time}, `
        }
      } else {
        hoursStr = `${e.time}`
      }
      total += (e.rate * 60)
    })

    let min: number = 1
    let withinHours: boolean = false
    while (min < (rates.length * 60) && goal <= total) {
      if (rates[0].rate * min > goal) {
        withinHours = true
        break
      }
      min++
    } 

    if (withinHours) {
      timeStr = String(min) + ' minutes'
      finalString = `it is best to go out at ${hoursStr} for ${timeStr}.`
    } else {

      finalString = "you must spend more time outside of peak sunglight hours. Be aware that prolonged exposure over may increase your risk of sunburn and skin-related cancers especially when the UV index is over 6."
    }



    return finalString
  })

  let bmi: number = $derived(Math.round(weight / ((height / 100)**2)))
  let bmiMsg: string = $derived.by(() => {
    if (bmi >= 30) {
      let per = Math.round((bmi - 25) * 1.15)
      let red = Math.round(30 - (30 * (per / 100)))
      return `which is categorized as obese. The normal average amount of calcidiol in the blood is 30 ng/mL and could be reduced to ${red} ng/ml (-${per}%).` 
    } 
    if (bmi >= 25 && bmi < 30) {
      let per = Math.round((bmi - 25)* 1.15)
      console.log(per)
      if (per > 0) {
        let red = Math.round(30 - (30 * (per / 100)))
        return `which is categorized as overweight. The normal average amount of calcidiol in the blood is 30 ng/mL and could be reduced to ${red} ng/ml (-${per}%).` 
      }
      return "which is categorized as overweight. Which could reduce the concentrations of calcidiol in your blood."
    } 
    if (bmi < 18.5) {
      return "which is categorized as being underweight but should not decrease concentrations of calcidiol in your blood."
    } 
    return "which is categorized as a normal weight and is most optimal for maintaining adequate concentrations of calcidiol in your blood."
  })

  function setGoal() {
    if (goal > 0) {
      localStorage.setItem('goal', String(goal))
    }
  }

  $effect(() => {
    if (final_bsa) {
      buildRateChart()
      buildTotalChart()
    }

    if (UVIChartData) {
      buildUVIChart()
    }
  })

  onMount(() => {
    //load localStorage
    const lsExposure = localStorage.getItem('exposure')
    if (lsExposure) {
      exposure = Number(lsExposure)
    }

    const lsSkin = localStorage.getItem('skin')
    if (lsSkin) {
      skin = Number(lsSkin)
    }

    const lsAge = localStorage.getItem('age')
    if (lsAge) {
      age = Number(lsAge)
    }

    const lsHeight = localStorage.getItem('height')
    if (lsHeight) {
      height = Number(lsHeight)
    }

    const lsWeight = localStorage.getItem('weight')
    if (lsWeight) {
      weight = Number(lsWeight)
    }

    const lsGoal = localStorage.getItem('goal')
    if (lsGoal) {
      goal = Number(lsGoal)
    }

    //build charts
    Chart.register(ChartDataLabels);
    buildUVIChart()
  })
</script>


<div class="container bg-white mb-5">
  <div class="grid sm:grid-cols-3 gap-2">

    <div class="p-2">
      <p class="text-sm text-center underline font-bold">Location</p>
      <div class="flex items-center">
        <iframe title="google-maps-embed-api" width="100%" height="300px" style="border:0" loading="lazy" allowfullscreen
          src="https://www.google.com/maps/embed/v1/place?q={latitude}%2C%20{longitude}&key={import.meta.env.VITE_GOOGLE_MAPS_API}">
        </iframe>
      </div>
    </div>

    <div class="p-2">
      <p class="text-sm text-center underline font-bold">Today's UV Index</p>
      <div class="flex items-center">
        <canvas id="lineChart"></canvas>
      </div>
    </div>

    <div class="p-2">
      <div class="grid grid-rows-3 gap-4">
        <div>
          <p class="text-sm text-center underline font-bold">Skin Type (Fitzpatrick Scale)</p>
          <div class="grid grid-cols-6 gap-1">
            {#if skin === 1}
            <button class="skintype1 py-2 px-4 cursor-pointer border-blue-500 border-2 text-blue-500">I</button>
            {:else}
            <button onclick={setSkin} value=1 class="skintype1 py-2 px-4 cursor-pointer hover:border-blue-500 border-2">I</button>
            {/if}

            {#if skin === 2}
            <button class="skintype2 py-2 px-4 cursor-pointer border-blue-500 border-2 text-blue-500">II</button>
            {:else}
            <button onclick={setSkin} value=2 class="skintype2 py-2 px-4 cursor-pointer hover:border-blue-500 border-2">II</button>
            {/if}

            {#if skin === 3}
            <button class="skintype3 py-2 px-4 cursor-pointer border-blue-500 border-2 text-blue-500">III</button>
            {:else}
            <button onclick={setSkin} value=3 class="skintype3 py-2 px-4 cursor-pointer hover:border-blue-500 border-2">III</button>
            {/if}

            {#if skin === 4}
            <button class="skintype4 py-2 px-4 cursor-pointer border-blue-500 border-2 text-blue-500">IV</button>
            {:else}
            <button onclick={setSkin} value=4 class="skintype4 py-2 px-4 cursor-pointer hover:border-blue-500 border-2">IV</button>
            {/if}

            {#if skin === 5}
            <button class="skintype5 py-2 px-4 cursor-pointer border-blue-500 border-2 text-blue-500">V</button>
            {:else}
            <button onclick={setSkin} value=5 class="skintype5 py-2 px-4 cursor-pointer hover:border-blue-500 border-2">V</button>
            {/if}

            {#if skin === 6}
            <button class="skintype6 py-2 px-4 cursor-pointer border-blue-500 border-2 text-blue-500">VI</button>
            {:else}
            <button onclick={setSkin} value=6 class="skintype6 py-2 px-4 cursor-pointer hover:border-blue-500 border-2">VI</button>
            {/if}
          </div>
        </div>

        <div>
          <div>
            <p class="text-sm text-center underline font-bold">Age</p>
            <div class="grid grid-cols-4 gap-1">
              {#if age === 1}
              <button class="bg-blue-500 text-blue-700 font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">0-21</button>
              {:else}
              <button onclick={setAge} value=1 class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">0-21</button>
              {/if}

              {#if age === 2}
              <button class="bg-blue-500 text-blue-700 font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">22-40</button>
              {:else}
              <button onclick={setAge} value=2 class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">22-40</button>
              {/if}

              {#if age === 3}
              <button class="bg-blue-500 text-blue-700 font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">41-59</button>
              {:else}
              <button onclick={setAge} value=3 class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">41-59</button>
              {/if}

              {#if age === 4}
              <button class="bg-blue-500 text-blue-700 font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">60+</button>
              {:else}
              <button onclick={setAge} value=4 class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">60+</button>
              {/if}
            </div>
          </div>
        </div>

        <div>
          <p class="text-sm text-center underline font-bold">Body Surface Area (Du Bois Formula)</p>
          <div class="grid grid-cols-3 gap-1">

            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <div class="shrink-0 text-xs text-gray-500 select-none sm:text-sm/6">Hgt. (cm) &nbsp;</div>
                <input type="number" class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" min=0 max=305 bind:value={height}>
              </div>
            </div>

            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <div class="shrink-0 text-xs text-gray-500 select-none sm:text-sm/6">Wgt. (kg) &nbsp;</div>
                <input type="number" class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" min=0 max=500 bind:value={weight}>
              </div>
            </div>

            <div class="mt-2">
              <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <div class="shrink-0 text-xs text-gray-500 select-none sm:text-sm/6">BSA (m²) &nbsp;</div>
                <input type="text" class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" disabled bind:value={bsa}>
              </div>
            </div>

          </div>
        </div>

        <div class="flex items-center justify-center">
          <p class="text-sm">Unilateral Exposure &nbsp;</p>
          <input type="checkbox" bind:checked={unilateral}/>
        </div>

        <div>
          <div>
            <p class="text-sm text-center underline font-bold">Exposure</p>
            <div class="grid grid-cols-5 gap-1">
              {#if exposure === 1}
              <button class="text-xs bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Hands & Face (12%)</button>
              {:else}
              <button onclick={setExposure} value=1 class="text-xs bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Hands & Face (12%)</button>
              {/if}

              {#if exposure === 2}
              <button class="text-xs bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Short Sleeves (26%)</button>
              {:else}
              <button onclick={setExposure} value=2 class="text-xs bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Short Sleeves (26%)</button>
              {/if}

              {#if exposure === 3}
              <button class="text-xs bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Shorts & T-shirt (46%)</button>
              {:else}
              <button onclick={setExposure} value=3 class="text-xs bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Shorts & T-shirt (46%)</button>
              {/if}

              {#if exposure === 4}
              <button class="text-xs bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Only Shorts (72%)</button>
              {:else}
              <button onclick={setExposure} value=4 class="text-xs bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Only Shorts (72%)</button>
              {/if}

              {#if exposure === 5}
              <button class="text-xs bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Naked (95%)</button>
              {:else}
              <button onclick={setExposure} value=5 class="text-xs bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Naked (95%)</button>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

{#if final_bsa}
<div class="container bg-white mb-5">
  <div class="grid sm:grid-cols-3 gap-2">
    <div class="p-2">
      <p class="text-sm text-center underline font-bold">Rate of Vitamin D Production (IU/min)</p>
      <div class="flex items-center">
        <canvas id="barChart"></canvas>
      </div>
      <p class="text-sm text-center underline font-bold">Methods To Calculate Rates</p>
      <p class="text-sm">The method used to calculate the production of vitamin D is drawn from studies conducted by <a class="text-blue-800" target="_blank" href="https://onlinelibrary.wiley.com/doi/10.1111/php.12651">Miyauchi et al.</a> and <a class="text-blue-800" target="_blank" href="https://onlinelibrary.wiley.com/doi/10.1111/j.1751-1097.2007.00226.x">Brenner et al.</a> Based on the data gathered by Miyachi et al. in table I, they were able to determine how much vitamin D a person with a type III skin (Fitzpatrick scale) can produce based on the UV index, irradiances for erythema, exposed skin surface area, and duration.</p>
      <br>
      <p class="text-sm">Brenner et al. states, “While Black epidermis allows only 7.4% of UVB and 17.5% of UVA to penetrate, 24% UVB and 55% UVA passes through White skin. (p. 5)” From here, I decided to create a normalized scale where I propose how much UVB is passed through each skin type.</p>

      <p class="underline font-bold text-sm text-center mt-2">Fitzpatrick Scale</p>
      <table class="text-sm border-separate border-spacing-2 border border-gray-400 dark:border-gray-500 table-auto mx-auto">
        <thead>
          <tr>
            <th class="border border-gray-300">I</th>
            <th class="border border-gray-300">II</th>
            <th class="border border-gray-300">III</th>
            <th class="border border-gray-300">IV</th>
            <th class="border border-gray-300">V</th>
            <th class="border border-gray-300">VI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-300">24%</td>
            <td class="border border-gray-300">20.6%</td>
            <td class="border border-gray-300">17.3%</td>
            <td class="border border-gray-300">14%</td>
            <td class="border border-gray-300">10.7%</td>
            <td class="border border-gray-300">7.4%</td>
          </tr>
        </tbody>
      </table>

      <p class="text-sm mt-2">With these percentages, I was able to construct six sets of data for each skin type based on the original data from Miyauchi et al. You may view the spreadsheet <a class="text-blue-800" target="_blank" href="https://docs.google.com/spreadsheets/d/10Q1NNXO7l7ZDnmvvAHUgIwdjus7XbOUkNwU1CQInJm8/edit?usp=sharing">here.</a></p>
    </div>

    <div class="p-2">
      <p class="text-sm text-center underline font-bold">Total Vitamin D Produced Per Hour (IU/hr)</p>
      <div class="flex items-center">
        <canvas id="polarChart"></canvas>
      </div>
      <p class="text-sm text-center underline font-bold mt-2">Estimating Amount Produced</p>
      <p class="text-sm">Knowing how much Vitamin D is produced per minute, we can then calculate the estimated max gained per hour for each time of the day where the UV index is greater than zero.</p>
      <br>
      <p class="text-sm">Enter your daily goal to calculate the most optimal time for sunlight exposure where an adequate duration is determined while minimizing skin damage.</p>
    </div>

    <div class="p-2">
      <p class="text-sm text-center underline font-bold">Set Goal & Estimate Actions</p>
      <p class="text-sm text-center font-semibold">Estimated Total: {totalVitD} IU ({totalVitD / 40} mcg) </p>

      <div class="grid grid-cols-2 gap-2">

        <div class="p-2">
          <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
            <div class="shrink-0 text-xs text-gray-500 select-none sm:text-sm/6">Daily Goal &nbsp;</div>
            <input type="number" class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" min=400 bind:value={goal} onchange={setGoal}>
          </div>

          <p class="text-sm underline font-bold mt-3">Optimal Times...</p>
          <p class="text-sm">
            To get your daily goal of {goal} IUs ({goal / 40} mcg) of vitamin D with the least amount of time spent under the sun, <a href="/" class="font-bold">{optimalMsg}</a>
          </p>
  
          <p class="text-sm underline font-bold mt-3">Other Factors...</p>
          <p class="text-sm">
            Air pollution and your BMI are some of the factors that are not being accounted for in these calculations. As stated by <a target="_blank" class="text-blue-800" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4138782/?utm_source=chatgpt.com">Cipriani et al,</a> “A bidirectional genetic study, which limits confounding, has suggested that higher BMI leads to lower 25(OH)D, each unit increase in BMI being associated with 1.15% lower concentration of 25(OH)D, after adjusting for age, sex, laboratory batch, and month of measurement. (p. 3)”.
          </p>
          <br>
          <p class="text-sm">
            Your BMI is <a href="/" class="font-bold">{bmi} (kg/m²), {bmiMsg}</a> Keep in mind that fat and muscles do serve as reservoirs for vitamin D.
          </p>
        </div>

        <div class="p-2">
          <p class="text-sm">According to the <a target="_blank" class="text-blue-800" href="https://ods.od.nih.gov/factsheets/VitaminD-Consumer/">NIH</a>, 600 IUs is recommended per day for adults ages 19-70. </p>
          <br>
          <p class="text-sm">An RDA of 600 IU’s may not be sufficient. Here is one explanation by <a class="text-blue-800" target="_blank" href="https://www.youtube.com/watch?v=NFxQJmvgXOQ">Dr. Eric Berg</a> who proposes 8,000 to 10,000 IU’s per day. <a class="text-blue-800" target="_blank" href="https://www.youtube.com/watch?v=-FKS7C5BcbE">Dr Ken D. Berry</a> also proposes 2,000 to 10,000 IU’s for the average adult. Most importantly, ask your doctor what they think based on your bloodwork results.</p>
          <br>
          <p class="text-sm underline font-bold mt-3">Symptoms of Deficiency...</p>
          <ul class="list-decimal text-sm">
            <li>Poor Bone Development (rickets, osteoporosis, etc...)</li>
            <li>Fatigue</li>
            <li>Depression</li>
            <li>Cancer (prostate, breast, colorectal, etc...)</li>
            <li>Muscle Weakness</li>
          </ul>
          <br>
          <p class="text-sm">Should you find yourself in a location where sunlight is not enough to meet your daily needs. It is best to rely on either a UV lamp or supplements.</p>
          <br>
        </div>

      </div>

    </div>

  </div>
</div>
{/if}


<style>
  .skintype1 {
    background-color: #FFDFC4;
  }
  .skintype2 {
    background-color: #F0D5BE;
  }
  .skintype3 {
    background-color: #E1B899;
  }
  .skintype4 {
    background-color: #C68642;
  }
  .skintype5 {
    background-color: #8D5524;
  }
  .skintype6 {
    background-color: #5C3836;
  }
</style>