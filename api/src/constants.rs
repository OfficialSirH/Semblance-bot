pub enum ErrorLogType {
    USER(String),
    INTERNAL,
}

pub enum LOG {
    SUCCESSFUL,
    INFORMATIONAL,
    FAILURE,
}

pub const BACKGROUND: &str = "\u{001b}[40m";
pub const SUCCESSFUL: &str = "\u{001b}[0;32m";
pub const INFORMATIONAL: &str = "\u{001b}[1;33m";
pub const FAILURE: &str = "\u{001b}[0;31m";
