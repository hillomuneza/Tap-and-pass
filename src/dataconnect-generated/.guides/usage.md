# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUser, useUpdateCurrentUser, useDeleteCurrentUser, useGetCurrentUser, useListUsers, useCreateEntryPoint, useUpdateEntryPoint, useDeleteEntryPoint, useGetEntryPoint, useListEntryPoints } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUser(createUserVars);

const { data, isPending, isSuccess, isError, error } = useUpdateCurrentUser(updateCurrentUserVars);

const { data, isPending, isSuccess, isError, error } = useDeleteCurrentUser();

const { data, isPending, isSuccess, isError, error } = useGetCurrentUser();

const { data, isPending, isSuccess, isError, error } = useListUsers();

const { data, isPending, isSuccess, isError, error } = useCreateEntryPoint(createEntryPointVars);

const { data, isPending, isSuccess, isError, error } = useUpdateEntryPoint(updateEntryPointVars);

const { data, isPending, isSuccess, isError, error } = useDeleteEntryPoint(deleteEntryPointVars);

const { data, isPending, isSuccess, isError, error } = useGetEntryPoint(getEntryPointVars);

const { data, isPending, isSuccess, isError, error } = useListEntryPoints();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, updateCurrentUser, deleteCurrentUser, getCurrentUser, listUsers, createEntryPoint, updateEntryPoint, deleteEntryPoint, getEntryPoint, listEntryPoints } from '@dataconnect/generated';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation UpdateCurrentUser:  For variables, look at type UpdateCurrentUserVars in ../index.d.ts
const { data } = await UpdateCurrentUser(dataConnect, updateCurrentUserVars);

// Operation DeleteCurrentUser: 
const { data } = await DeleteCurrentUser(dataConnect);

// Operation GetCurrentUser: 
const { data } = await GetCurrentUser(dataConnect);

// Operation ListUsers: 
const { data } = await ListUsers(dataConnect);

// Operation CreateEntryPoint:  For variables, look at type CreateEntryPointVars in ../index.d.ts
const { data } = await CreateEntryPoint(dataConnect, createEntryPointVars);

// Operation UpdateEntryPoint:  For variables, look at type UpdateEntryPointVars in ../index.d.ts
const { data } = await UpdateEntryPoint(dataConnect, updateEntryPointVars);

// Operation DeleteEntryPoint:  For variables, look at type DeleteEntryPointVars in ../index.d.ts
const { data } = await DeleteEntryPoint(dataConnect, deleteEntryPointVars);

// Operation GetEntryPoint:  For variables, look at type GetEntryPointVars in ../index.d.ts
const { data } = await GetEntryPoint(dataConnect, getEntryPointVars);

// Operation ListEntryPoints: 
const { data } = await ListEntryPoints(dataConnect);


```