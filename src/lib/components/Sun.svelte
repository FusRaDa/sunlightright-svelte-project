<script lang="ts">
  import Chart from 'chart.js/auto';
  import { onMount } from 'svelte';

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
</script>

<div class="container bg-white">
  <div class="grid sm:grid-cols-3 gap-4">

    <div>
      <iframe title="google-maps-embed-api" width="100%" height="300px" style="border:0" loading="lazy" allowfullscreen
        src="https://www.google.com/maps/embed/v1/place?q={latitude}%2C%20{longitude}&key=AIzaSyByavjM3Zi37I16a0z9BLo6KwgbRAKqaZA">
      </iframe>
    </div>

    <div>
      <canvas id="lineChart"></canvas>
    </div>

    <div>
      polar area chart here
    </div>

  </div>
</div>