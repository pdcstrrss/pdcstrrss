// import { AuthorizationError } from "remix-auth";
import { LoaderFunction, redirect } from "@remix-run/server-runtime";
import { authenticator } from "../../../services/auth.server";
import { commitSession, getSession } from "../../../services/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.authenticate("github", request, {
    failureRedirect: "/",
  });

  // manually get the session
  let session = await getSession(request.headers.get("cookie"));
  // and store the user data
  session.set(authenticator.sessionKey, user);

  // commit the session
  let headers = new Headers({ "Set-Cookie": await commitSession(session) });

  // redirect the user
  return redirect("/", { headers });
};
