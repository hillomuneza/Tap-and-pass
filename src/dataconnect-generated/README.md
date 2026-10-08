# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetCurrentUser*](#getcurrentuser)
  - [*ListUsers*](#listusers)
  - [*GetEntryPoint*](#getentrypoint)
  - [*ListEntryPoints*](#listentrypoints)
  - [*GetPermission*](#getpermission)
  - [*ListPermissions*](#listpermissions)
  - [*GetAccessLog*](#getaccesslog)
  - [*ListMyAccessLogs*](#listmyaccesslogs)
  - [*GetMyCredential*](#getmycredential)
  - [*ListCredentials*](#listcredentials)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateCurrentUser*](#updatecurrentuser)
  - [*DeleteCurrentUser*](#deletecurrentuser)
  - [*CreateEntryPoint*](#createentrypoint)
  - [*UpdateEntryPoint*](#updateentrypoint)
  - [*DeleteEntryPoint*](#deleteentrypoint)
  - [*CreatePermission*](#createpermission)
  - [*UpdatePermission*](#updatepermission)
  - [*DeletePermission*](#deletepermission)
  - [*CreateAccessLog*](#createaccesslog)
  - [*DeleteAccessLog*](#deleteaccesslog)
  - [*CreateCredential*](#createcredential)
  - [*UpdateCredential*](#updatecredential)
  - [*DeleteCredential*](#deletecredential)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetCurrentUser
You can execute the `GetCurrentUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCurrentUserRef:
```typescript
const name = getCurrentUserRef.operationName;
console.log(name);
```

### Variables
The `GetCurrentUser` query has no variables.
### Return Type
Recall that executing the `GetCurrentUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCurrentUserData {
  user?: {
    email: string;
    fullName: string;
    role: string;
  };
}
```
### Using `GetCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentUser } from '@dataconnect/generated';


// Call the `getCurrentUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getCurrentUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetCurrentUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentUserRef } from '@dataconnect/generated';


// Call the `getCurrentUserRef()` function to get a reference to the query.
const ref = getCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
The `ListUsers` query has no variables.
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersData {
  users: ({
    fullName: string;
    role: string;
  })[];
}
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsers } from '@dataconnect/generated';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersRef } from '@dataconnect/generated';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetEntryPoint
You can execute the `GetEntryPoint` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getEntryPoint(vars: GetEntryPointVariables, options?: ExecuteQueryOptions): QueryPromise<GetEntryPointData, GetEntryPointVariables>;

interface GetEntryPointRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEntryPointVariables): QueryRef<GetEntryPointData, GetEntryPointVariables>;
}
export const getEntryPointRef: GetEntryPointRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getEntryPoint(dc: DataConnect, vars: GetEntryPointVariables, options?: ExecuteQueryOptions): QueryPromise<GetEntryPointData, GetEntryPointVariables>;

interface GetEntryPointRef {
  ...
  (dc: DataConnect, vars: GetEntryPointVariables): QueryRef<GetEntryPointData, GetEntryPointVariables>;
}
export const getEntryPointRef: GetEntryPointRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getEntryPointRef:
```typescript
const name = getEntryPointRef.operationName;
console.log(name);
```

### Variables
The `GetEntryPoint` query requires an argument of type `GetEntryPointVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetEntryPointVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetEntryPoint` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetEntryPointData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetEntryPointData {
  entryPoint?: {
    name: string;
    locationDescription: string;
    status: string;
  };
}
```
### Using `GetEntryPoint`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getEntryPoint, GetEntryPointVariables } from '@dataconnect/generated';

// The `GetEntryPoint` query requires an argument of type `GetEntryPointVariables`:
const getEntryPointVars: GetEntryPointVariables = {
  id: ..., 
};

// Call the `getEntryPoint()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getEntryPoint(getEntryPointVars);
// Variables can be defined inline as well.
const { data } = await getEntryPoint({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getEntryPoint(dataConnect, getEntryPointVars);

console.log(data.entryPoint);

// Or, you can use the `Promise` API.
getEntryPoint(getEntryPointVars).then((response) => {
  const data = response.data;
  console.log(data.entryPoint);
});
```

### Using `GetEntryPoint`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getEntryPointRef, GetEntryPointVariables } from '@dataconnect/generated';

// The `GetEntryPoint` query requires an argument of type `GetEntryPointVariables`:
const getEntryPointVars: GetEntryPointVariables = {
  id: ..., 
};

// Call the `getEntryPointRef()` function to get a reference to the query.
const ref = getEntryPointRef(getEntryPointVars);
// Variables can be defined inline as well.
const ref = getEntryPointRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getEntryPointRef(dataConnect, getEntryPointVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.entryPoint);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.entryPoint);
});
```

## ListEntryPoints
You can execute the `ListEntryPoints` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listEntryPoints(options?: ExecuteQueryOptions): QueryPromise<ListEntryPointsData, undefined>;

interface ListEntryPointsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEntryPointsData, undefined>;
}
export const listEntryPointsRef: ListEntryPointsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEntryPoints(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEntryPointsData, undefined>;

interface ListEntryPointsRef {
  ...
  (dc: DataConnect): QueryRef<ListEntryPointsData, undefined>;
}
export const listEntryPointsRef: ListEntryPointsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEntryPointsRef:
```typescript
const name = listEntryPointsRef.operationName;
console.log(name);
```

### Variables
The `ListEntryPoints` query has no variables.
### Return Type
Recall that executing the `ListEntryPoints` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEntryPointsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListEntryPointsData {
  entryPoints: ({
    name: string;
    status: string;
  })[];
}
```
### Using `ListEntryPoints`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEntryPoints } from '@dataconnect/generated';


// Call the `listEntryPoints()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEntryPoints();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEntryPoints(dataConnect);

console.log(data.entryPoints);

// Or, you can use the `Promise` API.
listEntryPoints().then((response) => {
  const data = response.data;
  console.log(data.entryPoints);
});
```

### Using `ListEntryPoints`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEntryPointsRef } from '@dataconnect/generated';


// Call the `listEntryPointsRef()` function to get a reference to the query.
const ref = listEntryPointsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEntryPointsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.entryPoints);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.entryPoints);
});
```

## GetPermission
You can execute the `GetPermission` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPermission(vars: GetPermissionVariables, options?: ExecuteQueryOptions): QueryPromise<GetPermissionData, GetPermissionVariables>;

interface GetPermissionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPermissionVariables): QueryRef<GetPermissionData, GetPermissionVariables>;
}
export const getPermissionRef: GetPermissionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPermission(dc: DataConnect, vars: GetPermissionVariables, options?: ExecuteQueryOptions): QueryPromise<GetPermissionData, GetPermissionVariables>;

interface GetPermissionRef {
  ...
  (dc: DataConnect, vars: GetPermissionVariables): QueryRef<GetPermissionData, GetPermissionVariables>;
}
export const getPermissionRef: GetPermissionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPermissionRef:
```typescript
const name = getPermissionRef.operationName;
console.log(name);
```

### Variables
The `GetPermission` query requires an argument of type `GetPermissionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPermissionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetPermission` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPermissionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPermissionData {
  permission?: {
    user: {
      fullName: string;
    };
    entryPoint: {
      name: string;
    };
    accessLevel: number;
  };
}
```
### Using `GetPermission`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPermission, GetPermissionVariables } from '@dataconnect/generated';

// The `GetPermission` query requires an argument of type `GetPermissionVariables`:
const getPermissionVars: GetPermissionVariables = {
  id: ..., 
};

// Call the `getPermission()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPermission(getPermissionVars);
// Variables can be defined inline as well.
const { data } = await getPermission({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPermission(dataConnect, getPermissionVars);

console.log(data.permission);

// Or, you can use the `Promise` API.
getPermission(getPermissionVars).then((response) => {
  const data = response.data;
  console.log(data.permission);
});
```

### Using `GetPermission`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPermissionRef, GetPermissionVariables } from '@dataconnect/generated';

// The `GetPermission` query requires an argument of type `GetPermissionVariables`:
const getPermissionVars: GetPermissionVariables = {
  id: ..., 
};

// Call the `getPermissionRef()` function to get a reference to the query.
const ref = getPermissionRef(getPermissionVars);
// Variables can be defined inline as well.
const ref = getPermissionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPermissionRef(dataConnect, getPermissionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.permission);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.permission);
});
```

## ListPermissions
You can execute the `ListPermissions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPermissions(options?: ExecuteQueryOptions): QueryPromise<ListPermissionsData, undefined>;

interface ListPermissionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPermissionsData, undefined>;
}
export const listPermissionsRef: ListPermissionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPermissions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPermissionsData, undefined>;

interface ListPermissionsRef {
  ...
  (dc: DataConnect): QueryRef<ListPermissionsData, undefined>;
}
export const listPermissionsRef: ListPermissionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPermissionsRef:
```typescript
const name = listPermissionsRef.operationName;
console.log(name);
```

### Variables
The `ListPermissions` query has no variables.
### Return Type
Recall that executing the `ListPermissions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPermissionsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPermissionsData {
  permissions: ({
    accessLevel: number;
    entryPoint: {
      name: string;
    };
  })[];
}
```
### Using `ListPermissions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPermissions } from '@dataconnect/generated';


// Call the `listPermissions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPermissions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPermissions(dataConnect);

console.log(data.permissions);

// Or, you can use the `Promise` API.
listPermissions().then((response) => {
  const data = response.data;
  console.log(data.permissions);
});
```

### Using `ListPermissions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPermissionsRef } from '@dataconnect/generated';


// Call the `listPermissionsRef()` function to get a reference to the query.
const ref = listPermissionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPermissionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.permissions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.permissions);
});
```

## GetAccessLog
You can execute the `GetAccessLog` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAccessLog(vars: GetAccessLogVariables, options?: ExecuteQueryOptions): QueryPromise<GetAccessLogData, GetAccessLogVariables>;

interface GetAccessLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAccessLogVariables): QueryRef<GetAccessLogData, GetAccessLogVariables>;
}
export const getAccessLogRef: GetAccessLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAccessLog(dc: DataConnect, vars: GetAccessLogVariables, options?: ExecuteQueryOptions): QueryPromise<GetAccessLogData, GetAccessLogVariables>;

interface GetAccessLogRef {
  ...
  (dc: DataConnect, vars: GetAccessLogVariables): QueryRef<GetAccessLogData, GetAccessLogVariables>;
}
export const getAccessLogRef: GetAccessLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAccessLogRef:
```typescript
const name = getAccessLogRef.operationName;
console.log(name);
```

### Variables
The `GetAccessLog` query requires an argument of type `GetAccessLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAccessLogVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetAccessLog` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAccessLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAccessLogData {
  accessLog?: {
    status: string;
    timestamp: TimestampString;
    entryPoint: {
      name: string;
    };
  };
}
```
### Using `GetAccessLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAccessLog, GetAccessLogVariables } from '@dataconnect/generated';

// The `GetAccessLog` query requires an argument of type `GetAccessLogVariables`:
const getAccessLogVars: GetAccessLogVariables = {
  id: ..., 
};

// Call the `getAccessLog()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAccessLog(getAccessLogVars);
// Variables can be defined inline as well.
const { data } = await getAccessLog({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAccessLog(dataConnect, getAccessLogVars);

console.log(data.accessLog);

// Or, you can use the `Promise` API.
getAccessLog(getAccessLogVars).then((response) => {
  const data = response.data;
  console.log(data.accessLog);
});
```

### Using `GetAccessLog`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAccessLogRef, GetAccessLogVariables } from '@dataconnect/generated';

// The `GetAccessLog` query requires an argument of type `GetAccessLogVariables`:
const getAccessLogVars: GetAccessLogVariables = {
  id: ..., 
};

// Call the `getAccessLogRef()` function to get a reference to the query.
const ref = getAccessLogRef(getAccessLogVars);
// Variables can be defined inline as well.
const ref = getAccessLogRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAccessLogRef(dataConnect, getAccessLogVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.accessLog);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.accessLog);
});
```

## ListMyAccessLogs
You can execute the `ListMyAccessLogs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyAccessLogs(options?: ExecuteQueryOptions): QueryPromise<ListMyAccessLogsData, undefined>;

interface ListMyAccessLogsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyAccessLogsData, undefined>;
}
export const listMyAccessLogsRef: ListMyAccessLogsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyAccessLogs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyAccessLogsData, undefined>;

interface ListMyAccessLogsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyAccessLogsData, undefined>;
}
export const listMyAccessLogsRef: ListMyAccessLogsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyAccessLogsRef:
```typescript
const name = listMyAccessLogsRef.operationName;
console.log(name);
```

### Variables
The `ListMyAccessLogs` query has no variables.
### Return Type
Recall that executing the `ListMyAccessLogs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyAccessLogsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyAccessLogsData {
  accessLogs: ({
    timestamp: TimestampString;
    status: string;
    entryPoint: {
      name: string;
    };
  })[];
}
```
### Using `ListMyAccessLogs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyAccessLogs } from '@dataconnect/generated';


// Call the `listMyAccessLogs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyAccessLogs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyAccessLogs(dataConnect);

console.log(data.accessLogs);

// Or, you can use the `Promise` API.
listMyAccessLogs().then((response) => {
  const data = response.data;
  console.log(data.accessLogs);
});
```

### Using `ListMyAccessLogs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyAccessLogsRef } from '@dataconnect/generated';


// Call the `listMyAccessLogsRef()` function to get a reference to the query.
const ref = listMyAccessLogsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyAccessLogsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.accessLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.accessLogs);
});
```

## GetMyCredential
You can execute the `GetMyCredential` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyCredential(options?: ExecuteQueryOptions): QueryPromise<GetMyCredentialData, undefined>;

interface GetMyCredentialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyCredentialData, undefined>;
}
export const getMyCredentialRef: GetMyCredentialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyCredential(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyCredentialData, undefined>;

interface GetMyCredentialRef {
  ...
  (dc: DataConnect): QueryRef<GetMyCredentialData, undefined>;
}
export const getMyCredentialRef: GetMyCredentialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyCredentialRef:
```typescript
const name = getMyCredentialRef.operationName;
console.log(name);
```

### Variables
The `GetMyCredential` query has no variables.
### Return Type
Recall that executing the `GetMyCredential` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyCredentialData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyCredentialData {
  credentials: ({
    nfcTokenHash: string;
    lastUsedAt: TimestampString;
  })[];
}
```
### Using `GetMyCredential`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyCredential } from '@dataconnect/generated';


// Call the `getMyCredential()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyCredential();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyCredential(dataConnect);

console.log(data.credentials);

// Or, you can use the `Promise` API.
getMyCredential().then((response) => {
  const data = response.data;
  console.log(data.credentials);
});
```

### Using `GetMyCredential`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyCredentialRef } from '@dataconnect/generated';


// Call the `getMyCredentialRef()` function to get a reference to the query.
const ref = getMyCredentialRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyCredentialRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.credentials);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.credentials);
});
```

## ListCredentials
You can execute the `ListCredentials` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCredentials(options?: ExecuteQueryOptions): QueryPromise<ListCredentialsData, undefined>;

interface ListCredentialsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCredentialsData, undefined>;
}
export const listCredentialsRef: ListCredentialsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCredentials(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCredentialsData, undefined>;

interface ListCredentialsRef {
  ...
  (dc: DataConnect): QueryRef<ListCredentialsData, undefined>;
}
export const listCredentialsRef: ListCredentialsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCredentialsRef:
```typescript
const name = listCredentialsRef.operationName;
console.log(name);
```

### Variables
The `ListCredentials` query has no variables.
### Return Type
Recall that executing the `ListCredentials` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCredentialsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCredentialsData {
  credentials: ({
    user: {
      fullName: string;
    };
    lastUsedAt: TimestampString;
  })[];
}
```
### Using `ListCredentials`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCredentials } from '@dataconnect/generated';


// Call the `listCredentials()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCredentials();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCredentials(dataConnect);

console.log(data.credentials);

// Or, you can use the `Promise` API.
listCredentials().then((response) => {
  const data = response.data;
  console.log(data.credentials);
});
```

### Using `ListCredentials`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCredentialsRef } from '@dataconnect/generated';


// Call the `listCredentialsRef()` function to get a reference to the query.
const ref = listCredentialsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCredentialsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.credentials);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.credentials);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  email: string;
  fullName: string;
  role: string;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  email: ..., 
  fullName: ..., 
  role: ..., 
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ email: ..., fullName: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  email: ..., 
  fullName: ..., 
  role: ..., 
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ email: ..., fullName: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateCurrentUser
You can execute the `UpdateCurrentUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateCurrentUser(vars?: UpdateCurrentUserVariables): MutationPromise<UpdateCurrentUserData, UpdateCurrentUserVariables>;

interface UpdateCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateCurrentUserVariables): MutationRef<UpdateCurrentUserData, UpdateCurrentUserVariables>;
}
export const updateCurrentUserRef: UpdateCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCurrentUser(dc: DataConnect, vars?: UpdateCurrentUserVariables): MutationPromise<UpdateCurrentUserData, UpdateCurrentUserVariables>;

interface UpdateCurrentUserRef {
  ...
  (dc: DataConnect, vars?: UpdateCurrentUserVariables): MutationRef<UpdateCurrentUserData, UpdateCurrentUserVariables>;
}
export const updateCurrentUserRef: UpdateCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCurrentUserRef:
```typescript
const name = updateCurrentUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateCurrentUser` mutation has an optional argument of type `UpdateCurrentUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCurrentUserVariables {
  fullName?: string | null;
  phoneNumber?: string | null;
}
```
### Return Type
Recall that executing the `UpdateCurrentUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCurrentUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCurrentUser, UpdateCurrentUserVariables } from '@dataconnect/generated';

// The `UpdateCurrentUser` mutation has an optional argument of type `UpdateCurrentUserVariables`:
const updateCurrentUserVars: UpdateCurrentUserVariables = {
  fullName: ..., // optional
  phoneNumber: ..., // optional
};

// Call the `updateCurrentUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCurrentUser(updateCurrentUserVars);
// Variables can be defined inline as well.
const { data } = await updateCurrentUser({ fullName: ..., phoneNumber: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateCurrentUserVariables` argument.
const { data } = await updateCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCurrentUser(dataConnect, updateCurrentUserVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateCurrentUser(updateCurrentUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateCurrentUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCurrentUserRef, UpdateCurrentUserVariables } from '@dataconnect/generated';

// The `UpdateCurrentUser` mutation has an optional argument of type `UpdateCurrentUserVariables`:
const updateCurrentUserVars: UpdateCurrentUserVariables = {
  fullName: ..., // optional
  phoneNumber: ..., // optional
};

// Call the `updateCurrentUserRef()` function to get a reference to the mutation.
const ref = updateCurrentUserRef(updateCurrentUserVars);
// Variables can be defined inline as well.
const ref = updateCurrentUserRef({ fullName: ..., phoneNumber: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateCurrentUserVariables` argument.
const ref = updateCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCurrentUserRef(dataConnect, updateCurrentUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteCurrentUser
You can execute the `DeleteCurrentUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteCurrentUser(): MutationPromise<DeleteCurrentUserData, undefined>;

interface DeleteCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteCurrentUserData, undefined>;
}
export const deleteCurrentUserRef: DeleteCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCurrentUser(dc: DataConnect): MutationPromise<DeleteCurrentUserData, undefined>;

interface DeleteCurrentUserRef {
  ...
  (dc: DataConnect): MutationRef<DeleteCurrentUserData, undefined>;
}
export const deleteCurrentUserRef: DeleteCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCurrentUserRef:
```typescript
const name = deleteCurrentUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteCurrentUser` mutation has no variables.
### Return Type
Recall that executing the `DeleteCurrentUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCurrentUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCurrentUser } from '@dataconnect/generated';


// Call the `deleteCurrentUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCurrentUser(dataConnect);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteCurrentUser().then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteCurrentUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCurrentUserRef } from '@dataconnect/generated';


// Call the `deleteCurrentUserRef()` function to get a reference to the mutation.
const ref = deleteCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCurrentUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreateEntryPoint
You can execute the `CreateEntryPoint` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createEntryPoint(vars: CreateEntryPointVariables): MutationPromise<CreateEntryPointData, CreateEntryPointVariables>;

interface CreateEntryPointRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEntryPointVariables): MutationRef<CreateEntryPointData, CreateEntryPointVariables>;
}
export const createEntryPointRef: CreateEntryPointRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createEntryPoint(dc: DataConnect, vars: CreateEntryPointVariables): MutationPromise<CreateEntryPointData, CreateEntryPointVariables>;

interface CreateEntryPointRef {
  ...
  (dc: DataConnect, vars: CreateEntryPointVariables): MutationRef<CreateEntryPointData, CreateEntryPointVariables>;
}
export const createEntryPointRef: CreateEntryPointRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createEntryPointRef:
```typescript
const name = createEntryPointRef.operationName;
console.log(name);
```

### Variables
The `CreateEntryPoint` mutation requires an argument of type `CreateEntryPointVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateEntryPointVariables {
  name: string;
  locationDescription: string;
  status: string;
}
```
### Return Type
Recall that executing the `CreateEntryPoint` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateEntryPointData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateEntryPointData {
  entryPoint_insert: EntryPoint_Key;
}
```
### Using `CreateEntryPoint`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createEntryPoint, CreateEntryPointVariables } from '@dataconnect/generated';

// The `CreateEntryPoint` mutation requires an argument of type `CreateEntryPointVariables`:
const createEntryPointVars: CreateEntryPointVariables = {
  name: ..., 
  locationDescription: ..., 
  status: ..., 
};

// Call the `createEntryPoint()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEntryPoint(createEntryPointVars);
// Variables can be defined inline as well.
const { data } = await createEntryPoint({ name: ..., locationDescription: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createEntryPoint(dataConnect, createEntryPointVars);

console.log(data.entryPoint_insert);

// Or, you can use the `Promise` API.
createEntryPoint(createEntryPointVars).then((response) => {
  const data = response.data;
  console.log(data.entryPoint_insert);
});
```

### Using `CreateEntryPoint`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createEntryPointRef, CreateEntryPointVariables } from '@dataconnect/generated';

// The `CreateEntryPoint` mutation requires an argument of type `CreateEntryPointVariables`:
const createEntryPointVars: CreateEntryPointVariables = {
  name: ..., 
  locationDescription: ..., 
  status: ..., 
};

// Call the `createEntryPointRef()` function to get a reference to the mutation.
const ref = createEntryPointRef(createEntryPointVars);
// Variables can be defined inline as well.
const ref = createEntryPointRef({ name: ..., locationDescription: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createEntryPointRef(dataConnect, createEntryPointVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.entryPoint_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.entryPoint_insert);
});
```

## UpdateEntryPoint
You can execute the `UpdateEntryPoint` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateEntryPoint(vars: UpdateEntryPointVariables): MutationPromise<UpdateEntryPointData, UpdateEntryPointVariables>;

interface UpdateEntryPointRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEntryPointVariables): MutationRef<UpdateEntryPointData, UpdateEntryPointVariables>;
}
export const updateEntryPointRef: UpdateEntryPointRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEntryPoint(dc: DataConnect, vars: UpdateEntryPointVariables): MutationPromise<UpdateEntryPointData, UpdateEntryPointVariables>;

interface UpdateEntryPointRef {
  ...
  (dc: DataConnect, vars: UpdateEntryPointVariables): MutationRef<UpdateEntryPointData, UpdateEntryPointVariables>;
}
export const updateEntryPointRef: UpdateEntryPointRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEntryPointRef:
```typescript
const name = updateEntryPointRef.operationName;
console.log(name);
```

### Variables
The `UpdateEntryPoint` mutation requires an argument of type `UpdateEntryPointVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateEntryPointVariables {
  id: UUIDString;
  status?: string | null;
}
```
### Return Type
Recall that executing the `UpdateEntryPoint` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEntryPointData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEntryPointData {
  entryPoint_update?: EntryPoint_Key | null;
}
```
### Using `UpdateEntryPoint`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEntryPoint, UpdateEntryPointVariables } from '@dataconnect/generated';

// The `UpdateEntryPoint` mutation requires an argument of type `UpdateEntryPointVariables`:
const updateEntryPointVars: UpdateEntryPointVariables = {
  id: ..., 
  status: ..., // optional
};

// Call the `updateEntryPoint()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEntryPoint(updateEntryPointVars);
// Variables can be defined inline as well.
const { data } = await updateEntryPoint({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEntryPoint(dataConnect, updateEntryPointVars);

console.log(data.entryPoint_update);

// Or, you can use the `Promise` API.
updateEntryPoint(updateEntryPointVars).then((response) => {
  const data = response.data;
  console.log(data.entryPoint_update);
});
```

### Using `UpdateEntryPoint`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEntryPointRef, UpdateEntryPointVariables } from '@dataconnect/generated';

// The `UpdateEntryPoint` mutation requires an argument of type `UpdateEntryPointVariables`:
const updateEntryPointVars: UpdateEntryPointVariables = {
  id: ..., 
  status: ..., // optional
};

// Call the `updateEntryPointRef()` function to get a reference to the mutation.
const ref = updateEntryPointRef(updateEntryPointVars);
// Variables can be defined inline as well.
const ref = updateEntryPointRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEntryPointRef(dataConnect, updateEntryPointVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.entryPoint_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.entryPoint_update);
});
```

## DeleteEntryPoint
You can execute the `DeleteEntryPoint` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteEntryPoint(vars: DeleteEntryPointVariables): MutationPromise<DeleteEntryPointData, DeleteEntryPointVariables>;

interface DeleteEntryPointRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEntryPointVariables): MutationRef<DeleteEntryPointData, DeleteEntryPointVariables>;
}
export const deleteEntryPointRef: DeleteEntryPointRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteEntryPoint(dc: DataConnect, vars: DeleteEntryPointVariables): MutationPromise<DeleteEntryPointData, DeleteEntryPointVariables>;

interface DeleteEntryPointRef {
  ...
  (dc: DataConnect, vars: DeleteEntryPointVariables): MutationRef<DeleteEntryPointData, DeleteEntryPointVariables>;
}
export const deleteEntryPointRef: DeleteEntryPointRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteEntryPointRef:
```typescript
const name = deleteEntryPointRef.operationName;
console.log(name);
```

### Variables
The `DeleteEntryPoint` mutation requires an argument of type `DeleteEntryPointVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteEntryPointVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteEntryPoint` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteEntryPointData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteEntryPointData {
  entryPoint_delete?: EntryPoint_Key | null;
}
```
### Using `DeleteEntryPoint`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteEntryPoint, DeleteEntryPointVariables } from '@dataconnect/generated';

// The `DeleteEntryPoint` mutation requires an argument of type `DeleteEntryPointVariables`:
const deleteEntryPointVars: DeleteEntryPointVariables = {
  id: ..., 
};

// Call the `deleteEntryPoint()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteEntryPoint(deleteEntryPointVars);
// Variables can be defined inline as well.
const { data } = await deleteEntryPoint({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteEntryPoint(dataConnect, deleteEntryPointVars);

console.log(data.entryPoint_delete);

// Or, you can use the `Promise` API.
deleteEntryPoint(deleteEntryPointVars).then((response) => {
  const data = response.data;
  console.log(data.entryPoint_delete);
});
```

### Using `DeleteEntryPoint`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteEntryPointRef, DeleteEntryPointVariables } from '@dataconnect/generated';

// The `DeleteEntryPoint` mutation requires an argument of type `DeleteEntryPointVariables`:
const deleteEntryPointVars: DeleteEntryPointVariables = {
  id: ..., 
};

// Call the `deleteEntryPointRef()` function to get a reference to the mutation.
const ref = deleteEntryPointRef(deleteEntryPointVars);
// Variables can be defined inline as well.
const ref = deleteEntryPointRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteEntryPointRef(dataConnect, deleteEntryPointVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.entryPoint_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.entryPoint_delete);
});
```

## CreatePermission
You can execute the `CreatePermission` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPermission(vars: CreatePermissionVariables): MutationPromise<CreatePermissionData, CreatePermissionVariables>;

interface CreatePermissionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePermissionVariables): MutationRef<CreatePermissionData, CreatePermissionVariables>;
}
export const createPermissionRef: CreatePermissionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPermission(dc: DataConnect, vars: CreatePermissionVariables): MutationPromise<CreatePermissionData, CreatePermissionVariables>;

interface CreatePermissionRef {
  ...
  (dc: DataConnect, vars: CreatePermissionVariables): MutationRef<CreatePermissionData, CreatePermissionVariables>;
}
export const createPermissionRef: CreatePermissionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPermissionRef:
```typescript
const name = createPermissionRef.operationName;
console.log(name);
```

### Variables
The `CreatePermission` mutation requires an argument of type `CreatePermissionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePermissionVariables {
  userId: UUIDString;
  entryPointId: UUIDString;
  accessLevel: number;
}
```
### Return Type
Recall that executing the `CreatePermission` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePermissionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePermissionData {
  permission_insert: Permission_Key;
}
```
### Using `CreatePermission`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPermission, CreatePermissionVariables } from '@dataconnect/generated';

// The `CreatePermission` mutation requires an argument of type `CreatePermissionVariables`:
const createPermissionVars: CreatePermissionVariables = {
  userId: ..., 
  entryPointId: ..., 
  accessLevel: ..., 
};

// Call the `createPermission()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPermission(createPermissionVars);
// Variables can be defined inline as well.
const { data } = await createPermission({ userId: ..., entryPointId: ..., accessLevel: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPermission(dataConnect, createPermissionVars);

console.log(data.permission_insert);

// Or, you can use the `Promise` API.
createPermission(createPermissionVars).then((response) => {
  const data = response.data;
  console.log(data.permission_insert);
});
```

### Using `CreatePermission`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPermissionRef, CreatePermissionVariables } from '@dataconnect/generated';

// The `CreatePermission` mutation requires an argument of type `CreatePermissionVariables`:
const createPermissionVars: CreatePermissionVariables = {
  userId: ..., 
  entryPointId: ..., 
  accessLevel: ..., 
};

// Call the `createPermissionRef()` function to get a reference to the mutation.
const ref = createPermissionRef(createPermissionVars);
// Variables can be defined inline as well.
const ref = createPermissionRef({ userId: ..., entryPointId: ..., accessLevel: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPermissionRef(dataConnect, createPermissionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.permission_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.permission_insert);
});
```

## UpdatePermission
You can execute the `UpdatePermission` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updatePermission(vars: UpdatePermissionVariables): MutationPromise<UpdatePermissionData, UpdatePermissionVariables>;

interface UpdatePermissionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePermissionVariables): MutationRef<UpdatePermissionData, UpdatePermissionVariables>;
}
export const updatePermissionRef: UpdatePermissionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePermission(dc: DataConnect, vars: UpdatePermissionVariables): MutationPromise<UpdatePermissionData, UpdatePermissionVariables>;

interface UpdatePermissionRef {
  ...
  (dc: DataConnect, vars: UpdatePermissionVariables): MutationRef<UpdatePermissionData, UpdatePermissionVariables>;
}
export const updatePermissionRef: UpdatePermissionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePermissionRef:
```typescript
const name = updatePermissionRef.operationName;
console.log(name);
```

### Variables
The `UpdatePermission` mutation requires an argument of type `UpdatePermissionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePermissionVariables {
  id: UUIDString;
  accessLevel: number;
}
```
### Return Type
Recall that executing the `UpdatePermission` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePermissionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePermissionData {
  permission_update?: Permission_Key | null;
}
```
### Using `UpdatePermission`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePermission, UpdatePermissionVariables } from '@dataconnect/generated';

// The `UpdatePermission` mutation requires an argument of type `UpdatePermissionVariables`:
const updatePermissionVars: UpdatePermissionVariables = {
  id: ..., 
  accessLevel: ..., 
};

// Call the `updatePermission()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePermission(updatePermissionVars);
// Variables can be defined inline as well.
const { data } = await updatePermission({ id: ..., accessLevel: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePermission(dataConnect, updatePermissionVars);

console.log(data.permission_update);

// Or, you can use the `Promise` API.
updatePermission(updatePermissionVars).then((response) => {
  const data = response.data;
  console.log(data.permission_update);
});
```

### Using `UpdatePermission`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePermissionRef, UpdatePermissionVariables } from '@dataconnect/generated';

// The `UpdatePermission` mutation requires an argument of type `UpdatePermissionVariables`:
const updatePermissionVars: UpdatePermissionVariables = {
  id: ..., 
  accessLevel: ..., 
};

// Call the `updatePermissionRef()` function to get a reference to the mutation.
const ref = updatePermissionRef(updatePermissionVars);
// Variables can be defined inline as well.
const ref = updatePermissionRef({ id: ..., accessLevel: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePermissionRef(dataConnect, updatePermissionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.permission_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.permission_update);
});
```

## DeletePermission
You can execute the `DeletePermission` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deletePermission(vars: DeletePermissionVariables): MutationPromise<DeletePermissionData, DeletePermissionVariables>;

interface DeletePermissionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePermissionVariables): MutationRef<DeletePermissionData, DeletePermissionVariables>;
}
export const deletePermissionRef: DeletePermissionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePermission(dc: DataConnect, vars: DeletePermissionVariables): MutationPromise<DeletePermissionData, DeletePermissionVariables>;

interface DeletePermissionRef {
  ...
  (dc: DataConnect, vars: DeletePermissionVariables): MutationRef<DeletePermissionData, DeletePermissionVariables>;
}
export const deletePermissionRef: DeletePermissionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePermissionRef:
```typescript
const name = deletePermissionRef.operationName;
console.log(name);
```

### Variables
The `DeletePermission` mutation requires an argument of type `DeletePermissionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePermissionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeletePermission` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePermissionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePermissionData {
  permission_delete?: Permission_Key | null;
}
```
### Using `DeletePermission`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePermission, DeletePermissionVariables } from '@dataconnect/generated';

// The `DeletePermission` mutation requires an argument of type `DeletePermissionVariables`:
const deletePermissionVars: DeletePermissionVariables = {
  id: ..., 
};

// Call the `deletePermission()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePermission(deletePermissionVars);
// Variables can be defined inline as well.
const { data } = await deletePermission({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePermission(dataConnect, deletePermissionVars);

console.log(data.permission_delete);

// Or, you can use the `Promise` API.
deletePermission(deletePermissionVars).then((response) => {
  const data = response.data;
  console.log(data.permission_delete);
});
```

### Using `DeletePermission`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePermissionRef, DeletePermissionVariables } from '@dataconnect/generated';

// The `DeletePermission` mutation requires an argument of type `DeletePermissionVariables`:
const deletePermissionVars: DeletePermissionVariables = {
  id: ..., 
};

// Call the `deletePermissionRef()` function to get a reference to the mutation.
const ref = deletePermissionRef(deletePermissionVars);
// Variables can be defined inline as well.
const ref = deletePermissionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePermissionRef(dataConnect, deletePermissionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.permission_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.permission_delete);
});
```

## CreateAccessLog
You can execute the `CreateAccessLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAccessLog(vars: CreateAccessLogVariables): MutationPromise<CreateAccessLogData, CreateAccessLogVariables>;

interface CreateAccessLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAccessLogVariables): MutationRef<CreateAccessLogData, CreateAccessLogVariables>;
}
export const createAccessLogRef: CreateAccessLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAccessLog(dc: DataConnect, vars: CreateAccessLogVariables): MutationPromise<CreateAccessLogData, CreateAccessLogVariables>;

interface CreateAccessLogRef {
  ...
  (dc: DataConnect, vars: CreateAccessLogVariables): MutationRef<CreateAccessLogData, CreateAccessLogVariables>;
}
export const createAccessLogRef: CreateAccessLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAccessLogRef:
```typescript
const name = createAccessLogRef.operationName;
console.log(name);
```

### Variables
The `CreateAccessLog` mutation requires an argument of type `CreateAccessLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAccessLogVariables {
  entryPointId: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `CreateAccessLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAccessLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAccessLogData {
  accessLog_insert: AccessLog_Key;
}
```
### Using `CreateAccessLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAccessLog, CreateAccessLogVariables } from '@dataconnect/generated';

// The `CreateAccessLog` mutation requires an argument of type `CreateAccessLogVariables`:
const createAccessLogVars: CreateAccessLogVariables = {
  entryPointId: ..., 
  status: ..., 
};

// Call the `createAccessLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAccessLog(createAccessLogVars);
// Variables can be defined inline as well.
const { data } = await createAccessLog({ entryPointId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAccessLog(dataConnect, createAccessLogVars);

console.log(data.accessLog_insert);

// Or, you can use the `Promise` API.
createAccessLog(createAccessLogVars).then((response) => {
  const data = response.data;
  console.log(data.accessLog_insert);
});
```

### Using `CreateAccessLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAccessLogRef, CreateAccessLogVariables } from '@dataconnect/generated';

// The `CreateAccessLog` mutation requires an argument of type `CreateAccessLogVariables`:
const createAccessLogVars: CreateAccessLogVariables = {
  entryPointId: ..., 
  status: ..., 
};

// Call the `createAccessLogRef()` function to get a reference to the mutation.
const ref = createAccessLogRef(createAccessLogVars);
// Variables can be defined inline as well.
const ref = createAccessLogRef({ entryPointId: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAccessLogRef(dataConnect, createAccessLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.accessLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.accessLog_insert);
});
```

## DeleteAccessLog
You can execute the `DeleteAccessLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteAccessLog(vars: DeleteAccessLogVariables): MutationPromise<DeleteAccessLogData, DeleteAccessLogVariables>;

interface DeleteAccessLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAccessLogVariables): MutationRef<DeleteAccessLogData, DeleteAccessLogVariables>;
}
export const deleteAccessLogRef: DeleteAccessLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAccessLog(dc: DataConnect, vars: DeleteAccessLogVariables): MutationPromise<DeleteAccessLogData, DeleteAccessLogVariables>;

interface DeleteAccessLogRef {
  ...
  (dc: DataConnect, vars: DeleteAccessLogVariables): MutationRef<DeleteAccessLogData, DeleteAccessLogVariables>;
}
export const deleteAccessLogRef: DeleteAccessLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAccessLogRef:
```typescript
const name = deleteAccessLogRef.operationName;
console.log(name);
```

### Variables
The `DeleteAccessLog` mutation requires an argument of type `DeleteAccessLogVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAccessLogVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteAccessLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAccessLogData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAccessLogData {
  accessLog_delete?: AccessLog_Key | null;
}
```
### Using `DeleteAccessLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAccessLog, DeleteAccessLogVariables } from '@dataconnect/generated';

// The `DeleteAccessLog` mutation requires an argument of type `DeleteAccessLogVariables`:
const deleteAccessLogVars: DeleteAccessLogVariables = {
  id: ..., 
};

// Call the `deleteAccessLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAccessLog(deleteAccessLogVars);
// Variables can be defined inline as well.
const { data } = await deleteAccessLog({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAccessLog(dataConnect, deleteAccessLogVars);

console.log(data.accessLog_delete);

// Or, you can use the `Promise` API.
deleteAccessLog(deleteAccessLogVars).then((response) => {
  const data = response.data;
  console.log(data.accessLog_delete);
});
```

### Using `DeleteAccessLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAccessLogRef, DeleteAccessLogVariables } from '@dataconnect/generated';

// The `DeleteAccessLog` mutation requires an argument of type `DeleteAccessLogVariables`:
const deleteAccessLogVars: DeleteAccessLogVariables = {
  id: ..., 
};

// Call the `deleteAccessLogRef()` function to get a reference to the mutation.
const ref = deleteAccessLogRef(deleteAccessLogVars);
// Variables can be defined inline as well.
const ref = deleteAccessLogRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAccessLogRef(dataConnect, deleteAccessLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.accessLog_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.accessLog_delete);
});
```

## CreateCredential
You can execute the `CreateCredential` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createCredential(vars: CreateCredentialVariables): MutationPromise<CreateCredentialData, CreateCredentialVariables>;

interface CreateCredentialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCredentialVariables): MutationRef<CreateCredentialData, CreateCredentialVariables>;
}
export const createCredentialRef: CreateCredentialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCredential(dc: DataConnect, vars: CreateCredentialVariables): MutationPromise<CreateCredentialData, CreateCredentialVariables>;

interface CreateCredentialRef {
  ...
  (dc: DataConnect, vars: CreateCredentialVariables): MutationRef<CreateCredentialData, CreateCredentialVariables>;
}
export const createCredentialRef: CreateCredentialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCredentialRef:
```typescript
const name = createCredentialRef.operationName;
console.log(name);
```

### Variables
The `CreateCredential` mutation requires an argument of type `CreateCredentialVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCredentialVariables {
  nfcTokenHash: string;
}
```
### Return Type
Recall that executing the `CreateCredential` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCredentialData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCredentialData {
  credential_insert: Credential_Key;
}
```
### Using `CreateCredential`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCredential, CreateCredentialVariables } from '@dataconnect/generated';

// The `CreateCredential` mutation requires an argument of type `CreateCredentialVariables`:
const createCredentialVars: CreateCredentialVariables = {
  nfcTokenHash: ..., 
};

// Call the `createCredential()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCredential(createCredentialVars);
// Variables can be defined inline as well.
const { data } = await createCredential({ nfcTokenHash: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCredential(dataConnect, createCredentialVars);

console.log(data.credential_insert);

// Or, you can use the `Promise` API.
createCredential(createCredentialVars).then((response) => {
  const data = response.data;
  console.log(data.credential_insert);
});
```

### Using `CreateCredential`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCredentialRef, CreateCredentialVariables } from '@dataconnect/generated';

// The `CreateCredential` mutation requires an argument of type `CreateCredentialVariables`:
const createCredentialVars: CreateCredentialVariables = {
  nfcTokenHash: ..., 
};

// Call the `createCredentialRef()` function to get a reference to the mutation.
const ref = createCredentialRef(createCredentialVars);
// Variables can be defined inline as well.
const ref = createCredentialRef({ nfcTokenHash: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCredentialRef(dataConnect, createCredentialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.credential_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.credential_insert);
});
```

## UpdateCredential
You can execute the `UpdateCredential` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateCredential(vars: UpdateCredentialVariables): MutationPromise<UpdateCredentialData, UpdateCredentialVariables>;

interface UpdateCredentialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCredentialVariables): MutationRef<UpdateCredentialData, UpdateCredentialVariables>;
}
export const updateCredentialRef: UpdateCredentialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCredential(dc: DataConnect, vars: UpdateCredentialVariables): MutationPromise<UpdateCredentialData, UpdateCredentialVariables>;

interface UpdateCredentialRef {
  ...
  (dc: DataConnect, vars: UpdateCredentialVariables): MutationRef<UpdateCredentialData, UpdateCredentialVariables>;
}
export const updateCredentialRef: UpdateCredentialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCredentialRef:
```typescript
const name = updateCredentialRef.operationName;
console.log(name);
```

### Variables
The `UpdateCredential` mutation requires an argument of type `UpdateCredentialVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCredentialVariables {
  id: UUIDString;
  nfcTokenHash: string;
}
```
### Return Type
Recall that executing the `UpdateCredential` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCredentialData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCredentialData {
  credential_update?: Credential_Key | null;
}
```
### Using `UpdateCredential`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCredential, UpdateCredentialVariables } from '@dataconnect/generated';

// The `UpdateCredential` mutation requires an argument of type `UpdateCredentialVariables`:
const updateCredentialVars: UpdateCredentialVariables = {
  id: ..., 
  nfcTokenHash: ..., 
};

// Call the `updateCredential()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCredential(updateCredentialVars);
// Variables can be defined inline as well.
const { data } = await updateCredential({ id: ..., nfcTokenHash: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCredential(dataConnect, updateCredentialVars);

console.log(data.credential_update);

// Or, you can use the `Promise` API.
updateCredential(updateCredentialVars).then((response) => {
  const data = response.data;
  console.log(data.credential_update);
});
```

### Using `UpdateCredential`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCredentialRef, UpdateCredentialVariables } from '@dataconnect/generated';

// The `UpdateCredential` mutation requires an argument of type `UpdateCredentialVariables`:
const updateCredentialVars: UpdateCredentialVariables = {
  id: ..., 
  nfcTokenHash: ..., 
};

// Call the `updateCredentialRef()` function to get a reference to the mutation.
const ref = updateCredentialRef(updateCredentialVars);
// Variables can be defined inline as well.
const ref = updateCredentialRef({ id: ..., nfcTokenHash: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCredentialRef(dataConnect, updateCredentialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.credential_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.credential_update);
});
```

## DeleteCredential
You can execute the `DeleteCredential` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteCredential(vars: DeleteCredentialVariables): MutationPromise<DeleteCredentialData, DeleteCredentialVariables>;

interface DeleteCredentialRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCredentialVariables): MutationRef<DeleteCredentialData, DeleteCredentialVariables>;
}
export const deleteCredentialRef: DeleteCredentialRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCredential(dc: DataConnect, vars: DeleteCredentialVariables): MutationPromise<DeleteCredentialData, DeleteCredentialVariables>;

interface DeleteCredentialRef {
  ...
  (dc: DataConnect, vars: DeleteCredentialVariables): MutationRef<DeleteCredentialData, DeleteCredentialVariables>;
}
export const deleteCredentialRef: DeleteCredentialRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCredentialRef:
```typescript
const name = deleteCredentialRef.operationName;
console.log(name);
```

### Variables
The `DeleteCredential` mutation requires an argument of type `DeleteCredentialVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCredentialVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteCredential` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCredentialData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCredentialData {
  credential_delete?: Credential_Key | null;
}
```
### Using `DeleteCredential`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCredential, DeleteCredentialVariables } from '@dataconnect/generated';

// The `DeleteCredential` mutation requires an argument of type `DeleteCredentialVariables`:
const deleteCredentialVars: DeleteCredentialVariables = {
  id: ..., 
};

// Call the `deleteCredential()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCredential(deleteCredentialVars);
// Variables can be defined inline as well.
const { data } = await deleteCredential({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCredential(dataConnect, deleteCredentialVars);

console.log(data.credential_delete);

// Or, you can use the `Promise` API.
deleteCredential(deleteCredentialVars).then((response) => {
  const data = response.data;
  console.log(data.credential_delete);
});
```

### Using `DeleteCredential`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCredentialRef, DeleteCredentialVariables } from '@dataconnect/generated';

// The `DeleteCredential` mutation requires an argument of type `DeleteCredentialVariables`:
const deleteCredentialVars: DeleteCredentialVariables = {
  id: ..., 
};

// Call the `deleteCredentialRef()` function to get a reference to the mutation.
const ref = deleteCredentialRef(deleteCredentialVars);
// Variables can be defined inline as well.
const ref = deleteCredentialRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCredentialRef(dataConnect, deleteCredentialVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.credential_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.credential_delete);
});
```

