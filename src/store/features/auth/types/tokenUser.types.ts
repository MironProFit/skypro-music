interface TokenSuccessResponse {
  refresh: string
  access: string
}

// Ошибка от сервера
interface TokenErrorResponse {
  detail: string
  code: string
}

// Общий тип ответа
type TokenResponse = TokenSuccessResponse | TokenErrorResponse
