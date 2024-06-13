# Website Backend

A simple Express.js backend/API for coopsoc.com.au, to perform tasks that won't run on the static GitHub Pages-hosted frontend, written in NextJS. These primarily involve the merch site, such as querying the Stripe API for a list of products (which can't be done with fetch directly for security reasons), or creating a checkout session.

## Contributors
The first version of this backend was written by the 2024 CoopSoc IT Subcom/Directors, inspired by the Go merch backend written by the 2023 IT Subcom.
