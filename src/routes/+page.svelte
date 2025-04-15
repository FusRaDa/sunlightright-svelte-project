<script lang="ts">
  import Sun from "$lib/components/Sun.svelte";
  import { onMount } from 'svelte'
  import img from '$lib/assets/sunset-7324598_1280.jpg'

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
    if (data !== null) {
      setBackground(data)
    }

    const lsLatitude = localStorage.getItem('latitude')
    const lsLongitude = localStorage.getItem('longitude')
    
    if (currentDate !== new Date().getDate() || Math.trunc(Number(latitude)) !== Math.trunc(Number(lsLatitude)) || Math.trunc(Number(longitude)) !== Math.trunc(Number(lsLongitude))) {
      console.log("api fetch")
      const response = await fetch(`/weather?lat=${latitude}&lon=${longitude}&tz=${timezone}`)
      data = await response.json()
      setBackground(data)
      let date = new Date(data.hourly.time[0].split("T")[0])
      currentDate = date.getUTCDate()

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
      getLocation()
  }

  onMount(() => {
    // Client-side only code here
    getLocation()
  });

  $inspect(data)
  //$inspect(background)
  //$inspect(currentDate)
</script>


<div class="h-screen {background} justify-items-center pt-10">

  <div class="container bg-gray-500 p-3 mb-5">
    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
    <button class="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded" onclick={getLocation}>Get Weather Data</button>
  </div>

  {#if latitude && longitude && data}
  <Sun {latitude} {longitude} {data}/>
  {:else}
  <div>Failed to get data, button - try again</div>
  {/if}
  
</div>


<style lang="postcss">
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-amber-300);
  }
</style>