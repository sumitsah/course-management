export interface AppError {
    message: string;
    status: string;
    code?: string;
}

// export interface ToastMessage {
//     type: string; // 'success' | 'error' | 'info' | 'warning'
//     message: string;
// }