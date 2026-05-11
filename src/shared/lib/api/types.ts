type ApiUser = {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string | null;
};

type SignInRequest = {
  login: string;
  password: string;
};

type SignUpRequest = {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
};

type SignUpResponse = {
  id: number;
};

type UserProfileRequest = {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
};

type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

type UserSearchRequest = {
  login: string;
};

type ChatLastMessageUser = {
  first_name: string;
  second_name: string;
  avatar: string | null;
  email: string;
  login: string;
  phone: string;
};

type ChatLastMessage = {
  user: ChatLastMessageUser;
  time: string;
  content: string;
};

type ApiChat = {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  created_by: number;
  last_message: ChatLastMessage | null;
};

type CreateChatRequest = {
  title: string;
};

type CreateChatResponse = {
  id: number;
};

type ChatSocketTokenResponse = {
  token: string;
};

type DeleteChatRequest = {
  chatId: number;
};

type ChatsUsersRequest = {
  users: number[];
  chatId: number;
};

type GetChatUsersQuery = {
  offset?: number;
  limit?: number;
  name?: string;
  email?: string;
};

type ApiChatMember = ApiUser & {
  role?: string;
};

export {
  type ApiChat,
  type ApiChatMember,
  type ApiUser,
  type ChangePasswordRequest,
  type ChatLastMessage,
  type ChatLastMessageUser,
  type ChatSocketTokenResponse,
  type ChatsUsersRequest,
  type CreateChatRequest,
  type CreateChatResponse,
  type DeleteChatRequest,
  type GetChatUsersQuery,
  type SignInRequest,
  type SignUpRequest,
  type SignUpResponse,
  type UserProfileRequest,
  type UserSearchRequest,
};
