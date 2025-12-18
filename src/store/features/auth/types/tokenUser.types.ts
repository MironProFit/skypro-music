export interface TokenUserData {
  email: string
  password: string
}

export interface TokenSuccessResponse {
  refresh: string
  access: string
}

export interface TokenErrorResponse {
  success: false
  message: string
}

// Общий тип ответа
export type TokenUserResponse = TokenSuccessResponse | TokenErrorResponse
