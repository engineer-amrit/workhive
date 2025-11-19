import { redirect } from "react-router";
import { loaderWithoutTx } from "~/utils/loader";
export const loader = loaderWithoutTx(async () => {
    const headers = new Headers();

    headers.append(
        "Set-Cookie",
        `access=; HttpOnly; Path=/; Max-Age=0`
    );
    headers.append(
        "Set-Cookie",
        `refresh=; HttpOnly; Path=/; Max-Age=0`
    );
    return redirect("/login", { headers });
});

export default function Logout() {
    return null;
}