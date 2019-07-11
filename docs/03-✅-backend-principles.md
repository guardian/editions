# Backend Principles

## Store Issues Seperately

All content is to be devided into issues, such that a single issue may be downloaded or deleted.

## Always Republish Everything (except media)

When a change is made to the content in an edition, the whole thing will be regenerated.

## Add new media

Media files are referenced by unique ids, when republishing, we do not need to refetch images which are already present. Therefore media files can be added to an edition bundle without forcing a full redownload.

## Structure

A backend lambda can serve all the paths required for an issue. These are then copied into S3 for reading an issue without downloading. And are zipped up so that an edition can be downloaded overnight.
