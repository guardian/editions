export type Loaded<Value> =
    | {
          value: Value
          error?: undefined
          isLoading?: undefined
      }
    | { value?: undefined; error: Error; isLoading?: undefined }
    | { isLoading: true; value?: undefined; error?: undefined }
