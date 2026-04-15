export type ApiUser = {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string | null;
};

export type SignInRequest = {
  login: string;
  password: string;
};

export type SignUpRequest = {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
};

export type SignUpResponse = {
  id: number;
};

export type UserProfileRequest = {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type UserSearchRequest = {
  login: string;
};

export type ChatLastMessageUser = {
  first_name: string;
  second_name: string;
  avatar: string | null;
  email: string;
  login: string;
  phone: string;
};

export type ChatLastMessage = {
  user: ChatLastMessageUser;
  time: string;
  content: string;
};

export type ApiChat = {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  created_by: number;
  last_message: ChatLastMessage | null;
};

export type CreateChatRequest = {
  title: string;
};

export type CreateChatResponse = {
  id: number;
};

export type DeleteChatRequest = {
  chatId: number;
};

export type ChatsUsersRequest = {
  users: number[];
  chatId: number;
};

export type GetChatUsersQuery = {
  offset?: number;
  limit?: number;
  name?: string;
  email?: string;
};

export type ApiChatMember = ApiUser & {
  role?: string;
};
