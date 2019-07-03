# Backend Principles

## Store Issues Seperately

All content is to be devided into issues, such that a single issue may be downloaded or deleted.

## Always Republish Everything (except media)

When a change is made to the content in an edition, the whole thing will be regenerated.

## Add new media

Media files are referenced by unique ids, when republishing, we do not need to refetch images which are already present.
