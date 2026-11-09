# GitHub Review Workflow

## Opening a Pull Request

After the `Open pull request for Codex branches` workflow is merged into `main`, push a change branch named `codex/<short-description>` to GitHub. GitHub Actions opens a pull request as `github-actions[bot]` with a title from the latest commit and a short summary of the branch commits.

The workflow only opens the pull request. Review the **Files changed** tab, leave feedback on the PR, and merge it when ready. It does not merge changes or deploy the site to AWS.

If the workflow is not yet on `main`, an initial pull request must be opened manually. A branch pushed before the workflow is merged will need another push afterward to trigger automatic PR creation.
