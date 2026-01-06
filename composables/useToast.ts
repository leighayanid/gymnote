import { toast } from 'vue-sonner'

export const useToast = () => {
  const success = (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 3000,
    })
  }

  const error = (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
    })
  }

  const info = (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 3000,
    })
  }

  const warning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    })
  }

  const loading = (message: string) => {
    return toast.loading(message)
  }

  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId)
  }

  const promise = <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, messages)
  }

  // Helper to extract error message from various error types
  const getErrorMessage = (error: any): { message: string; description?: string } => {
    // Handle FetchError from $fetch
    if (error?.data?.message) {
      return {
        message: 'Request Failed',
        description: error.data.message
      }
    }

    // Handle error with message property
    if (error?.message) {
      return {
        message: 'Error',
        description: error.message
      }
    }

    // Handle string errors
    if (typeof error === 'string') {
      return {
        message: 'Error',
        description: error
      }
    }

    // Handle error with statusMessage
    if (error?.statusMessage) {
      return {
        message: `Error ${error.statusCode || ''}`,
        description: error.statusMessage
      }
    }

    // Fallback
    return {
      message: 'Something went wrong',
      description: 'An unexpected error occurred. Please try again.'
    }
  }

  const handleError = (error: any, fallbackMessage?: string) => {
    const { message, description } = getErrorMessage(error)
    toast.error(fallbackMessage || message, {
      description,
      duration: 5000,
    })
  }

  return {
    success,
    error,
    info,
    warning,
    loading,
    dismiss,
    promise,
    getErrorMessage,
    handleError,
  }
}
