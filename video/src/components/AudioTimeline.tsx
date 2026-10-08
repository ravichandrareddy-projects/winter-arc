import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import { Language } from "../config/languages";
import { VOICE_START_FRAME } from "../config/timeline";

interface AudioTimelineProps {
  frame: number;
  language?: Language;
  enableMusic?: boolean;
  enableVoice?: boolean;
  musicVolume?: number;
}

export const AudioTimeline: React.FC<AudioTimelineProps> = ({
  frame,
  language = "en",
  enableMusic = true,
  enableVoice = true,
  musicVolume = 0.20,
}) => {
  // Voice file mapping based on language prop
  const voiceFileMap: Record<Language, string> = {
    en: "audio/voice-en.wav",
    hi: "audio/voice-hi.wav",
    te: "audio/voice-te.wav",
  };

  const voiceSrc = voiceFileMap[language];

  // Dynamic audio ducking for music (speech is king, subtle warm bed):
  const duckedMusicVolume = interpolate(
    frame,
    [0, 15, 825, 975, 1065, 1170],
    [
      musicVolume * 0.7,
      musicVolume * 0.6,
      musicVolume * 0.6,
      musicVolume * 1.0, // Swell at brand climax
      musicVolume * 0.8,
      0, // Smooth fadeout at very end
    ],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <>
      {/* Background Synth Music Bed (Underneath the voice) */}
      {enableMusic && (
        <Audio
          src={staticFile("audio/music.wav")}
          volume={duckedMusicVolume}
        />
      )}

      {/* Primary Voiceover Track synced with 2.5s opening breath */}
      {enableVoice && (
        <Sequence from={VOICE_START_FRAME} name="Voiceover Track">
          <Audio
            src={staticFile(voiceSrc)}
            volume={1.0}
          />
        </Sequence>
      )}
    </>
  );
};
