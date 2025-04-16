<script lang="ts">
  import Chart from 'chart.js/auto';
  import { onMount } from 'svelte';
  
  // Vitamin d rates
  const VITAMIN_D_RATES = {
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
    var ctx: any = document.getElementById('lineChart');
    var today = new Date().toLocaleDateString()

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
            text: today,
          }
        },
      }
    });
  }

  function buildRateChart() {
   
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

  onMount(() => {
    //build charts
    buildUVIChart()

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

<div class="container bg-white">
  <div class="grid sm:grid-cols-3 gap-2">
    <div class="p-2">
      <p class="text-sm text-center underline font-bold">Rate of Vitamin D Production (IU/W&#8901;min)</p>
      <div class="flex items-center">
        <canvas id="barChart"></canvas>
      </div>
    </div>

    <div class="p-2">
      <p class="text-sm text-center underline font-bold">Total Vitamin D Produced Per Hour</p>
    </div>

    <div class="p-2">
      <p class="text-sm text-center underline font-bold">Set Goal & Estimate Actions</p>
    </div>

  </div>
</div>


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