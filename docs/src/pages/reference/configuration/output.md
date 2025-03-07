---
id: configuration-output
title: Output
---

### target

Type: `String`.

Valid values: path to the file which will contains the implementation.

```js
module.exports = {
  petstore: {
    output: {
      target: 'src/petstore.ts',
    },
  },
};
```

### client

Type: `String | Function`.

Valid values: `axios`, `axios-functions`, `angular`, `react-query`, `svelte-query`, `vue-query`.

Default Value: `axios`.

```js
module.exports = {
  petstore: {
    output: {
      client: 'react-query',
    },
  },
};
```

if you want you can provide a function to extend or create you custom client generator and this function receive a [GeneratorClients](https://github.com/anymaniax/orval/blob/master/src/types/generator.ts#L148) in argument and should return a [ClientGeneratorsBuilder](https://github.com/anymaniax/orval/blob/master/src/types/generator.ts#L140).

### schemas

Type: `String`.

Valid values: path to the folder where you want to generate all your models.

Default Value: same as the target.

```js
module.exports = {
  petstore: {
    output: {
      schemas: './api/model',
    },
  },
};
```

### workspace

Type: `String`.

Valid values: path to the folder which will contains all the generated files. This value will be use as a base for all the other path used in the orval config.

If you provide this option, an `index.ts` file will be also created with all the available exports

```js
module.exports = {
  petstore: {
    output: {
      workspace: 'src/'
      target: './petstore.ts',
    },
  },
};
```

### mode

Type: `String`.

Valid values: `single`, `split`, `tags`, `tags-split`.

Default Value: `single`.

```js
module.exports = {
  petstore: {
    output: {
      mode: 'tags-split',
    },
  },
};
```

#### Value: single

Use to have one file with everything

```js
module.exports = {
  petstore: {
    output: {
      target: 'src/petstore.ts',
    },
  },
};
```

```
my-app
└── src
    └── api
        └── endpoints
            └── petstore.ts
```

Here a single file petstore will be created in src with your specification implementation.

#### Value: split

Use to have definition, implementation, schemas, mock in differents files

```js
module.exports = {
  petstore: {
    output: {
      target: 'src/petstore.ts',
      mode: 'split',
    },
  },
};
```

```
my-app
└── src
    ├── petstore.definition.ts
    ├── petstore.schemas.ts
    ├── petstore.msw.ts
    └── petstore.ts
```

Here depending on the configuration, you will have multiple files named petstore with a prefix created in src.

- petstore.definition.ts
- petstore.schemas.ts
- petstore.ts
- petstore.msw.ts

For Angular:

=> petstore.ts is petstore.service.ts

#### Value: tags

Use this mode if you want one file by tag. Tag is a reference of the OpenApi specification tag. If you have a `pets` tag for all your pet calls then Orval will generate a file pets.ts in the target folder

```js
module.exports = {
  petstore: {
    output: {
      target: 'src/petstore.ts',
      mode: 'tags',
    },
  },
};
```

```
my-app
└── src
    ├── pets.ts
    └── petstore.schemas.ts
```

For Angular:

=> petstore.ts is petstore.service.ts

If you don't use the `schemas` property only one file will be created with all the models for every tag.

#### Value: tags-split

This mode is a combination of the tags and split mode. Orval will generate a folder for every tag in the target folder and split into multiple files in those folders.

```js
module.exports = {
  petstore: {
    output: {
      target: 'src/petstore.ts',
      mode: 'tags-split',
    },
  },
};
```

```
my-app
└── src
    ├── petstore.schemas.ts
    └── pets
        ├── petstore.ts
        ├── petstore.definition.ts
        ├── petstore.msw.ts
        └── petstore.ts
```

Same as the tags mode if you don't use the `schemas` property only one file will be created with all the models for every tag.

### title

Type: `String` or `Function`.

Valid values: path or implementation of the function.

```js
module.exports = {
  output: {
    override: {
      title: (title) => `${title}Api`,
    },
  },
};
```

### mock

Type: `Boolean | Function`.

Default Value: `false`.

Will generate your mock using <a href="https://github.com/marak/Faker.js/" target="_blank">faker</a> and <a href="https://mswjs.io/" target="_blank">msw</a>

```js
module.exports = {
  petstore: {
    output: {
      mock: true,
    },
  },
};
```

If you want you can provide a function to extend or create you custom mock generator and check [here](https://github.com/anymaniax/orval/blob/master/src/types/generator.ts#L132) the type

### clean

Type: `Boolean | String[]`.

Default Value: `false`.

Can be used to clean generated files. Provide an array of glob if you want to customize what is deleted.

Be carefull clean all output target and schemas folder.

### prettier

Type: `Boolean`.

Default Value: `false`.

Can be used to prettier generated files. You need to have prettier in your dependencies.

### override

Type: `Object`.

Give you the possibility to override the output like your mock implementation or transform the API implementation like you want

#### transformer

Type: `String` or `Function`.

Valid values: path or implementation of the transformer function.

This function is executed for each call when you generate and take in argument a <a href="https://github.com/anymaniax/orval/blob/master/src/types/generator.ts#L40" target="_blank">VerbOptions</a> and shouled return a <a href="https://github.com/anymaniax/orval/blob/master/src/types/generator.ts#L40" target="_blank">VerbOptions</a>

```js
module.exports = {
  petstore: {
    output: {
      override: {
        transformer: 'src/yourfunction.js',
      },
    },
  },
};
```

#### mutator

Type: `String` or `Object`.

Valid values: path of the mutator function or object with a path and name.

If you provide an object you can also add a default property to use an export default function.

This function is executed for each call when this one is executed. It takes all the options passed to the verb as an argument and should return a promise with your custom implementation or preferred HTTP client.

Possible arguments:

- The first argument will be an object with the following type.

```ts
// based on AxiosRequestConfig
interface RequestConfig {
  method: 'get' | 'put' | 'patch' | 'post' | 'delete';
  url: string;
  params?: any;
  data?: any;
  responseType?: string;
}
```

- The second is only provided for the Angular client and give an instance of HttpClient

Example:

```js
module.exports = {
  petstore: {
    output: {
      override: {
        mutator: {
          path: './api/mutator/custom-instance.ts',
          name: 'customInstance',
          // default: true
        },
      },
    },
  },
};
```

```ts
// custom-instance.ts

import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({ baseURL: '' });

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => data,
  );

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};
```

#### header

Type: `Boolean | Function`.

Default Value: `true`.

Use this property to disable the auto generation of the file header

You can provide a function to customize the way you want the generate the file header. You will receive the info object of the specification in argument and you should return an array of string.

```ts
module.exports = {
  petstore: {
    output: {
      override: {
        header: (info: InfoObject): String[] => [
          `Generated by orval 🍺`,
          `Do not edit manually.`,
          ...(title ? [title] : []),
          ...(description ? [description] : []),
          ...(version ? [`OpenAPI spec version: ${version}`] : []),
        ],
      },
    },
  },
};
```

#### query

Type: `Object`.

Give you the possibility to override the generated <a href="https://react-query.tanstack.com/" target="_blank">query</a>

```js
module.exports = {
  petstore: {
    output: {
      ...
      override: {
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: 'nextId',
          options: {
            staleTime: 10000,
          },
        },
      },
    },
    ...
  },
};
```

##### useQuery

Type: `Boolean`.

Use to generate a <a href="https://react-query.tanstack.com/reference/useQuery" target="_blank">useQuery</a> custom hook. If the query key isn't provided that's the default hook generated.

##### useInfinite

Type: `Boolean`.

Use to generate a <a href="https://react-query.tanstack.com/reference/useInfiniteQuery" target="_blank">useInfiniteQuery</a> custom hook.

##### useInfiniteQueryParam

Type: `String`.

Use to automatically add to the request the query param provided by the useInfiniteQuery when you use `getFetchMore` function.

##### options

Type: `Object`.

Use to override the query config. Check available options <a href="https://react-query.tanstack.com/reference/useQuery" target="_blank">here</a>

#### angular

Type: `Object`.

Give you specific options for the angular client

```js
module.exports = {
  petstore: {
    output: {
      ...
      override: {
        angular: {
          provideInRoot: false,
        },
      },
    },
    ...
  },
};
```

##### provideInRoot

Type: `Boolean`.

Default Value: `true`.

Use to remove the provide in root in the generated angular services

#### mock

Type: `Object`.

Give you the possibility to override the generated mock

#### properties

Type: `Object` or `Function`.

You can use this to override the generated mock per property. Properties can take a function who take the specification in argument and should return un object or directly the object. Each key of this object can be a regex or directly the name of the property to override and the value can be a function which return the wanted value or directly the value. If you use a function this will be executed at runtime.

```js
module.exports = {
  petstore: {
    output: {
      override: {
        mock: {
          properties: {
            '/tag|name/': 'jon',
            email: () => faker.internet.email(),
          },
        },
      },
    },
  },
};
```

#### format

Type: `Object`.

Give you the possibility to put a value for a `format`. In your specification, if you put a `format: email` to a property Orval will automatically generate a random email for you. See <a href="https://github.com/anymaniax/orval/blob/next/src/constants/format.mock.ts" target="_blank">here</a> the default available format.

```js
module.exports = {
  petstore: {
    output: {
      override: {
        mock: {
          format: {
            email: () => faker.internet.email(),
            iban: () => faker.finance.iban(),
          },
        },
      },
    },
  },
};
```

#### required

Type: `Boolean`.

Give you the possibility to set every property required.

#### baseUrl

Type: `String`.

Give you the possibility to set base url to your mock handlers.

#### components

Type: `Object`.

Give you the possibility to override the models

```js
module.exports = {
  petstore: {
    output: {
      override: {
        components: {
          schemas: {
            suffix: 'DTO',
          },
          responses: {
            suffix: 'Response',
          },
          parameters: {
            suffix: 'Params',
          },
          requestBodies: {
            suffix: 'Bodies',
          },
        },
      },
    },
  },
};
```

#### operations

Type: `Object`.

Give you the possibility to override the generated mock by <a href="https://swagger.io/docs/specification/paths-and-operations/" target="_blank">operationId</a>.

Each key of the object should be an operationId and take as value an object.

The value object can take the same properties as the override property (mutator,query,transformer,mock).

The mock options have one more possibility the data property. Which can take a function or the value directly. The function will be executed at runtime.

```js
module.exports = {
  petstore: {
    output: {
      override: {
        operations: {
          listPets: {
            transformer: 'src/yourfunction.js',
            mutator: 'src/response-type.js',
            mock: {
              properties: () => {
                return {
                  id: () => faker.random.number({ min: 1, max: 99999 }),
                };
              },
            },
          },
          showPetById: {
            mock: {
              data: () => ({
                id: faker.random.number({ min: 1, max: 99 }),
                name: faker.name.firstName(),
                tag: faker.helpers.randomize([faker.random.word(), undefined]),
              }),
            },
          },
        },
      },
    },
  },
};
```

#### tags

Type: `Object`.

Exactly the same as the `override.operations` but this time you can do it by <a href="https://swagger.io/docs/specification/grouping-operations-with-tags/" target="_blank">tags</a>

#### operationName

Type: `Function`.

```ts
// type signature
(operation: OperationObject, route: string, verb: Verbs) => string;
```

Function to override the generate operation name.

#### requestOptions

Type: `Object | Boolean`.

Use this property to provide a config to your http client or completly remove the request options property from the generated files.

#### formData

Type: `Boolean` or `String` or `Object`.

Valid values: path of the formData function or object with a path and name.

Use this property to disable the auto generation of form data if you use multipart

If you provide an object you can also add a default property to use an export default function.

Example:

```js
module.exports = {
  petstore: {
    output: {
      override: {
        mutator: {
          path: './api/mutator/custom-form-data-fn.ts',
          name: 'customFormDataFn',
          // default: true
        },
      },
    },
  },
};
```

```ts
// type signature
export const customFormDataFn = <Body>(body: Body): FormData => {
  // do your implementation to transform it to FormData

  return FormData;
};
```
