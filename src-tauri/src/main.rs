#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::fs::File;
use std::fs;
use std::io::{Write, Read};

#[tauri::command]
fn set_file(text: String){
    let path_of_dir = "../flint_data";
    let is_exists = fs::metadata(path_of_dir).is_ok();
    if !is_exists {
        fs::create_dir("../flint_data").expect("Ошибка создания папки");
    }
    let path =  "../flint_data/database.txt";
    let mut file = File::create(path).expect("Ошибка при создании файла");
    file.write_all(text.as_bytes()).expect("Ошибка при записи в файл");
}

#[tauri::command]
fn open_file() -> String{
    let path =  "../flint_data/database.txt";
    let is_exists = fs::metadata(path).is_ok();
    let mut file;

    if is_exists {
        file = File::open("../flint_data/database.txt").expect("123");
    } else {
        fs::create_dir("../flint_data").expect("Ошибка создания папки");
        file = File::create("../flint_data/database.txt").expect("123");
        file.write_all(b"{\"material\": [], \"product\": [], \"report\": []}").expect("Ошибка при записи в файл");
    }

    let mut file_data = String::new();
    file.read_to_string(&mut file_data).expect("Ошибка чтения файла");

    return file_data
}

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![set_file, open_file])
        .run(context)
        .expect("Ошибка при запуске приложения");
}
