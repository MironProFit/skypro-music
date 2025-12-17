export interface LoginUserData {
  email: string
  password: string
}

export interface LoginUserResult {
  _id: number
  email: string
  username: string
}

export interface LoginUserSuccessResponse {
  _id: number
  email: string
  username: string
}

export interface LoginUserErrorResponse {
  success: false
  message: string
}

export type LoginUserResponse =
  | LoginUserSuccessResponse
  | LoginUserErrorResponse
