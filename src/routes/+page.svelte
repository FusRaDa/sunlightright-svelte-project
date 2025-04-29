<script lang="ts">
  import Sun from "$lib/components/Sun.svelte";
  import { onMount } from 'svelte'
  import img from '$lib/assets/sunlightright.png'

  let latitude: number | null = $state(null)
  let longitude: number | null = $state(null)
  let timezone: string | null = $state(null)
  let currentDate: number | null = $state(null)
  let data: any = $state(null)
  let background: string = $state('bg-neutral-400/100')

  // if lat, long, and tz are present call API unless localstorage already exists
  $effect(() => {
    if (latitude && longitude && timezone) {
      getWeather()
    }

    if (data) {
      setBackground(data)
    }
  })

  function getLocation(): void {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    if (localStorage.getItem('data') !== null || localStorage.getItem('data') == undefined) {
      const lsData: any = localStorage.getItem('data')
      data = JSON.parse(lsData)
    } else {
      localStorage.removeItem('data')
    }
    
    if (localStorage.getItem('currentDate') !== null || localStorage.getItem('currentDate') !== undefined) {
      const lsCurrentDate = localStorage.getItem('currentDate')
      currentDate = Number(lsCurrentDate)
    } else {
      localStorage.removeItem('currentDate')
    }
  }

  function success(position: any) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  }

  function error(err: any) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  async function getWeather() {
    const lsLatitude = localStorage.getItem('latitude')
    const lsLongitude = localStorage.getItem('longitude')
    
    if (currentDate !== new Date().getHours() || Math.trunc(Number(latitude)) !== Math.trunc(Number(lsLatitude)) || Math.trunc(Number(longitude)) !== Math.trunc(Number(lsLongitude))) {
      console.log("api fetch")
      const response = await fetch(`/weather?lat=${latitude}&lon=${longitude}&tz=${timezone}`)
      data = await response.json()
      currentDate = new Date().getHours()

      localStorage.setItem('data', JSON.stringify(data))
      localStorage.setItem('currentDate', String(currentDate))
      localStorage.setItem('latitude', String(latitude))
      localStorage.setItem('longitude', String(longitude))
    }
  }

  function setBackground(data: any) {
    let hour = new Date().getHours()
    let index = Math.round(data.hourly.uvIndex[hour])
    switch(true) {
      case index === 1:
        background = 'bg-neutral-400/100'
        break
      case index === 2:
        background = 'bg-neutral-400/90'
        break
      case index === 3: 
        background = 'bg-neutral-400/80'
        break
      case index === 4:
        background = 'bg-neutral-400/70'
        break
      case index === 5:
        background = 'bg-neutral-400/60'
        break
      case index === 6:
        background = 'bg-neutral-400/50'
        break
      case index === 7:
        background = 'bg-neutral-400/40'
        break
      case index === 8:
        background = 'bg-neutral-400/30'
        break
      case index === 9:
        background = 'bg-neutral-400/20'
        break
      case index > 10:
        background = 'bg-neutral-400/10'
      default:
        background = 'bg-neutral-400/100'
    }
  }

  function resetData() {
    localStorage.removeItem('data')
    localStorage.removeItem('currentDate')
    localStorage.removeItem('latitude')
    localStorage.removeItem('longitude')
    location.reload()
  }

  onMount(() => {
    // Client-side only code here
    getLocation()
  });
</script>


<div class="sm:h-full {background} justify-items-center pt-10 pb-10">

  <img class="mx-auto" alt="Sunlight Right Logo" width="100" height="100" src={img}/>
  <h1 class="text-center text-2xl font-bold text-yellow-800 underline">The Sunlight Is Your Right!</h1>
  <p class="text-center text-yellow-800 mb-3">Every cell in your body needs vitamin D in order to function optimally. Make sure you are getting enough!</p>

  {#if latitude && longitude && data}
  <Sun {latitude} {longitude} {data}/>
  {/if}

  <div class="container bg-white">
    <div class="grid sm:grid-cols-2 gap-2">
      <div class="p-2">
        <p class="text-sm text-center underline font-bold">Why Is Sunlight Vital?</p>
      </div>
  
      <div class="p-2">
        <p class="text-sm text-center underline font-bold">Christopher M. Rada</p>
      </div>
      
    </div>
  </div>

  <div class="justify-items-center">
    <p class="text-center font-bold mt-3">Data Not Loading?</p>
    <button class="text-center mb-3 mx-auto bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded" onclick={resetData}>Reset Data</button>
  </div>

</div>


<style lang="postcss">
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-amber-300);
  }
</style>