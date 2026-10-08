import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AccessLog_Key {
  id: UUIDString;
  __typename?: 'AccessLog_Key';
}

export interface CreateAccessLogData {
  accessLog_insert: AccessLog_Key;
}

export interface CreateAccessLogVariables {
  entryPointId: UUIDString;
  status: string;
}

export interface CreateCredentialData {
  credential_insert: Credential_Key;
}

export interface CreateCredentialVariables {
  nfcTokenHash: string;
}

export interface CreateEntryPointData {
  entryPoint_insert: EntryPoint_Key;
}

export interface CreateEntryPointVariables {
  name: string;
  locationDescription: string;
  status: string;
}

export interface CreatePermissionData {
  permission_insert: Permission_Key;
}

export interface CreatePermissionVariables {
  userId: UUIDString;
  entryPointId: UUIDString;
  accessLevel: number;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  email: string;
  fullName: string;
  role: string;
}

export interface Credential_Key {
  id: UUIDString;
  __typename?: 'Credential_Key';
}

export interface DeleteAccessLogData {
  accessLog_delete?: AccessLog_Key | null;
}

export interface DeleteAccessLogVariables {
  id: UUIDString;
}

export interface DeleteCredentialData {
  credential_delete?: Credential_Key | null;
}

export interface DeleteCredentialVariables {
  id: UUIDString;
}

export interface DeleteCurrentUserData {
  user_delete?: User_Key | null;
}

export interface DeleteEntryPointData {
  entryPoint_delete?: EntryPoint_Key | null;
}

export interface DeleteEntryPointVariables {
  id: UUIDString;
}

export interface DeletePermissionData {
  permission_delete?: Permission_Key | null;
}

export interface DeletePermissionVariables {
  id: UUIDString;
}

export interface EntryPoint_Key {
  id: UUIDString;
  __typename?: 'EntryPoint_Key';
}

export interface GetAccessLogData {
  accessLog?: {
    status: string;
    timestamp: TimestampString;
    entryPoint: {
      name: string;
    };
  };
}

export interface GetAccessLogVariables {
  id: UUIDString;
}

export interface GetCurrentUserData {
  user?: {
    email: string;
    fullName: string;
    role: string;
  };
}

export interface GetEntryPointData {
  entryPoint?: {
    name: string;
    locationDescription: string;
    status: string;
  };
}

export interface GetEntryPointVariables {
  id: UUIDString;
}

export interface GetMyCredentialData {
  credentials: ({
    nfcTokenHash: string;
    lastUsedAt: TimestampString;
  })[];
}

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

export interface GetPermissionVariables {
  id: UUIDString;
}

export interface ListCredentialsData {
  credentials: ({
    user: {
      fullName: string;
    };
    lastUsedAt: TimestampString;
  })[];
}

export interface ListEntryPointsData {
  entryPoints: ({
    name: string;
    status: string;
  })[];
}

export interface ListMyAccessLogsData {
  accessLogs: ({
    timestamp: TimestampString;
    status: string;
    entryPoint: {
      name: string;
    };
  })[];
}

export interface ListPermissionsData {
  permissions: ({
    accessLevel: number;
    entryPoint: {
      name: string;
    };
  })[];
}

export interface ListUsersData {
  users: ({
    fullName: string;
    role: string;
  })[];
}

export interface Permission_Key {
  id: UUIDString;
  __typename?: 'Permission_Key';
}

export interface UpdateCredentialData {
  credential_update?: Credential_Key | null;
}

export interface UpdateCredentialVariables {
  id: UUIDString;
  nfcTokenHash: string;
}

export interface UpdateCurrentUserData {
  user_update?: User_Key | null;
}

export interface UpdateCurrentUserVariables {
  fullName?: string | null;
  phoneNumber?: string | null;
}

export interface UpdateEntryPointData {
  entryPoint_update?: EntryPoint_Key | null;
}

export interface UpdateEntryPointVariables {
  id: UUIDString;
  status?: string | null;
}

export interface UpdatePermissionData {
  permission_update?: Permission_Key | null;
}

export interface UpdatePermissionVariables {
  id: UUIDString;
  accessLevel: number;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpdateCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateCurrentUserVariables): MutationRef<UpdateCurrentUserData, UpdateCurrentUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateCurrentUserVariables): MutationRef<UpdateCurrentUserData, UpdateCurrentUserVariables>;
  operationName: string;
}
export const updateCurrentUserRef: UpdateCurrentUserRef;

export function updateCurrentUser(vars?: UpdateCurrentUserVariables): MutationPromise<UpdateCurrentUserData, UpdateCurrentUserVariables>;
export function updateCurrentUser(dc: DataConnect, vars?: UpdateCurrentUserVariables): MutationPromise<UpdateCurrentUserData, UpdateCurrentUserVariables>;

interface DeleteCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteCurrentUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteCurrentUserData, undefined>;
  operationName: string;
}
export const deleteCurrentUserRef: DeleteCurrentUserRef;

export function deleteCurrentUser(): MutationPromise<DeleteCurrentUserData, undefined>;
export function deleteCurrentUser(dc: DataConnect): MutationPromise<DeleteCurrentUserData, undefined>;

interface GetCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
  operationName: string;
}
export const getCurrentUserRef: GetCurrentUserRef;

export function getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;
export function getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface CreateEntryPointRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEntryPointVariables): MutationRef<CreateEntryPointData, CreateEntryPointVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEntryPointVariables): MutationRef<CreateEntryPointData, CreateEntryPointVariables>;
  operationName: string;
}
export const createEntryPointRef: CreateEntryPointRef;

export function createEntryPoint(vars: CreateEntryPointVariables): MutationPromise<CreateEntryPointData, CreateEntryPointVariables>;
export function createEntryPoint(dc: DataConnect, vars: CreateEntryPointVariables): MutationPromise<CreateEntryPointData, CreateEntryPointVariables>;

interface UpdateEntryPointRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEntryPointVariables): MutationRef<UpdateEntryPointData, UpdateEntryPointVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEntryPointVariables): MutationRef<UpdateEntryPointData, UpdateEntryPointVariables>;
  operationName: string;
}
export const updateEntryPointRef: UpdateEntryPointRef;

export function updateEntryPoint(vars: UpdateEntryPointVariables): MutationPromise<UpdateEntryPointData, UpdateEntryPointVariables>;
export function updateEntryPoint(dc: DataConnect, vars: UpdateEntryPointVariables): MutationPromise<UpdateEntryPointData, UpdateEntryPointVariables>;

interface DeleteEntryPointRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEntryPointVariables): MutationRef<DeleteEntryPointData, DeleteEntryPointVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteEntryPointVariables): MutationRef<DeleteEntryPointData, DeleteEntryPointVariables>;
  operationName: string;
}
export const deleteEntryPointRef: DeleteEntryPointRef;

export function deleteEntryPoint(vars: DeleteEntryPointVariables): MutationPromise<DeleteEntryPointData, DeleteEntryPointVariables>;
export function deleteEntryPoint(dc: DataConnect, vars: DeleteEntryPointVariables): MutationPromise<DeleteEntryPointData, DeleteEntryPointVariables>;

interface GetEntryPointRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetEntryPointVariables): QueryRef<GetEntryPointData, GetEntryPointVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetEntryPointVariables): QueryRef<GetEntryPointData, GetEntryPointVariables>;
  operationName: string;
}
export const getEntryPointRef: GetEntryPointRef;

export function getEntryPoint(vars: GetEntryPointVariables, options?: ExecuteQueryOptions): QueryPromise<GetEntryPointData, GetEntryPointVariables>;
export function getEntryPoint(dc: DataConnect, vars: GetEntryPointVariables, options?: ExecuteQueryOptions): QueryPromise<GetEntryPointData, GetEntryPointVariables>;

interface ListEntryPointsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEntryPointsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListEntryPointsData, undefined>;
  operationName: string;
}
export const listEntryPointsRef: ListEntryPointsRef;

export function listEntryPoints(options?: ExecuteQueryOptions): QueryPromise<ListEntryPointsData, undefined>;
export function listEntryPoints(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEntryPointsData, undefined>;

interface CreatePermissionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePermissionVariables): MutationRef<CreatePermissionData, CreatePermissionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePermissionVariables): MutationRef<CreatePermissionData, CreatePermissionVariables>;
  operationName: string;
}
export const createPermissionRef: CreatePermissionRef;

export function createPermission(vars: CreatePermissionVariables): MutationPromise<CreatePermissionData, CreatePermissionVariables>;
export function createPermission(dc: DataConnect, vars: CreatePermissionVariables): MutationPromise<CreatePermissionData, CreatePermissionVariables>;

interface UpdatePermissionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePermissionVariables): MutationRef<UpdatePermissionData, UpdatePermissionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePermissionVariables): MutationRef<UpdatePermissionData, UpdatePermissionVariables>;
  operationName: string;
}
export const updatePermissionRef: UpdatePermissionRef;

export function updatePermission(vars: UpdatePermissionVariables): MutationPromise<UpdatePermissionData, UpdatePermissionVariables>;
export function updatePermission(dc: DataConnect, vars: UpdatePermissionVariables): MutationPromise<UpdatePermissionData, UpdatePermissionVariables>;

interface DeletePermissionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePermissionVariables): MutationRef<DeletePermissionData, DeletePermissionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePermissionVariables): MutationRef<DeletePermissionData, DeletePermissionVariables>;
  operationName: string;
}
export const deletePermissionRef: DeletePermissionRef;

export function deletePermission(vars: DeletePermissionVariables): MutationPromise<DeletePermissionData, DeletePermissionVariables>;
export function deletePermission(dc: DataConnect, vars: DeletePermissionVariables): MutationPromise<DeletePermissionData, DeletePermissionVariables>;

interface GetPermissionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPermissionVariables): QueryRef<GetPermissionData, GetPermissionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPermissionVariables): QueryRef<GetPermissionData, GetPermissionVariables>;
  operationName: string;
}
export const getPermissionRef: GetPermissionRef;

export function getPermission(vars: GetPermissionVariables, options?: ExecuteQueryOptions): QueryPromise<GetPermissionData, GetPermissionVariables>;
export function getPermission(dc: DataConnect, vars: GetPermissionVariables, options?: ExecuteQueryOptions): QueryPromise<GetPermissionData, GetPermissionVariables>;

interface ListPermissionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPermissionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPermissionsData, undefined>;
  operationName: string;
}
export const listPermissionsRef: ListPermissionsRef;

export function listPermissions(options?: ExecuteQueryOptions): QueryPromise<ListPermissionsData, undefined>;
export function listPermissions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPermissionsData, undefined>;

interface CreateAccessLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAccessLogVariables): MutationRef<CreateAccessLogData, CreateAccessLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAccessLogVariables): MutationRef<CreateAccessLogData, CreateAccessLogVariables>;
  operationName: string;
}
export const createAccessLogRef: CreateAccessLogRef;

export function createAccessLog(vars: CreateAccessLogVariables): MutationPromise<CreateAccessLogData, CreateAccessLogVariables>;
export function createAccessLog(dc: DataConnect, vars: CreateAccessLogVariables): MutationPromise<CreateAccessLogData, CreateAccessLogVariables>;

interface DeleteAccessLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAccessLogVariables): MutationRef<DeleteAccessLogData, DeleteAccessLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAccessLogVariables): MutationRef<DeleteAccessLogData, DeleteAccessLogVariables>;
  operationName: string;
}
export const deleteAccessLogRef: DeleteAccessLogRef;

export function deleteAccessLog(vars: DeleteAccessLogVariables): MutationPromise<DeleteAccessLogData, DeleteAccessLogVariables>;
export function deleteAccessLog(dc: DataConnect, vars: DeleteAccessLogVariables): MutationPromise<DeleteAccessLogData, DeleteAccessLogVariables>;

interface GetAccessLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAccessLogVariables): QueryRef<GetAccessLogData, GetAccessLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAccessLogVariables): QueryRef<GetAccessLogData, GetAccessLogVariables>;
  operationName: string;
}
export const getAccessLogRef: GetAccessLogRef;

export function getAccessLog(vars: GetAccessLogVariables, options?: ExecuteQueryOptions): QueryPromise<GetAccessLogData, GetAccessLogVariables>;
export function getAccessLog(dc: DataConnect, vars: GetAccessLogVariables, options?: ExecuteQueryOptions): QueryPromise<GetAccessLogData, GetAccessLogVariables>;

interface ListMyAccessLogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyAccessLogsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyAccessLogsData, undefined>;
  operationName: string;
}
export const listMyAccessLogsRef: ListMyAccessLogsRef;

export function listMyAccessLogs(options?: ExecuteQueryOptions): QueryPromise<ListMyAccessLogsData, undefined>;
export function listMyAccessLogs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyAccessLogsData, undefined>;

interface CreateCredentialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCredentialVariables): MutationRef<CreateCredentialData, CreateCredentialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCredentialVariables): MutationRef<CreateCredentialData, CreateCredentialVariables>;
  operationName: string;
}
export const createCredentialRef: CreateCredentialRef;

export function createCredential(vars: CreateCredentialVariables): MutationPromise<CreateCredentialData, CreateCredentialVariables>;
export function createCredential(dc: DataConnect, vars: CreateCredentialVariables): MutationPromise<CreateCredentialData, CreateCredentialVariables>;

interface UpdateCredentialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCredentialVariables): MutationRef<UpdateCredentialData, UpdateCredentialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCredentialVariables): MutationRef<UpdateCredentialData, UpdateCredentialVariables>;
  operationName: string;
}
export const updateCredentialRef: UpdateCredentialRef;

export function updateCredential(vars: UpdateCredentialVariables): MutationPromise<UpdateCredentialData, UpdateCredentialVariables>;
export function updateCredential(dc: DataConnect, vars: UpdateCredentialVariables): MutationPromise<UpdateCredentialData, UpdateCredentialVariables>;

interface DeleteCredentialRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCredentialVariables): MutationRef<DeleteCredentialData, DeleteCredentialVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCredentialVariables): MutationRef<DeleteCredentialData, DeleteCredentialVariables>;
  operationName: string;
}
export const deleteCredentialRef: DeleteCredentialRef;

export function deleteCredential(vars: DeleteCredentialVariables): MutationPromise<DeleteCredentialData, DeleteCredentialVariables>;
export function deleteCredential(dc: DataConnect, vars: DeleteCredentialVariables): MutationPromise<DeleteCredentialData, DeleteCredentialVariables>;

interface GetMyCredentialRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyCredentialData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyCredentialData, undefined>;
  operationName: string;
}
export const getMyCredentialRef: GetMyCredentialRef;

export function getMyCredential(options?: ExecuteQueryOptions): QueryPromise<GetMyCredentialData, undefined>;
export function getMyCredential(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyCredentialData, undefined>;

interface ListCredentialsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCredentialsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCredentialsData, undefined>;
  operationName: string;
}
export const listCredentialsRef: ListCredentialsRef;

export function listCredentials(options?: ExecuteQueryOptions): QueryPromise<ListCredentialsData, undefined>;
export function listCredentials(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCredentialsData, undefined>;

