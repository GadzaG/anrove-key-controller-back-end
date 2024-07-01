export interface IStatus {
	message?: string | string[]
	statusCode: number
	error?: string
}
export const Unauthorized: IStatus = {
		message: 'Unauthorized',
		statusCode: 401,
	},
	Forbidden: IStatus = {
		message: 'You have no rights!',
		error: 'Forbidden',
		statusCode: 403,
	},
	UnauthorizedVoid = (message?: string | string[]): IStatus => ({
		message,
		error: 'Unauthorized',
		statusCode: 401,
	}),
	NotFound = (message: string | string[]): IStatus => ({
		message,
		error: 'Not Found',
		statusCode: 404,
	}),
	BadRequest = (message: string | string[]): IStatus => ({
		message,
		error: 'Bad Request',
		statusCode: 400,
	})
