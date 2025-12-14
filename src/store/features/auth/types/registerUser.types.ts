export interface RegisterUserData {
  email: string
  password: string
  username: string
}

export interface RegisterUserResult {
  _id: number
  email: string
  username: string
}

export interface RegisterUserSuccessResponse {
  success: true
  message: string
  result: RegisterUserResult
}

export interface RegisterUserErrorResponse {
  success: false
  message: string
}

export type RegisterUserResponse =
  | RegisterUserSuccessResponse
  | RegisterUserErrorResponse
