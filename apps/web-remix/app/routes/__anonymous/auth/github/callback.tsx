// import { AuthorizationError } from "remix-auth";
import { LoaderFunction, redirect } from "@remix-run/server-runtime";
import { authenticator } from "../../../../services/auth.server";
import { commitSession, getSession } from "../../../../services/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.authenticate("github", request, {
    failureRedirect: "/",
  });

  // manually get the session
  const session = await getSession(request.headers.get("cookie"));
  // and store the user data
  session.set(authenticator.sessionKey, user);

  // commit the session
  const headers = new Headers({ "Set-Cookie": await commitSession(session) });

  // redirect the user
  return redirect("/", { headers });
};
