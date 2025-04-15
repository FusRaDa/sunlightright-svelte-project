<script lang="ts">
  import Chart from 'chart.js/auto';
  import { onMount } from 'svelte';

  // factors
  let skin: number | null = $state(null)
  let age: number | null = $state(null)
  let height: number | null = $state(null) //cm
  let weight: number | null = $state(null) //kg
  let bsa: number | null = $derived.by(() => {
    if (height && weight) {
      return 0.007184 * (height**0.725) * (weight**0.425) //du bois formula
    }
    return null
  })
  let clothing: number | null = $state(null)
  let unilateral: boolean = $state(true)

  let {
    latitude,
    longitude,
    data,
  }: {
    latitude: number;
    longitude: number;
    data: any
  } = $props();

  let chartData = $derived.by(() => {
    
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

  onMount(() => {
    const ctx: any = document.getElementById('lineChart');
    const today = new Date().toLocaleDateString()

    new Chart(ctx, {
      type: 'line',
      data: chartData,
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
            text: today + ' UV Index',
          }
        },
      }
    });
  })

  // border-5 border-blue-500 
</script>

<div class="container bg-white">
  <div class="grid sm:grid-cols-3 gap-2">

    <div class="flex items-center">
      <iframe title="google-maps-embed-api" width="100%" height="300px" style="border:0" loading="lazy" allowfullscreen
        src="https://www.google.com/maps/embed/v1/place?q={latitude}%2C%20{longitude}&key={import.meta.env.VITE_GOOGLE_MAPS_API}">
      </iframe>
    </div>

    <div class="flex items-center">
      <canvas id="lineChart"></canvas>
    </div>

    <div class="p-2">

      <div class="grid grid-rows-3 gap-4">
        <div>
          <p class="text-sm text-center underline font-bold">Skin Type (Fitzpatrick Scale)</p>
          <div class="grid grid-cols-6 gap-1">
            <button class="skintype1 py-2 px-4 cursor-pointer hover:border-blue-500 border-2">I</button>
            <button class="skintype2 py-2 px-4 cursor-pointer hover:border-blue-500 border-2">II</button>
            <button class="skintype3 py-2 px-4 cursor-pointer hover:border-blue-500 border-2">III</button>
            <button class="skintype4 py-2 px-4 cursor-pointer hover:border-blue-500 border-2">IV</button>
            <button class="skintype5 py-2 px-4 cursor-pointer hover:border-blue-500 border-2">V</button>
            <button class="skintype6 py-2 px-4 cursor-pointer hover:border-blue-500 border-2">VI</button>
          </div>
        </div>

        <div>
          <div>
            <p class="text-sm text-center underline font-bold">Age</p>
            <div class="grid grid-cols-4 gap-1">
              <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">0-21</button>
              <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">22-40</button>
              <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">41-59</button>
              <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">60+</button>
            </div>
          </div>
        </div>

        <div>
          <p class="text-sm text-center underline font-bold">Body Surface Area (Du Bois Formula)</p>
          <div class="grid grid-cols-3 gap-1">
            <input type="text" id="height" name="height" placeholder="height (cm)">
            <input type="text" id="weight" name="weight" placeholder="height (kg)">
            <input type="text" id="bsa" name="bsa" disabled value="BSA m²">
          </div>
        </div>

        <div>
          <div>
            <p class="text-sm text-center underline font-bold">Exposure</p>
            <div class="grid grid-cols-5 gap-1">
              <button class="text-xs bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Hands & Face (12%)</button>
              <button class="text-xs bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Short Sleeves (26%)</button>
              <button class="text-xs bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Shorts & T-shirt (46%)</button>
              <button class="text-xs bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Only Shorts (72%)</button>
              <button class="text-xs bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded cursor-pointer">Naked (95%)</button>
            </div>
          </div>
        </div>
      </div>

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
    background-color: 	#E1B899;
  }
  .skintype4 {
    background-color: 	#C68642;
  }
  .skintype5 {
    background-color: #8D5524;
  }
  .skintype6 {
    background-color: 	#5C3836;
  }
</style>