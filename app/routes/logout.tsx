import { CustomLoader } from "~/classes/utils/loader";
import { UserContext } from "~/middleware/context";
import { Auth } from "~/classes/services/auth";
import { redirect } from "react-router";

export const loader = CustomLoader.withTx(async ({ context, request }, tx) => {

    const auth = new Auth(tx);
    const cookies = auth.getCookies(request)
    const id = context.get(UserContext).id
    if (!id) {
        return redirect("/login");
    }

    await tx.refreshToken.deleteMany({
        where: {
            userId: id,
            token: cookies.refresh
        }
    });
    const headers = auth.clearCookies(new Headers());
    return redirect("/login", { headers });
});

export default function Logout() {
    return null;
}