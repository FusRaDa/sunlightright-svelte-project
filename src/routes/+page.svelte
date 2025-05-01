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
        <p class="text-sm">Sunlight exposure, specifically vitamin D, offers benefits to both your physical and mental well-being. How the body uses vitamin D is a complicated process and often involves several metabolic processes. I’ve linked some videos and articles for you to learn more about.</p>
        <br>
   
        <ul class="list-decimal text-sm ms-4">
          <li><a target="_blank" class="text-blue-800 hover:text-blue-600" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2669834/">Calcium and Vitamin D: Skeletal and Extraskeletal Health</a></li>
          <li><a target="_blank" class="text-blue-800 hover:text-blue-600" href="https://www.youtube.com/watch?v=D_UJaEZe9gg">Exposing the links between Calcium, Vitamin K2, and Plaque Buildup in Blood Vessels</a></li>
          <li><a target="_blank" class="text-blue-800 hover:text-blue-600" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7926526/">The Medical Benefits of Vitamin K2 on Calcium-Related Disorders</a></li>
          <li><a target="_blank" class="text-blue-800 hover:text-blue-600" href="https://www.degruyterbrill.com/document/doi/10.7556/jaoa.2018.037/html">Role of Magnesium in Vitamin D Activation and Function</a></li>
          <li><a target="_blank" class="text-blue-800 hover:text-blue-600" href="https://www.sciencedirect.com/science/article/pii/S0014480023000175#:~:text=Vit%2DD%20regulates%20the%20differentiation,et%20al.%2C%202019">A review of the critical role of vitamin D axis on the immune system</a></li>
          <li><a target="_blank" class="text-blue-800 hover:text-blue-600" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7281985/">Vitamin D’s Effect on Immune Function</a></li>
          <li><a target="_blank" class="text-blue-800 hover:text-blue-600" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6821324/">Vitamin D supplementation and total cancer incidence and mortality: a meta-analysis of randomized controlled trials</a></li>
          <li><a target="_blank" class="text-blue-800 hover:text-blue-600" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5440113/">Vitamin D and Chronic Diseases</a></li>
        </ul>

      </div>
  
      <div class="p-2">
        <p class="text-sm text-center underline font-bold">The Project Developer</p>
        <p class="text-sm">Hello and thank you for visiting my web application! My name is Matthew Rada and this is my first programming biology-related project. I am currently pursuing a MS in bioinformatics and am looking to graduate by the end of 2026.</p>
        <br>
        <p class="text-sm">I made this website as a means of connecting the relations between sunlight and vitamin D production. By no means do I consider myself an expert in this field but rather a student doing my best to interpret the information I have found from scientific sources such as PubMed and the NIH.</p>
        <br>
        <p class="text-sm">Beyond that, I will continue to build my portfolio as I am looking for job opportunities related to software engineering and data science. If you come across a bug, have questions, or want to reach out you can email me at <a class="text-blue-800 hover:text-blue-600" href="mailto:matthewr7.christopher@gmail.com">matthewr7.christopher@gmail.com</a> or message me on <a target="_blank" class="text-blue-800 hover:text-blue-600" href="https://www.linkedin.com/in/christopher-rada-a657a51b6/">LinkedIn</a>.</p>
      </div>
      
    </div>
  </div>

  <div class="mt-3">
    <a href="/" type="button" class="text-center font-bold text-blue-800 underline hover:text-blue-400" onclick={resetData}>Data Not Loading?</a>
  </div>


</div>


<style lang="postcss">
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-amber-300);
  }
</style>