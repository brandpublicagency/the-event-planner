export class NotificationError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, any>,
    public timestamp: Date = new Date()
  ) {
    super(message);
    this.name = 'NotificationError';
  }
}

export class NotificationFetchError extends NotificationError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'NOTIFICATION_FETCH_ERROR', context);
    this.name = 'NotificationFetchError';
  }
}

export class NotificationUpdateError extends NotificationError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'NOTIFICATION_UPDATE_ERROR', context);
    this.name = 'NotificationUpdateError';
  }
}

export class NotificationNetworkError extends NotificationError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'NOTIFICATION_NETWORK_ERROR', context);
    this.name = 'NotificationNetworkError';
  }
}

export function isNotificationError(error: unknown): error is NotificationError {
  return error instanceof NotificationError;
}

export function getErrorMessage(error: unknown): string {
  if (isNotificationError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}
