import { PropsWithChildren } from "react";

interface AudioPlayerProps {
  src: string;
}

export const AudioPlayer = (props: PropsWithChildren<AudioPlayerProps>) => {
  return <audio src={props.src} controls />;
};
