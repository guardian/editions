const fetch = require('node-fetch')
const path = require('path')
const fs = require('fs')

const capiApiKey = process.env.CAPI_API_KEY

/**
 * Key represents the unique path to the article in the content api.
 * Value represents the name of the file the html of the article is written to.
 */
const settingsPagePathsToFetch = {
    'help/2019/sep/12/the-guardian-daily-beta-faqs': 'faq',
    'help/terms-of-service': 'terms-of-service',
}

const fetchHtmlForPath = async path => {
    const res = await fetch(
        `https://content.guardianapis.com/${path}?show-fields=body&api-key=${capiApiKey}&format=json`,
    )
    const json = await res.json()
    return json.response.content.fields.body
}

if (!capiApiKey) {
    console.log(
        `You haven't set the environment var: CAPI_API_KEY. The script will not run.`,
    )
} else {
    Object.keys(settingsPagePathsToFetch).map(async urlPath => {
        try {
            const bodyHtml = await fetchHtmlForPath(urlPath)
            fs.writeFileSync(
                path.join(
                    process.cwd(),
                    `/src/constants/settings/${settingsPagePathsToFetch[urlPath]}.json`,
                ),
                `${JSON.stringify({ bodyHtml: bodyHtml })}`,
            )
        } catch (error) {
            console.log(
                'FAILED (contents of settings file will not have been modified): ' +
                    error,
            )
            process.exit(1)
        }
    })
}
