# Moth

A royalty point system
Fully developed on algorand chain
This project was created for Algorand change the game hackathon consumer track

# Overview

Moth is a fully on-chain decentralized application that allows wallet holders to earn special ASAs (Algorand Standard Assets) by making transactions and purchasing products through the contract gateway. These earned ASAs can then be used in later transactions to get discounts.

The system features a shop owner profile system, where each shop owner can customize their own profile and gateway with unique settings. Users can easily browse and interact with the available shops through the project's website.

# Key Features

### On-Chain Loyalty System:
The entire project is built on the Algorand blockchain, ensuring a secure and transparent platform for earning and redeeming points.

### Point Transfer:
Users can transfer their earned ASA points to their friends and family, enabling a community-driven loyalty system.

### Shop Owner Profiles:
Each shop owner has their own customizable profile, allowing them to showcase their offerings and settings. Users can easily browse the available shops through the project's website.

# Contributing

Contributions to the Loyalty Point System are welcome! If you have any ideas, bug fixes, or feature enhancements, please submit a pull request on the project's GitHub repository.

## Setup

### Initial setup
1. Clone this repository to your local machine.
2. Ensure [Docker](https://www.docker.com/) is installed and operational. Then, install `AlgoKit` following this [guide](https://github.com/algorandfoundation/algokit-cli#install).
3. Run `algokit project bootstrap all` in the project directory. This command sets up your environment by installing necessary dependencies, setting up a Python virtual environment, and preparing your `.env` file.
4. To build your project, execute `algokit project run build`. This compiles your project and prepares it for running.
5. For project-specific instructions, refer to the READMEs of the child projects:
   - Smart Contracts: [moth-contracts](projects/moth-contracts/README.md)
   - Frontend Application: [moth-frontend](projects/moth-frontend/README.md)

> This project is structured as a monorepo, refer to the [documentation](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/features/project/run.md) to learn more about custom command orchestration via `algokit project run`.

### Subsequently

1. If you update to the latest source code and there are new dependencies, you will need to run `algokit project bootstrap all` again.
2. Follow step 3 above.

## Tools

This project makes use of Python and React to build Algorand smart contracts and to provide a base project configuration to develop frontends for your Algorand dApps and interactions with smart contracts. The following tools are in use:

- Algorand, AlgoKit, and AlgoKit Utils
- Python dependencies including Poetry, Black, Ruff or Flake8, mypy, pytest, and pip-audit
- React and related dependencies including AlgoKit Utils, Tailwind CSS, daisyUI, use-wallet, npm, jest, playwright, Prettier, ESLint, and Github Actions workflows for build validation

### VS Code

It has also been configured to have a productive dev experience out of the box in [VS Code](https://code.visualstudio.com/), see the [backend .vscode](./backend/.vscode) and [frontend .vscode](./frontend/.vscode) folders for more details.

## Integrating with smart contracts and application clients

Refer to the [moth-contracts](projects/moth-contracts/README.md) folder for overview of working with smart contracts, [projects/moth-frontend](projects/moth-frontend/README.md) for overview of the React project and the [projects/moth-frontend/contracts](projects/moth-frontend/src/contracts/README.md) folder for README on adding new smart contracts from backend as application clients on your frontend. The templates provided in these folders will help you get started.
When you compile and generate smart contract artifacts, your frontend component will automatically generate typescript application clients from smart contract artifacts and move them to `frontend/src/contracts` folder, see [`generate:app-clients` in package.json](projects/moth-frontend/package.json). Afterwards, you are free to import and use them in your frontend application.

The frontend starter also provides an example of interactions with your HelloWorldClient in [`AppCalls.tsx`](projects/moth-frontend/src/components/AppCalls.tsx) component by default.

## Next Steps

You can take this project and customize it to build your own decentralized applications on Algorand. Make sure to understand how to use AlgoKit and how to write smart contracts for Algorand before you start.
