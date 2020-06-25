const fetch = require('node-fetch')

const BASE_URL = 'https://api.github.com/repos/guardian/editions'

const tagNameFromSha = sha => sha.slice(0, 8)

const headers = {
    'Content-Type': 'application/json',
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
}

const doFetch = async (url, params) => {
    const resp = await fetch(url, params)
    if (resp.status >= 200 && resp.status < 300) {
        return resp.json()
    } else {
        console.log(
            `Request to ${url} failed with status ${resp.status}: ${resp.statusText}. Exiting.`,
        )
        process.exit()
    }
}

const get = async path => {
    return doFetch(`${BASE_URL}/${path}`, { headers: headers })
}

const post = async (path, body) => {
    return doFetch(`${BASE_URL}/${path}`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(body),
    })
}

const patch = async (path, body) => {
    return doFetch(`${BASE_URL}/${path}`, {
        headers: headers,
        method: 'PATCH',
        body: JSON.stringify(body),
    })
}

const findReleaseForCommit = (commit, releases) => {
    return releases.find(r => r.tag_name == tagNameFromSha(commit))
}

const patchReleaseName = (name, os, appStoreId) =>
    `${name}--${os}-${appStoreId}`

const updateRelease = async (commitSha, message, branch, appStoreId, os) => {
    const releases = await get('releases')
    const matchingRelease = findReleaseForCommit(commitSha, releases)

    if (matchingRelease) {
        console.log(
            `Release exists (${matchingRelease.html_url}), patching release name`,
        )
        const patchedName = patchReleaseName(
            matchingRelease.name,
            os,
            appStoreId,
        )
        const releaseUpdateResult = await patch(
            `releases/${matchingRelease.id}`,
            { name: patchedName },
        )
        console.log(
            `Updated release, new name: ${patchedName}, view it here: ${releaseUpdateResult.html_url}`,
        )
    } else {
        console.log(
            `Creating release with tag name ${commitSha}, message ${message}, branch ${branch}`,
        )
        const releaseName = patchReleaseName(branch, os, appStoreId)
        const release = await post('releases', {
            tag_name: tagNameFromSha(commitSha),
            prerelease: true,
            target_commitish: branch,
            name: releaseName,
        })
        console.log(`Created release, view it here: ${release.html_url}`)
    }
}
const params = {
    sha: 2,
    message: 3,
    branch: 4,
    appStoreId: 5,
    os: 6,
}

if (process.argv.length < Object.keys(params).length) {
    console.log(
        `Usage: node ${process.argv[1]} <${Object.keys(params).join('> <')}>`,
    )
    process.exit()
} else {
    updateRelease(
        process.argv[params.sha],
        process.argv[params.message],
        process.argv[params.branch],
        process.argv[params.appStoreId],
        process.argv[params.os],
    )
}
