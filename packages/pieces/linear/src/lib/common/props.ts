import { Property } from '@activepieces/pieces-framework';
import { makeClient } from './client';
import { LinearDocument } from '@linear/sdk';

export const props = {
  team_id: (required = true) =>
    Property.Dropdown({
      description: 'The team for which the issue will be created',
      displayName: 'Team',
      required,
      refreshers: ['auth'],
      options: async ({ auth }) => {
        if (!auth) {
          return {
            disabled: true,
            placeholder: 'connect your account first',
            options: [],
          };
        }
        const client = makeClient(auth as string);
        const teams = await client.listTeams({
          first: 50,
          orderBy: LinearDocument.PaginationOrderBy.UpdatedAt,
        });
        return {
          disabled: false,
          options: teams.nodes.map((team) => {
            return {
              label: team.name,
              value: team.id,
            };
          }),
        };
      },
    }),
  status_id: (required = false) =>
    Property.Dropdown({
      description: 'Status of the Issue',
      displayName: 'Status',
      required,
      refreshers: ['auth', 'team_id'],
      options: async ({ auth, team_id }) => {
        if (!auth || !team_id) {
          return {
            disabled: true,
            placeholder: 'connect your account first and select team',
            options: [],
          };
        }
        const client = makeClient(auth as string);
        const filter: LinearDocument.WorkflowStatesQueryVariables = {
          filter: {
            team: {
              id: {
                eq: team_id as string,
              },
            },
          },
        };
        const statusList = await client.listIssueStates(filter);
        return {
          disabled: false,
          options: statusList.nodes.map((status) => {
            return {
              label: status.name,
              value: status.id,
            };
          }),
        };
      },
    }),
  labels: (required = false) =>
    Property.MultiSelectDropdown({
      description: 'Labels for the Issue',
      displayName: 'Labels',
      required,
      refreshers: ['auth'],
      options: async ({ auth }) => {
        if (!auth) {
          return {
            disabled: true,
            placeholder: 'connect your account first',
            options: [],
          };
        }
        const client = makeClient(auth as string);
        const labels = await client.listIssueLabels();
        return {
          disabled: false,
          options: labels.nodes.map((label) => {
            return {
              label: label.name,
              value: label.id,
            };
          }),
        };
      },
    }),
  assignee_id: (required = false) =>
    Property.Dropdown({
      description: 'Assignee of the Issue',
      displayName: 'Assignee',
      required,
      refreshers: ['auth'],
      options: async ({ auth }) => {
        if (!auth) {
          return {
            disabled: true,
            placeholder: 'connect your account first',
            options: [],
          };
        }
        const client = makeClient(auth as string);
        const users = await client.listUsers();
        return {
          disabled: false,
          options: users.nodes.map((user) => {
            return {
              label: user.name,
              value: user.id,
            };
          }),
        };
      },
    }),
  priority_id: (required = false) =>
    Property.Dropdown({
      description: 'Priority of the Issue',
      displayName: 'Priority',
      required,
      refreshers: ['auth'],
      options: async ({ auth }) => {
        if (!auth) {
          return {
            disabled: true,
            placeholder: 'connect your account first',
            options: [],
          };
        }
        const client = makeClient(auth as string);
        const priorities = await client.listIssuePriorities();
        return {
          disabled: false,
          options: priorities.map((priority) => {
            return {
              label: priority.label,
              value: priority.priority,
            };
          }),
        };
      },
    }),
  issue_id: (required = true) =>
    Property.Dropdown({
      displayName: 'Issue',
      required,
      description: 'ID of Linear Issue',
      refreshers: ['team_id'],
      options: async ({ auth, team_id }) => {
        if (!auth || !team_id) {
          return {
            disabled: true,
            placeholder: 'connect your account first and select team',
            options: [],
          };
        }
        const client = makeClient(auth as string);
        const filter: LinearDocument.IssuesQueryVariables = {
          first: 50,
          filter: {
            team: {
              id: {
                eq: team_id as string,
              },
            },
          },
          orderBy: LinearDocument.PaginationOrderBy.UpdatedAt,
        };
        const issues = await client.listIssues(filter);
        return {
          disabled: false,
          options: issues.nodes.map((issue) => {
            return {
              label: issue.title,
              value: issue.id,
            };
          }),
        };
      },
    }),
};
