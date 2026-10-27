class RingtonePlayer {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
  }

  getAudio() {
    if (!this.audio && typeof window !== "undefined") {
      this.audio = new Audio("/sounds/Ringtone.mp3");
      this.audio.loop = true;
      this.audio.preload = "auto";
    }
    return this.audio;
  }

  play() {
    const audio = this.getAudio();
    if (!audio) return;

    try {
      audio.currentTime = 0;
      audio.loop = true;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
          })
          .catch((err) => {
            console.warn("Ringtone playback prevented by browser autoplay policy:", err);
          });
      }
    } catch (err) {
      console.warn("Failed to play ringtone:", err);
    }
  }

  stop() {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch (err) {
        console.warn("Failed to stop ringtone:", err);
      }
      this.isPlaying = false;
    }
  }
}

export const ringtonePlayer = new RingtonePlayer();
