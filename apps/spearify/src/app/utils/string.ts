export function trimAddress(address?: string, chars = 4) {
	if (!address) return "";
	if (address.length <= chars * 2) {
		return address;
	}
	const start = address.slice(0, chars);
	const end = address.slice(-chars);
	return `${start}...${end}`;
}
