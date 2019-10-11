@file:Suppress("unused")

package ophan

import com.gu.ophan.Logger
import ophan.thrift.device.DeviceClass
import kotlin.native.concurrent.freeze

fun getThreadSafeOphanApi(
        appFamily: String,
        appVersion: String,
        appOsVersion: String,
        deviceName: String,
        deviceManufacturer: String,
        deviceClass: DeviceClass?,
        deviceId: String,
        userId: String?,
        logger: Logger,
        recordStorePath: String
): OphanApi = OphanApi(appFamily, appVersion, appOsVersion, deviceName, deviceManufacturer, deviceClass, deviceId, userId, logger, recordStorePath).freeze()
