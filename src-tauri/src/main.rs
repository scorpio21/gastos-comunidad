// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::thread;
use std::time::Duration;

// Comando para verificar si un proceso está en ejecución
#[tauri::command]
fn check_process_running(process_name: &str) -> bool {
    #[cfg(target_os = "windows")]
    {
        let output = Command::new("powershell")
            .args(["-Command", &format!("Get-Process -Name {} -ErrorAction SilentlyContinue", process_name)])
            .output()
            .expect("Failed to execute command");
        
        output.status.success()
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        false // No implementado para otros sistemas operativos
    }
}

// Comando para iniciar XAMPP
#[tauri::command]
fn start_xampp() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        let xampp_path = "C:\\xampp\\xampp-control.exe";
        
        match Command::new(xampp_path).spawn() {
            Ok(_) => Ok("XAMPP Control Panel iniciado correctamente".to_string()),
            Err(e) => Err(format!("Error al iniciar XAMPP: {}", e))
        }
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        Err("Esta función solo está disponible en Windows".to_string())
    }
}

// Comando para abrir la aplicación en el navegador predeterminado
#[tauri::command]
fn open_in_browser(url: &str) -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        match open::that(url) {
            Ok(_) => Ok(format!("Aplicación abierta en el navegador: {}", url)),
            Err(e) => Err(format!("Error al abrir el navegador: {}", e))
        }
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        Err("Esta función solo está disponible en Windows".to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            check_process_running,
            start_xampp,
            open_in_browser
        ])
        .run(tauri::generate_context!())
        .expect("Error al ejecutar la aplicación");
}
