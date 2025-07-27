# SL Palette Generator

## Disclaimer

This app is a test project for Tauri and Angular + Angular Material. It is not meant to be
released or used as an app, but rather a playground to see how things work in those frameworks and
how to build a Tauri app with installer.

There are a lot of things missing:

- Tests
- State management (e.g. with ngrx)
- Persistence level (e.g. sqlite)
- Angular 20 tech like signals, inject(), ...
- Angular routing for multiple views
- Performance in color palette creation
- Cancellation token like mechanism in backend during calculation
- Progress bar info updates
- Structured metadata
- Tauri app update + migration
- App icons and meta info
- Additional features like palette styles and sorting

(This is also kinda like a todo list for future updates)

## Used technologies
### npm
- Angular 20 (standlone, with zone.js)
- Angular Material 20
- Tauri 2
- rxjs
- exifr

### cargo
- tauri-plugins (log, dialog, fs)
- image
- kmeans_colors
- palette
