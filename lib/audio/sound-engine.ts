let audioContext: AudioContext | null = null
const bufferCache = new Map<string, AudioBuffer>()
const bufferPromiseCache = new Map<string, Promise<AudioBuffer>>()

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

export async function decodeAudioData(dataUri: string): Promise<AudioBuffer> {
  const cached = bufferCache.get(dataUri)
  if (cached) return cached

  const pending = bufferPromiseCache.get(dataUri)
  if (pending) return pending

  const loadPromise = (async () => {
    const ctx = getAudioContext()
    const base64 = dataUri.split(",")[1]
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0))
    bufferCache.set(dataUri, audioBuffer)
    bufferPromiseCache.delete(dataUri)

    return audioBuffer
  })()

  bufferPromiseCache.set(dataUri, loadPromise)

  return loadPromise
}

interface PlaySoundOptions {
  volume?: number
  playbackRate?: number
  onEnd?: () => void
}

interface SoundPlayback {
  stop: () => void
}

export async function playSound(
  dataUri: string,
  options: PlaySoundOptions = {}
): Promise<SoundPlayback> {
  const { volume = 1, playbackRate = 1, onEnd } = options
  const ctx = getAudioContext()
  if (ctx.state === "suspended") {
    await ctx.resume()
  }

  const buffer = await decodeAudioData(dataUri)
  const source = ctx.createBufferSource()
  const gain = ctx.createGain()

  source.buffer = buffer
  source.playbackRate.value = playbackRate
  gain.gain.value = volume

  source.connect(gain)
  gain.connect(ctx.destination)

  source.onended = () => {
    onEnd?.()
  }

  source.start(0)

  return {
    stop: () => {
      try {
        source.stop()
      } catch {
        // No-op if already stopped.
      }
    },
  }
}
