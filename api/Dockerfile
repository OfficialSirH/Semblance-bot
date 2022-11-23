FROM rustlang/rust:nightly-buster as builder
WORKDIR /usr/src/myapp
COPY Cargo.toml Cargo.toml
COPY Cargo.lock Cargo.lock
RUN mkdir src && echo "// Empty" > src/lib.rs && cargo build --release && rm -rf src/

COPY src/ src/
COPY sql/ sql/
RUN cargo build --release

FROM debian:buster-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY .env /.env
COPY sql /sql
COPY --from=builder /usr/src/myapp/target/release/discord-link /usr/local/bin/discord-link
EXPOSE 3000
CMD ["discord-link"]