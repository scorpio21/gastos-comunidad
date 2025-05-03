import { invoke } from '@tauri-apps/api/tauri';

// Function to check if a process is running
export async function checkProcessRunning(processName: string): Promise<boolean> {
  try {
    return await invoke('check_process_running', { processName });
  } catch (error) {
    console.error('Error checking process:', error);
    return false;
  }
}

// Function to check if XAMPP services are running
export async function checkXamppServices(): Promise<{ apache: boolean; mysql: boolean }> {
  try {
    const apacheRunning = await checkProcessRunning('httpd');
    const mysqlRunning = await checkProcessRunning('mysqld');
    return { apache: apacheRunning, mysql: mysqlRunning };
  } catch (error) {
    console.error('Error checking XAMPP services:', error);
    return { apache: false, mysql: false };
  }
}

// Function to start XAMPP
export async function startXampp(): Promise<string> {
  try {
    return await invoke('start_xampp');
  } catch (error) {
    console.error('Error starting XAMPP:', error);
    return error as string;
  }
}

// Function to open the application in the default browser
export async function openInBrowser(url: string): Promise<string> {
  try {
    return await invoke('open_in_browser', { url });
  } catch (error) {
    console.error('Error opening in browser:', error);
    return error as string;
  }
}

// Add type declaration for Tauri global property
declare global {
  interface Window {
    __TAURI__?: unknown;
  }
}

// Check if running in Tauri environment
export function isTauri(): boolean {
  return typeof window !== 'undefined' && window.__TAURI__ !== undefined;
}
