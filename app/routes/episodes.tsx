import { User } from "@prisma/client";
import { Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunction, redirect } from "@remix-run/server-runtime";
import { AppHeader } from "~/components/app/AppHeader/AppHeader";
import { getAudioSource } from "~/services/audio.service";
import { getUser } from "~/services/auth.server";

interface EpisodesLoaderResponse {
  user: User;
  audioSource?: string;
}

export const loader: LoaderFunction = async ({ request }): Promise<EpisodesLoaderResponse | Response> => {
  try {
    const user = await getUser({ request });
    const audioSource = await getAudioSource({ request });
    if (!user) {
      return redirect("/");
    }
    return { user, audioSource };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default function Episodes() {
  const { user, audioSource } = useLoaderData<EpisodesLoaderResponse>();
  return (
    <>
      <AppHeader user={user} />
      <main data-page-index data-page-index-with-audio-player={audioSource}>
        <Outlet />
        {audioSource && (
          <div data-audio-player>
            <audio src={audioSource} controls />
          </div>
        )}
      </main>
    </>
  );
}
