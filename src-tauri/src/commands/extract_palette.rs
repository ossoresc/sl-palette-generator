use image::{imageops::FilterType, io::Reader as ImageReader};
use kmeans_colors::{get_kmeans, Kmeans};
use palette::{FromColor, Hsl, LinSrgb, Srgb};

#[tauri::command]
pub async fn extract_palette(file_path: String, max_colors: usize) -> Result<Vec<String>, String> {
    tauri::async_runtime::spawn_blocking(move || extract_palette_impl(file_path, max_colors))
        .await
        .map_err(|e| format!("Thread-Error: {e}"))?
}

fn extract_palette_impl(file_path: String, max_colors: usize) -> Result<Vec<String>, String> {
    let img = ImageReader::open(&file_path)
        .map_err(|e| format!("Error while opening image file: {}", e))?
        .decode()
        .map_err(|e| format!("Error while devoding image: {}", e))?;

    let img = img.to_rgba8();
    let resized = image::imageops::resize(&img, 100, 100, FilterType::Triangle);

    let pixels: Vec<LinSrgb> = resized
        .pixels()
        .map(|pixel| {
            let rgba = pixel.0;
            LinSrgb::new(
                rgba[0] as f32 / 255.0,
                rgba[1] as f32 / 255.0,
                rgba[2] as f32 / 255.0,
            )
        })
        .collect();

    let max_iter = 100;
    let cutoff = 1e-4;
    let verbose = false;
    let seed = 42;

    let Kmeans { centroids, .. }: Kmeans<LinSrgb> =
        get_kmeans(max_colors, max_iter, cutoff, verbose, &pixels, seed);

    let mut sorted_centroids = centroids.clone();
    sorted_centroids.sort_by(|a, b| {
        let hsl_a = palette::Hsl::from_color(*a);
        let hsl_b = palette::Hsl::from_color(*b);

        hsl_a
            .hue
            .into_positive_degrees()
            .partial_cmp(&hsl_b.hue.into_positive_degrees())
            .unwrap()
            .then_with(|| hsl_a.lightness.partial_cmp(&hsl_b.lightness).unwrap())
            .then_with(|| hsl_a.saturation.partial_cmp(&hsl_b.saturation).unwrap())
    });

    let palette = centroids
        .iter()
        .map(|color| {
            let srgb_f32: Srgb<f32> = Srgb::from_color(*color);
            let srgb_u8: Srgb<u8> = srgb_f32.into_format();
            let (r, g, b) = srgb_u8.into_components();
            format!("#{:02X}{:02X}{:02X}", r, g, b)
        })
        .collect();

    Ok(palette)
}
