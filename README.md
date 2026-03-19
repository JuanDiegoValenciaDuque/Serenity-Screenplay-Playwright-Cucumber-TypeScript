## Credential Encryption & Project Execution

This project uses encrypted credentials to ensure sensitive data is not stored in plain text. Follow the steps below to generate and use encrypted credentials correctly.

### 1. Encrypt credentials

Use the encryptor script to generate the encrypted payload:

-npx ts-node security/encryptor.ts "Test"

This command will output an encrypted payload.

### 2. Store encrypted credentials

- Copy the generated payload
- Paste it into a file `credentials.enc`

### 3. Set the encryption key

Before running the project, define the encryption key as an environment variable.

PowerShell (Windows):

$env:KEY="key"

The key **must match** the one used during the encryption process

### 4. Execute the project

Run the test suite across all browsers using:

npx ts-node runners/executeallbrowsers.ts

### Notes

- Never commit plain credentials to the repository
- The `KEY` environment variable is required at runtime
- Encrypted credentials are decrypted automatically during execution
