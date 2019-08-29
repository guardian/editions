package ophan

import com.gu.ophan.Logger
import kotlin.native.concurrent.freeze

fun getThreadSafeOphanApi(
        appVersion: String,
        appOs: String,
        deviceName: String,
        deviceManufacturer: String,
        deviceId: String,
        userId: String,
        logger: Logger,
        recordStorePath: String
): OphanApi = OphanApi(appVersion, appOs, deviceName, deviceManufacturer, deviceId, userId, logger, recordStorePath).freeze()
