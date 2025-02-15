export type Success<T = void> = {
  type: 'Success';
  data: T;
};

export type Failure = {
  type: 'Failure';
  error: Error;
};

export type Result<T = void> = Success<T> | Failure;

export function succeed<T = void>(data: T): Success<T> {
  return {
    type: 'Success',
    data: data,
  };
}

export function failed(err: Error): Failure {
  return {
    type: 'Failure',
    error: err,
  };
}

export function isSuccess<T = void>(res: Result<T>): boolean {
  return res.type == 'Success';
}

export function isFailure<T = void>(res: Result<T>): boolean {
  return res.type == 'Failure';
}

export function getError<T = void>(result: Result<T>): Error {
  if (result.type == 'Success') {
    throw new Error('Cannot get error from a success result');
  }
  return result.error;
}

export function getValue<T = void>(result: Result<T>): T {
  if (result.type == 'Failure') {
    throw new Error('Cannot get value from a failed result');
  }
  return result.data;
}

export interface Error {
  title: string;
  description: string;
}
