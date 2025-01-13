# Comprehensive Guide to Setting Up and Using the Project

## Overview

This document provides a step-by-step guide to setting up, configuring, and using the project. Follow the instructions carefully to ensure a smooth experience.

## System Requirements

Before proceeding, make sure the following dependencies are installed:

- **Node.js**: Version 14.x or newer
- **Yarn**: Version 1.22.x or newer
- **Redis**: Required for caching and queue management

## Installation Steps

### 1. Clone the Repository

Clone the project repository and navigate to the project directory:

```bash
git clone https://github.com/x-ror/converter.git
cd converter
```

### 2. Install Dependencies

Install the required dependencies using Yarn:

```bash
yarn install
```

## Configuration Setup

### 1. Create a Configuration File

Navigate to the `apps/currency-converter/config/` directory and create a `.env` file based on the provided example:

```bash
cp apps/currency-converter/config/.env.example apps/currency-converter/config/.env
```

### 2. Update Environment Variables

Open the `.env` file and configure the required environment variables:

```env
ENV=.env
SERVICE_NAME=your_service_name
SERVICE_HOST=localhost
SERVICE_PORT=3000
LOG_LEVEL=debug
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_AUTH=your_password_if_needed
REDIS_DB=0
REDIS_TLS=use_tls_if_needed
```

Ensure Redis is running and configured according to these settings.

## Running the Application

### 1. Development Mode

To run the application in development mode with hot-reloading enabled, use:

```bash
yarn start:dev
```

### 2. Production Mode

First, build the project:

```bash
yarn build
```

Then, start the application:

```bash
yarn start:prod
```


## Using the Application

Once the application is running, access it using the host and port specified in the `.env` file. By default, it will be available at:

```text
http://localhost:3000
```