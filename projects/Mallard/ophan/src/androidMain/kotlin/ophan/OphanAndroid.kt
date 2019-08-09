package ophan

import com.gu.ophan.Logger
import com.gu.ophan.RecordStore

actual object Platform {
    actual fun name(): String = "Android"
}

actual fun getThreadSafeOphanApi(
        appVersion: String,
        appOs: String,
        deviceName: String,
        deviceManufacturer: String,
        deviceId: String,
        userId: String,
        recordStore: RecordStore,
        logger: Logger
): OphanApi = OphanApi(appVersion, appOs, deviceName, deviceManufacturer, deviceId, userId, recordStore, logger)