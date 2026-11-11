# Members Management — Final API & Implementation Specification

## 1. Overview

The system contains three primary views:

1. **Members Directory** — member list, stats, search, filter, CSV export, single delete, and bulk delete.
2. **Add New Member** — form to create a member.
3. **Edit Member** — profile summary and member updates.

The global header displays the currently logged-in user.

### Confirmed decisions

- `GET /members` returns all members without pagination.
- Search and filtering run on the client side over loaded data.
- CSV export runs entirely in the browser; no export endpoint exists.
- No invitation system or separate invitations API.
- Dashboard stats come from `GET /members/stats`.
- Repositories and deployments belong to **department metrics**, not individual members.
- Members store only `departmentId`; metrics are not duplicated in member records.
- Member detail responses include the department object and its metrics.
- Single delete and bulk delete use separate endpoints.
- Success, confirmation, and error popups are frontend components with no dedicated API.

------------------------------------------------------------------------

## 2. Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/auth/me` | Current user profile |
| GET | `/api/v1/members` | All members |
| GET | `/api/v1/members/stats` | Dashboard stats |
| GET | `/api/v1/members/:id` | Member detail + department metrics |
| POST | `/api/v1/members` | Create member |
| PATCH | `/api/v1/members/:id` | Update member |
| DELETE | `/api/v1/members/:id` | Delete member |
| POST | `/api/v1/members/bulk-delete` | Bulk delete members |
| GET | `/api/v1/departments` | Departments + metrics |

### Unused endpoints

- `/api/v1/invitations`
- `/api/v1/members/export`
- `/api/v1/members/:id/metrics`

**Routing note:** Register static routes like `/members/stats` and `/members/bulk-delete` before dynamic routes like `/members/:id`. Ensure `bulk-delete` uses `POST`.

------------------------------------------------------------------------

## 3. Global Header — Current User

### `GET /api/v1/auth/me`

Returns profile details for the active session.

**Example response:**

``` json
{
  "success": true,
  "data": {
    "id": "USR-001",
    "name": "Alex Vance",
    "email": "alex@company.com",
    "jobTitle": "Lead Architect",
    "avatar": null
  }
}
```

| UI | Response field |
|---|---|
| Avatar | `data.avatar` |
| Name | `data.name` |
| Job title | `data.jobTitle` |

If `avatar` is null, render a fallback or initials. Resolve user identity from a validated session or access token, not client input.

------------------------------------------------------------------------

## 4. Members Directory

### `GET /api/v1/members`

Returns all accessible members without pagination.

**Example response:**

``` json
{
  "success": true,
  "data": [
    {
      "id": "MEM-2048",
      "name": "Sarah Jenkins",
      "email": "sarah.jenkins@company.com",
      "avatar": null,
      "jobTitle": "Staff Frontend Engineer",
      "department": {
        "id": "DEPT-001",
        "name": "Engineering"
      },
      "accountStatus": "active",
      "employmentType": "full_time_permanent",
      "joinedAt": "2022-02-14T00:00:00Z"
    }
  ],
  "meta": {
    "total": 148
  }
}
```

### Search and filter

Handled on the client side:
- Search: name, email, and job title.
- Filter: department, account status, and employment type.
- Checkboxes and select-all managed via component state.

------------------------------------------------------------------------

## 5. Dashboard Statistics

### `GET /api/v1/members/stats`

Provides aggregate numbers for dashboard cards.

**Example response:**

``` json
{
  "success": true,
  "data": {
    "totalMembers": 148,
    "activeNow": 132,
    "departments": 8,
    "pendingInvites": 5,
    "newMembersThisMonth": 12,
    "activePercentage": 94,
    "expiringSoon": 3
  }
}
```

| UI Field | Response Field |
|---|---|
| Total Members | `totalMembers` |
| Active Now | `activeNow` |
| Departments | `departments` |
| Pending Invites | `pendingInvites` |
| New Members This Month | `newMembersThisMonth` |
| Live Activity Percentage | `activePercentage` |
| Expiring Soon | `expiringSoon` |

### Notes on pending invites and metrics

Calculate pending counts and expirations from actual domain data. If no data source exists, omit the card or rename it to reflect available data. Define `activeNow` clearly (e.g., activity within the last 5 minutes), keeping it separate from `accountStatus: active`.

Ensure consistency between `activeNow`, `totalMembers`, and `activePercentage`. Do not hardcode percentages.

------------------------------------------------------------------------

## 6. Departments and Metrics

### `GET /api/v1/departments`

Returns departments and their metrics for add/edit dropdowns.

**Example response:**

``` json
{
  "success": true,
  "data": [
    {
      "id": "DEPT-001",
      "name": "Engineering",
      "metrics": {
        "repositories": 42,
        "deployments": 1489
      }
    }
  ]
}
```

### Rules

- Repositories and deployments belong to the department, not individual members.
- Members store only `departmentId`.
- Moving a member to another department updates their profile summary metrics accordingly.
- If data comes from an external provider (like GitHub or CI/CD), sync it on the backend or return `null`.

------------------------------------------------------------------------

## 7. Add New Member

### Form fields

| UI Label | API Property | Required |
|---|---|---|
| Full Name | `name` | Yes |
| Work Email | `email` | Yes |
| Account Status | `accountStatus` + `accessLevel` | Yes |
| Job Title | `jobTitle` | Yes |
| Department | `departmentId` | Yes |
| Employment Type | `employmentType` | Yes |
| Bio & Notes | `bio` | No |

### Employment types

- `full_time_permanent`
- `contract`
- `part_time`
- `temporary`
- `internship`
- `freelance`

### `POST /api/v1/members`

**Example request:**

``` json
{
  "name": "Michael Phelps",
  "email": "michael.phelps@company.com",
  "accountStatus": "active",
  "accessLevel": "full_workspace",
  "jobTitle": "Staff UI/UX Designer",
  "departmentId": "DEPT-002",
  "employmentType": "contract",
  "bio": "Working on design systems."
}
```

**Example response:**

``` json
{
  "success": true,
  "message": "Member created successfully",
  "data": {
    "id": "MEM-2049",
    "name": "Michael Phelps",
    "email": "michael.phelps@company.com",
    "accountStatus": "active",
    "accessLevel": "full_workspace",
    "jobTitle": "Staff UI/UX Designer",
    "department": {
      "id": "DEPT-002",
      "name": "Design",
      "metrics": {
        "repositories": 18,
        "deployments": 320
      }
    },
    "employmentType": "contract",
    "bio": "Working on design systems.",
    "joinedAt": "2026-11-11T03:00:00Z"
  }
}
```

------------------------------------------------------------------------

## 8. Edit Member

### `GET /api/v1/members/:id`

Retrieves data for profile summary and edit forms.

**Example response:**

``` json
{
  "success": true,
  "data": {
    "id": "MEM-2048",
    "name": "Sarah Jenkins",
    "email": "sarah.jenkins@company.com",
    "avatar": null,
    "jobTitle": "Staff Frontend Engineer",
    "department": {
      "id": "DEPT-001",
      "name": "Engineering",
      "metrics": {
        "repositories": 42,
        "deployments": 1489
      }
    },
    "accountStatus": "active",
    "accessLevel": "full_workspace",
    "employmentType": "full_time_permanent",
    "bio": "Frontend architecture lead.",
    "joinedAt": "2022-02-14T00:00:00Z"
  }
}
```

### `PATCH /api/v1/members/:id`

Updates specified fields.

**Example request:**

``` json
{
  "jobTitle": "Senior Frontend Engineer",
  "departmentId": "DEPT-001",
  "employmentType": "full_time_permanent",
  "bio": "Updated notes."
}
```

------------------------------------------------------------------------

## 9. Single Delete

### `DELETE /api/v1/members/:id`

Deletes a single member.

**Example response:**

``` json
{
  "success": true,
  "message": "Member deleted successfully",
  "data": {
    "id": "MEM-2048",
    "name": "Sarah Jenkins",
    "permissionsRevoked": true,
    "sessionsRevoked": true,
    "accessTokensRevoked": true
  }
}
```

Only return `true` flags if actions actually execute successfully.

------------------------------------------------------------------------

## 10. Bulk Delete

### `POST /api/v1/members/bulk-delete`

**Example request:**

``` json
{
  "memberIds": [
    "MEM-2048",
    "MEM-2049"
  ]
}
```

**Example response:**

``` json
{
  "success": true,
  "message": "Members deleted successfully",
  "data": {
    "deletedCount": 2,
    "deletedMembers": [
      {
        "id": "MEM-2048",
        "name": "Sarah Jenkins"
      },
      {
        "id": "MEM-2049",
        "name": "Alex Rivera"
      }
    ],
    "permissionsRevoked": true,
    "sessionsRevoked": true,
    "accessTokensRevoked": true
  }
}
```

------------------------------------------------------------------------

## 11. Modals and UI States

All dialogs and modals live in the frontend.

| Modal | Trigger | Action |
|---|---|---|
| Member Added Successfully | Successful POST | Return to dashboard |
| Member Updated Successfully | Successful PATCH | Continue editing or return |
| Member Deleted Successfully | Successful DELETE | Dismiss |
| Members Deleted Successfully | Successful bulk delete | Dismiss |
| Confirmation Delete | Before delete | Confirm action |
| Error State | API failure | Display inline error or toast |

------------------------------------------------------------------------

## 12. Frontend-Only Features

- Export CSV: generated via browser Blob download.
- Copy ID: Clipboard API.
- Search and filters: Client-side filtering.
- Selection state: React state.
- Avatar fallbacks: Frontend rendering.

------------------------------------------------------------------------

## 13. Backend Architecture

Organize code by feature using controller, domain, usecase, and infrastructure layers.

### Directory structure

```text
src/
└── features/
    ├── member/
    │   ├── controller/
    │   ├── domain/
    │   ├── usecase/
    │   └── infrastructure/
    ├── department/
    │   ├── controller/
    │   ├── domain/
    │   ├── usecase/
    │   └── infrastructure/
    └── user/
        ├── controller/
        ├── domain/
        ├── usecase/
        └── infrastructure/
```
