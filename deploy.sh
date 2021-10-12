#!/bin/bash

doctave build --release
gh-pages -d site
