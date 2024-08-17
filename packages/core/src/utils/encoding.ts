import b4a from "b4a";

export const toHex = (buffer: Buffer) => b4a.toString(buffer, "hex");

export const fromHex = (hexString: string) => b4a.from(hexString, "hex");
