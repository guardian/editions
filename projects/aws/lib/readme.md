# Considerations

We could simplify code by introducing factory functions:

```
export const bucketMaker = (scope: Construct) => (
    bucketNameParam: CfnParameter,
) => {
    return s3.Bucket.fromBucketName(
        scope,
        bucketNameParam.valueAsString,
        bucketNameParam.valueAsString,
    )
}
```

Note that this enforces bucket id is the same as the bucket name.

This would allow us to use:

```
const bucket = bucketMaker(this)
const bucket1 = bucket(bucket1NameParameter)
const bucket2 = bucket(bucket2NameParameter)
const bucket3 = bucket(bucket3NameParameter)
```

instead of

```
const bucket1 = s3.Bucket.fromBucketName(
    this,
    'bucket1',
    bucket1NameParameter.valueAsString,
)

const bucket2 = s3.Bucket.fromBucketName(
    this,
    'bucket2',
    bucket2NameParameter.valueAsString,
)

const bucket3 = s3.Bucket.fromBucketName(
    this,
    'bucket3',
    bucket3NameParameter.valueAsString,
)

```

