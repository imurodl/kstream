export interface SubtitleTrack {
  src: string
  srclang: string
  label: string
  default?: boolean
}

// Free public HLS test streams
const HLS_STREAMS = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8',
  'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
]

// Deterministic stream selection per episode
export function getStreamForEpisode(_showId: number, episodeId: number): string {
  const index = Math.abs(episodeId) % HLS_STREAMS.length
  return HLS_STREAMS[index]
}

// Default subtitle tracks
export function getSubtitleTracks(): SubtitleTrack[] {
  return [
    { src: '/subs/sample-en.vtt', srclang: 'en', label: 'English', default: true },
    { src: '/subs/sample-ko.vtt', srclang: 'ko', label: '한국어' },
  ]
}
