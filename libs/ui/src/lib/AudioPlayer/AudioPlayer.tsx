// import { useEffect, useState } from "react";
// import { useInView } from "react-intersection-observer";

// const [audioSource, setAudioSource] = useState<string | undefined>(undefined);
// const { ref, inView } = useInView({
//   threshold: 0,
//   triggerOnce: true,
// });

// <div ref={ref} style={{ height: "54px" }}>
//   {inView && <audio src={audioSource} controls />}
// </div>;

// useEffect(() => {
//   if (inView) {
//     const audioApiUrl = new URL(document.location + "audio");
//     audioApiUrl.searchParams.append("url", url);
//     const fetchAudioSource = async () => {
//       const data = await fetch(audioApiUrl.toString()).then((res) => res.json());
//       setAudioSource(data);
//     };
//     fetchAudioSource().catch(console.error);
//   }
// }, [inView]);
