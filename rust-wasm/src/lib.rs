use wasm_bindgen::prelude::*;

// This function will be exposed to JavaScript.
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello XD, {}!", name)
}
