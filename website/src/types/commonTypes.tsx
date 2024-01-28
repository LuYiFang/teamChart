import { AxiosRequestConfig } from "axios";
import { PropsWithChildren } from "react";

export type User = {
  id: string;
  name: string;
  group: string;
  status: OnlineStatus;
};

export type findUser = string | undefined | null;

export type AuthValue = {
  user: string;
  login: (data: string) => void;
  logout: () => void;
};

export interface FetchApiType {
  url: string;
  method: string;
  data?: Object;
  config?: AxiosRequestConfig;
}

export interface UserOpenInfo {
  name: string;
}

export interface UserOpenInfoProps {
  userOpenInfo: UserOpenInfo;
  setUserOpenInfo: (userInfo: UserOpenInfo) => void;
}

export interface Message {
  username: string;
  message: string;
  groupId: string;
  createAt: Date;
}

export interface MessageGroup {
  [groupId: string]: Message[];
}

export type LocalStorageValue = string | UserOpenInfo | null;

export interface VerticalTabsComponentProps extends PropsWithChildren {
  tabIndex?: number;
  onChange?: (tabIndex: number) => void;
}

export interface SidbarComponentProps extends PropsWithChildren {
  anchor?: "bottom" | "left" | "right" | "top" | undefined;
  isOpen: boolean;
  disabledMessage?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface SidbarTabComponentProps
  extends SidbarComponentProps,
    VerticalTabsComponentProps {
  userOpenInfo: UserOpenInfo;
  currentGroup: string;
  sendMessage: (message: string) => void;
  messageGroup: MessageGroup;
  userGroup: Array<User>;
  wishList: Array<Wish>;
}

export interface Wish {
  username: string;
  content: string;
  voteCount: number;
  createAt: Date;
}

export type WishCardProps = React.PropsWithChildren<{
  currentUser: string;
  voteCount: number;
  name: string;
  content: string;
  userMap: UserMap;
}>;

export enum OnlineStatus {
  Online = "online",
  Offline = "offline",
}

export type RippleAvatarProps = {
  active?: string | undefined;
  iscurrentuser?: string;
  status?: OnlineStatus | undefined;
};

export type UserMap = {
  [name: string]: User;
};
