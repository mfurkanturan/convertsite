export class AppError extends Error {
  constructor(public code: string, message: string, public status = 400) { super(message); }
}
export function publicError(error: unknown): AppError {
  return error instanceof AppError ? error : new AppError('INTERNAL_ERROR', 'İşlem tamamlanamadı. Lütfen yeniden dene.', 500);
}
