import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

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

/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function createUser(dc: DataConnect, vars: CreateUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;
/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function createUser(vars: CreateUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateCurrentUser' Mutation. Allow users to execute without passing in DataConnect. */
export function updateCurrentUser(dc: DataConnect, vars?: UpdateCurrentUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCurrentUserData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateCurrentUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateCurrentUser(vars?: UpdateCurrentUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCurrentUserData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteCurrentUser' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteCurrentUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCurrentUserData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteCurrentUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteCurrentUser(options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCurrentUserData>>;

/** Generated Node Admin SDK operation action function for the 'GetCurrentUser' Query. Allow users to execute without passing in DataConnect. */
export function getCurrentUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCurrentUserData>>;
/** Generated Node Admin SDK operation action function for the 'GetCurrentUser' Query. Allow users to pass in custom DataConnect instances. */
export function getCurrentUser(options?: OperationOptions): Promise<ExecuteOperationResponse<GetCurrentUserData>>;

/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to execute without passing in DataConnect. */
export function listUsers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;
/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to pass in custom DataConnect instances. */
export function listUsers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;

/** Generated Node Admin SDK operation action function for the 'CreateEntryPoint' Mutation. Allow users to execute without passing in DataConnect. */
export function createEntryPoint(dc: DataConnect, vars: CreateEntryPointVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateEntryPointData>>;
/** Generated Node Admin SDK operation action function for the 'CreateEntryPoint' Mutation. Allow users to pass in custom DataConnect instances. */
export function createEntryPoint(vars: CreateEntryPointVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateEntryPointData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateEntryPoint' Mutation. Allow users to execute without passing in DataConnect. */
export function updateEntryPoint(dc: DataConnect, vars: UpdateEntryPointVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateEntryPointData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateEntryPoint' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateEntryPoint(vars: UpdateEntryPointVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateEntryPointData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteEntryPoint' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteEntryPoint(dc: DataConnect, vars: DeleteEntryPointVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteEntryPointData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteEntryPoint' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteEntryPoint(vars: DeleteEntryPointVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteEntryPointData>>;

/** Generated Node Admin SDK operation action function for the 'GetEntryPoint' Query. Allow users to execute without passing in DataConnect. */
export function getEntryPoint(dc: DataConnect, vars: GetEntryPointVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetEntryPointData>>;
/** Generated Node Admin SDK operation action function for the 'GetEntryPoint' Query. Allow users to pass in custom DataConnect instances. */
export function getEntryPoint(vars: GetEntryPointVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetEntryPointData>>;

/** Generated Node Admin SDK operation action function for the 'ListEntryPoints' Query. Allow users to execute without passing in DataConnect. */
export function listEntryPoints(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListEntryPointsData>>;
/** Generated Node Admin SDK operation action function for the 'ListEntryPoints' Query. Allow users to pass in custom DataConnect instances. */
export function listEntryPoints(options?: OperationOptions): Promise<ExecuteOperationResponse<ListEntryPointsData>>;

/** Generated Node Admin SDK operation action function for the 'CreatePermission' Mutation. Allow users to execute without passing in DataConnect. */
export function createPermission(dc: DataConnect, vars: CreatePermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePermissionData>>;
/** Generated Node Admin SDK operation action function for the 'CreatePermission' Mutation. Allow users to pass in custom DataConnect instances. */
export function createPermission(vars: CreatePermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreatePermissionData>>;

/** Generated Node Admin SDK operation action function for the 'UpdatePermission' Mutation. Allow users to execute without passing in DataConnect. */
export function updatePermission(dc: DataConnect, vars: UpdatePermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdatePermissionData>>;
/** Generated Node Admin SDK operation action function for the 'UpdatePermission' Mutation. Allow users to pass in custom DataConnect instances. */
export function updatePermission(vars: UpdatePermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdatePermissionData>>;

/** Generated Node Admin SDK operation action function for the 'DeletePermission' Mutation. Allow users to execute without passing in DataConnect. */
export function deletePermission(dc: DataConnect, vars: DeletePermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePermissionData>>;
/** Generated Node Admin SDK operation action function for the 'DeletePermission' Mutation. Allow users to pass in custom DataConnect instances. */
export function deletePermission(vars: DeletePermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePermissionData>>;

/** Generated Node Admin SDK operation action function for the 'GetPermission' Query. Allow users to execute without passing in DataConnect. */
export function getPermission(dc: DataConnect, vars: GetPermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPermissionData>>;
/** Generated Node Admin SDK operation action function for the 'GetPermission' Query. Allow users to pass in custom DataConnect instances. */
export function getPermission(vars: GetPermissionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPermissionData>>;

/** Generated Node Admin SDK operation action function for the 'ListPermissions' Query. Allow users to execute without passing in DataConnect. */
export function listPermissions(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListPermissionsData>>;
/** Generated Node Admin SDK operation action function for the 'ListPermissions' Query. Allow users to pass in custom DataConnect instances. */
export function listPermissions(options?: OperationOptions): Promise<ExecuteOperationResponse<ListPermissionsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateAccessLog' Mutation. Allow users to execute without passing in DataConnect. */
export function createAccessLog(dc: DataConnect, vars: CreateAccessLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateAccessLogData>>;
/** Generated Node Admin SDK operation action function for the 'CreateAccessLog' Mutation. Allow users to pass in custom DataConnect instances. */
export function createAccessLog(vars: CreateAccessLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateAccessLogData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteAccessLog' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteAccessLog(dc: DataConnect, vars: DeleteAccessLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteAccessLogData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteAccessLog' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteAccessLog(vars: DeleteAccessLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteAccessLogData>>;

/** Generated Node Admin SDK operation action function for the 'GetAccessLog' Query. Allow users to execute without passing in DataConnect. */
export function getAccessLog(dc: DataConnect, vars: GetAccessLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetAccessLogData>>;
/** Generated Node Admin SDK operation action function for the 'GetAccessLog' Query. Allow users to pass in custom DataConnect instances. */
export function getAccessLog(vars: GetAccessLogVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetAccessLogData>>;

/** Generated Node Admin SDK operation action function for the 'ListMyAccessLogs' Query. Allow users to execute without passing in DataConnect. */
export function listMyAccessLogs(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyAccessLogsData>>;
/** Generated Node Admin SDK operation action function for the 'ListMyAccessLogs' Query. Allow users to pass in custom DataConnect instances. */
export function listMyAccessLogs(options?: OperationOptions): Promise<ExecuteOperationResponse<ListMyAccessLogsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateCredential' Mutation. Allow users to execute without passing in DataConnect. */
export function createCredential(dc: DataConnect, vars: CreateCredentialVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateCredentialData>>;
/** Generated Node Admin SDK operation action function for the 'CreateCredential' Mutation. Allow users to pass in custom DataConnect instances. */
export function createCredential(vars: CreateCredentialVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateCredentialData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateCredential' Mutation. Allow users to execute without passing in DataConnect. */
export function updateCredential(dc: DataConnect, vars: UpdateCredentialVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCredentialData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateCredential' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateCredential(vars: UpdateCredentialVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateCredentialData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteCredential' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteCredential(dc: DataConnect, vars: DeleteCredentialVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCredentialData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteCredential' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteCredential(vars: DeleteCredentialVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteCredentialData>>;

/** Generated Node Admin SDK operation action function for the 'GetMyCredential' Query. Allow users to execute without passing in DataConnect. */
export function getMyCredential(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyCredentialData>>;
/** Generated Node Admin SDK operation action function for the 'GetMyCredential' Query. Allow users to pass in custom DataConnect instances. */
export function getMyCredential(options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyCredentialData>>;

/** Generated Node Admin SDK operation action function for the 'ListCredentials' Query. Allow users to execute without passing in DataConnect. */
export function listCredentials(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListCredentialsData>>;
/** Generated Node Admin SDK operation action function for the 'ListCredentials' Query. Allow users to pass in custom DataConnect instances. */
export function listCredentials(options?: OperationOptions): Promise<ExecuteOperationResponse<ListCredentialsData>>;

