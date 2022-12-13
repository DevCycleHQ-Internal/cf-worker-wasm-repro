import { DVCAPIUser, BucketedUserConfig } from '@devcycle/types'
import {
    instantiate,
    Exports as BucketingLib
} from '@devcycle/bucketing-assembly-script/index-worker'

const configURL = (sdkKey: string) => `https://config-cdn.devcycle.com/config/v1/server/${sdkKey}.json`
const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
}

addEventListener('fetch', (event: FetchEvent) => {
    event.respondWith(handleRequest(event))
})

async function handleRequest(event: FetchEvent): Promise<Response> {
    const sdkKey = event.request.headers?.get('Authorization')
    if (!sdkKey) throw new Error('Missing Authorization header')

    const response = await fetch(configURL(sdkKey), {
        headers: { 'Content-Type': 'application/json' }
    })
    const configString  = await response.text()
    const bucketedConfig = await bucketUserForConfig({
        sdkKey,
        configString,
        user: { user_id: 'test-user-id' }
    })

    return new Response(JSON.stringify(bucketedConfig), {
        status: 200,
        headers: defaultHeaders
    })
}

let Bucketing: BucketingLib | null
const getBucketingLib = async (): Promise<BucketingLib> => {
    if (Bucketing) return Bucketing

    Bucketing = await instantiate()
    return Bucketing
}

const bucketUserForConfig = async (
    {
        sdkKey,
        configString,
        user
    }: {
        sdkKey: string,
        configString: string,
        user: DVCAPIUser
    }
): Promise<BucketedUserConfig> => {
    const bucketingLib = await getBucketingLib()
    bucketingLib.setConfigData(sdkKey, configString)
    bucketingLib.setPlatformData(JSON.stringify({
        platform: user.platform || '',
        platformVersion: user.platformVersion || '',
        sdkType: user.sdkType || '',
        sdkVersion: user.sdkVersion || ''
    }))
    return JSON.parse(
        bucketingLib.generateBucketedConfigForUser(sdkKey, JSON.stringify(user))
    ) as BucketedUserConfig
}
