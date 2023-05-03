import { ToastData } from "@/assets/types"
import _ from "lodash"

export const getToasts = () => useState<ToastData[]>("toasts", () => [])
export const getToastCount = () => useState<number>("toastCounter", () => 0)

export const resetToasts = () => getToasts().value.length = 0

export const addToast = (toast: ToastData) => {
  toast.id = getToastCount().value++
  toast.duration ? setTimeout(() => {
    const isOnIndex = (_.findIndex(getToasts().value, {id: toast.id}))
    getToasts().value.splice(isOnIndex, 1)
  }, toast.duration) : null
  getToasts().value.push(toast)
  if (_.findIndex(getToasts().value, 'duration') < 0) {
    getToasts().value = getToasts().value.slice(-1)
  }
}
