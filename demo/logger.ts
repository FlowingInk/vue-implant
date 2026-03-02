import { ref } from 'vue'

export interface LogEntry {
    time: string
    level: 'info' | 'warn' | 'error'
    msg: string
}

const logs = ref<LogEntry[]>([])

export function addLog(level: LogEntry['level'], msg: string) {
    const time = new Date().toLocaleTimeString()
    logs.value.unshift({ time, level, msg })
    if (logs.value.length > 50) logs.value.pop()
}

export function clearLogs() {
    logs.value = []
}

export function patchConsole() {
    const ori = { log: console.log, warn: console.warn, error: console.error }
    console.log = (...a) => { ori.log(...a); if (String(a[0]).startsWith('[Injector')) addLog('info', a.join(' ')) }
    console.warn = (...a) => { ori.warn(...a); if (String(a[0]).startsWith('[Injector')) addLog('warn', a.join(' ')) }
    console.error = (...a) => { ori.error(...a); if (String(a[0]).startsWith('[Injector')) addLog('error', a.join(' ')) }
    return () => { console.log = ori.log; console.warn = ori.warn; console.error = ori.error }
}

export function useLogs() {
    return { logs, addLog, clearLogs, patchConsole }
}
