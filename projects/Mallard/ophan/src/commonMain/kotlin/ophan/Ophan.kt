package ophan

import com.gu.ophan.FileRecordStore
import com.gu.ophan.Logger
import com.gu.ophan.OphanDispatcher
import ophan.thrift.componentEvent.Action
import ophan.thrift.componentEvent.ComponentEvent
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.componentEvent.ComponentV2
import ophan.thrift.nativeapp.*

fun hello(): String = "Hello from MAX AND JAMES!"

class OphanApi(
        private val dispatcher: OphanDispatcher
) {

    constructor(
            appFamily: String,
            appVersion: String,
            appOsVersion: String,
            deviceName: String,
            deviceManufacturer: String,
            deviceId: String,
            userId: String?,
            logger: Logger,
            recordStorePath: String
    ) : this(OphanDispatcher(
            App(
                    version = appVersion,
                    family = appFamily,
                    os = appOsVersion,
                    edition = Edition.UK
            ),
            Device(
                    name = deviceName,
                    manufacturer = deviceManufacturer
            ),
            deviceId,
            userId,
            logger,
            FileRecordStore(recordStorePath)
    ))

    fun sendTestAppScreenEvent(screenName: String, eventId: String) {
        val event = Event.Builder()
                .eventId(eventId)
                .eventType(EventType.COMPONENT_EVENT)
                .viewId(null) /* TODO */
                .componentEvent(ComponentEvent.Builder()
                        .component(ComponentV2.Builder()
                                .componentType(ComponentType.APP_SCREEN)
                                .id(screenName)
                                .products(emptySet())
                                .campaignCode(null)
                                .labels(emptySet())
                                .build()
                        )
                        .action(Action.VIEW)
                        .value("yes")
                        .build()
                )
                .build()
        dispatcher.dispatchEvent(event)
    }
}