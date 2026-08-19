# Contributing

## Branching & Environment Promotion Strategy

We follow a GitOps promotion model. Code moves through environments via Pull Requests:

`Feature Branch` ➔ `develop` (Dev) ➔ `staging` (Stage) ➔ `main` (Production)

### Branch & PR Conventions

- **Feature Branches:** Branch off `develop`.
  - **Naming convention:** `<ticketNumber>/<SmallSummary>` (e.g., `123/add-search-bar`)
  - kebab-case instead of spaces
- **Development Work:**
  - Create local overrides using `.env.development.local` (ignored by git).
  - Open a PR into `develop` to deploy changes to the Development environment.
- **Promotions:**
  - **To Staging:** Open a PR from `develop` into `staging`.
  - **To Production:** Open a PR from `staging` into `main`.
