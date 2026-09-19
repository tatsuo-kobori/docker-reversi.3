import { EntryUserInfo } from "./EntryUserInfo";

export interface RoomInfo {
	roomId: string,
	name: string,
	disabled: boolean,
	entryUsers: EntryUserInfo[],
}
