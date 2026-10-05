import { Composition } from "remotion";
import { WinterArcAd } from "./WinterArcAd";

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="WinterArcAdLandscape"
        component={WinterArcAd}
        durationInFrames={60 * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ format: "landscape" as const }}
      />
      <Composition
        id="WinterArcAdVertical"
        component={WinterArcAd}
        durationInFrames={60 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ format: "vertical" as const }}
      />
    </>
  );
}