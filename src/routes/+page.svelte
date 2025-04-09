<script lang="ts">
  import Sun from "$lib/components/Sun.svelte";
  import img from '$lib/assets/sunset-7324598_1280.jpg'

  let latitude: number | null = $state(null)
  let longitude: number | null = $state(null)
  let timezone: string | null = $state(null)
  let background: string = $state('--color-slate-950')

  let data: any = $derived.by(() => {
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
  }

  function success(position: any) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  }

  function error(err: any) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  async function getWeather() {
    const response = await fetch(`/weather?lat=${latitude}&lon=${longitude}&tz=${timezone}`)
    data = await response.json()
    setBackground(data)
  }

  function setBackground(data: any) {
    let hour = new Date().getHours()
    let index = Math.round(data.hourly.uvIndex[hour])
    switch(true) {
      case index === 1 || index === 2:
        background = ""
        break
      case index === 3 || index === 4:
        background = ""
        break
      case index === 3 || index === 4: 
        background = ""
        break
      case index === 3 || index === 4:
        background = ""
        break
      case index === 3 || index === 4:
        background = ""
        break
      case index > 10:
        background = ""
    }
  }

  //getLocation()
  $inspect(data)
  $inspect(background)
  // let data = $props();
  // $inspect(data)
</script>

<div class="@container px-6">
  <div class="flex flex-col @md:flex-row bg-gray-500">
    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
  
    <h1 class="text-3xl font-bold underline">
      {#if latitude && longitude && timezone}
        Latitude: {latitude}
        Longitude: {longitude}
        Timezone: {timezone}
        <Sun {latitude} {longitude} {timezone}/>
      {/if}
    </h1>
  
    {#if data}
      <h4>{data}</h4>
    {/if}
  
    <button class="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded" onclick={getLocation}>Get Weather Data</button>
  </div>
</div>

<div class="@container px-6">
  <div class="flex flex-col @md:flex-row bg-blue-500">
    dfdf
  </div>
</div>


<style lang="postcss">
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>