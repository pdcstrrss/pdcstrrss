import { LoaderFunction } from "@remix-run/server-runtime";
import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = ({ request }) => {
  return authenticator.authenticate("github", request, {
    successRedirect: "/",
  });
};
