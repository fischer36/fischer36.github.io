use std::env;
use std::path::Path;

fn mainxd() {
    let args: Vec<String> = std::env::args().collect();

    if args.len() == 3 {
        if args[1] == "md2html" {
            let mut path = format!(
                "{}",
                std::fs::canonicalize(&args[0])
                    .unwrap()
                    .display()
                    .to_string()
            );
            let x = path.rfind("/").unwrap();
            let y = path[0..x + 1].to_string();
            println!("Path: {}", y);
            let file = format!("{}{}", y, args[2]);
            println!("File: {}", file);

            let text = std::fs::read_to_string(file).unwrap();
            println!("{}", text);
        }
    }
}

fn md2html(html: &str) -> String {
    html.find("<i>").unwrap();
    return String::new();
}

fn handle_hash(text: &str) -> String {
    text.lines()
        .map(|line| {
            let hashes = line.chars().take_while(|&c| c == '#').count();
            if hashes > 0 && hashes <= 6 {
                // Remove the '#' characters and any leading whitespace
                let content = line[hashes..].trim();
                // Enclose the content with appropriate <hN> tags
                format!("<h{level}>{}</h{level}>", content, level = hashes)
            } else {
                line.to_string()
            }
        })
        .collect::<Vec<String>>()
        .join("\n")
}

fn find_close(text: &str, start: usize, delimiter: &str) -> Option<usize> {
    let search_start = start + delimiter.len();
    let substring = &text[search_start..];
    if let Some(pos) = substring.find(delimiter) {
        Some(search_start + pos)
    } else {
        None
    }
}

fn handle_emphasis(text: &str) -> String {
    let mut result = String::new();
    let mut i = 0;
    let chars: Vec<char> = text.chars().collect();
    while i < chars.len() {
        if chars[i] == '*' {
            // Determine if it's '**' or '*'
            let delimiter = if i + 1 < chars.len() && chars[i + 1] == '*' {
                "**"
            } else {
                "*"
            };
            let start = i;
            if let Some(close_index) = find_close(text, i, delimiter) {
                // Extract content between the delimiters
                let content = &text[i + delimiter.len()..close_index];
                // Recursively handle nested emphasis
                let processed_content = handle_emphasis(content);
                // Wrap content with the appropriate tag
                let tag = if delimiter == "**" { "b" } else { "i" };
                result.push_str(&format!("<{tag}>{}</{tag}>", processed_content, tag = tag));
                // Move index past the closing delimiter
                i = close_index + delimiter.len();
            } else {
                // No closing delimiter found; treat '*' as a normal character
                result.push(chars[i]);
                i += 1;
            }
        } else {
            // Regular character; add to result
            result.push(chars[i]);
            i += 1;
        }
    }
    result
}

fn main() {
    let text =
        "This is *italic* text and this is **bold** text. Nested **bold and *italic* text** here.";
    println!("{}", text);
    let processed_text = handle_emphasis(text);
    println!("{}", processed_text);
}
