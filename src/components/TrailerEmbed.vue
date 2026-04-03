<script setup lang="ts">
defineProps<{ youtubeKey: string }>()
</script>

<template>
  <div class="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
    <iframe
      :src="`https://www.youtube.com/embed/${youtubeKey}?rel=0&modestbranding=1`"
      class="absolute inset-0 w-full h-full"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>
