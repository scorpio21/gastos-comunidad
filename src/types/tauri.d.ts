declare module '@tauri-apps/api/tauri' {
  /**
   * Invoca un comando de Tauri.
   * @param command Nombre del comando a invocar
   * @param args Argumentos opcionales para el comando
   * @returns Una promesa que se resuelve con el resultado del comando
   */
  export function invoke<T>(command: string, args?: Record<string, unknown>): Promise<T>;
}

// Declaración global para la propiedad __TAURI__ en el objeto window
declare interface Window {
  __TAURI__?: unknown;
}

// Asegurarse de que TypeScript reconozca otros módulos de Tauri que podrías necesitar
declare module '@tauri-apps/api/dialog' {
  export function open(options?: { multiple?: boolean, filters?: { name: string, extensions: string[] }[] }): Promise<string | string[] | null>;
  export function save(options?: { filters?: { name: string, extensions: string[] }[] }): Promise<string | null>;
}

declare module '@tauri-apps/api/shell' {
  export function open(path: string): Promise<void>;
}
