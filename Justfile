default:
    @just --list

init:
    pnpm install

build:
    pnpm run build

on-deploy:
    @just build
