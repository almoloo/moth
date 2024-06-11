![image](./banner.png)

# Moth

A royalty point system
Fully developed on algorand chain
This project was created for Algorand change the game hackathon consumer track

# Overview

Moth is a fully on-chain decentralized application that allows wallet holders to earn special ASAs (Algorand Standard Assets) by making transactions and purchasing products through the contract gateway. These earned ASAs can then be used in later transactions to get discounts.

The system features a shop owner profile system, where each shop owner can customize their own profile and gateway with unique settings. Users can easily browse and interact with the available shops through the project's website.

# Key Features

## On-Chain Loyalty System:

The entire project is built on the Algorand blockchain, ensuring a secure and transparent platform for earning and redeeming points.

## Point Transfer:

Users can transfer their earned ASA points to their friends and family, enabling a community-driven loyalty system.

## Shop Owner Profiles:

Each shop owner has their own customizable profile, allowing them to showcase their offerings and settings. Users can easily browse the available shops through the project's website.

# How to Use

1. ## Connect your wallet and complete your gateway profile:
   - Connect your Algorand wallet to the Royalty Point System platform.
   - Fill out your gateway profile with the necessary information.
2. Redirect to the gateway URL:

   - To use the gateway, redirect to the following URL: https://localhost:5173/gateway/[YOUR_WALLET_ADDRESS]/[AMOUNT]/[CALLBACK_URL]
   - Include the following required parameters in the URL:
     - Your wallet address
     - The amount of ALGO your client should pay
     - A URL-encoded URL to redirect to after the payment is completed.
       Make sure to include the term "TRANSACTION_ID" somewhere in your URL, it will be replaced with the actual transaction URL.

3. Validate the transaction:
   - After the payment is completed, the platform will redirect to the call_back URL you provided.
   - In the callback request, you will receive the transaction ID (txid) in your URL.
   - You can use the txid to verify the transaction on the Algorand blockchain and ensure that the payment was successful.

# Contributing

Contributions to the Loyalty Point System are welcome! If you have any ideas, bug fixes, or feature enhancements, please submit a pull request on the project's GitHub repository.

# Contact Us

For any inquiries or feedback, feel free to reach out to us:

Ali Mousavi - [@almoloo](https://twitter.com/almoloo) - amousavig@icloud.com

Hossein Arabi - [@hossein-79](https://github.com/Hossein-79) - ho.arabi79@gmail.com
