FROM rustlang/rust:nightly-buster as builder
WORKDIR /usr/src/myapp
COPY Cargo.toml Cargo.toml
COPY Cargo.lock Cargo.lock
RUN mkdir src && echo "// Empty" > src/lib.rs && cargo build --release && rm -rf src/

COPY src/ src/
COPY sql/ sql/
RUN cargo build --release

FROM alpine:latest
RUN apk update && apk add --no-interactive ca-certificates && rm -rf /var/lib/apt/lists/*
COPY .env /.env
COPY sql /sql
COPY --from=builder /usr/src/myapp/target/release/c2s-linked-roles /usr/local/bin/c2s-linked-roles
EXPOSE 3000
CMD ["c2s-linked-roles"]