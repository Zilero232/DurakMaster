#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Набор плагинов различается по платформам: обновления и контроль
    // единственного экземпляра нужны только на десктопе, отступы под
    // системные элементы — только на мобильных.
    #[cfg(desktop)]
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            use tauri::Manager;
            use tauri_plugin_deep_link::DeepLinkExt;

            // Повторный запуск возвращает уже открытое окно, а не плодит
            // вторую копию: иначе игрок окажется за столом дважды.
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.unminimize();
                let _ = window.show();
                let _ = window.set_focus();
            }

            app.deep_link().handle_cli_arguments(args.into_iter());
        }));

    #[cfg(not(desktop))]
    let builder =
        tauri::Builder::default().plugin(tauri_plugin_safe_area_insets_css::init());

    builder
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_deep_link::init())
        .setup(|_app| {
            #[cfg(desktop)]
            {
                use tauri_plugin_deep_link::DeepLinkExt;

                if let Err(error) = _app.deep_link().register_all() {
                    eprintln!("не удалось зарегистрировать deep-link: {error}");
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("ошибка при запуске приложения");
}
