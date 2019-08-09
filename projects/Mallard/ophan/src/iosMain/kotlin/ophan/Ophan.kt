package ophan

import com.gu.ophan.Logger
import com.gu.ophan.RecordStore
import kotlin.native.concurrent.freeze

actual object Platform {
    actual fun name(): String = "iOS"
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
): OphanApi = OphanApi(appVersion, appOs, deviceName, deviceManufacturer, deviceId, userId, recordStore, logger).freeze()