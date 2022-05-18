#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{RunEvent};

fn main() {
  tauri::Builder::default()
    .build(tauri::generate_context!())
    .expect("error while running tauri application")
    .run(|_app_handle, e| {
      if let RunEvent::MainEventsCleared = e {
        //  println!("Derp");
      }
    });
}
