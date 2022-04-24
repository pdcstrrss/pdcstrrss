import { LoaderFunction, redirect, ActionFunction } from "@remix-run/server-runtime";
import { authenticator } from "../../../services/auth.server";

export let loader: LoaderFunction = () => redirect("/login");

export let action: ActionFunction = ({ request }) => {
  return authenticator.authenticate("github", request);
};
