import * as React from "react"
import { type AlertProps } from "./alert"

export type AlertContextValue = undefined | Pick<AlertProps, keyof AlertProps>



const AlertContext = React.createContext<AlertContextValue>(undefined)

export default AlertContext
