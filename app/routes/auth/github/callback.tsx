// import { AuthorizationError } from "remix-auth";
import { LoaderFunction } from "@remix-run/server-runtime";
import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  try {
    return await authenticator.authenticate("github", request, {
      successRedirect: "/",
      throwOnError: true,
    });
  } catch (error) {
    return error;
    // // Because redirects work by throwing a Response, you need to check if the
    // // caught error is a response and return it or throw it again
    // if (error instanceof Response) return error;
    // if (error instanceof AuthorizationError) {
    //   // here the error is related to the authentication process
    // }
    // // here the error is a generic error that another reason may throw
  }
};
