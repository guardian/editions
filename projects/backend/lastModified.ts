//Gives the latest date fed to it, or the current time.
//In the format for the last-modified header
export type LastModifiedUpdater = (newDate: Date | undefined) => void
export type LastModified = () => [() => string, LastModifiedUpdater]
export const lastModified: LastModified = () => {
    let date: Date | null = null
    return [
        () => (date || new Date()).toUTCString(),
        newDate => {
            if (newDate == null) {
                return
            }
            if (date == null || newDate > date) {
                date = newDate
            }
        },
    ]
}
