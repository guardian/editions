package ophan

import com.gu.ophan.Logger
import com.gu.ophan.OphanDispatcher
import ophan.thrift.componentEvent.Action
import ophan.thrift.componentEvent.ComponentEvent
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.componentEvent.ComponentV2
import ophan.thrift.nativeapp.*


expect object Platform {
    fun name(): String
}

fun hello(): String = "Hello from ${Platform.name()}!"

class OphanApi(
        private val dispatcher: OphanDispatcher
) {

    private var lastPageView: Event? = null

    constructor(
            appVersion: String,
            appOs: String,
            deviceName: String,
            deviceManufacturer: String,
            deviceId: String,
            userId: String,
            logger: Logger
    ) : this(OphanDispatcher(
            App(appVersion, "TestEditions", appOs, Edition.UK),
            Device(deviceName, deviceManufacturer),
            deviceId,
            userId,
            logger
    ))

    fun sendPageView() {
        // Make a page view event
        // Send it
        lastPageView = TODO()
    }

    fun sendTestAppScreenEvent(screenName: String) {
        val event = Event.Builder()
                .eventId("ffdfdfdfdssfdsf")
                .eventType(EventType.COMPONENT_EVENT)
                .viewId(lastPageView?.viewId)
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

    fun sendTimeOnPageEvent(timeMs: Long) {

    }
}
