<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import videojs from 'video.js'
import type Player from 'video.js/dist/types/player'
import type { SubtitleTrack } from '../data/streams'

const props = withDefaults(defineProps<{
  src: string
  poster?: string
  subtitles?: SubtitleTrack[]
  startTime?: number
}>(), {
  poster: '',
  subtitles: () => [],
  startTime: 0,
})

const emit = defineEmits<{
  timeupdate: [currentTime: number, duration: number]
  ended: []
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
let player: Player | null = null

function initPlayer() {
  if (!videoRef.value) return

  player = videojs(videoRef.value, {
    controls: true,
    autoplay: false,
    preload: 'auto',
    fluid: false,
    responsive: false,
    playbackRates: [0.5, 1, 1.25, 1.5, 2],
    html5: {
      vhs: {
        overrideNative: true,
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false,
    },
    controlBar: {
      children: [
        'playToggle',
        'volumePanel',
        'currentTimeDisplay',
        'timeDivider',
        'durationDisplay',
        'progressControl',
        'playbackRateMenuButton',
        'subtitlesButton',
        'qualitySelector',
        'fullscreenToggle',
      ],
    },
  })

  player.src({ src: props.src, type: 'application/x-mpegURL' })

  if (props.poster) {
    player.poster(props.poster)
  }

  // Add subtitle tracks
  for (const sub of props.subtitles) {
    player.addRemoteTextTrack({
      kind: 'subtitles',
      src: sub.src,
      srclang: sub.srclang,
      label: sub.label,
      default: sub.default || false,
    }, false)
  }

  // Resume from saved position
  if (props.startTime > 0) {
    player.one('loadedmetadata', () => {
      player?.currentTime(props.startTime)
    })
  }

  // Emit time updates (throttled)
  let lastEmit = 0
  player.on('timeupdate', () => {
    const now = Date.now()
    if (now - lastEmit < 5000) return // emit every 5s
    lastEmit = now
    const currentTime = player?.currentTime() || 0
    const duration = player?.duration() || 0
    if (duration > 0) {
      emit('timeupdate', currentTime, duration)
    }
  })

  player.on('ended', () => emit('ended'))

  // Keyboard shortcuts
  const handleKeydown = (e: KeyboardEvent) => {
    if (!player || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

    switch (e.key) {
      case ' ':
        e.preventDefault()
        player.paused() ? player.play() : player.pause()
        break
      case 'ArrowLeft':
        e.preventDefault()
        player.currentTime(Math.max(0, (player.currentTime() || 0) - 10))
        break
      case 'ArrowRight':
        e.preventDefault()
        player.currentTime(Math.min(player.duration() || 0, (player.currentTime() || 0) + 10))
        break
      case 'f':
      case 'F':
        e.preventDefault()
        player.isFullscreen() ? player.exitFullscreen() : player.requestFullscreen()
        break
      case 'm':
      case 'M':
        e.preventDefault()
        player.muted(!player.muted())
        break
    }
  }

  document.addEventListener('keydown', handleKeydown)
  player.on('dispose', () => document.removeEventListener('keydown', handleKeydown))
}

// Watch for source changes
watch(() => props.src, (newSrc) => {
  if (player && newSrc) {
    player.src({ src: newSrc, type: 'application/x-mpegURL' })
  }
})

onMounted(() => initPlayer())

onBeforeUnmount(() => {
  if (player) {
    player.dispose()
    player = null
  }
})
</script>

<template>
  <div class="video-player-wrapper">
    <video
      ref="videoRef"
      class="video-js vjs-big-play-centered vjs-theme-kstream"
    />
  </div>
</template>

<style>
.video-player-wrapper {
  width: 100%;
  background: #000;
  aspect-ratio: 16 / 9;
  max-height: 70vh;
}
.video-player-wrapper .video-js {
  width: 100%;
  height: 100%;
}

/* Custom dark theme for Video.js */
.vjs-theme-kstream .vjs-control-bar {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
  height: 4em;
}

.vjs-theme-kstream .vjs-play-progress {
  background: #a855f7;
}

.vjs-theme-kstream .vjs-load-progress div {
  background: rgba(255, 255, 255, 0.2);
}

.vjs-theme-kstream .vjs-slider:focus {
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.5);
}

.vjs-theme-kstream .vjs-big-play-button {
  background: rgba(168, 85, 247, 0.8);
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  line-height: 80px;
  font-size: 36px;
  transition: background 0.2s;
}

.vjs-theme-kstream .vjs-big-play-button:hover {
  background: rgba(168, 85, 247, 1);
}

.vjs-theme-kstream .vjs-volume-level {
  background: #a855f7;
}

.vjs-theme-kstream .vjs-time-tooltip {
  background: #a855f7;
}

.vjs-theme-kstream .vjs-menu-button-popup .vjs-menu .vjs-menu-content {
  background: rgba(15, 15, 15, 0.95);
  border-radius: 8px;
  padding: 4px 0;
}

.vjs-theme-kstream .vjs-menu li.vjs-selected {
  background: #a855f7;
  color: #fff;
}

.vjs-theme-kstream .vjs-menu li:hover {
  background: rgba(168, 85, 247, 0.3);
}
</style>
