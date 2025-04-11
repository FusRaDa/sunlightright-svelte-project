<script lang="ts">
  let {
    latitude,
    longitude,
    timezone,
    data,
  }: {
    latitude: number;
    longitude: number;
    timezone: string;
    data: any
  } = $props();
</script>

<div class="container">

  <iframe title="google-maps-embed-api" width="100%" height="300px" style="border:0" loading="lazy" allowfullscreen
    src="https://www.google.com/maps/embed/v1/place?q={latitude}%2C%20{longitude}&key=AIzaSyByavjM3Zi37I16a0z9BLo6KwgbRAKqaZA">
  </iframe>

</div>