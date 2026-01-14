export type SetCookieOptions = {
    name: string;
    value: string;
    days?: number;
    path?: string;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
};

export const getCookie = (cookieName: string): string | null => {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split("; ");
    const found = cookies.find(row => row.startsWith(`${cookieName}=`));

    return found ? decodeURIComponent(found.split("=")[1]) : null;
};

export const setCookie = ({
    name,
    value,
    days = 7,
    path = "/",
    sameSite = "Lax",
    secure = false,
}: SetCookieOptions): void => {
    if (typeof document === "undefined") return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie = [
        `${name}=${encodeURIComponent(value)}`,
        `expires=${expires.toUTCString()}`,
        `path=${path}`,
        `SameSite=${sameSite}`,
        secure ? "Secure" : ""
    ].join("; ");
};
