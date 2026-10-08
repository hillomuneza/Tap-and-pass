import { CreateUserData, CreateUserVariables, UpdateCurrentUserData, UpdateCurrentUserVariables, DeleteCurrentUserData, GetCurrentUserData, ListUsersData, CreateEntryPointData, CreateEntryPointVariables, UpdateEntryPointData, UpdateEntryPointVariables, DeleteEntryPointData, DeleteEntryPointVariables, GetEntryPointData, GetEntryPointVariables, ListEntryPointsData, CreatePermissionData, CreatePermissionVariables, UpdatePermissionData, UpdatePermissionVariables, DeletePermissionData, DeletePermissionVariables, GetPermissionData, GetPermissionVariables, ListPermissionsData, CreateAccessLogData, CreateAccessLogVariables, DeleteAccessLogData, DeleteAccessLogVariables, GetAccessLogData, GetAccessLogVariables, ListMyAccessLogsData, CreateCredentialData, CreateCredentialVariables, UpdateCredentialData, UpdateCredentialVariables, DeleteCredentialData, DeleteCredentialVariables, GetMyCredentialData, ListCredentialsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useUpdateCurrentUser(options?: useDataConnectMutationOptions<UpdateCurrentUserData, FirebaseError, UpdateCurrentUserVariables | void>): UseDataConnectMutationResult<UpdateCurrentUserData, UpdateCurrentUserVariables>;
export function useUpdateCurrentUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCurrentUserData, FirebaseError, UpdateCurrentUserVariables | void>): UseDataConnectMutationResult<UpdateCurrentUserData, UpdateCurrentUserVariables>;

export function useDeleteCurrentUser(options?: useDataConnectMutationOptions<DeleteCurrentUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteCurrentUserData, undefined>;
export function useDeleteCurrentUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCurrentUserData, FirebaseError, void>): UseDataConnectMutationResult<DeleteCurrentUserData, undefined>;

export function useGetCurrentUser(options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;
export function useGetCurrentUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;

export function useListUsers(options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;
export function useListUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;

export function useCreateEntryPoint(options?: useDataConnectMutationOptions<CreateEntryPointData, FirebaseError, CreateEntryPointVariables>): UseDataConnectMutationResult<CreateEntryPointData, CreateEntryPointVariables>;
export function useCreateEntryPoint(dc: DataConnect, options?: useDataConnectMutationOptions<CreateEntryPointData, FirebaseError, CreateEntryPointVariables>): UseDataConnectMutationResult<CreateEntryPointData, CreateEntryPointVariables>;

export function useUpdateEntryPoint(options?: useDataConnectMutationOptions<UpdateEntryPointData, FirebaseError, UpdateEntryPointVariables>): UseDataConnectMutationResult<UpdateEntryPointData, UpdateEntryPointVariables>;
export function useUpdateEntryPoint(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEntryPointData, FirebaseError, UpdateEntryPointVariables>): UseDataConnectMutationResult<UpdateEntryPointData, UpdateEntryPointVariables>;

export function useDeleteEntryPoint(options?: useDataConnectMutationOptions<DeleteEntryPointData, FirebaseError, DeleteEntryPointVariables>): UseDataConnectMutationResult<DeleteEntryPointData, DeleteEntryPointVariables>;
export function useDeleteEntryPoint(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteEntryPointData, FirebaseError, DeleteEntryPointVariables>): UseDataConnectMutationResult<DeleteEntryPointData, DeleteEntryPointVariables>;

export function useGetEntryPoint(vars: GetEntryPointVariables, options?: useDataConnectQueryOptions<GetEntryPointData>): UseDataConnectQueryResult<GetEntryPointData, GetEntryPointVariables>;
export function useGetEntryPoint(dc: DataConnect, vars: GetEntryPointVariables, options?: useDataConnectQueryOptions<GetEntryPointData>): UseDataConnectQueryResult<GetEntryPointData, GetEntryPointVariables>;

export function useListEntryPoints(options?: useDataConnectQueryOptions<ListEntryPointsData>): UseDataConnectQueryResult<ListEntryPointsData, undefined>;
export function useListEntryPoints(dc: DataConnect, options?: useDataConnectQueryOptions<ListEntryPointsData>): UseDataConnectQueryResult<ListEntryPointsData, undefined>;

export function useCreatePermission(options?: useDataConnectMutationOptions<CreatePermissionData, FirebaseError, CreatePermissionVariables>): UseDataConnectMutationResult<CreatePermissionData, CreatePermissionVariables>;
export function useCreatePermission(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePermissionData, FirebaseError, CreatePermissionVariables>): UseDataConnectMutationResult<CreatePermissionData, CreatePermissionVariables>;

export function useUpdatePermission(options?: useDataConnectMutationOptions<UpdatePermissionData, FirebaseError, UpdatePermissionVariables>): UseDataConnectMutationResult<UpdatePermissionData, UpdatePermissionVariables>;
export function useUpdatePermission(dc: DataConnect, options?: useDataConnectMutationOptions<UpdatePermissionData, FirebaseError, UpdatePermissionVariables>): UseDataConnectMutationResult<UpdatePermissionData, UpdatePermissionVariables>;

export function useDeletePermission(options?: useDataConnectMutationOptions<DeletePermissionData, FirebaseError, DeletePermissionVariables>): UseDataConnectMutationResult<DeletePermissionData, DeletePermissionVariables>;
export function useDeletePermission(dc: DataConnect, options?: useDataConnectMutationOptions<DeletePermissionData, FirebaseError, DeletePermissionVariables>): UseDataConnectMutationResult<DeletePermissionData, DeletePermissionVariables>;

export function useGetPermission(vars: GetPermissionVariables, options?: useDataConnectQueryOptions<GetPermissionData>): UseDataConnectQueryResult<GetPermissionData, GetPermissionVariables>;
export function useGetPermission(dc: DataConnect, vars: GetPermissionVariables, options?: useDataConnectQueryOptions<GetPermissionData>): UseDataConnectQueryResult<GetPermissionData, GetPermissionVariables>;

export function useListPermissions(options?: useDataConnectQueryOptions<ListPermissionsData>): UseDataConnectQueryResult<ListPermissionsData, undefined>;
export function useListPermissions(dc: DataConnect, options?: useDataConnectQueryOptions<ListPermissionsData>): UseDataConnectQueryResult<ListPermissionsData, undefined>;

export function useCreateAccessLog(options?: useDataConnectMutationOptions<CreateAccessLogData, FirebaseError, CreateAccessLogVariables>): UseDataConnectMutationResult<CreateAccessLogData, CreateAccessLogVariables>;
export function useCreateAccessLog(dc: DataConnect, options?: useDataConnectMutationOptions<CreateAccessLogData, FirebaseError, CreateAccessLogVariables>): UseDataConnectMutationResult<CreateAccessLogData, CreateAccessLogVariables>;

export function useDeleteAccessLog(options?: useDataConnectMutationOptions<DeleteAccessLogData, FirebaseError, DeleteAccessLogVariables>): UseDataConnectMutationResult<DeleteAccessLogData, DeleteAccessLogVariables>;
export function useDeleteAccessLog(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteAccessLogData, FirebaseError, DeleteAccessLogVariables>): UseDataConnectMutationResult<DeleteAccessLogData, DeleteAccessLogVariables>;

export function useGetAccessLog(vars: GetAccessLogVariables, options?: useDataConnectQueryOptions<GetAccessLogData>): UseDataConnectQueryResult<GetAccessLogData, GetAccessLogVariables>;
export function useGetAccessLog(dc: DataConnect, vars: GetAccessLogVariables, options?: useDataConnectQueryOptions<GetAccessLogData>): UseDataConnectQueryResult<GetAccessLogData, GetAccessLogVariables>;

export function useListMyAccessLogs(options?: useDataConnectQueryOptions<ListMyAccessLogsData>): UseDataConnectQueryResult<ListMyAccessLogsData, undefined>;
export function useListMyAccessLogs(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyAccessLogsData>): UseDataConnectQueryResult<ListMyAccessLogsData, undefined>;

export function useCreateCredential(options?: useDataConnectMutationOptions<CreateCredentialData, FirebaseError, CreateCredentialVariables>): UseDataConnectMutationResult<CreateCredentialData, CreateCredentialVariables>;
export function useCreateCredential(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCredentialData, FirebaseError, CreateCredentialVariables>): UseDataConnectMutationResult<CreateCredentialData, CreateCredentialVariables>;

export function useUpdateCredential(options?: useDataConnectMutationOptions<UpdateCredentialData, FirebaseError, UpdateCredentialVariables>): UseDataConnectMutationResult<UpdateCredentialData, UpdateCredentialVariables>;
export function useUpdateCredential(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCredentialData, FirebaseError, UpdateCredentialVariables>): UseDataConnectMutationResult<UpdateCredentialData, UpdateCredentialVariables>;

export function useDeleteCredential(options?: useDataConnectMutationOptions<DeleteCredentialData, FirebaseError, DeleteCredentialVariables>): UseDataConnectMutationResult<DeleteCredentialData, DeleteCredentialVariables>;
export function useDeleteCredential(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCredentialData, FirebaseError, DeleteCredentialVariables>): UseDataConnectMutationResult<DeleteCredentialData, DeleteCredentialVariables>;

export function useGetMyCredential(options?: useDataConnectQueryOptions<GetMyCredentialData>): UseDataConnectQueryResult<GetMyCredentialData, undefined>;
export function useGetMyCredential(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyCredentialData>): UseDataConnectQueryResult<GetMyCredentialData, undefined>;

export function useListCredentials(options?: useDataConnectQueryOptions<ListCredentialsData>): UseDataConnectQueryResult<ListCredentialsData, undefined>;
export function useListCredentials(dc: DataConnect, options?: useDataConnectQueryOptions<ListCredentialsData>): UseDataConnectQueryResult<ListCredentialsData, undefined>;
