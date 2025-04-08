<script lang="ts">
  import Sun from "$lib/components/Sun.svelte";

  let latitude: number | null = $state(null)
  let longitude: number | null = $state(null)
  let timezone: string | null = $state(null)
  let data: any = $state(null)

  $inspect(data)

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
  }

  $effect(() => {
    // add other filters to reduce API calls
    if (latitude && longitude && timezone) {
      getWeather()
    }
  })

  // let data = $props();
  // $inspect(data)
</script>

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

<style lang="postcss">
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>