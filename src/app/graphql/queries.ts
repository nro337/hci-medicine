import { Octokit } from "octokit";
import fs from "fs";

const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

export async function loginGH() {
  const { data } = await octokit.rest.users.getAuthenticated();
  return data;
}

const PLATFORM_DELIVERABLE = "css";
const variables = {
  owner: process.env.GITHUB_REPO_OWNER,
  name: process.env.GITHUB_REPO_NAME,
  tree: `${process.env.GITHUB_REPO_BRANCH}:build/${PLATFORM_DELIVERABLE}`,
};

const graphqlWithAuth = octokit.graphql.defaults({
  headers: {
    authorization: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  },
});

// source: https://www.michaelmang.dev/blog/consuming-design-tokens-from-style-dictionary-across-platform-specific-applications
export async function fetchDesignTokens() {
  // @ts-expect-error
  const { repository } = await graphqlWithAuth(
    `
    query FetchDesignTokens($owner: String!, $name: String!, $tree: String!) {
      repository(name: $name, owner: $owner) {
        content: object(expression: $tree) {
          ... on Tree {
            entries {
              name
              object {
                ... on Blob {
                  text
                }
              }
            }
          }
        }
      }
    }
    `,
    variables
  );

  // @ts-ignore
  repository.content.entries.forEach(({ name, object: { text } }) => {
    fs.writeFileSync(`./src/tokens/${name}`, text);
  });
}