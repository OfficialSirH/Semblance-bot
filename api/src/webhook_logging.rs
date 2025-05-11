use crate::{
    config::Config,
    constants::{self, BACKGROUND, LOG},
};
use twilight_http::Client;
use twilight_model::id::{marker::WebhookMarker, Id};

#[allow(unused_must_use)]

pub async fn webhook_log(content: String, log_type: LOG) {
    let config = Config::new();
    let client = Client::new(config.discord_token);
    let webhook_id = Id::<WebhookMarker>::new(config.webhook_id.parse::<u64>().unwrap());

    let color = match log_type {
        LOG::SUCCESSFUL => constants::SUCCESSFUL,
        LOG::INFORMATIONAL => constants::INFORMATIONAL,
        LOG::FAILURE => constants::FAILURE,
    };

    let formatted_content = format!(
        "```ansi\n{}{}```",
        BACKGROUND,
        content
            .split(' ')
            .map(|word| { format!("{}{}", color, word) })
            .collect::<Vec<String>>()
            .join(" ")
    );

    let pre_webhook_execution = match client
        .execute_webhook(webhook_id, &config.webhook_token)
        .content(formatted_content.as_str())
    {
        Ok(value) => value,
        Err(err) => {
            return eprintln!("{:?}", err);
        }
    };

    pre_webhook_execution
        .await
        .inspect_err(|error| eprintln!("{:?}", error));
}

#[tokio::test]
async fn uwu_log() -> () {
    webhook_log(
        "UwU, this logger is working! OwO".to_string(),
        crate::constants::LOG::INFORMATIONAL,
    )
    .await;
}

#[tokio::test]
async fn failure_log() -> () {
    webhook_log(
        "SOMETHING FAILED, OMG!!! RED ALERT, RED ALERT!! WOO WOO WOO WOO!".to_string(),
        crate::constants::LOG::FAILURE,
    )
    .await;
}

#[tokio::test]
async fn successful_log() -> () {
    webhook_log(
        "YAY! IT WORKED! IT WAS SUCCESSFUL!".to_string(),
        crate::constants::LOG::SUCCESSFUL,
    )
    .await;
}
